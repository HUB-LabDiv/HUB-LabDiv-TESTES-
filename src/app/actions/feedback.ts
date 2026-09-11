'use server';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */


import { createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitFeedback(data: { type: string; description: string; user_agent?: string; url?: string; email?: string; context?: any }) {
    const supabase = await createServerSupabase();

    const { type, description, user_agent, url, email, context } = data;
    let screenshot_url = null;

    // Get current user if any
    const { data: { user } } = await supabase.auth.getUser();

    const reportPayload = {
        user_id: user?.id || null,
        type,
        description,
        screenshot_url,
        metadata: {
            user_email: email || user?.email,
            user_agent: user_agent || '',
            url: url || '',
            platform: 'web',
            context: context || null
        }
    };

    let { error } = await supabase
        .from('feedback_reports')
        .insert([reportPayload]);

    if (error) {
        console.warn('[Feedback] Standard insert failed (likely RLS), retrying with Admin Client:', error.message);
        try {
            const { createAdminSupabase } = await import('@/lib/supabase/admin');
            const adminSupabase = createAdminSupabase();
            const { error: adminErr } = await adminSupabase.from('feedback_reports').insert([reportPayload]);
            if (!adminErr) {
                error = null; // Sucesso via bypass de admin
            } else {
                console.error('[Feedback] Admin insert also failed:', adminErr.message);
            }
        } catch (adminException) {
            console.error('[Feedback] Failed to invoke Admin Supabase client:', adminException);
        }
    }

    if (error) {
        console.error('Error submitting feedback:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/reports');

    // Notify Admins
    try {
        const { sendAdminNotification } = await import('@/lib/notifications.server');
        // Buscar nome do usuário para o email
        let displayName = email || user?.email || 'Anônimo';
        if (user?.id) {
            const { data: prof } = await supabase.from('profiles').select('full_name, username').eq('id', user.id).single();
            displayName = prof?.full_name || (prof?.username ? `@${prof.username}` : displayName);
        }
        await sendAdminNotification({
            type: 'bug_report',
            userName: displayName,
            content: description,
            url: url || '',
            details: type, // tipo real: 'bug' | 'sugestao' | 'outro'
        });
    } catch (emailErr) {
        console.warn('[Feedback] Email notification failed, but report was saved:', emailErr);
    }

    return { success: true };
}

/**
 * Busca todos os feedback reports para o painel admin.
 * Usa Admin Client para bypassar RLS (somente chamado de Server Components/Actions autenticados).
 */
export async function getFeedbackReports() {
    try {
        const { createAdminSupabase } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminSupabase();

        const { data, error } = await adminSupabase
            .from('feedback_reports')
            .select('*, profiles(full_name, username, avatar_url)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[getFeedbackReports] Error:', error.message);
            // Fallback: tenta sem o join de profiles (schema pode não ter FK)
            const { data: fallback } = await adminSupabase
                .from('feedback_reports')
                .select('*')
                .order('created_at', { ascending: false });
            return { data: fallback || [], error: null };
        }

        return { data: data || [], error: null };
    } catch (e: any) {
        console.error('[getFeedbackReports] Exception:', e);
        return { data: [], error: e.message };
    }
}

/**
 * Atualiza o status de um feedback report.
 * Usa Admin Client para bypassar RLS.
 */
export async function updateFeedbackReportStatus(id: string, newStatus: string) {
    // Valida que o usuário é admin antes de executar
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Não autenticado' };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!['admin', 'moderator', 'labdiv', 'labdiv adm'].includes(profile?.role || '')) {
        return { success: false, error: 'Acesso negado' };
    }

    try {
        const { createAdminSupabase } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminSupabase();
        const { error } = await adminSupabase
            .from('feedback_reports')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/reports');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function submitHubSuggestion(description: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('feedback_reports')
        .insert([
            {
                user_id: user?.id || null,
                type: 'suggestion',
                description,
                metadata: {
                    platform: 'web',
                    source: 'arena_researcher'
                }
            }
        ]);

    if (error) {
        console.error('Error submitting suggestion:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/reports');

    // Notify Admins
    const { sendAdminNotification } = await import('@/lib/notifications.server');
    const { data: profile } = await supabase.from('profiles').select('full_name, username').eq('id', user?.id).single();

    await sendAdminNotification({
        type: 'hub_improvement',
        userName: profile?.full_name || (profile?.username ? `@${profile.username}` : user?.email) || 'Pesquisador Anônimo',
        content: description
    });

    return { success: true };
}
