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


import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { PostDTO } from '@/dtos/media';
import { parseMediaUrl, getYoutubeThumbnail, getOptimizedUrl } from '@/lib/media-utils';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

import { Grid, Star, Image as ImageIcon, FileText, Heart, MessageSquare, Info, Camera, ShieldCheck, Play, Linkedin, Github, Youtube, Instagram, Globe, Share2, GraduationCap, Eye, Edit, BarChart2, Filter, Trash2 } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import { RadiationBadge } from '@/components/gamification/RadiationBadge';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { RadiationTab } from '@/components/gamification/RadiationTab';
import { ThreadNode, Drop } from '@/components/comunidade/LogsView';
import { Profile } from '@/types';
import { Avatar } from "@/components/ui/Avatar";
import { User } from '@supabase/supabase-js';
import { EditSubmissionModal } from '@/components/profile/EditSubmissionModal';
import { NetworkModal } from '@/components/profile/NetworkModal';
import { requestPostModeration } from '@/app/actions/submissions';
import toast from 'react-hot-toast';

import { MetricsModal } from './components/MetricsModal';

interface LabClientViewProps {
    currentUser: User;
    initialCurrentUserProfile: Profile | null;
    initialViewedProfile: Profile | null;
    submissions: { post: PostDTO }[];
    savedPosts: PostDTO[];
    userLogs: any[];
    followStats: { followers: number; following: number };
    initialAdoptionStatus: 'pending' | 'approved' | null;
    academicData: any;
    topInterest: string | null;
    initialTab: string;
}

