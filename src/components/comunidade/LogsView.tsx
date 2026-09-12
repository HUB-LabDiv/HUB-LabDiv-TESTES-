'use client';

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


import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { FilePenLine, Send, Atom, Clock, Star, Hash, GitCommit, Loader2, Zap, ArrowUp, ArrowDown, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { fetchThreads, createDrop, reactToDrop } from '@/app/actions/drops';
import { SkeletonLog } from '@/components/ui/SkeletonLog';

export interface Drop {
    id: string;
    author_id: string;
    content: string;
    parent_id?: string | null;
    likes_count: number;
    dislikes_count: number;
    created_at: string;
    status: string;
    is_featured: boolean;
    profiles?: {
        name: string;
        avatar: string;
        handle: string;
        user_category?: string;
        research_line?: string;
        course?: string;
        interest_area?: string;
    };
    replies_count?: number;
    user_reaction?: 'up' | 'down' | null;
}

export function LogsView() {
    const [drops, setDrops] = useState<Drop[]>([]);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isSyncing, setIsSyncingState] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setIsSyncing = useCallback((val: boolean) => {
        if (val) {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
            setIsSyncingState(true);
        } else {
            syncTimeoutRef.current = setTimeout(() => {
                setIsSyncingState(false);
            }, 4000);
        }
    }, []);

    const [feedScope, setFeedScope] = useState<'todos' | 'seguindo'>('todos');

    useEffect(() => {
        fetchDrops();
        supabase.auth.getUser().then(({ data }) => setUser(data.user));

        const channel = supabase
            .channel('drops_realtime_hub')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'micro_articles' }, () => {
                fetchDrops();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchDrops = async (scope: 'todos' | 'seguindo' = feedScope) => {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        let followingIds: string[] = [];
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        let queryBuilder = supabase
            .from('micro_articles')
            .select(`
                *,
                likes_count,
                dislikes_count,
                profiles:author_id (
                    name:full_name,
                    handle:username,
                    avatar:avatar_url,
                    user_category,
                    research_line,
                    course,
                    interest_area
                )
            `)
            .is('parent_id', null)
            .eq('status', 'approved')
            .neq('moderation_status', 'suspended')
            .or(`is_featured.eq.true,created_at.gte.${twentyFourHoursAgo}`);

        if (scope === 'seguindo' && user) {
            const { data: follows } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', user.id);
            
            if (follows && follows.length > 0) {
                const followingIds = follows.map(f => f.following_id);
                queryBuilder = queryBuilder.in('author_id', followingIds);
            } else {
                queryBuilder = queryBuilder.in('author_id', []);
            }
        } else if (scope === 'seguindo' && !user) {
             queryBuilder = queryBuilder.in('author_id', []);
        }

        const { data, error } = await queryBuilder
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Drops] Fetch error:', error);
            return;
        }

        const dropsWithContext = await Promise.all((data || []).map(async (drop) => {
            const { count } = await supabase
                .from('micro_articles')
                .select('*', { count: 'exact', head: true })
                .eq('parent_id', drop.id)
                .eq('status', 'approved')
                .neq('moderation_status', 'suspended');

            let userReaction = null;
            if (user) {
                const { data: reaction } = await supabase
                    .from('micro_article_likes')
                    .select('reaction_type')
                    .eq('article_id', drop.id)
                    .eq('user_id', user.id)
                    .single();
                userReaction = reaction?.reaction_type || null;
            }

            return { 
                ...drop, 
                replies_count: count || 0,
                user_reaction: userReaction
            };
        }));

        setDrops(dropsWithContext as Drop[]);
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return toast.error('Faça login para postar um Drop!');
        if (!content.trim()) return;
        if (content.length > 260) return toast.error('O limite é de 260 caracteres!');

        setIsSubmitting(true);
        const result = await createDrop(content.trim());

        if (result.error) {
            toast.error(result.error);
        } else {
            setContent('');
            toast.success('Log enviado para aprovação!');
        }
        setIsSubmitting(false);
    };

    const featuredDrops = useMemo(() => drops.filter(d => d.is_featured), [drops]);
    const recentDrops = useMemo(() => drops.filter(d => !d.is_featured), [drops]);

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-8">
            <div data-tour="logs-header" className="flex flex-col gap-3 relative mb-6">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-red/5 rounded-full blur-[60px] pointer-events-none"></div>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter text-brand-red flex items-center gap-4 relative z-10">
                    <FilePenLine className="w-12 h-12" />
                    Logs
                </h1>
                <p className="text-gray-400 font-medium text-sm border-l-2 border-brand-red pl-4 max-w-xl leading-relaxed [text-shadow:var(--text-halo)]">
                    Microatualizações rápidas, descobertas recentes e notícias de bastidores transmitidas em tempo real pelos pesquisadores e estudantes do IFUSP.
                </p>
            </div>

            <form data-tour="logs-form" onSubmit={handleSubmit} className="relative glass-card p-8 rounded-[40px] border-brand-red/10 bg-gradient-to-br from-brand-red/10 via-transparent to-transparent shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Hash size={80} />
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Compartilhe uma descoberta rápida ou notícia do lab..."
                    className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none min-h-[120px] placeholder:text-gray-700 dark:placeholder:text-gray-600 font-medium"
                    maxLength={260}
                />
                <div className="flex items-center justify-between mt-6 border-t dark:border-white/5 border-gray-100 pt-6">
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black font-mono px-3 py-1 rounded-full border ${content.length > 240 ? 'text-brand-red border-brand-red/20 bg-brand-red/10' : 'text-gray-500 border-white/5 bg-white/5'}`}>
                            {content.length} <span className="opacity-40">/</span> 260
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="bg-brand-red hover:bg-brand-red text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-red/20 shadow-inner"
                    >
                        {isSubmitting ? 'Transmitindo...' : <>Lançar <Send className="w-4 h-4" /></>}
                    </button>
                </div>
            </form>

            {/* TOGGLE SEGUINDO VS TODOS */}
            <div className="flex justify-center mb-4 mt-8">
                <div className="flex p-1 bg-white/50 dark:bg-card-dark/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full shadow-sm">
                    <button
                        onClick={() => {
                            if (!user) {
                                toast.error('Faça login para ver os logs de quem você segue!');
                                return;
                            }
                            setFeedScope('todos');
                            fetchDrops('todos');
                        }}
                        className={`relative px-5 py-2 rounded-full text-[10px] sm:text-xs font-black font-bukra uppercase tracking-widest transition-all ${
                            feedScope === 'todos' 
                                ? 'text-white' 
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {feedScope === 'todos' && (
                            <motion.div
                                layoutId="logsFeedScope"
                                className="absolute inset-0 bg-brand-red rounded-full shadow-lg shadow-brand-red/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">Explorar Todos</span>
                    </button>

                    <button
                        onClick={() => {
                            if (!user) {
                                toast.error('Faça login para ver os logs de quem você segue!');
                                return;
                            }
                            setFeedScope('seguindo');
                            fetchDrops('seguindo');
                        }}
                        className={`relative px-5 py-2 rounded-full text-[10px] sm:text-xs font-black font-bukra uppercase tracking-widest transition-all ${
                            feedScope === 'seguindo' 
                                ? 'text-white' 
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {feedScope === 'seguindo' && (
                            <motion.div
                                layoutId="logsFeedScope"
                                className="absolute inset-0 bg-brand-red rounded-full shadow-lg shadow-brand-red/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">Seguindo</span>
                    </button>
                </div>
            </div>

            <div data-tour="logs-feed" className="space-y-12">
                {isLoading ? (
                    <FeedSection title="Interceptando Transmissões..." icon={<Loader2 className="w-4 h-4 animate-spin" />} color="red">
                        <SkeletonLog />
                        <SkeletonLog />
                        <SkeletonLog />
                    </FeedSection>
                ) : (
                    <>
                        {featuredDrops.length > 0 && (
                            <FeedSection title="Logs Destacados" icon={<Star className="w-4 h-4 fill-yellow-500" />} color="yellow">
                                {featuredDrops.map(drop => <ThreadNode key={drop.id} drop={drop} level={0} onRefresh={fetchDrops} setIsSyncing={setIsSyncing} />)}
                            </FeedSection>
                        )}

                        <FeedSection title="Logs Recentes (24h)" icon={<Clock className="w-4 h-4" />} color="red">
                            {recentDrops.length > 0 ? (
                                recentDrops.map(drop => <ThreadNode key={drop.id} drop={drop} level={0} onRefresh={fetchDrops} setIsSyncing={setIsSyncing} />)
                            ) : (
                                <div className="py-12 px-6 text-center bg-[#1E1E1E] border border-white/5 rounded-3xl space-y-3 shadow-xl my-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mx-auto text-brand-red">
                                        <Radio className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <p className="font-mono text-xs uppercase tracking-widest text-gray-300 font-bold">Nenhuma transmissão captada nas últimas 24h.</p>
                                    <p className="text-xs text-gray-400 max-w-sm mx-auto">Seja o primeiro a enviar uma descoberta ou notícia rápida no campo acima!</p>
                                </div>
                            )}
                        </FeedSection>
                    </>
                )}
            </div>

            <AnimatePresence>
                {isSyncing && (
                    <motion.div initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 50, scale: 0.9 }} className="fixed top-6 right-6 z-[100] bg-background-dark/80 backdrop-blur-xl border border-brand-blue/30 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(0,163,255,0.15)]">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-brand-blue/30 rounded-full" />
                            <div className="relative">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-brand-blue rounded-full shadow-[0_0_10px_#00A3FF]" />
                                <Atom className="absolute -top-3 -left-3 w-8 h-8 text-white/10 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex flex-col pr-2">
                            <h2 className="text-[10px] font-black font-mono text-white uppercase tracking-[0.2em]">Sinc_Atômico</h2>
                            <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest leading-none">Atualizando_Partículas...</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4, ease: "linear" }} className="h-full bg-brand-blue shadow-[0_0_10px_#3b82f6]" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FeedSection({ title, icon, color, children }: { title: string, icon: React.ReactNode, color: 'red' | 'yellow', children: React.ReactNode }) {
    const borderColor = color === 'red' ? 'via-brand-red/50' : 'via-brand-yellow/50';
    const textColor = color === 'red' ? 'text-brand-red' : 'text-brand-yellow';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
                <div className={`h-px bg-gradient-to-r from-transparent ${borderColor} to-transparent flex-1`}></div>
                <div className={`flex items-center gap-2 ${textColor} font-black uppercase italic tracking-tighter text-sm`}>
                    {icon} {title}
                </div>
                <div className={`h-px bg-gradient-to-r from-transparent ${borderColor} to-transparent flex-1`}></div>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

export function ThreadNode({ drop, level = 0, onRefresh, setIsSyncing }: { drop: Drop, level?: number, onRefresh?: () => void, setIsSyncing?: (val: boolean) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [threads, setThreads] = useState<Drop[]>([]);
    const [isLoadingThreads, setIsLoadingThreads] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [imgError, setImgError] = useState(false);

    const fetchCurrentThreads = async () => {
        setIsLoadingThreads(true);
        if (setIsSyncing) setIsSyncing(true);
        const { data } = await fetchThreads(drop.id);
        if (data) setThreads(data as Drop[]);
        setIsLoadingThreads(false);
        if (setIsSyncing) setIsSyncing(false);
    };

    const handleToggleExpand = async () => {
        if (!isExpanded && threads.length === 0 && (drop.replies_count || 0) > 0) {
            await fetchCurrentThreads();
        }
        setIsExpanded(!isExpanded);
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((drop.replies_count || 0) >= 4) {
            toast.error('Limite de imendas atingido!', { icon: '🧪' });
            setShowReplyInput(false);
            return;
        }
        if (!replyContent.trim()) return;
        setIsSubmittingReply(true);
        const result = await createDrop(replyContent.trim(), drop.id);
        if (!result.error) {
            setReplyContent('');
            setShowReplyInput(false);
            toast.success('Resposta enviada para aprovação!');
        } else {
            toast.error(result.error);
        }
        setIsSubmittingReply(false);
    };

    const hasReplies = (drop.replies_count || 0) > 0 || threads.length > 0;
    const marginClass = level > 0 ? (level <= 3 ? `ml-4 sm:ml-6` : `ml-2 sm:ml-4`) : '';
    const borderClass = level > 0 ? `border-l-2 ${hasReplies ? 'border-brand-red/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-zinc-800'} hover:border-zinc-500 transition-colors` : '';

    return (
        <div className={`${marginClass} ${borderClass} pl-4 space-y-3`}>
            <div className={`group relative glass-card p-6 rounded-[2.5rem] border-white/5 transition-all ${level === 0 ? 'bg-zinc-950/40 backdrop-blur-md' : 'bg-transparent border-transparent'}`}>
                <div className="flex gap-4 text-left items-start">
                    <div className="shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center overflow-hidden border border-brand-red/20 shadow-inner">
                            {drop.profiles?.avatar && !imgError ? (
                                <img src={drop.profiles.avatar} className="w-full h-full object-cover" alt="" onError={() => setImgError(true)} />
                            ) : (
                                <span className="text-[10px] font-black text-brand-red uppercase">{(drop.profiles?.handle || drop.profiles?.name || 'M')[0]}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-black text-sm text-gray-900 dark:text-white truncate max-w-[150px]">@{drop.profiles?.handle || 'membro'}</span>
                            <div className="flex items-center gap-2 text-[9px] font-black font-mono text-gray-500 bg-background-dark/20 px-2 py-1 rounded-lg border border-white/5 shrink-0">
                                <Clock className="w-2.5 h-2.5 text-brand-red" />
                                {new Date(drop.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {!drop.is_featured && level === 0 && (
                                <div className="px-2 py-1 bg-brand-red/10 border border-brand-red/20 rounded-full shrink-0">
                                    <LogTimer createdAt={drop.created_at} />
                                </div>
                            )}
                        </div>
                        <p className={`font-medium break-words ${level === 0 ? 'text-gray-100 text-sm' : 'text-gray-400 text-xs'}`}>{drop.content}</p>

                        <div className="flex items-center gap-4 pt-1">
                            <button onClick={handleToggleExpand} className="flex flex-col items-center gap-0.5 group/btn">
                                <div className={`flex items-center gap-1.5 px-1.5 py-0.5 border border-brand-red/30 rounded group-hover/btn:border-brand-red/60 transition-colors ${hasReplies ? 'bg-brand-red/5' : ''}`}>
                                    {hasReplies && (drop.replies_count || 0) >= 4 ? <Zap className="w-4 h-4 text-brand-red fill-brand-red filter drop-shadow-[0_0_3px_rgba(239,68,68,0.5)]" /> : <GitCommit className={`w-4 h-4 group-hover/btn:scale-110 transition-transform ${hasReplies ? 'text-brand-red' : ''}`} />}
                                    <span className={`text-[10px] font-black font-mono ${hasReplies ? 'text-brand-red' : ''}`}>{drop.replies_count || threads.length || 0}</span>
                                </div>
                                <span className="text-[8px] uppercase font-black tracking-tighter text-gray-600 group-hover/btn:text-brand-red transition-colors leading-none">ver</span>
                            </button>
                            <button onClick={() => { if ((drop.replies_count || 0) >= 4) return; setShowReplyInput(!showReplyInput); }} className={`text-[10px] uppercase font-black tracking-widest transition-colors ${(drop.replies_count || 0) >= 4 ? 'text-gray-800 cursor-not-allowed' : 'text-gray-600 hover:text-brand-red'}`}>IMENDAR</button>
                            
                            <div className="flex items-center gap-4 border-l border-white/5 pl-4 ml-2">
                                <button onClick={async (e) => { e.stopPropagation(); if (setIsSyncing) setIsSyncing(true); const res = await reactToDrop(drop.id, 'up'); if (res?.error) toast.error(res.error); else if (onRefresh) onRefresh(); if (setIsSyncing) setIsSyncing(false); }} className="flex items-center gap-2 group/react hover:scale-110 transition-transform">
                                    <div className="relative">
                                        <Atom size={18} className={`${drop.user_reaction === 'up' ? 'text-brand-blue' : 'text-gray-600/40'} group-hover/react:text-brand-blue transition-colors`} />
                                        <ArrowUp size={10} className={`absolute -top-1.5 -right-1.5 ${drop.user_reaction === 'up' ? 'text-brand-blue font-bold' : 'text-gray-600/40'} group-hover/react:text-brand-blue transition-colors`} />
                                    </div>
                                    <span className={`text-[10px] font-mono font-black ${drop.user_reaction === 'up' ? 'text-brand-blue' : 'text-gray-600/60'}`}>{drop.likes_count || 0}</span>
                                </button>
                                <button onClick={async (e) => { e.stopPropagation(); if (setIsSyncing) setIsSyncing(true); const res = await reactToDrop(drop.id, 'down'); if (res?.error) toast.error(res.error); else if (onRefresh) onRefresh(); if (setIsSyncing) setIsSyncing(false); }} className="flex items-center gap-2 group/react hover:scale-110 transition-transform">
                                    <div className={`relative ${drop.user_reaction === 'down' ? 'opacity-100' : 'opacity-30 group-hover/react:opacity-100'} transition-opacity`}>
                                        <Atom size={18} className={`${drop.user_reaction === 'down' ? 'text-brand-red' : 'text-gray-500'} group-hover/react:text-brand-red transition-colors`} />
                                        <ArrowDown size={10} className={`absolute -bottom-1.5 -right-1.5 ${drop.user_reaction === 'down' ? 'text-brand-red' : 'text-gray-400'} group-hover/react:text-brand-red`} />
                                    </div>
                                    <span className={`text-[10px] font-mono font-black ${drop.user_reaction === 'down' ? 'text-brand-red/80' : 'text-gray-600/60'}`}>{drop.dislikes_count || 0}</span>
                                </button>
                            </div>
                            {isLoadingThreads && <div className="w-3 h-3 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>}
                        </div>
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${showReplyInput ? 'mt-4 opacity-100' : 'max-h-0 opacity-0'}`} style={{ maxHeight: showReplyInput ? '500px' : '0' }}>
                    <form onSubmit={handleReply} className="flex gap-2">
                        <input value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Adicionar ao fio..." className="flex-1 bg-background-dark/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-brand-red outline-none text-white" maxLength={260} autoFocus={showReplyInput} />
                        <button type="submit" disabled={isSubmittingReply || !replyContent.trim()} className="bg-brand-red p-2 rounded-xl text-white hover:scale-105 transition-all text-xs font-black flex items-center justify-center min-w-[36px]">
                            {isSubmittingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        </button>
                    </form>
                </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}>
                <div className="overflow-hidden space-y-3">
                    {threads.map(reply => <ThreadNode key={reply.id} drop={reply} level={level + 1} onRefresh={fetchCurrentThreads} setIsSyncing={setIsSyncing} />)}
                </div>
            </div>
        </div>
    );
}

function LogTimer({ createdAt }: { createdAt: string }) {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const updateTimer = () => {
            const diff = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000 - Date.now();
            if (diff <= 0) { setTimeLeft('00h 00m'); return; }
            setTimeLeft(`${Math.floor(diff / (1000 * 60 * 60))}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m`);
        };
        const interval = setInterval(updateTimer, 60000);
        updateTimer();
        return () => clearInterval(interval);
    }, [createdAt]);
    return <span className="text-[8px] font-black font-mono text-brand-red uppercase">{timeLeft}</span>;
}
