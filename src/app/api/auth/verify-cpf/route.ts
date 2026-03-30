import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { argon2id } from 'hash-wasm';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Validação rigorosa do payload
const RequestSchema = z.object({
  cpf: z.string().length(11).regex(/^\d+$/),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((date) => {
    return new Date(date) <= new Date();
  }, { message: "Data de nascimento não pode ser no futuro." }),
  guardianEmail: z.string().email().optional(),
});

/**
 * Validação de Checksum do CPF (Algoritmo Módulo 11)
 * Usado como fallback caso a BrasilAPI esteja instável ou retorne falso 404.
 */
function validateCPFChecksum(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  const digits = cpf.split('').map(Number);
  
  const calcDigit = (slice: number[]) => {
    const factor = slice.length + 1;
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += slice[i] * (factor - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const digit1 = calcDigit(digits.slice(0, 9));
  const digit2 = calcDigit(digits.slice(0, 10));

  return digit1 === digits[9] && digit2 === digits[10];
}

export async function POST(req: Request) {
  let cpfPlainText: string | null = null;
  let birthdate: string | null = null;

  try {
    const body = await req.json();
    
    // Sanitização: Remove qualquer caractere que não seja número do CPF
    if (body.cpf) {
      body.cpf = body.cpf.replace(/\D/g, '');
    }

    const validated = RequestSchema.parse(body);
    cpfPlainText = validated.cpf;
    birthdate = validated.birthdate;
    const guardianEmail = validated.guardianEmail;

    // 1. Validação via BrasilAPI com Fallback de Algoritmo
    let verificationSuccess = true;
    let verificationError = null;
    let isAuditMode = false;

    try {
      const brasilApiRes = await fetch(`https://brasilapi.com.br/api/cpf/v1/${cpfPlainText}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'HUB-LabDiv-IFUSP (contato: hublabdiv@gmail.com)'
        },
        cache: 'no-store'
      });

      if (!brasilApiRes.ok) {
        // Se a API falhou (404 ou 5xx), tentamos validar pelo algoritmo local
        const isValidChecksum = validateCPFChecksum(cpfPlainText);
        
        if (isValidChecksum) {
          isAuditMode = true;
          verificationSuccess = true;
        } else {
          verificationSuccess = false;
          verificationError = brasilApiRes.status === 404 
            ? 'CPF não encontrado na base da Receita Federal e falhou na validação algorítmica.' 
            : 'Instabilidade na base governamental. Tente novamente em instantes.';
        }
      }
    } catch (e) {
      // Falha de rede: usa o checksum como última linha de defesa
      if (validateCPFChecksum(cpfPlainText)) {
        isAuditMode = true;
        verificationSuccess = true;
      } else {
        verificationSuccess = false;
        verificationError = 'Erro de conexão com a base de CPFs e falha na validação local.';
      }
    }

    if (!verificationSuccess) {
      return NextResponse.json({ error: verificationError }, { status: 502 });
    }

    // 2. Cálculo de Maioridade
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    const isAdult = age >= 18;

    // 3. Criptografia Blindada
    const saltBuffer = new Uint8Array(16);
    crypto.getRandomValues(saltBuffer);
    const cpfHash = await argon2id({
      password: cpfPlainText,
      salt: saltBuffer,
      parallelism: 1,
      iterations: 2,
      memorySize: 65536,
      hashLength: 32,
      outputType: 'encoded',
    });

    // 4. Supabase Client (Cookie-based for auth check)
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    // Service-role client for guaranteed writes (bypasses RLS)
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {},
        },
      }
    );

    // 5. Diferenciação de Fluxo (Logado vs Anônimo)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Fluxo do Estudante (Autenticado) — usa admin client para garantir persistência
      const { error: updateError } = await supabaseAdmin.from('profiles').update({
        is_adult: isAdult,
        cpf_hash: cpfHash,
        birthdate: birthdate,
        guardian_email: !isAdult ? guardianEmail : null,
        is_audit_mode: isAuditMode,
        accepted_terms_version: 'v2.0',
        accepted_at: new Date().toISOString()
      }).eq('id', user.id);

      if (updateError) {
        console.error('[CPF-API] Profile update failed:', updateError);
        return NextResponse.json({ error: 'Falha ao salvar dados no perfil.' }, { status: 500 });
      }

      if (!isAdult && guardianEmail) {
        const token = crypto.randomUUID();
        const { error: tokenError } = await supabaseAdmin.from('parental_consent_tokens').insert({
          child_id: user.id,
          guardian_email: guardianEmail,
          token: token,
          status: 'pending',
          expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        });

        if (!tokenError) {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hub-lab-div.vercel.app';
            const magicLink = `${baseUrl}/auth/parental-consent/${token}`;
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''),
              },
            });

            await transporter.sendMail({
              from: `"HUB Lab-Div" <${process.env.GMAIL_USER}>`,
              to: guardianEmail,
              subject: '🔒 Autorização de Acesso - HUB Lab-Div IFUSP',
              html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #0F4780;">Portal de Consentimento Parental</h2>
                <p>Olá, um menor sob sua responsabilidade solicitou acesso à plataforma acadêmica <strong>HUB Lab-Div (IFUSP)</strong>.</p>
                <div style="margin: 30px 0; text-align: center;">
                  <a href="${magicLink}" style="background-color: #0F4780; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar e Autorizar Acesso</a>
                </div>
                <p style="font-size: 10px; color: #999;">HUB Lab-Div - Laboratório de Comunicação Científica - IFUSP</p>
              </div>`
            });
          } catch (e) {
            // Silently fail email
          }
        }
      }
    }

    // Limpeza de segurança
    cpfPlainText = null;
    cookieStore.delete('admin_impersonating_id');

    // Force revalidation of global stats and user profile
    revalidatePath('/');
    revalidatePath('/re-accept-terms');

    return NextResponse.json({
      success: true,
      is_adult: isAdult,
      cpfHash: cpfHash, // Necessário para o fluxo parental anônimo
      mode: isAuditMode ? 'audit' : 'official',
      message: 'Verificação concluída.'
    });

  } catch (err: any) {
    cpfPlainText = null;
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Formato de dados inválido.', details: err.issues }, { status: 400 });
    }
    console.error('[CPF-API] Fatal:', err);
    return NextResponse.json({ error: 'Erro interno no processador de segurança.' }, { status: 500 });
  }
}
