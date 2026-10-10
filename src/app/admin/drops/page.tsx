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


import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
    MessageSquare, Check, X, Star, Trash2, Atom,
    Clock, Loader2, Search, Inbox, ShieldCheck, Compass
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Drop {
    id: string;
    content: string;
    status: string;
    is_featured: boolean;
    created_at: string;
    likes_count: number;
    profiles?: {
        name: string;
        handle: string;
        avatar: string;
        user_category?: string;
        research_line?: string;
        course?: string;
        interest_area?: string;
    };
    parent?: {
        content: string;
        author?: {
            handle: string;
        };
    };
}

export default function AdminDropsPage() {
    const [drops, setDrops] = useState<Drop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'featured' | 'rejected'>('pending');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDrops = useCallback(async () => {
        setIsLoading(true);
        // Correcting column names to match profiles table schema:
        // name -> full_name, handle -> username, avatar -> avatar_url
        let query = supabase
            .from('micro_articles')
            .select(`
                *,
                profiles:author_id (
                    name:full_name,
                    handle:username,
                    avatar:avatar_url,
                    user_category,
                    research_line,
                    course,
                    interest_area
                ),
                parent:parent_id (
                    content,
                    author:author_id (
                        handle:username
                    )
                )
            `)
            .order('created_at', { ascending: false });

        if (filter === 'featured') {
            query = query.eq('is_featured', true);
        } else {
            query = query.eq('status', filter);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Fetch error:', error);
            toast.error('Erro ao carregar logs');
        } else {
            setDrops(data || []);
        }
        setIsLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchDrops();
    }, [fetchDrops]);

    const handleAction = async (id: string, action: 'approve' | 'feature' | 'remove_feature' | 'delete' | 'reject' | 'to_usp101') => {
        try {
            let updateData: any = {};
            if (action === 'approve') updateData = { status: 'approved' };
            if (action === 'reject') updateData = { status: 'rejected' };
            if (action === 'feature') updateData = { is_featured: true, status: 'approved' };
            if (action === 'remove_feature') updateData = { is_featured: false };

            if (action === 'to_usp101') {
                const drop = drops.find(d => d.id === id);
                if (!drop) throw new Error('Log não encontrado.');
                
                const titulo = window.prompt('Dê um título para este Conselho de Veterano (USP 101):');
                if (!titulo) return; // Cancelado
                
                const { error } = await supabase.from('dicas_veteranos').insert({
                    titulo,
                    conteudo: drop.content,
                    categoria: 'comunicacao',
                    instituto: 'geral',
                    autor_nome: drop.profiles?.name || drop.profiles?.handle || 'Veterano',
                    autor_id: drop.author_id,
                    status: 'approved'
                });
                
                if (error) throw error;
                toast.success('Log promovido para USP 101 com sucesso!');
                return;
            }

            if (action === 'delete') {
                const { error } = await supabase.from('micro_articles').delete().eq('id', id);
                if (error) throw error;
                toast.success('Log removido permanentemente.');
            } else {
                const { error } = await supabase.from('micro_articles').update(updateData).eq('id', id);
                if (error) throw error;
                toast.success('Status atualizado com sucesso!');
            }
            fetchDrops();
        } catch (err) {
            toast.error('Ocorreu um erro ao processar a ação.');
        }
    };

    const filteredDrops = drops.filter(d => 
        d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.profiles?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.profiles?.handle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 min-h-screen bg-background-dark/50 rounded-[3rem] border border-white/5 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4 group">
                        <div className="p-3 bg-brand-red/10 rounded-2xl border border-brand-red/20 group-hover:rotate-6 transition-transform">
                            <MessageSquare className="text-brand-red" size={32} />
                        </div>
                        <span className="underline decoration-brand-red/50 decoration-8 underline-offset-4">GERENCIAMENTO DE LOGS</span>
                    </h1>
                    <p className="text-gray-500 mt-4 font-medium max-w-xl border-l-4 border-brand-red/30 pl-4">Aprove, destaque ou modere as comunicações científicas em tempo real com o motor de transparência IFUSP.</p>
                </div>

                <div className="flex flex-wrap gap-2 p-1.5 bg-[#1E1E1E] rounded-2xl border border-white/5 shadow-2xl self-start max-w-full">
                    {(['pending', 'approved', 'featured', 'rejected'] as const).map((f) => ( f === filter ? (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-brand-red text-white shadow-lg shadow-brand-red/20 whitespace-nowrap"
                        >
                            {f === 'pending' ? 'Pendentes' : f === 'approved' ? 'Aprovados' : f === 'featured' ? 'Destacados' : 'Reprovados'}
                        </button>
                    ) : (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-gray-500 hover:text-white hover:bg-white/5 whitespace-nowrap"
                        >
                            {f === 'pending' ? 'Pendentes' : f === 'approved' ? 'Aprovados' : f === 'featured' ? 'Destacados' : 'Reprovados'}
                        </button>
                    )))}
                </div>
            </div>

            <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 focus-within:border-brand-red/50 transition-all shadow-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-brand-red transition-colors z-10" />
                <input 
                    type="text" 
                    placeholder="Filtrar logs por conteúdo, nome ou @id..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 bg-[#1E1E1E] text-white outline-none font-mono text-xs placeholder:text-white/20 tracking-wider transition-all"
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 animate-spin text-brand-red" />
                        <div className="absolute inset-0 bg-brand-red/20 blur-2xl rounded-full"></div>
                    </div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.5em] mt-8 text-white animate-pulse">Sincronizando Matriz Datalake...</p>
                </div>
            ) : filteredDrops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#1E1E1E]/50 rounded-[4rem] border-2 border-dashed border-white/5 transition-all">
                    <div className="p-8 bg-background-dark/40 rounded-full mb-8 border border-white/5 shadow-inner">
                        <Inbox className="w-16 h-16 text-gray-700" />
                    </div>
                    <p className="text-white font-black uppercase tracking-[0.3em] text-[10px] italic">Silêncio no Laboratório.</p>
                    <p className="text-gray-500 text-xs mt-2 font-medium">Nenhum log encontrado nesta frequência de filtragem.</p>
                </div>
            ) : (
                <div className="space-y-12 pb-20">
                    {filter === 'pending' ? (
                        <>
                            {/* Group < 7 dias */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 px-2">
                                    <div className="h-px bg-gradient-to-r from-transparent via-brand-red/30 to-transparent flex-1"></div>
                                    <h3 className="text-brand-red font-black uppercase italic tracking-widest text-xs flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Recentes (&lt; 7d)
                                    </h3>
                                    <div className="h-px bg-gradient-to-r from-transparent via-brand-red/30 to-transparent flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {filteredDrops.filter(d => (Date.now() - new Date(d.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000).map((drop) => (
                                        <DropAdminCard key={drop.id} drop={drop} handleAction={handleAction} />
                                    ))}
                                    {filteredDrops.filter(d => (Date.now() - new Date(d.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000).length === 0 && (
                                        <div className="col-span-full py-10 text-center opacity-30 border border-dashed border-white/5 rounded-[2rem]">
                                            <p className="font-mono text-[10px] uppercase tracking-widest">Nenhum log pendente recente.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Group > 7 dias */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 px-2">
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent flex-1"></div>
                                    <h3 className="text-gray-500 font-black uppercase italic tracking-widest text-xs flex items-center gap-2">
                                        <Inbox className="w-4 h-4" /> Antigos (&gt; 7d)
                                    </h3>
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {filteredDrops.filter(d => (Date.now() - new Date(d.created_at).getTime()) >= 7 * 24 * 60 * 60 * 1000).map((drop) => (
                                        <DropAdminCard key={drop.id} drop={drop} handleAction={handleAction} />
                                    ))}
                                    {filteredDrops.filter(d => (Date.now() - new Date(d.created_at).getTime()) >= 7 * 24 * 60 * 60 * 1000).length === 0 && (
                                        <div className="col-span-full py-10 text-center opacity-30 border border-dashed border-white/5 rounded-[2rem]">
                                            <p className="font-mono text-[10px] uppercase tracking-widest">Nenhum log pendente antigo.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filteredDrops.map((drop) => (
                                <DropAdminCard key={drop.id} drop={drop} handleAction={handleAction} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function DropAdminCard({ drop, handleAction }: { drop: Drop, handleAction: (id: string, action: 'approve' | 'feature' | 'remove_feature' | 'delete' | 'reject' | 'to_usp101') => void }) {
    return (
        <div key={drop.id} className="group relative bg-[#1E1E1E] p-8 rounded-[3rem] border border-white/5 hover:border-brand-red/40 transition-all flex flex-col gap-6 overflow-hidden shadow-2xl hover:-translate-y-2 duration-500">
            {/* Ambient background effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-brand-red/10 transition-colors"></div>
            
            <div className="flex items-center gap-5 relative z-10">
                <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-background-dark/20 overflow-hidden ring-4 ring-white/5 relative flex items-center justify-center">
                        <img 
                            src={drop.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${drop.id}`} 
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('dicebear')) {
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        const span = document.createElement('span');
                                        span.className = 'text-xs font-black text-brand-red opacity-50';
                                        span.innerText = (drop.profiles?.name || 'M').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                                        parent.appendChild(span);
                                    }
                                } else {
                                    target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${drop.id}`;
                                }
                            }}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                            alt="" 
                        />
                    </div>
                    {drop.is_featured && (
                        <div className="absolute -top-1 -right-1 bg-brand-yellow text-white p-1.5 rounded-lg border-2 border-[#1E1E1E] shadow-lg animate-bounce">
                            <Star size={12} fill="currentColor" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-black text-lg text-white leading-tight tracking-tight uppercase italic">{drop.profiles?.name || 'Autor Desconhecido'}</h4>
                    <div className="flex flex-col">
                        <p className="text-[10px] uppercase font-mono tracking-[0.25em] text-brand-red font-black opacity-70 italic">@{drop.profiles?.handle || 'anônimo'}</p>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black italic mt-1">
                            {drop.profiles?.user_category === 'pesquisador' 
                                ? (drop.profiles?.research_line || 'Pesquisador IFUSP')
                                : drop.profiles?.user_category === 'aluno_usp'
                                    ? (drop.profiles?.course || 'Graduação IFUSP')
                                    : (drop.profiles?.interest_area || 'Curioso / Entusiasta')}
                        </span>
                    </div>
                </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/50 bg-background-dark/60 px-4 py-2 rounded-2xl border border-white/5 font-mono shadow-inner">
                            <Atom className="w-3.5 h-3.5 text-brand-red animate-spin-slow" />
                            {drop.likes_count || 0}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/50 bg-background-dark/60 px-4 py-2 rounded-2xl border border-white/5 font-mono shadow-inner">
                            <Clock className="w-3.5 h-3.5 text-brand-red" />
                            {new Date(drop.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <AdminTimer createdAt={drop.created_at} />
                    </div>
            </div>

            <div className="relative">
                {drop.parent && (
                    <div className="mb-4 p-3 bg-background-dark/40 rounded-2xl border-l-4 border-brand-red/50 text-[10px] text-gray-400 italic">
                        <span className="font-black text-brand-red/70 not-italic mr-1">RESPONDENDO A @{drop.parent.author?.handle}:</span>
                        "{drop.parent.content.slice(0, 100)}{drop.parent.content.length > 100 ? '...' : ''}"
                    </div>
                )}
                <p className="text-base text-gray-300 leading-relaxed min-h-[100px] font-medium relative z-10 break-words italic pl-6 border-l-2 border-white/10 group-hover:border-brand-red/50 transition-colors">
                    "{drop.content}"
                </p>
            </div>

            <div className="flex items-center gap-4 pt-8 mt-auto relative z-10">
                {(drop.status === 'pending' || drop.status === 'rejected') && (
                    <button 
                        onClick={() => handleAction(drop.id, 'approve')}
                        className="flex-1 bg-white hover:bg-brand-red text-black hover:text-white px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-brand-red/30"
                    >
                        <Check size={18} strokeWidth={3} /> APROVAR
                    </button>
                )}
                {(drop.status === 'pending' || drop.status === 'approved') && (
                    <button 
                        onClick={() => handleAction(drop.id, 'reject')}
                        className="flex-1 bg-white/5 hover:bg-brand-red text-white px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 hover:border-brand-red/50 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <X size={18} /> REPROVAR
                    </button>
                )}
                {!drop.is_featured ? (
                    <button 
                        onClick={() => handleAction(drop.id, 'feature')}
                        className="flex-1 bg-white/5 hover:bg-brand-yellow/20 text-brand-yellow/60 hover:text-brand-yellow px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 hover:border-brand-yellow/50 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Star size={18} /> DESTACAR
                    </button>
                ) : (
                    <button 
                        onClick={() => handleAction(drop.id, 'remove_feature')}
                        className="flex-1 bg-white/5 hover:bg-brand-blue/20 text-brand-blue/60 hover:text-brand-blue px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 hover:border-brand-blue/50 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <ShieldCheck size={18} /> DESAFIXAR
                    </button>
                )}
                <button 
                    onClick={() => handleAction(drop.id, 'to_usp101')}
                    className="p-4 aspect-square bg-background-dark hover:bg-brand-blue text-brand-blue hover:text-white rounded-[1.5rem] border border-white/5 transition-all flex items-center justify-center shadow-2xl shadow-black hover:shadow-brand-blue/40"
                    title="Promover para USP 101"
                >
                    <Compass size={22} />
                </button>
                <button 
                    onClick={() => handleAction(drop.id, 'delete')}
                    className="p-4 aspect-square bg-background-dark hover:bg-brand-red text-gray-600 hover:text-white rounded-[1.5rem] border border-white/5 transition-all flex items-center justify-center shadow-2xl shadow-black hover:shadow-brand-red/40"
                >
                    <Trash2 size={22} />
                </button>
            </div>

            {/* Decorative tag */}
            <div className="absolute top-2 right-8 opacity-5 flex gap-2">
                <span className="text-4xl font-black italic tracking-tighter">LOG</span>
            </div>
        </div>
    );
}

function AdminTimer({ createdAt }: { createdAt: string }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const created = new Date(createdAt).getTime();
            const expiration = created + 7 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            const diff = expiration - now;

            if (diff <= 0) {
                setTimeLeft('EXPIRADO');
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (d > 0) {
                setTimeLeft(`${d}d ${h}h`);
            } else {
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${h}h ${m}m`);
            }
        };

        const interval = setInterval(updateTimer, 60000); // 1 minute is enough for admin
        updateTimer();
        return () => clearInterval(interval);
    }, [createdAt]);

    if (timeLeft === 'EXPIRADO') return null;

    return (
        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mr-2">
            Restam {timeLeft}
        </span>
    );
}
