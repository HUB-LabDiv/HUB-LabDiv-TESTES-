import { createAdminSupabase } from '@/lib/supabase/admin';
import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    
    // 1. Verificar Autenticação (Session)
    const supabaseSession = await createServerSupabase();
    const { data: { user }, error: authError } = await supabaseSession.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = user.id;

    // 2. Cliente com Service Role (Privilégios de Admin)
    const supabaseAdmin = createAdminSupabase();

    // 3. Executar o Soft Delete via RPC (Lógica MK5)
    // A RPC no god-sql-mk5.sql cuida da anonimização e deleção de auth.users
    const { error: rpcError } = await supabaseAdmin.rpc('soft_delete_user', {
      target_user_id: userId
    });

    if (rpcError) {
      console.error('ERRO CRÍTICO NA RPC DE EXCLUSÃO (Soft Delete):', {
        message: rpcError.message,
        details: rpcError.details,
        hint: rpcError.hint,
        code: rpcError.code
      });
      return NextResponse.json({ 
        error: 'Falha ao processar exclusão no banco de dados',
        details: rpcError.message 
      }, { status: 500 });
    }

    // 4. Limpar Cookies de Segurança e Sessão
    cookieStore.delete('admin_impersonating_id');
    
    // O client-side deve rodar o deepCleanup no browser.
    return NextResponse.json({ 
      success: true, 
      message: 'Sua conta foi excluída com sucesso. Todos os dados sensíveis foram removidos.' 
    });

  } catch (err: any) {
    console.error('Erro crítico na rota de exclusão:', err);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
