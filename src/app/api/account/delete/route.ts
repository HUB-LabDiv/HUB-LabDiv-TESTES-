import { createAdminSupabase } from '@/lib/supabase/admin';
import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Verificar Autenticação (Session) - Use lib client
    const supabaseSession = await createServerSupabase();
    const { data: { user }, error: authError } = await supabaseSession.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = user.id;

    // 2. Cliente com Service Role (Privilégios de Admin) - Use lib client
    const supabaseAdmin = createAdminSupabase();

    // 3. Executar o Soft Delete via RPC (Lógica MK5)
    // A RPC no god-sql-mk5.sql cuida da anonimização e deleção de auth.users
    const { error: rpcError } = await supabaseAdmin.rpc('soft_delete_user', {
      target_user_id: userId
    });

    if (rpcError) {
      console.error('Erro na RPC de exclusão:', rpcError);
      return NextResponse.json({ error: 'Falha ao processar exclusão no banco de dados' }, { status: 500 });
    }

    // 4. Limpar Cookies de Sessão (Logout Forçado no Servidor)
    // Nota: O client-side ainda deve rodar o deepCleanup em seguida.
    return NextResponse.json({ success: true, message: 'Conta processada para exclusão e anonimização.' });

  } catch (err: any) {
    console.error('Erro crítico na rota de exclusão:', err);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
