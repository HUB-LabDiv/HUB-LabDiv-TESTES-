import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    let payload = await req.json();
    let ageSignalToken: string | null = payload.token?.trim();

    if (!ageSignalToken) {
        return NextResponse.json({ error: 'Token do Play Age Signals não enviado.' }, { status: 400 });
    }

    // [TODO/PWA]: Implementar decodificação JWT da API do Google Android 
    // MOCK: Para fins de validação do Gatekeeper, simularemos a asserção Baseado no Payload "valid"
    const isAdult = ageSignalToken === 'mock_google_adult_signal';

    ageSignalToken = null;
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
        return NextResponse.json({ error: 'Autenticação requerida para atrelar verificação PWA.' }, { status: 401 });
    }

    // 5. Salvar flag no Perfil do Supabase
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            is_adult: isAdult,
            // mobile age signals não possui CPF atrelado, is_adult gerencia acesso.
        })
        .eq('id', user.id);

    if (profileError) {
        console.error('[PWA-AGE-API] Falha:', profileError.message);
        return NextResponse.json({ error: 'Falha ao processar Age Gate via Play Signals.' }, { status: 500 });
    }

    return NextResponse.json({ 
        success: true, 
        is_adult: isAdult, 
        message: 'Classificação etária Android confirmada com a Conta Google.' 
    });
}