export function LabClientView({
    currentUser,
    initialCurrentUserProfile,
    initialViewedProfile,
    submissions,
    savedPosts,
    userLogs,
    followStats,
    initialAdoptionStatus,
    academicData,
    topInterest,
    initialTab
}: LabClientViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Network Modal State
    const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
    const [networkModalType, setNetworkModalType] = useState<'followers' | 'following'>('followers');

    // Local state for fast updates
    const [viewedProfile, setViewedProfile] = useState<Profile | null>(initialViewedProfile);
    const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(initialCurrentUserProfile);
    const [adoptionStatus, setAdoptionStatus] = useState<'pending' | 'approved' | null>(initialAdoptionStatus);
    
    // Auto-open Edit Profile Modal if critical info is missing
    const isViewingOwn = !viewedProfile || currentUser.id === viewedProfile?.id;
    
    const isUspMember = viewedProfile?.email?.endsWith('@usp.br') || viewedProfile?.email?.endsWith('@if.usp.br');
    const isResearcher = viewedProfile?.user_category === 'pesquisador' || viewedProfile?.user_category === 'docente_pesquisador';
    
    let isProfileIncomplete = false;
    if (viewedProfile && !isResearcher) {
        if (isUspMember) {
            isProfileIncomplete = !viewedProfile.institute || !viewedProfile.course;
        } else {
            isProfileIncomplete = !viewedProfile.education_level || !viewedProfile.external_institution;
        }
    }

    const [isEditModalOpen, setIsEditModalOpen] = useState(
        isViewingOwn && isProfileIncomplete
    );
    
    const [activeTab, setActiveTab] = useState(initialTab);

    // Moderation state
    const [selectedPostToEdit, setSelectedPostToEdit] = useState<PostDTO | null>(null);
    const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
    
    // Metrics state
    const [selectedPostForMetrics, setSelectedPostForMetrics] = useState<PostDTO | null>(null);
    const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

    useEffect(() => {
        setViewedProfile(initialViewedProfile);
        setCurrentUserProfile(initialCurrentUserProfile);
        setAdoptionStatus(initialAdoptionStatus);
    }, [initialViewedProfile, initialCurrentUserProfile, initialAdoptionStatus]);

    // Persistência Offline: Salva dados do Lab Pessoal no localStorage para consulta sem internet
    useEffect(() => {
        const prof = initialCurrentUserProfile || initialViewedProfile;
        if (prof && typeof window !== 'undefined') {
            try {
                localStorage.setItem('hub_offline_profile', JSON.stringify({
                    id: prof.id,
                    name: prof.full_name || prof.username || currentUser?.email,
                    full_name: prof.full_name,
                    avatar_url: prof.avatar_url,
                    user_category: prof.user_category,
                    role: prof.role,
                    bio: prof.bio,
                    nusp: (prof as any).nusp || (prof as any).usp_number || '',
                    institute: prof.institute,
                    course: prof.course,
                    research_line: (prof as any).research_line || '',
                    interests: prof.interests || []
                }));

                if (submissions && submissions.length > 0) {
                    localStorage.setItem('hub_offline_lab_data', JSON.stringify({
                        submissionsCount: submissions.length,
                        savedPostsCount: savedPosts?.length || 0,
                        academicData: academicData || null,
                        lastSync: Date.now()
                    }));
                }
            } catch (_) {}
        }
    }, [initialCurrentUserProfile, initialViewedProfile, submissions, savedPosts, academicData, currentUser]);

    // Fallback Offline: Se perfil não carregou por falta de rede, carrega do armazenamento local
    useEffect(() => {
        if (!viewedProfile && typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem('hub_offline_profile');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    setViewedProfile(parsed);
                }
            } catch (_) {}
        }
    }, [viewedProfile]);

    const handleDeleteRequest = async (postId: string) => {
        if (!confirm('Deseja realmente solicitar a anonimização deste post? Ele será desvinculado do seu perfil mas continuará no HUB.')) return;
        
        const res = await requestPostModeration(postId, 'delete');
        if (res.success) {
            toast.success('Solicitação de anonimização enviada!');
        } else {
            toast.error(res.error || 'Erro ao solicitar');
        }
    };

    const handleShare = async () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${origin}/lab?user=${viewedProfile?.id}`;
        const title = viewedProfile?.full_name ? `Laboratório de ${viewedProfile.full_name} | IFUSP Ciência` : 'Meu Laboratório | IFUSP Ciência';
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: `Confira o laboratório de ${viewedProfile?.full_name || 'pesquisa'} no IFUSP Ciência!`,
                    url
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const params = new URLSearchParams(searchParams);
        params.set('tab', tabId);
        // Optional: you can update the URL without full refresh if desired, 
        // using shallow routing via history API or next/navigation
        window.history.replaceState(null, '', `?${params.toString()}`);
    };

    return (
        <MainLayoutWrapper 
            userId={currentUser.id}
        >
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div data-tour="lab-profile-header" className="bg-white dark:bg-background-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12 max-w-3xl mx-auto">
                        <div className="relative shrink-0">
                            <Avatar
                                src={viewedProfile?.avatar_url}
                                name={(viewedProfile?.use_nickname && viewedProfile?.username) ? viewedProfile.username : (viewedProfile?.full_name || 'Usuário')}
                                size="custom"
                                customSize="w-32 h-32 sm:w-40 sm:h-40"
                                xp={viewedProfile?.xp}
                                level={viewedProfile?.level}
                                isLabDiv={viewedProfile?.is_labdiv}
                            />
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-4 sm:pt-2">
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
                                {(viewedProfile?.use_nickname && viewedProfile?.username) ? viewedProfile.username : (viewedProfile?.full_name || 'Usuário')}
                                <span className="text-xs font-black uppercase text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">
                                    {viewedProfile?.id === currentUser.id ? 'Laboratório Pessoal' : 'Laboratório Externo'}
                                </span>
                                {viewedProfile && (
                                    <span data-tour="lab-radiation-badge">
                                        <RadiationBadge xp={viewedProfile.xp || 0} level={viewedProfile.level || 1} size="md" showTierName />
                                    </span>
                                )}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-1">
                                <div className="text-center sm:text-left">
                                    <span className="block text-lg font-bold text-gray-900 dark:text-white">
                                        {submissions.filter(s => s.post.status !== 'deleted' && s.post.status !== 'deletado' && (isViewingOwn || s.post.status === 'aprovado')).length}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">publicações</span>
                                </div>
                                <div className="text-center sm:text-left hidden sm:block">
                                    <span className="block text-lg font-bold text-gray-900 dark:text-white">{viewedProfile?.level || 1}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">nível</span>
                                </div>
                                <div 
                                    className="text-center sm:text-left cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl px-2 -mx-2"
                                    onClick={() => { setNetworkModalType('following'); setIsNetworkModalOpen(true); }}
                                    title="Ver pessoas que você segue"
                                >
                                    <span className="block text-lg font-bold text-gray-900 dark:text-white">{followStats.following}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">seguindo</span>
                                </div>
                                <div 
                                    className="text-center sm:text-left cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl px-2 -mx-2"
                                    onClick={() => { setNetworkModalType('followers'); setIsNetworkModalOpen(true); }}
                                    title="Ver seus seguidores"
                                >
                                    <span className="block text-lg font-bold text-gray-900 dark:text-white">{followStats.followers}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">seguidores</span>
                                </div>

                                {isViewingOwn ? (
                                    <div data-tour="lab-actions" className="flex flex-wrap items-center gap-2 sm:ml-4">
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                            Editar Perfil
                                        </button>

                                        <button 
                                            onClick={handleShare}
                                            className="px-4 py-2 bg-brand-blue text-white hover:scale-105 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-blue/20"
                                        >
                                            <Share2 className="w-3.5 h-3.5" />
                                            Compartilhar Lab
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {currentUserProfile?.available_to_mentor && viewedProfile?.seeking_mentor && (
                                            <button
                                                onClick={async () => {
                                                    if (adoptionStatus) return;
                                                    const { requestAdoption } = await import('@/app/actions/profiles');
                                                    const { toast } = await import('react-hot-toast');
                                                    const res = await requestAdoption(viewedProfile!.id);
                                                    if (res.success) {
                                                        toast.success('Solicitação de adoção enviada ao ADM!');
                                                        setAdoptionStatus('pending');
                                                    } else {
                                                        toast.error(res.error || 'Erro ao solicitar adoção');
                                                    }
                                                }}
                                                disabled={!!adoptionStatus}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${adoptionStatus === 'approved'
                                                    ? 'bg-green-500 text-white cursor-default'
                                                    : adoptionStatus === 'pending'
                                                        ? 'bg-gray-400 text-white cursor-default'
                                                        : 'bg-brand-yellow text-black hover:bg-brand-yellow/90 shadow-brand-yellow/20'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    {adoptionStatus === 'approved' ? 'check_circle' : adoptionStatus === 'pending' ? 'schedule' : 'favorite'}
                                                </span>
                                                {adoptionStatus === 'approved' ? 'Adotado' : adoptionStatus === 'pending' ? 'Pedido Pendente' : 'Adotar Bixo'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div data-tour="lab-academic-info" className="pt-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                {isViewingOwn && <p>{currentUser.email}</p>}
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {topInterest && (
                                        <span className="px-2 py-0.5 bg-brand-blue/20 text-brand-blue text-[10px] font-black rounded uppercase border border-brand-blue/30 flex items-center gap-1 shadow-sm">
                                            <Star className="w-3 h-3 fill-current" />
                                            Foco: {topInterest}
                                        </span>
                                    )}
                                    {viewedProfile?.institute && (
                                        <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold rounded uppercase">
                                            {viewedProfile.institute}
                                        </span>
                                    )}
                                    {viewedProfile?.course && (
                                        <span className="px-2 py-0.5 bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold rounded uppercase">
                                            {viewedProfile.course}
                                        </span>
                                    )}
                                    {viewedProfile?.is_labdiv && (
                                        <span className="px-2 py-0.5 bg-brand-yellow text-black text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-sm shadow-brand-yellow/20">
                                            <ShieldCheck className="w-3 h-3" />
                                            Membro Lab-Div
                                        </span>
                                    )}
                                    {viewedProfile?.role && (
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${viewedProfile.role === 'admin' ? 'bg-brand-red text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                            {viewedProfile.role === 'admin' ? 'Admin' : viewedProfile.role}
                                        </span>
                                    )}
                                    {viewedProfile?.user_category && (
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                                            viewedProfile.user_category === 'pesquisador' ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30' : 
                                            viewedProfile.user_category === 'aluno_usp' ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' : 
                                            'bg-brand-red/20 text-brand-red border border-brand-red/30'
                                        }`}>
                                            {viewedProfile.user_category === 'pesquisador' ? 'Pesquisador' : 
                                             viewedProfile.user_category === 'aluno_usp' ? 'Aluno USP' : 
                                             'Curioso'}
                                        </span>
                                    )}
                                    {viewedProfile?.is_usp_member && viewedProfile?.entrance_year && (
                                        <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold rounded uppercase">
                                            Ingresso: {viewedProfile.entrance_year}
                                        </span>
                                    )}
                                    {!viewedProfile?.is_usp_member && viewedProfile?.education_level && (
                                        <span className="px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-bold rounded uppercase">
                                            {viewedProfile.education_level} {viewedProfile.school_year ? `- ${viewedProfile.school_year}` : ''}
                                        </span>
                                    )}
                                    {viewedProfile?.available_to_mentor && (
                                        <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold rounded uppercase border border-brand-blue/20 flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3 fill-current" />
                                            Mentor/Veterano
                                        </span>
                                    )}
                                    {viewedProfile?.seeking_mentor && (
                                        <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold rounded uppercase border border-brand-blue/20 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">person_search</span>
                                            Bixo / Buscando Adotante
                                        </span>
                                    )}
                                </div>
                                {isViewingOwn && viewedProfile?.review_status === 'pending' && (viewedProfile?.bio_draft || !viewedProfile?.is_public) && (
                                    <div className="mt-4 p-3 bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl flex items-center gap-3 animate-pulse">
                                        <Info className="w-4 h-4 text-brand-yellow" />
                                        <p className="text-[10px] font-bold text-brand-yellow uppercase tracking-tight">
                                            Seu perfil está em análise e será publicado em breve.
                                        </p>
                                    </div>
                                )}

                                <p className="mt-4 text-gray-500 italic text-[13px] leading-relaxed">
                                    {viewedProfile?.bio_draft || viewedProfile?.bio || (isViewingOwn ? "Seu laboratório pessoal está quase pronto!" : "Membro da comunidade Lab-Div.")}
                                </p>

                                {/* Redes Sociais e Contato */}
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {viewedProfile?.lattes_url && (
                                        <a href={viewedProfile.lattes_url} target="_blank" rel="noopener noreferrer" title="Currículo Lattes" className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-brand-blue dark:text-brand-blue border border-blue-200 dark:border-blue-800/50 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1.5 shadow-sm">
                                            <FileText className="w-3.5 h-3.5" />
                                            Lattes CNPq
                                        </a>
                                    )}
                                    {viewedProfile?.linkedin_url && (
                                        <a href={viewedProfile.linkedin_url} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-[#0A66C2]/10 text-gray-500 hover:text-[#0A66C2] rounded-xl transition-colors">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    {viewedProfile?.github_url && (
                                        <a href={viewedProfile.github_url} target="_blank" rel="noopener noreferrer" title="GitHub" className="p-2 bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-110 transition-transform rounded-xl">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                    {viewedProfile?.youtube_url && (
                                        <a href={viewedProfile.youtube_url} target="_blank" rel="noopener noreferrer" title="YouTube" className="p-2 bg-[#FF0000] text-white hover:scale-110 transition-transform rounded-xl">
                                            <Youtube className="w-4 h-4" />
                                        </a>
                                    )}
                                    {viewedProfile?.instagram_url && (
                                        <a href={viewedProfile.instagram_url} target="_blank" rel="noopener noreferrer" title="Instagram" className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-[#E1306C]/10 text-gray-500 hover:text-[#E1306C] rounded-xl transition-colors">
                                            <Instagram className="w-4 h-4" />
                                        </a>
                                    )}
                                    {viewedProfile?.tiktok_url && (
                                        <a href={viewedProfile.tiktok_url} target="_blank" rel="noopener noreferrer" title="TikTok" className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white rounded-xl transition-colors">
                                            <TikTokIcon className="w-4 h-4" />
                                        </a>
                                    )}
                                    {viewedProfile?.portfolio_url && (
                                        <a href={viewedProfile.portfolio_url} target="_blank" rel="noopener noreferrer" title="Site Pessoal / Portfólio" className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-brand-blue/10 text-gray-500 hover:text-brand-blue rounded-xl transition-colors">
                                            <Globe className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                {viewedProfile?.artistic_interests && viewedProfile.artistic_interests.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                                        <span className="text-[9px] font-black uppercase text-gray-400 block w-full mb-1">Lado Artístico / Hobbies</span>
                                        {viewedProfile.artistic_interests.map((art: string, index: number) => {
                                            const colors = [
                                                { text: 'text-brand-blue', bg: 'bg-brand-blue/5', border: 'border-brand-blue/10' },
                                                { text: 'text-brand-yellow', bg: 'bg-brand-yellow/5', border: 'border-brand-yellow/10' },
                                                { text: 'text-brand-red', bg: 'bg-brand-red/5', border: 'border-brand-red/10' }
                                            ];
                                            const color = colors[index % colors.length];
                                            return (
                                                <span key={art} className={`px-2 py-0.5 ${color.bg} ${color.text} text-[9px] font-black rounded-full border ${color.border} uppercase tracking-tighter transition-all hover:scale-105`}>
                                                    {art}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Context (Only for Alunos) */}
                {viewedProfile?.user_category === 'aluno_usp' && academicData && (
                    <div className="bg-white dark:bg-background-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 animate-in fade-in slide-in-from-top-2 duration-700">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-4">
                                <h4 className="text-[10px] font-black uppercase text-brand-blue tracking-[0.2em] flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    Ecossistema Acadêmico
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                                        <div className="text-[8px] font-black text-brand-blue uppercase mb-2">Em Curso</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {academicData.inProgress?.length > 0 ? (
                                                academicData.inProgress.map((p: any) => (
                                                    <span key={p.id} className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[9px] font-bold rounded uppercase">
                                                        {p.learning_trails?.course_code}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[9px] text-gray-500 font-bold uppercase italic">Nenhuma disciplina</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-brand-yellow/5 rounded-2xl border border-brand-yellow/10">
                                        <div className="text-[8px] font-black text-brand-yellow uppercase mb-2">Concluídas</div>
                                        <div className="text-[9px] text-zinc-500 dark:text-white/60 font-black uppercase">
                                            {academicData.completed?.length || 0} Disciplinas Concluídas
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {viewedProfile?.areas_of_interest && viewedProfile.areas_of_interest.length > 0 && (
                                <div className="w-full md:w-64 space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                                        <Star className="w-4 h-4" />
                                        Foco de Pesquisa
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {viewedProfile.areas_of_interest.map((area: string) => (
                                            <span key={area} className="px-2 py-1 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-white/60 text-[9px] font-black border border-gray-200 dark:border-white/10 rounded-lg uppercase transition-all hover:border-brand-yellow/50 hover:text-brand-yellow">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div data-tour="lab-subnav" className="flex justify-center border-t border-gray-200 dark:border-gray-800 mb-8 max-w-3xl mx-auto flex-wrap">
                    {[
                        { id: 'fluxo', label: 'FLUXO', icon: <Grid className={`w-4 h-4 ${activeTab === 'fluxo' ? 'text-brand-blue' : ''}`} /> },
                        { id: 'artes', label: 'ARTE', icon: <ImageIcon className={`w-4 h-4 ${activeTab === 'artes' ? 'text-brand-yellow' : ''}`} /> },
                        { id: 'logs', label: 'LOGS', icon: <FileText className={`w-4 h-4 ${activeTab === 'logs' ? 'text-brand-red' : ''}`} /> },
                        { id: 'estrelados', label: 'CONSTELAÇÃO', icon: <Star className={`w-4 h-4 ${activeTab === 'estrelados' ? 'text-brand-yellow fill-brand-yellow' : ''}`} /> },
                        { id: 'radiacao', label: 'RADIAÇÃO', icon: <span className="text-sm">☢️</span> },
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        let colorClass = 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300';
                        if (isActive) {
                            switch (tab.id) {
                                case 'fluxo': colorClass = 'text-brand-blue border-t-2 border-brand-blue -mt-[1px]'; break;
                                case 'artes': colorClass = 'text-brand-yellow border-t-2 border-brand-yellow -mt-[1px]'; break;
                                case 'logs': colorClass = 'text-brand-red border-t-2 border-brand-red -mt-[1px]'; break;
                                case 'estrelados': colorClass = 'text-brand-blue border-t-2 border-brand-blue -mt-[1px]'; break;
                                case 'radiacao': colorClass = 'border-t-2 border-brand-yellow -mt-[1px] text-gray-900 dark:text-white'; break;
                            }
                        }

                        return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-4 text-[9px] sm:text-xs font-bold tracking-widest transition-all ${colorClass}`}
                        >
                            {tab.icon}
                            {tab.id === 'radiacao' && isActive ? (
                                <span className="bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-red bg-clip-text text-transparent">{tab.label}</span>
                            ) : (
                                <span>{tab.label}</span>
                            )}
                        </button>
                    )})}
                </div>

                <div className="animate-in fade-in duration-500 max-w-4xl mx-auto border-t-0">
                    {(activeTab === 'fluxo' || activeTab === 'artes') && (() => {
                        const filteredSubmissions = submissions.filter(sub => {
                            if (sub.post.status === 'deleted' || sub.post.status === 'deletado') return false;
                            if (!isViewingOwn && sub.post.status !== 'aprovado') return false;
                            return activeTab === 'artes' ? sub.post.category === 'Arte' : sub.post.category !== 'Arte';
                        });
                        return (
                        <div>
                            {filteredSubmissions.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {filteredSubmissions.map(sub => {
                                        const urls = parseMediaUrl(sub.post.mediaUrl);
                                        let firstMedia = urls[0] || '';
                                        if (sub.post.mediaType === 'pdf' && firstMedia.toLowerCase().endsWith('.pdf')) {
                                            firstMedia = firstMedia.replace(/\.pdf$/i, '.jpg');
                                        }
                                        const isVideo = sub.post.mediaType === 'video';
                                        const isImage = !isVideo && !!firstMedia;

                                        let thumbUrl = '';
                                        if (isImage && firstMedia) {
                                            thumbUrl = getOptimizedUrl(firstMedia, 400, 70, sub.post.category, 'image');
                                        } else if (isVideo && firstMedia) {
                                            thumbUrl = getYoutubeThumbnail(firstMedia);
                                        }

                                        return (
                                            <a key={sub.post.id} href={`/arquivo/${sub.post.id}`} className="group relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-2xl cursor-pointer border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
                                                {thumbUrl ? (
                                                    <>
                                                        <Image
                                                            src={thumbUrl}
                                                            alt={sub.post.title}
                                                            fill
                                                            sizes="(max-width: 768px) 50vw, 33vw"
                                                            className="object-contain bg-background-dark/5 dark:bg-white/5 group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent) {
                                                                    const fallback = parent.querySelector('.fallback-container') as HTMLElement;
                                                                    if (fallback) fallback.style.display = 'flex';
                                                                }
                                                            }}
                                                        />
                                                        <div className="fallback-container hidden w-full h-full flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                                            <FileText className="w-12 h-12 text-gray-400/50 dark:text-white/10" />
                                                        </div>
                                                        {isVideo && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-background-dark/20 group-hover:bg-background-dark/40 transition-colors">
                                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                                                    <Play className="w-6 h-6 text-white fill-current" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : sub.post.mediaType === 'pdf' ? (
                                                    <div className="w-full h-full bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 dark:from-brand-yellow/10 dark:to-brand-yellow/5 flex flex-col items-center justify-center p-4 text-center">
                                                        <FileText className="w-12 h-12 text-brand-yellow/50" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 dark:from-brand-blue/10 dark:to-brand-blue/5 flex flex-col items-center justify-center p-4 text-center">
                                                        <FileText className="w-12 h-12 text-brand-blue/50" />
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-background-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white z-10">
                                                    <div className="flex flex-col items-center gap-1 font-bold">
                                                        <Eye className="w-5 h-5 fill-current opacity-70" />
                                                        <span className="text-[10px]">{sub.post.views || 0}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 font-bold">
                                                        <Heart className="w-5 h-5 fill-current text-brand-red" />
                                                        <span className="text-[10px]">{sub.post.likeCount}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 font-bold">
                                                        <Star className="w-5 h-5 fill-current text-brand-yellow" />
                                                        <span className="text-[10px]">{sub.post.saveCount}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 font-bold">
                                                        <MessageSquare className="w-5 h-5 fill-current opacity-70" />
                                                        <span className="text-[10px]">{sub.post.commentCount}</span>
                                                    </div>
                                                </div>

                                                {sub.post.status !== 'aprovado' && (
                                                    <div className="absolute top-2 right-2 px-2 py-1 bg-background-dark/80 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-wider z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        {sub.post.status === 'pendente' ? 'Análise' : sub.post.status}
                                                    </div>
                                                )}

                                                {/* Moderation Actions (Owner Only) */}
                                                {isViewingOwn && (
                                                    <div className="absolute top-2 left-2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                router.push(`/enviar?editId=${sub.post.id}`);
                                                            }}
                                                            className="p-2 bg-white/20 backdrop-blur-md hover:bg-brand-blue/80 text-white rounded-lg transition-all border border-white/20 shadow-lg group/btn"
                                                            title="Solicitar Edição"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-background-dark/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Editar</span>
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setSelectedPostForMetrics(sub.post);
                                                                setIsMetricsModalOpen(true);
                                                            }}
                                                            className="p-2 bg-white/20 backdrop-blur-md hover:bg-brand-yellow text-white rounded-lg transition-all border border-white/20 shadow-lg group/btn"
                                                            title="Ver Estatísticas Pedagógicas"
                                                        >
                                                            <BarChart2 className="w-4 h-4" />
                                                            <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-background-dark/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Estatísticas</span>
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDeleteRequest(sub.post.id);
                                                            }}
                                                            className="p-2 bg-white/20 backdrop-blur-md hover:bg-brand-red text-white rounded-lg transition-all border border-white/20 shadow-lg group/btn"
                                                            title="Solicitar Anonimização"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-background-dark/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Anonimizar</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </a>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-24 h-24 mb-6 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                        <Camera className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Compartilhe sua ciência</h2>
                                    <p className="text-gray-500 max-w-xs mx-auto mb-6">Quando você compartilhar artigos, fotos ou vídeos, eles aparecerão no seu perfil.</p>
                                    <button onClick={() => router.push('/enviar')} className="font-bold text-brand-blue hover:text-brand-darkBlue transition-colors">
                                        Fazer primeira submissão
                                    </button>
                                </div>
                            )}
                        </div>
                        );
                    })()}

                    {activeTab === 'radiacao' && viewedProfile && (
                        <RadiationTab profile={{ id: viewedProfile.id, xp: viewedProfile.xp || 0, level: viewedProfile.level || 1 }} />
                    )}

                    {activeTab === 'estrelados' && (
                        <div>
                            {savedPosts.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {savedPosts.map(post => {
                                        const urls = parseMediaUrl(post.mediaUrl);
                                        const firstMedia = urls[0] || '';
                                        const isImage = post.mediaType === 'image';
                                        const isVideo = post.mediaType === 'video';

                                        let thumbUrl = '';
                                        if (isImage) {
                                            thumbUrl = getOptimizedUrl(firstMedia, 400, 70, post.category, 'image');
                                        } else if (isVideo) {
                                            thumbUrl = getYoutubeThumbnail(firstMedia);
                                        }

                                        return (
                                            <a key={post.id} href={`/arquivo/${post.id}`} className="group relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-2xl cursor-pointer border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
                                                {thumbUrl ? (
                                                    <>
                                                        <img 
                                                            src={thumbUrl} 
                                                            alt={post.title} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent) {
                                                                    const fallback = parent.querySelector('.fallback-container') as HTMLElement;
                                                                    if (fallback) fallback.style.display = 'flex';
                                                                }
                                                            }}
                                                        />
                                                        <div className="fallback-container hidden w-full h-full flex-col items-center justify-center p-4">
                                                            <FileText className="w-12 h-12 text-gray-400 dark:text-white/10 mb-2" />
                                                            <span className="text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest leading-tight px-4 line-clamp-3">{post.title || 'MÍDIA INDISPONÍVEL'}</span>
                                                        </div>
                                                        {isVideo && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-background-dark/20 group-hover:bg-background-dark/40 transition-colors">
                                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                                                    <Play className="w-6 h-6 text-white fill-current" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full bg-brand-yellow/5 dark:bg-brand-yellow/10 flex flex-col items-center justify-center p-4 text-center">
                                                        <FileText className="w-12 h-12 text-brand-yellow/50 mb-2" />
                                                        <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest leading-tight px-4 line-clamp-3">{post.title || 'MÍDIA INDISPONÍVEL'}</span>
                                                    </div>
                                                )}

                                                <div className="absolute top-2 right-2">
                                                    <Star className="w-5 h-5 text-brand-yellow fill-current" />
                                                </div>

                                                <div className="absolute inset-0 bg-background-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white">
                                                    <div className="flex items-center gap-1.5 font-bold">
                                                        <Heart className="w-5 h-5 fill-current" />
                                                        <span>{post.likeCount}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-bold">
                                                        <MessageSquare className="w-5 h-5 fill-current" />
                                                        <span>{post.commentCount}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-24 h-24 mb-6 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                        <Star className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Constelação vazia</h2>
                                    <p className="text-gray-500 max-w-xs mx-auto">Clique na ⭐ estrela nos posts para adicioná-los à sua constelação.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="space-y-6">
                            {userLogs.length > 0 ? (
                                userLogs.map(log => <ThreadNode key={log.id} drop={log as Drop} />)
                            ) : (
                                <div className="py-20 text-center opacity-40">
                                    <p className="font-mono text-xs uppercase tracking-widest">Nenhum log registrado.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => router.refresh()}
            />

            {/* Modal de Estatísticas Pedagógicas */}
            {selectedPostForMetrics && (
                <MetricsModal
                    isOpen={isMetricsModalOpen}
                    onClose={() => setIsMetricsModalOpen(false)}
                    post={selectedPostForMetrics}
                />
            )}

            <EditSubmissionModal 
                isOpen={isEditPostModalOpen}
                onClose={() => {
                    setIsEditPostModalOpen(false);
                    setSelectedPostToEdit(null);
                }}
                post={selectedPostToEdit}
            />

            <NetworkModal
                isOpen={isNetworkModalOpen}
                onClose={() => setIsNetworkModalOpen(false)}
                userId={viewedProfile?.id || ''}
                isViewingOwn={isViewingOwn}
                initialTab={networkModalType}
            />
        </MainLayoutWrapper >
    );
}

