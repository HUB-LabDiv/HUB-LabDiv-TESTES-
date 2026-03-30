'use server';

import { createServerSupabase } from '@/lib/supabase/server';

export async function fetchRecentEntanglements() {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) return [];

    // 1. Busca mensagens para identificar conversas ativas
    const { data: messages, error: mError } = await supabaseServer
        .from('messages')
        .select('sender_id, recipient_id, content, created_at')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    if (mError) return [];

    // 2. Busca usuários que o usuário atual segue
    const { data: follows, error: fError } = await supabaseServer
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

    if (fError) return [];

    // Agrupa por usuário para pegar a ÚLTIMA mensagem de cada conversa
    const conversationMap = new Map();
    messages?.forEach(m => {
        const peerId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
        if (!conversationMap.has(peerId)) {
            conversationMap.set(peerId, {
                lastMessage: m.content,
                lastAt: m.created_at
            });
        }
    });

    // Pega IDs de seguidos que ainda não estão no mapa de conversas
    const followedIds = follows?.map(f => f.following_id) || [];

    // Lista final de IDs únicos (conversas + seguidos)
    const allPeerIds = Array.from(new Set([
        ...Array.from(conversationMap.keys()),
        ...followedIds
    ]));

    if (allPeerIds.length === 0) return [];

    // 3. Busca perfis para todos esses IDs
    const { data: profiles, error: pError } = await supabaseServer
        .from('profiles')
        .select('id, full_name, username, use_nickname, email, avatar_url, xp, level, is_labdiv')
        .in('id', allPeerIds);

    if (pError || !profiles) return [];

    // 4. Mapeia para o formato esperado pela UI
    return profiles.map(p => {
        const conv = conversationMap.get(p.id);
        const isFollowed = followedIds.includes(p.id);

        return {
            id: p.id,
            name: (p.use_nickname && p.username) ? p.username : (p.full_name || 'Usuário'),
            handle: p.email ? `@${p.email.split('@')[0]}` : '@usuario',
            avatar: p.avatar_url,
            xp: p.xp,
            level: p.level,
            is_labdiv: p.is_labdiv,
            lastMessage: conv?.lastMessage,
            lastAt: conv?.lastAt,
            isFollowed
        };
    }).sort((a, b) => {
        // Ordena por data da última mensagem, ou coloca seguidos sem conversa no final
        if (a.lastAt && b.lastAt) return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
        if (a.lastAt) return -1;
        if (b.lastAt) return 1;
        return 0;
    });
}
