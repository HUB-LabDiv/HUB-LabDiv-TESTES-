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


import { createServerSupabase, createSupabaseStatic } from '@/lib/supabase/server';
import { PostDTO, mapToPostDTO, mapToAdminPostDTO } from '@/dtos/media';
import { unstable_cache, revalidatePath } from 'next/cache';
import { SubmissionSchema } from '@/lib/validations';
import { z } from 'zod';
import { sendAutomaticNotification } from './notifications';
import { postMatchesMediaTypes } from '@/lib/media-utils';

export interface AdminUpdate {
    status?: string;
    admin_feedback?: string | null;
    is_featured?: boolean;
    title?: string;
    authors?: string;
    category?: string;
    description?: string;
    tags?: string[];
    isotopes?: string[];
    media_url?: string | string[];
    external_link?: string | null;
    technical_details?: string | null;
    is_priority?: boolean;
    event_date?: string | null;
    whatsapp?: string | null;
    pseudonym?: string | null;
    event_year?: number | null;
    media_type?: string;
    co_authors?: string[] | null;
    testimonial?: string | null;
    alt_text?: string | null;
    quiz?: any;
    is_historical?: boolean;
    is_golden_standard?: boolean;
}

export interface FetchParams {
    page: number;
    limit: number;
    query: string;
    categories?: string[];
    excludeCategories?: string[];
    institutes?: string[];
    mediaTypes?: string[];
    sort: 'recentes' | 'antigas';
    author?: string;
    is_featured?: boolean;
    is_golden_standard?: boolean;
    is_historical?: boolean;
    years?: number[];
    feedScope?: 'todos' | 'seguindo';
}

