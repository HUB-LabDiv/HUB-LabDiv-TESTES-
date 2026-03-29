import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// Função auxiliar para validar formação matemática do CPF
function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

    let sum = 0, rest;
    for (let i = 1; i <= 9; i++) 
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) 
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

export async function POST(req: Request) {
    let payload = await req.json();
    let cpfPlainText: string | null = payload.cpf?.trim();

    if (!cpfPlainText) {
        return NextResponse.json({ error: 'CPF não fornecido.' }, { status: 400 });
    }

    // 1. Validação Matemática
    if (!isValidCPF(cpfPlainText)) {
        return NextResponse.json({ error: 'CPF inválido.' }, { status: 400 });
    }

    // MOCK REGRA: Par = Adulto, Ímpar = Menor
    const lastDigit = parseInt(cpfPlainText.slice(-1), 10);
    const isAdult = lastDigit % 2 === 0;

    // 2. Hash usando bcryptjs (Compatível em ambientes Serverless/Vercel)
    const salt = await bcrypt.genSalt(10);
    const cpfHash = await bcrypt.hash(cpfPlainText, salt);

    // 3. Destruição do texto claro em memória (LGPD - Privacy by Design)
    cpfPlainText = null;
    payload = null;

    // 4. Instanciar Supabase e validar Sessão
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // ignored setup
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Autenticação requerida para atrelar verificação.' }, { status: 401 });
    }

    // 5. Salvar hash e flag no Perfil do Supabase
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            is_adult: isAdult,
            cpf_hash: cpfHash,
        })
        .eq('id', user.id);

    if (profileError) {
        console.error('[CPF-API] Falha de atualização no DB:', profileError.message);
        return NextResponse.json({ error: 'Falha ao processar Age Gate no Banco de Dados.' }, { status: 500 });
    }

    return NextResponse.json({ 
        success: true, 
        is_adult: isAdult, 
        message: isAdult ? 'Identidade confirmada como adulto.' : 'Identidade confirmada como menor.' 
    });
}