export async function fetchSubmissions({ page, limit, query, categories, excludeCategories, institutes, mediaTypes, sort, author, is_featured: featured, years, is_golden_standard, is_historical, feedScope }: FetchParams): Promise<{ items: { post: PostDTO }[], hasMore: boolean }> {
    const supabaseServer = await createServerSupabase();
    let queryBuilder = supabaseServer
        .from('submissions')
        .select('*, profiles(avatar_url, xp, level, is_labdiv), energy_reactions, atomic_excitation', { count: 'exact' })
        .eq('status', 'aprovado')
        .neq('moderation_status', 'suspended');

    if (feedScope === 'seguindo') {
        const { data: { user } } = await supabaseServer.auth.getUser();
        if (user) {
            const { data: follows } = await supabaseServer
                .from('follows')
                .select('following_id')
                .eq('follower_id', user.id);
            if (follows && follows.length > 0) {
                const followingIds = follows.map(f => f.following_id);
                queryBuilder = queryBuilder.in('user_id', followingIds);
            } else {
                // Se não segue ninguém, retorna vazio
                queryBuilder = queryBuilder.in('user_id', []);
            }
        } else {
             // Se não estiver logado mas tentar acessar seguindo, retorna vazio
             queryBuilder = queryBuilder.in('user_id', []);
        }
    }

    if (featured) queryBuilder = queryBuilder.eq('is_featured', true);
    if (is_golden_standard !== undefined) queryBuilder = queryBuilder.eq('is_golden_standard', is_golden_standard);
    if (is_historical !== undefined) queryBuilder = queryBuilder.eq('is_historical', is_historical);
    if (categories && categories.length > 0) queryBuilder = queryBuilder.in('category', categories);
    if (institutes && institutes.length > 0) {
        const cleanInstitutes = institutes.map(i => i.toLowerCase()).filter(i => i !== 'todos');
        if (cleanInstitutes.length > 0) {
            queryBuilder = queryBuilder.in('institute', cleanInstitutes);
        }
    }
    if (excludeCategories && excludeCategories.length > 0) {
        queryBuilder = queryBuilder.not('category', 'in', `(${excludeCategories.join(',')})`);
    }
    if (author) queryBuilder = queryBuilder.eq('authors', author);

    if (mediaTypes && mediaTypes.length > 0) {
        // Busca ampla no banco de dados para cobrir tanto o tipo raiz quanto posts compostos (SDOCX / blocos múltiplos)
        const orClauses: string[] = [];
        orClauses.push(`media_type.in.(${mediaTypes.join(',')})`);
        orClauses.push(`media_type.eq.sdocx`);

        if (mediaTypes.includes('video')) {
            orClauses.push(`media_url.ilike.%youtube%`);
            orClauses.push(`media_url.ilike.%youtu.be%`);
            orClauses.push(`media_url.ilike.%vimeo%`);
            orClauses.push(`media_url.ilike.%"type":"video"%`);
            orClauses.push(`media_url.ilike.%.mp4%`);
            orClauses.push(`description.ilike.%youtube.com%`);
            orClauses.push(`description.ilike.%youtu.be%`);
        }
        if (mediaTypes.includes('image')) {
            orClauses.push(`media_url.ilike.%"type":"image"%`);
            orClauses.push(`media_url.ilike.%"type":"carousel"%`);
            orClauses.push(`media_url.ilike.%.jpg%`);
            orClauses.push(`media_url.ilike.%.png%`);
            orClauses.push(`media_url.ilike.%.webp%`);
            orClauses.push(`media_url.ilike.%cloudinary.com%`);
        }
        if (mediaTypes.includes('pdf')) {
            orClauses.push(`media_url.ilike.%.pdf%`);
            orClauses.push(`media_url.ilike.%"type":"pdf"%`);
        }
        if (mediaTypes.includes('text') || mediaTypes.includes('sdocx')) {
            orClauses.push(`media_type.eq.text`);
            orClauses.push(`media_type.eq.sdocx`);
            orClauses.push(`media_url.ilike.%"type":"html"%`);
        }

        queryBuilder = queryBuilder.or(orClauses.join(','));
    }

    if (years && years.length > 0) {
        const orConditions = years.map(y => `and(event_date.gte.${y}-01-01T00:00:00Z,event_date.lte.${y}-12-31T23:59:59Z)`).join(',');
        queryBuilder = queryBuilder.or(orConditions);
    }

    if (query) {
        if (query.startsWith('#')) {
            const tag = query.substring(1).trim();
            if (tag) queryBuilder = queryBuilder.contains('tags', [tag]);
        } else {
            queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,authors.ilike.%${query}%`);
        }
    }

    queryBuilder = queryBuilder.order('created_at', { ascending: sort === 'antigas' });
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data: submissions, error, count } = await queryBuilder;
    if (error) {
        // Quiet in production
        return { items: [], hasMore: false };
    }
    if (!submissions) return { items: [], hasMore: false };

    // Análise profunda de todos os elementos e blocos do post
    const matchedSubs = (mediaTypes && mediaTypes.length > 0)
        ? submissions.filter(sub => postMatchesMediaTypes(sub, mediaTypes))
        : submissions;

    const items = matchedSubs.map(sub => ({
        post: mapToPostDTO(sub, undefined, (sub as any).profiles?.avatar_url)
    }));

    const hasMore = count ? from + submissions.length < count : false;
    return { items, hasMore };
}

export async function fetchTrendingSubmissions(institute?: string): Promise<{ post: PostDTO }[]> {
    const supabaseServer = await createSupabaseStatic();
    let queryBuilder = supabaseServer
        .from('submissions')
        .select('*, profiles(avatar_url, xp, level, is_labdiv), like_count')
        .eq('status', 'aprovado')
        .neq('moderation_status', 'suspended')
        .neq('category', 'Arte');

    if (institute && institute.trim() && institute.toLowerCase() !== 'todos') {
        queryBuilder = queryBuilder.eq('institute', institute.toLowerCase());
    }

    const { data: submissions, error } = await queryBuilder
        .order('views', { ascending: false })
        .limit(6);

    if (error || !submissions) return [];

    return submissions.map(sub => ({
        post: mapToPostDTO(sub)
    }));
}

export const getFeaturedSubmissions = unstable_cache(
    async (limit: number = 10): Promise<{ post: PostDTO }[]> => {
        const supabaseServer = await createSupabaseStatic();
        const { data: submissions, error } = await supabaseServer
            .from('submissions')
            .select('*, profiles(avatar_url, xp, level, is_labdiv)')
            .eq('status', 'aprovado')
            .neq('moderation_status', 'suspended')
            .neq('category', 'Arte')
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error || !submissions) return [];

        return submissions.map(sub => ({
            post: mapToPostDTO(sub)
        }));
    },
    ['featured-submissions-v2'],
    { revalidate: 60 }
);

export async function getUserPseudonyms() {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await serverSupabase
        .from('pseudonyms')
        .select('*')
        .eq('user_id', user.id);

    if (error) return [];
    return data;
}

import { v2 as cloudinary } from 'cloudinary';

// Opcional: configurar globalmente se as envs estiverem disponíveis no startup
if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export async function deleteSubmissionAdmin(id: string) {
    try {
        const supabaseServer = await createServerSupabase();

        // 1. Validar Admin
        const { data: { user } } = await supabaseServer.auth.getUser();
        if (!user) return { error: "Não autenticado" };

        const { data: profile } = await supabaseServer.from('profiles').select('is_labdiv').eq('id', user.id).single();
        if (!profile?.is_labdiv) return { error: "Acesso negado: Administrador necessário." };

        // 2. Buscar a mídia para deletar do Cloudinary
        const { data: sub } = await supabaseServer.from('submissions').select('media_url, media_type').eq('id', id).single();
        if (!sub) return { error: "Submissão não encontrada" };

        // 3. Deletar Arquivos Físicos do Cloudinary (se aplicável)
        if (sub.media_url && ['image', 'pdf', 'zip', 'sdocx'].includes(sub.media_type)) {
            try {
                // Ensure config is present (in case global init failed or wasn't executed)
                cloudinary.config({
                    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                });

                let urls: string[] = [];
                try {
                    urls = JSON.parse(sub.media_url);
                } catch {
                    // Try parsing as simple array string if single URL or not JSON format
                    if (sub.media_url.startsWith('["') || sub.media_url.startsWith('[')) {
                        urls = JSON.parse(sub.media_url);
                    } else {
                        urls = [sub.media_url];
                    }
                }

                for (const url of urls) {
                    if (typeof url === 'string' && url.includes('cloudinary.com')) {
                        const parts = url.split('/upload/');
                        if (parts.length > 1) {
                            let publicIdPath = parts[1];
                            publicIdPath = publicIdPath.replace(/^v\d+\//, '');
                            // Remove a extensão (o Cloudinary destroy precisa só do Public ID sem a extensão por padrão para image)
                            const publicId = publicIdPath.replace(/\.[^/.]+$/, "");

                            const resourceType = ['image', 'pdf'].includes(sub.media_type) ? 'image' : 'raw';

                            await cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type: resourceType });
                        }
                    }
                }
            } catch (mediaErr) {
                // Ignore media delete errors
            }
        }

        // 4. Deletar do banco de dados Submissions
        const { error } = await supabaseServer.from('submissions').delete().eq('id', id);

        if (error) {
            if (process.env.NODE_ENV === 'development') console.error("Erro ao deletar submissão do banco:", error);
            return { error: error.message };
        }
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Erro desconhecido" };
    }
}

export async function deleteOwnSubmission(id: string) {
    try {
        const supabaseServer = await createServerSupabase();
        const { data: { user } } = await supabaseServer.auth.getUser();
        if (!user) return { error: "Não autenticado" };

        const { data: sub } = await supabaseServer.from('submissions').select('user_id, media_url, media_type').eq('id', id).single();
        if (!sub) return { error: "Submissão não encontrada" };
        if (sub.user_id !== user.id) return { error: "Acesso negado: Você não é o autor deste post." };

        // Deletar Arquivos Físicos do Cloudinary (se aplicável)
        if (sub.media_url && ['image', 'pdf', 'zip', 'sdocx'].includes(sub.media_type)) {
            try {
                cloudinary.config({
                    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                });
                let urls: string[] = [];
                try { urls = JSON.parse(sub.media_url); } catch { urls = [sub.media_url]; }
                for (const url of urls) {
                    if (typeof url === 'string' && url.includes('cloudinary.com')) {
                        const parts = url.split('/upload/');
                        if (parts.length > 1) {
                            let publicIdPath = parts[1].replace(/^v\d+\//, '');
                            const publicId = publicIdPath.replace(/\.[^/.]+$/, "");
                            const resourceType = ['image', 'pdf'].includes(sub.media_type) ? 'image' : 'raw';
                            await cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type: resourceType });
                        }
                    }
                }
            } catch (mediaErr) {}
        }

        const { error } = await supabaseServer.from('submissions').delete().eq('id', id);
        if (error) return { error: error.message };
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Erro desconhecido" };
    }
}

export async function revertSubmissionToDraft(id: string) {
    try {
        const supabaseServer = await createServerSupabase();
        const { data: { user } } = await supabaseServer.auth.getUser();
        if (!user) return { error: "Não autenticado" };

        const { data: sub } = await supabaseServer.from('submissions').select('user_id').eq('id', id).single();
        if (!sub) return { error: "Submissão não encontrada" };
        if (sub.user_id !== user.id) return { error: "Acesso negado: Você não é o autor deste post." };

        const { error } = await supabaseServer.from('submissions').update({ status: 'rascunho' }).eq('id', id);
        if (error) return { error: error.message };
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Erro desconhecido" };
    }
}

export async function saveDraftForShare(payload: {
    title: string;
    authors?: string;
    category?: string;
    institute?: string;
    description?: string;
    media_url?: string;
    media_type?: string;
    quiz?: any;
    reflexoes?: any;
    docs_link?: string;
    drive_link?: string;
    draftId?: string;
}) {
    try {
        const supabaseServer = await createServerSupabase();
        const { data: { user } } = await supabaseServer.auth.getUser();
        
        let client: any = supabaseServer;
        try {
            const { createAdminSupabase } = await import('@/lib/supabase/admin');
            client = createAdminSupabase();
        } catch {}

        const dataToSave: any = {
            title: payload.title || 'Rascunho Sem Título',
            authors: payload.authors || user?.user_metadata?.full_name || 'Autor(a)',
            category: payload.category || 'Outros',
            institute: (payload.institute && String(payload.institute).trim()) ? String(payload.institute).toLowerCase() : 'ifusp',
            description: payload.description || '',
            media_type: payload.media_type || 'sdocx',
            media_url: payload.media_url || '[]',
            quiz: payload.quiz || null,
            reflexoes: payload.reflexoes || null,
            docs_link: payload.docs_link || null,
            drive_link: payload.drive_link || null,
            expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        };

        if (user) {
            dataToSave.user_id = user.id;
        }

        let targetId = payload.draftId;

        // 1. Tenta salvar / atualizar na tabela shared_drafts
        try {
            if (targetId && targetId !== 'new') {
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
                if (isUUID) {
                    const { data: existing } = await client
                        .from('shared_drafts')
                        .select('id')
                        .eq('id', targetId)
                        .maybeSingle();

                    if (existing) {
                        const { error: updateError } = await client
                            .from('shared_drafts')
                            .update(dataToSave)
                            .eq('id', targetId);

                        if (!updateError) {
                            return { success: true, draftId: targetId };
                        }
                    }
                }
            }

            const { data: newShared, error: insertSharedError } = await client
                .from('shared_drafts')
                .insert([dataToSave])
                .select('id')
                .single();

            if (!insertSharedError && newShared?.id) {
                return { success: true, draftId: newShared.id };
            }
        } catch (sharedErr) {
            console.warn('Fallback para submissions ao salvar draft compartilhado:', sharedErr);
        }

        // 2. Fallback de contingência para submissions caso a tabela shared_drafts ainda não tenha sido executada
        const subData: any = {
            ...dataToSave,
            status: 'pendente'
        };

        if (targetId && targetId !== 'new') {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
            if (isUUID) {
                const { data: existingSub } = await client
                    .from('submissions')
                    .select('id')
                    .eq('id', targetId)
                    .maybeSingle();

                if (existingSub) {
                    const { error: updateSubErr } = await client
                        .from('submissions')
                        .update(subData)
                        .eq('id', targetId);

                    if (!updateSubErr) {
                        return { success: true, draftId: targetId };
                    }
                }
            }
        }

        const { data: newSub, error: insertSubErr } = await client
            .from('submissions')
            .insert([subData])
            .select('id')
            .single();

        if (insertSubErr) {
            return { error: insertSubErr.message };
        }

        return { success: true, draftId: newSub.id };
    } catch (e: any) {
        return { error: e.message || "Erro ao salvar rascunho para compartilhamento" };
    }
}

export async function getDraftSubmission(id: string) {
    try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (!isUUID) return { error: "ID de rascunho inválido" };

        const supabaseServer = await createServerSupabase();
        let client: any = supabaseServer;
        try {
            const { createAdminSupabase } = await import('@/lib/supabase/admin');
            client = createAdminSupabase();
        } catch {}

        // 1. Tenta buscar em shared_drafts
        try {
            const { data: sharedDraft, error: sharedErr } = await client
                .from('shared_drafts')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (sharedDraft && !sharedErr) {
                // Checa se a prévia expirou (15 dias)
                if (sharedDraft.expires_at && new Date(sharedDraft.expires_at).getTime() < Date.now()) {
                    return { error: "Este link de pré-visualização expirou (limite de 15 dias). Peça ao autor para gerar um novo link de prévia." };
                }

                if (sharedDraft.user_id) {
                    try {
                        const { data: prof } = await client
                            .from('profiles')
                            .select('avatar_url, xp, level, is_labdiv')
                            .eq('id', sharedDraft.user_id)
                            .maybeSingle();
                        if (prof) {
                            sharedDraft.profiles = prof;
                        }
                    } catch {}
                }

                return { success: true, data: sharedDraft };
            }
        } catch (e) {
            console.error('Erro ao buscar em shared_drafts:', e);
        }

        // 2. Tenta buscar em submissions
        const { data: subData, error: subErr } = await client
            .from('submissions')
            .select('*, profiles(avatar_url, xp, level, is_labdiv)')
            .eq('id', id)
            .maybeSingle();

        if (subData && !subErr) {
            return { success: true, data: subData };
        }

        return { error: "Rascunho não encontrado ou indisponível" };
    } catch (e: any) {
        return { error: e.message || "Erro ao carregar rascunho" };
    }
}

export async function createPseudonym(name: string) {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    // Check if it already exists to avoid unique constraint error
    const { data: existing } = await serverSupabase
        .from('pseudonyms')
        .select('*')
        .eq('name', name)
        .single();

    if (existing) {
        return { success: true, data: existing };
    }

    const { data, error } = await serverSupabase
        .from('pseudonyms')
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

    if (error) return { error: error.message };
    return { success: true, data };
}

export async function togglePseudonymActive(id: string, is_active: boolean) {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data, error } = await serverSupabase
        .from('pseudonyms')
        .update({ is_active })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return { error: error.message };
    return { success: true, data };
}

export async function deletePseudonym(id: string) {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await serverSupabase
        .from('pseudonyms')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return { error: error.message };
    return { success: true };
}

export const getTrendingTags = unstable_cache(
    async () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const supabaseServer = await createSupabaseStatic();
        const { data, error } = await supabaseServer
            .from('submissions')
            .select('tags')
            .eq('status', 'aprovado')
            .gte('created_at', oneWeekAgo.toISOString());

        if (error || !data) return [];
        const tagCounts: Record<string, number> = {};
        data.forEach(sub => sub.tags?.forEach((tag: string) => {
            const t = tag.trim();
            if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
        }));
        return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag]) => tag);
    },
    ['trending-tags-v5'],
    { revalidate: 3600 }
);

export const getSidebarTags = unstable_cache(
    async () => {
        const supabaseServer = await createSupabaseStatic();
        const { data } = await supabaseServer.from('submissions').select('tags').eq('status', 'aprovado').limit(100);
        const tagCounts: Record<string, number> = {};
        data?.forEach(sub => sub.tags?.forEach((tag: string) => {
            const t = tag.trim();
            if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
        }));
        return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
    },
    ['sidebar-tags-v2'],
    { revalidate: 60 }
);

export const getUsersInOrbit = unstable_cache(
    async (limit = 5) => {
        const supabaseServer = await createSupabaseStatic();
        let query = supabaseServer
            .from('profiles')
            .select('id, full_name, username, use_nickname, email, avatar_url, xp, level, is_labdiv')
            .eq('review_status', 'approved')
            .eq('is_visible', true)
            .not('email', 'ilike', 'bento.teste%') // Esconde o perfil de teste
            .order('is_labdiv', { ascending: false })
            .order('created_at', { ascending: false });

        if (limit > 0) {
            query = query.limit(limit);
        }

        const { data: profiles } = await query;

        return profiles?.map(p => ({
            id: p.id,
            name: (p.use_nickname && p.username) ? p.username : (p.full_name || p.username || 'Usuário'),
            handle: p.email ? `@${p.email.split('@')[0]}` : '@usuario',
            avatar: p.avatar_url,
            xp: p.xp,
            level: p.level,
            is_labdiv: p.is_labdiv
        })) || [];
    },
    ['users-in-orbit-v4'],
    { revalidate: 60 }
);

export async function searchProfiles(query: string) {
    if (!query || query.length < 2) return [];

    const supabaseServer = await createServerSupabase();
    const { data: profiles, error } = await supabaseServer
        .from('profiles')
        .select('id, full_name, username, use_nickname, email, avatar_url, xp, level, is_labdiv')
        .eq('review_status', 'approved')
        .eq('is_visible', true)
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);

    if (error) return [];

    return profiles?.map(p => ({
        id: p.id,
        name: (p.use_nickname && p.username) ? p.username : (p.full_name || 'Usuário'),
        handle: p.email ? `@${p.email.split('@')[0]}` : '@colaborador',
        avatar: p.avatar_url,
        xp: p.xp,
        level: p.level,
        is_labdiv: p.is_labdiv
    })) || [];
}

export async function followUser(followingId: string) {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return { success: false, error: 'Não autorizado' };

    const { error } = await supabaseServer
        .from('follows')
        .insert([{ follower_id: user.id, following_id: followingId }]);

    if (error) return { success: false, error: error.message };
    
    // Notification
    const userName = user.user_metadata?.full_name || 'Alguém';
    sendAutomaticNotification({
        userId: followingId,
        type: 'social',
        title: 'Novo Seguidor!',
        message: `${userName} começou a te seguir.`,
        link: `/lab?user=${user.id}`
    }).catch(console.error);

    revalidatePath('/');
    return { success: true };
}

export async function unfollowUser(followingId: string) {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return { success: false, error: 'Não autorizado' };

    const { error } = await supabaseServer
        .from('follows')
        .delete()
        .match({ follower_id: user.id, following_id: followingId });

    if (error) return { success: false, error: error.message };
    revalidatePath('/');
    return { success: true };
}

export async function checkIsFollowing(followingId: string) {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return false;

    const { data } = await supabaseServer
        .from('follows')
        .select('id')
        .match({ follower_id: user.id, following_id: followingId })
        .single();

    return !!data;
}

export async function getFollowStats(userId: string) {
    const supabaseServer = await createServerSupabase();
    
    // Followers: count where following_id = userId
    const { count: followersCount } = await supabaseServer
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);
        
    // Following: count where follower_id = userId
    const { count: followingCount } = await supabaseServer
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

    return {
        followers: followersCount || 0,
        following: followingCount || 0
    };
}

export async function fetchFollowersList(userId: string) {
    const supabaseServer = await createServerSupabase();
    
    // Pega IDs de quem segue o userId
    const { data: follows } = await supabaseServer
        .from('follows')
        .select('follower_id')
        .eq('following_id', userId);

    if (!follows || follows.length === 0) return [];

    const followerIds = follows.map(f => f.follower_id);

    // Pega os perfis desses IDs
    const { data: profiles } = await supabaseServer
        .from('profiles')
        .select('id, full_name, username, avatar_url, use_nickname, review_status, role')
        .in('id', followerIds)
        .eq('is_visible', true);

    return profiles || [];
}

export async function fetchFollowingList(userId: string) {
    const supabaseServer = await createServerSupabase();
    
    // Pega IDs de quem o userId está seguindo
    const { data: follows } = await supabaseServer
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId);

    if (!follows || follows.length === 0) return [];

    const followingIds = follows.map(f => f.following_id);

    // Pega os perfis desses IDs
    const { data: profiles } = await supabaseServer
        .from('profiles')
        .select('id, full_name, username, avatar_url, use_nickname, review_status, role')
        .in('id', followingIds)
        .eq('is_visible', true);

    return profiles || [];
}

export async function removeFollower(followerId: string) {
    // Current user that is being followed wants to remove someone from their followers list
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return { success: false, error: 'Não autorizado' };

    const { error } = await supabaseServer
        .from('follows')
        .delete()
        .match({ follower_id: followerId, following_id: user.id });

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/lab');
    revalidatePath('/');
    return { success: true };
}

export async function getProfileById(id: string) {
    const supabaseServer = await createServerSupabase();
    const { data } = await supabaseServer
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .eq('id', id)
        .single();

    return data ? {
        id: data.id,
        name: data.full_name || 'Usuário',
        handle: data.email ? `@${data.email.split('@')[0]}` : '@usuario',
        avatar: data.avatar_url,
    } : null;
}

export async function sendMessage(recipientId: string, content: string, attachmentId?: string) {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return { success: false, error: 'Não autorizado' };

    const { error } = await supabaseServer
        .from('messages')
        .insert([{
            sender_id: user.id,
            recipient_id: recipientId,
            content,
            attachment_id: attachmentId || null,
            status: 'sent'
        }]);

    if (error) return { success: false, error: error.message };

    return { success: true };
}

export async function fetchMessages(recipientId: string) {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabaseServer
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

    if (error) return [];

    return data || [];
}

export async function createSubmission(formData: z.infer<typeof SubmissionSchema>) {
    // createSubmission logic simplified (removed debug logs)
    const validated = SubmissionSchema.safeParse(formData);
    if (!validated.success) {
        const fieldErrors = validated.error.flatten().fieldErrors;
        // Validation Failed
        return {
            error: {
                validation: fieldErrors,
                message: "Falha na validação dos dados pelo servidor."
            }
        };
    }
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return { error: { auth: ["Unauthorized"] } };

    // [GOLDEN MASTER] DB Mapping & Cleaning
    const {
        read_guide,
        accepted_cc,
        co_authors,
        event_year,
        pseudonym_id,
        new_pseudonym,
        quiz,
        video_url, // Excluded from DB insert as it has no column
        is_historical,
        is_golden_standard,
        selected_departments,
        selected_laboratories,
        selected_researchers,
        selected_research_lines,
        contexto_hsec,
        reflexoes,
        ...insertData
    } = validated.data as any;

    const co_author_ids = Array.isArray(co_authors)
        ? co_authors.map(u => typeof u === 'string' ? u : u.id).filter(Boolean)
        : [];

    // Map year to event_date
    const event_date = event_year ? `${event_year}-01-01T12:00:00Z` : null;

    // Fix: DB media_type enum is ['image', 'video', 'pdf', 'text', 'link', 'zip', 'sdocx']
    // Frontend uses 'text' for some links, but DB might expect 'link'
    let db_media_type = insertData.media_type;
    if (db_media_type as string === 'text' && (insertData.media_url?.startsWith('http') || insertData.external_link)) {
        // Only switch to 'link' if it's actually a link
    }

    // Determinar status inicial: Lab-Div aprovado automaticamente se for do time
    const { data: profile } = await serverSupabase.from('profiles').select('role').eq('id', user.id).single();
    const isAuthorized = ['admin', 'labdiv', 'moderator', 'labdiv adm'].includes(profile?.role || '');
    const initialStatus = (validated.data.category === 'Lab-Div' && isAuthorized) ? 'aprovado' : 'pendente';

    const insertPayload = {
        ...insertData,
        co_author_ids,
        event_date,
        pseudonym_id,
        quiz,
        contexto_hsec,
        user_id: user.id,
        status: initialStatus,
        is_historical,
        is_golden_standard
    };

    // Attempting Insert

    const { data: newSub, error } = await serverSupabase.from('submissions').insert([insertPayload]).select().single();

    if (error) {
        // DB Insert Failed
        return { error: { database: [`Erro DB (${error.code}): ${error.message}`] } };
    }

    // Attempting Side Effects in Parallel (Optimizing performance)
    const sideEffects = [];

    // [Interactive V4.0] Insert Reflections
    if (reflexoes && Array.isArray(reflexoes) && reflexoes.length > 0) {
        sideEffects.push(
            serverSupabase.from('reflexoes_inline').insert(reflexoes.map(r => ({
                ...r,
                post_id: newSub.id
            }))).then(({ error }) => {
                if (error) console.error("Error inserting reflexoes_inline:", error);
            })
        );
    }

    // Revalidations
    sideEffects.push(Promise.resolve().then(() => revalidatePath('/')));
    sideEffects.push(Promise.resolve().then(() => revalidatePath('/admin/pendentes')));

    // Notifications
    const notificationPromise = (async () => {
        try {
            const { sendAdminNotification } = await import('@/lib/notifications.server');
            await sendAdminNotification({
                type: 'submission',
                title: newSub.title,
                authors: newSub.authors,
                category: newSub.category || 'Geral'
            });

            if (initialStatus === 'pendente') {
                await sendAutomaticNotification({
                    userId: user.id,
                    title: 'Conteúdo em Análise ⏳',
                    message: `Seu envio para a categoria [${newSub.category || 'Geral'}] foi recebido pelo Painel Administrativo e aguarda moderação. Avisaremos assim que for aprovado!`,
                    type: 'submission'
                });
            }
        } catch (e) {
            console.error('Error in side-effect notifications:', e);
        }
    })();
    sideEffects.push(notificationPromise);

    // Knowledge Graph Junctions
    if (selected_departments?.length > 0) {
        sideEffects.push(serverSupabase.from('submission_departments').insert(selected_departments.map((id: string) => ({ submission_id: newSub.id, department_id: id }))));
    }
    if (selected_laboratories?.length > 0) {
        sideEffects.push(serverSupabase.from('submission_laboratories').insert(selected_laboratories.map((id: string) => ({ submission_id: newSub.id, laboratory_id: id }))));
    }
    if (selected_researchers?.length > 0) {
        sideEffects.push(serverSupabase.from('submission_researchers').insert(selected_researchers.map((id: string) => ({ submission_id: newSub.id, researcher_id: id }))));
    }
    if (selected_research_lines?.length > 0) {
        sideEffects.push(serverSupabase.from('submission_research_lines').insert(selected_research_lines.map((id: string) => ({ submission_id: newSub.id, research_line_id: id }))));
    }

    // Wait for all non-critical work to complete or error out gracefully
    await Promise.allSettled(sideEffects);

    return { success: true, data: newSub };

    return { success: true, data: newSub };
}

export async function updateSubmission(id: string, formData: any) {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return { error: { auth: ["Unauthorized"] } };

    // Validar se o usuário é o dono do post ou se é admin
    const { data: existingPost } = await serverSupabase
        .from('submissions')
        .select('user_id')
        .eq('id', id)
        .single();
        
    if (!existingPost) return { error: { message: "Post não encontrado" } };
    
    if (existingPost.user_id !== user.id) {
        const { data: profile } = await serverSupabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') {
            return { error: { message: "Você só pode editar seus próprios posts." } };
        }
    }

    const {
        title, authors, category, institute, description, media_type, media_url,
        event_year, is_historical, is_golden_standard, accepted_cc,
        language_register, needs_moderation_help, reflexoes, quiz
    } = formData;

    const event_date = event_year ? `${event_year}-01-01T12:00:00Z` : null;

    const updatePayload = {
        title,
        authors,
        category,
        institute: (institute && String(institute).trim()) ? String(institute).toLowerCase() : 'ifusp',
        description,
        media_type,
        media_url,
        event_date,
        is_historical,
        is_golden_standard,
        language_register,
        needs_moderation_help,
        quiz
    };

    const { data: updatedSub, error } = await serverSupabase
        .from('submissions')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return { error: { database: [`Erro DB (${error.code}): ${error.message}`] } };
    }

    // Update Reflexoes
    if (reflexoes && Array.isArray(reflexoes)) {
        // Simple strategy: delete old and insert new
        await serverSupabase.from('reflexoes_inline').delete().eq('post_id', id);
        if (reflexoes.length > 0) {
            await serverSupabase.from('reflexoes_inline').insert(reflexoes.map(r => ({
                ...r,
                post_id: id
            })));
        }
    }

    revalidatePath('/');
    revalidatePath(`/arquivo/${id}`);
    revalidatePath('/lab');

    return { success: true, data: updatedSub };
}

export async function fetchUserSubmissions(userId: string): Promise<{ post: PostDTO }[]> {
    const supabaseServer = await createServerSupabase();
    const { data: submissions, error } = await supabaseServer
        .from('submissions')
        .select('*, profiles(avatar_url, xp, level, is_labdiv), energy_reactions, atomic_excitation')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error || !submissions) return [];

    return submissions
        .filter(sub => 
            sub.status !== 'deleted' && 
            sub.status !== 'deletado' && 
            sub.moderation_status !== 'suspended' && 
            sub.moderation_status !== 'deleted'
        )
        .map(sub => ({
            post: mapToPostDTO(sub)
        }));
}

export async function updateSubmissionAdmin(id: string, updates: AdminUpdate) {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return { error: { message: 'Unauthorized' } };

    // Strict Admin Check
    const { data: profile } = await serverSupabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: { message: 'Forbidden' } };

    const { data, error } = await serverSupabase
        .from('submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (!error && data) {
        // Trigger Notifications for Author
        if (updates.status === 'aprovado') {
            const hasFeedback = !!updates.admin_feedback;
            const title = hasFeedback ? 'Conteúdo Aprovado com Review! 📝' : 'Conteúdo Aprovado! 🚀';
            let message = hasFeedback 
                ? 'Seu conteúdo foi aprovado e um revisor deixou um feedback para você.'
                : 'Seu envio saiu do Painel Adm e já está publicado na comunidade!';
            
            if (hasFeedback) {
                message += `\n\n"${updates.admin_feedback}"`;
            }

            await sendAutomaticNotification({
                userId: data.user_id,
                title,
                message,
                link: `/fluxo/${data.id}`, // Standard link to the post
                type: 'approval'
            });
        }

        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/admin/pendentes');
        revalidatePath('/admin/acervo');
        revalidatePath('/fluxo');
    }
    return { data, error };
}

export async function fetchAdminSubmissions(status: string) {
    const supabaseServer = await createServerSupabase();
    const { data: submissions, error } = await supabaseServer
        .from('submissions')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error || !submissions) return [];
    return submissions.map(sub => mapToAdminPostDTO(sub));
}

export async function fetchParticlePreview(id: string) {
    const supabaseServer = await createServerSupabase();
    const { data, error } = await supabaseServer
        .from('submissions')
        .select('title, authors, atomic_excitation')
        .eq('id', id)
        .single();

    if (error || !data) return null;

    return {
        title: data.title,
        author: data.authors,
        energy: data.atomic_excitation || 0
    };
}

export async function getCurrentUserId() {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();
    return user?.id || null;
}
// deprecated_fetchRecentEntanglements REMOVED

export async function requestPostModeration(postId: string, type: 'edit' | 'delete', payload?: any) {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return { error: 'Não autorizado' };

    // Validar se o post pertence ao usuário
    const { data: post, error: fetchError } = await serverSupabase
        .from('submissions')
        .select('user_id, status')
        .eq('id', postId)
        .single();

    if (fetchError || !post) return { error: 'Post não encontrado' };
    if (post.user_id !== user.id) return { error: 'Você não tem permissão para editar este post' };

    const moderation_request = {
        type,
        payload,
        status: 'pending',
        requested_at: new Date().toISOString()
    };

    const { error: updateError } = await serverSupabase
        .from('submissions')
        .update({ moderation_request })
        .eq('id', postId);

    if (updateError) return { error: updateError.message };

    revalidatePath('/lab');
    revalidatePath('/admin');
    
    // Notificar Admin
    try {
        const { sendAdminNotification } = await import('@/lib/notifications.server');
        await sendAdminNotification({
            type: 'bug_report', // Reusing report type for governance
            title: `Solicitação de ${type === 'edit' ? 'Edição' : 'Anonimização'}`,
            authors: user.email || 'Usuário',
            category: 'Governança'
        });
    } catch (e) {}

    return { success: true };
}

export async function getEstimatedAdminWaitTime() {
    try {
        const supabaseServer = await createServerSupabase();
        // Fetch last 5 approved submissions to estimate average moderation time
        const { data } = await supabaseServer
            .from('submissions')
            .select('created_at, updated_at')
            .eq('status', 'aprovado')
            .not('updated_at', 'is', null) // Avoid nulls
            .order('updated_at', { ascending: false })
            .limit(5);

        if (!data || data.length === 0) return 'alguns minutos';
        
        let totalTime = 0;
        let count = 0;
        data.forEach(item => {
            if (item.updated_at && item.created_at) {
                const up = new Date(item.updated_at).getTime();
                const cr = new Date(item.created_at).getTime();
                // Validar dados sãos (máximo 72h para não bagunçar a média com lixo)
                if (up > cr && (up - cr) < (72 * 60 * 60 * 1000)) {
                    totalTime += (up - cr);
                    count++;
                }
            }
        });
        
        if (count === 0) return 'alguns minutos';
        const avgMs = totalTime / count;
        const minutes = Math.round(avgMs / (1000 * 60));
        
        if (minutes < 1) return 'menos de 1 minuto';
        if (minutes === 1) return '1 minuto';
        return `${minutes} minutos`;
    } catch {
        return 'alguns minutos';
    }
}

export async function resolvePostModeration(postId: string, action: 'approve' | 'reject') {
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return { error: 'Não autorizado' };

    // Strict Admin Check
    const { data: profile } = await serverSupabase.from('profiles').select('role').eq('id', user.id).single();
    if (!['admin', 'labdiv adm', 'moderador'].includes(profile?.role || '')) return { error: 'Acesso negado' };

    const { data: post, error: fetchError } = await serverSupabase
        .from('submissions')
        .select('*, moderation_request')
        .eq('id', postId)
        .single();

    if (fetchError || !post || !post.moderation_request) return { error: 'Solicitação não encontrada' };

    const request = post.moderation_request as any;

    if (action === 'reject') {
        const { error } = await serverSupabase
            .from('submissions')
            .update({ moderation_request: null })
            .eq('id', postId);
        
        if (error) return { error: error.message };
        
        revalidatePath('/admin');
        return { success: true, message: 'Solicitação rejeitada' };
    }

    // Approve
    let updates: any = { moderation_request: null };

    if (request.type === 'delete') {
        // Anonimização solicitada
        updates.user_id = null;
        updates.authors = 'Anônimo';
    } else if (request.type === 'edit' && request.payload) {
        // Aplica os campos do payload
        updates = { ...updates, ...request.payload };
    }

    const { error: updateError } = await serverSupabase
        .from('submissions')
        .update(updates)
        .eq('id', postId);

    if (updateError) return { error: updateError.message };

    revalidatePath('/');
    revalidatePath('/lab');
    revalidatePath('/admin');
    revalidatePath(`/arquivo/${postId}`);

    return { success: true, message: 'Solicitação aprovada e aplicada!' };
}
