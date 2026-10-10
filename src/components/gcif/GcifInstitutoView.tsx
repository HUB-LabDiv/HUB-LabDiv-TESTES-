'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Landmark,
    Workflow,
    Info,
    Sparkles,
    ArrowRight,
    ChevronRight,
    MapPin,
    Building2,
    Users,
    Clock
} from 'lucide-react';
import { NetflixFeed } from '@/components/shared/NetflixFeed';
import { ColisorIcon } from '@/components/icons/ColisorIcon';
import dynamic from 'next/dynamic';
import { DepartmentGrid } from '@/components/wiki/instituto/DepartmentGrid';
import { InstitutoTimeline } from '@/components/wiki/instituto/InstitutoTimeline';
import { HistoricalPosts } from '@/components/wiki/instituto/HistoricalPosts';

const CampusMap = dynamic(() => import('@/components/map/CampusMap').then(mod => mod.CampusMap), {
    ssr: false,
    loading: () => (
        <div className="w-full aspect-square rounded-3xl overflow-hidden animate-pulse bg-gray-200 dark:bg-gray-800" />
    )
});

interface GcifInstitutoViewProps {
    mapItems: any[];
}

const influencers = [
    {
        name: 'Canoa Da Lagoa',
        role: 'Divulgação Científica',
        bio: 'Canal do YouTube com conteúdo de física e ciência para todos.',
        imagePlaceholder: 'CL',
        color: 'brand-red',
        platform: 'youtube',
        link: 'https://www.youtube.com/@CanoadaLagoa/featured'
    },
    {
        name: 'Saficada Física',
        role: '@saficadafisica',
        bio: 'Física com humor e acessibilidade no TikTok.',
        imagePlaceholder: 'SF',
        color: 'brand-blue',
        platform: 'tiktok',
        link: 'https://www.tiktok.com/@saficadafisica'
    },
    {
        name: 'Gustavo Alves',
        role: 'Física e Vida Acadêmica',
        bio: 'Rotina de estudos, dicas de graduação e vida acadêmica na física.',
        imagePlaceholder: 'GA',
        color: 'brand-blue',
        platform: 'youtube',
        link: 'https://www.youtube.com/@ViverComoFisico'
    },
    {
        name: 'Alexandria 21',
        role: 'Agnessa',
        bio: 'Ciência, história e cultura científica no YouTube.',
        imagePlaceholder: 'A21',
        color: 'brand-red',
        platform: 'youtube',
        link: 'https://www.youtube.com/@Alexandria21'
    },
    {
        name: 'Ana Pleiade',
        role: '@a_pleiade',
        bio: 'Astronomia, astrofísica e inspiração científica no Instagram.',
        imagePlaceholder: 'AP',
        color: 'brand-blue',
        platform: 'instagram',
        link: 'https://www.instagram.com/a_pleiade'
    },
    {
        name: 'Levitang',
        role: '@levitang',
        bio: 'Física e divulgação científica no TikTok.',
        imagePlaceholder: 'LV',
        color: 'brand-blue',
        platform: 'tiktok',
        link: 'https://www.tiktok.com/@levitang'
    },
];

const getPlatformIcon = (platform: string) => {
    if (platform === 'youtube') return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>;
    if (platform === 'instagram') return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
    if (platform === 'tiktok') return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.51.36-5.17 2.05-7.11 1.57-1.79 4.11-2.9 6.55-2.73 0 1.34.02 2.69 0 4.03-1.07-.15-2.18.06-3.12.63-1.08.66-1.85 1.83-2.02 3.1-.15 1.14.07 2.34.61 3.32.78 1.45 2.58 2.36 4.19 2.03 2.15-.46 3.65-2.42 3.65-4.66.01-4.8.01-9.61 0-14.41-.01-.57-.01-1.14-.01-1.71h.01z" /></svg>;
    return <span className="material-symbols-outlined text-[18px]">open_in_new</span>;
};

export function GcifInstitutoView({ mapItems }: GcifInstitutoViewProps) {
    return (
        <div className="w-full space-y-16 pb-16">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1E1E] via-[#161616] to-[#0f0f0f] border border-white/10 p-6 sm:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue-ifusp/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue-ifusp/20 border border-brand-blue-ifusp/40 text-blue-300 text-xs font-black uppercase tracking-wider mb-3">
                        <Landmark className="w-3.5 h-3.5" />
                        Instituto de Física da Universidade de São Paulo
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white font-bukra tracking-tight">
                        O Instituto, Iniciativas & Espaços
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans mt-3 leading-relaxed">
                        Conheça a estrutura, história, departamentos, laboratórios, entidades estudantis e a comunidade de divulgadores que constroem a ciência no IFUSP.
                    </p>
                </div>
            </div>

            {/* 1. Departamentos */}
            <div id="estrutura-departamentos" data-tour="gcif-instituto-departamentos" className="scroll-mt-24">
                <DepartmentGrid />
            </div>

            {/* 2. Iniciativas de Impacto */}
            <div id="iniciativas-impacto" data-tour="gcif-instituto-iniciativas" className="space-y-6">
                <NetflixFeed 
                    title="Iniciativas de Impacto" 
                    icon={<div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue"><ColisorIcon size={20} animate={false} /></div>}
                >
                    {/* Lab-Div Card */}
                    <div className="snap-center shrink-0 w-[300px] md:w-[400px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl relative overflow-hidden group flex flex-col justify-between">
                        <div>
                            <div className="size-16 bg-white rounded-2xl p-3 mb-6">
                                <img src="/labdiv-logo.png" alt="Lab-Div" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl font-black italic uppercase mb-2 text-brand-blue font-bukra">Lab-Div</h3>
                            <p className="text-xs text-gray-400 font-open-sans leading-relaxed mb-6">Comunicação científica inspirada no MIT. Tutoria entre pares, escrita e design.</p>
                        </div>
                        <Link href="/iniciativas/labdiv" className="mt-auto px-6 py-3 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-[10px] text-center group-hover:scale-105 transition-transform">Explorar Acervo</Link>
                    </div>

                    {/* Show da Física Card (Neon Edition) */}
                    <div className="snap-center shrink-0 w-[300px] md:w-[400px] bg-[#0a0a0c] rounded-[40px] p-8 border border-[#002ffe] shadow-[0_0_20px_rgba(0,47,254,0.25)] relative overflow-hidden group flex flex-col justify-between transition-all hover:shadow-[0_0_30px_rgba(1,243,0,0.3)] hover:border-[#01f300]">
                        {/* Brilho interno de fundo */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#f60011]/10 rounded-full blur-3xl group-hover:bg-[#01f300]/10 transition-colors pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="size-16 bg-black border border-white/10 rounded-2xl p-3 flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform shadow-[inset_0_0_15px_rgba(246,0,17,0.3)]">
                                <span className="material-symbols-outlined text-4xl drop-shadow-[0_0_8px_#f60011]">experiment</span>
                            </div>
                            <h3 className="text-[22px] font-black uppercase mb-2 font-bukra tracking-wider">
                                <span className="text-white" style={{ textShadow: '0 0 10px #f60011' }}>Show</span>{' '}
                                <span className="text-white" style={{ textShadow: '0 0 10px #002ffe' }}>de</span>{' '}
                                <span className="text-white" style={{ textShadow: '0 0 10px #01f300' }}>Física</span>
                            </h3>
                            <p className="text-xs text-gray-300 font-open-sans leading-relaxed mb-6">Demonstrações de fenômenos físicos de maneira lúdica e interativa. Monte seu show ou participe das interações ao vivo.</p>
                        </div>
                        <Link href="/iniciativas/show-da-fisica" className="relative z-10 mt-auto px-6 py-3 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] text-center transition-all border border-[#01f300] hover:bg-[#01f300] hover:text-black shadow-[0_0_15px_rgba(1,243,0,0.4)] group-hover:scale-105">
                            Conhecer o Show
                        </Link>
                    </div>

                    {/* Boletim Supernova */}
                    <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl flex flex-col justify-between group">
                        <div>
                            <div className="size-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-6">
                                <span className="material-symbols-outlined text-3xl">newspaper</span>
                            </div>
                            <h3 className="text-xl font-black italic uppercase mb-2 text-white font-bukra">Supernova</h3>
                            <p className="text-xs text-gray-400 font-open-sans leading-relaxed mb-6">O boletim crítico e cultural do CEFISMA. A voz ativa da graduação.</p>
                        </div>
                        <a href="https://cefisma.com.br" target="_blank" rel="noopener noreferrer" className="mt-auto px-6 py-3 border border-brand-blue/20 text-brand-blue rounded-xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-brand-blue/10 transition-colors">Ler Supernova</a>
                    </div>

                    {/* BIFUSP */}
                    <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl flex flex-col justify-between group">
                        <div>
                            <div className="size-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-6">
                                <span className="material-symbols-outlined text-3xl">library_books</span>
                            </div>
                            <h3 className="text-xl font-black italic uppercase mb-2 text-white font-bukra">BIFUSP</h3>
                            <p className="text-xs text-gray-400 font-open-sans leading-relaxed mb-6">A base de dados física. Biblioteca central do Instituto de Física.</p>
                        </div>
                        <a href="https://portal.if.usp.br/biblioteca/" target="_blank" rel="noopener noreferrer" className="mt-auto px-6 py-3 border border-brand-blue/20 text-brand-blue rounded-xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-brand-blue/10 transition-colors">Consultar</a>
                    </div>

                    {/* Grupo Noether */}
                    <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl flex flex-col justify-between group">
                        <div>
                            <div className="size-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow mb-6">
                                <span className="material-symbols-outlined text-3xl">group</span>
                            </div>
                            <h3 className="text-xl font-black italic uppercase mb-2 text-white font-bukra">Grupo Noether</h3>
                            <p className="text-xs text-gray-400 font-open-sans leading-relaxed mb-6">Mulheres na Física. Apoio, visibilidade e debates para as alunas do IFUSP.</p>
                        </div>
                        <a href="https://www.instagram.com/gnoether_/" target="_blank" rel="noopener noreferrer" className="mt-auto px-6 py-3 border border-brand-yellow/30 text-brand-yellow rounded-xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-brand-yellow/10 transition-colors">Acessar Instagram</a>
                    </div>
                </NetflixFeed>
            </div>

            {/* Canais de Divulgação (Influenciadores e Criadores do IF) */}
            <div id="canais-divulgacao" data-tour="gcif-instituto-influenciadores" className="space-y-6">
                <NetflixFeed 
                    title="Canais de Divulgação" 
                    icon={<div className="p-2 bg-brand-red/10 rounded-xl text-brand-red"><Sparkles className="w-5 h-5" /></div>}
                >
                    {influencers.map((influencer, index) => (
                        <div key={index} className="flex flex-col items-center text-center group snap-center shrink-0 w-[280px] p-8 bg-[#1E1E1E] rounded-[40px] border border-white/10 shadow-xl hover:border-brand-yellow/30 transition-all">
                            <div className={`relative w-20 h-20 rounded-full mb-4 flex items-center justify-center text-xl font-bold text-white bg-${influencer.color} ring-4 ring-black/20 group-hover:scale-105 transition-transform`}>
                                {influencer.imagePlaceholder}
                            </div>
                            <h3 className="text-base font-black uppercase tracking-tight mb-1 text-white font-bukra">{influencer.name}</h3>
                            <p className={`text-[10px] font-black uppercase tracking-wider text-${influencer.color} mb-3`}>{influencer.role}</p>
                            <p className="text-xs text-gray-400 leading-relaxed font-open-sans line-clamp-3 mb-6">{influencer.bio}</p>
                            <div className="mt-auto w-full pt-2">
                                <a 
                                    href={influencer.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-brand-yellow/30 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-white/10"
                                >
                                    {getPlatformIcon(influencer.platform)}
                                    <span className="font-open-sans font-bold text-xs tracking-wider">Conhecer</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </NetflixFeed>
            </div>

            {/* 3. Espaços do IF */}
            <div id="espacos-convivencia" data-tour="gcif-instituto-espacos" className="space-y-6">
                <NetflixFeed 
                    title="Espaços de Convivência & Criação" 
                    icon={<div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue"><Info className="w-5 h-5" /></div>}
                >
                    {/* Hackerspace */}
                    <div className="snap-center shrink-0 w-[300px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                        <div>
                            <div className="size-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">memory</span>
                            </div>
                            <h3 className="text-lg font-black uppercase mb-2 text-white font-bukra">Hackerspace</h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-open-sans">Cultura maker no IF. Arduinos, 3D e colaboração radical.</p>
                        </div>
                        <a href="https://hackerspace.if.usp.br" target="_blank" rel="noopener noreferrer" className="mt-auto text-brand-blue font-black uppercase tracking-wider text-xs flex items-center gap-1.5 hover:underline">Visitar <ArrowRight className="w-4 h-4" /></a>
                    </div>

                    {/* DigitalLab */}
                    <div className="snap-center shrink-0 w-[300px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl flex flex-col justify-between group opacity-60">
                        <div>
                            <div className="size-14 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red mb-6">
                                <span className="material-symbols-outlined text-3xl">desktop_windows</span>
                            </div>
                            <h3 className="text-lg font-black uppercase mb-2 text-white font-bukra">DigitalLab</h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-open-sans">Espaço no Inova. Experiências digitais e audiovisual.</p>
                        </div>
                        <div className="mt-auto text-brand-red text-[10px] font-black uppercase tracking-widest">
                            Em fase de ignição
                        </div>
                    </div>

                    {/* CEFISMA - Amélia Império */}
                    <div className="snap-center shrink-0 w-[300px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl flex flex-col justify-between group hover:border-brand-blue/30 transition-all">
                        <div>
                            <div className="size-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">groups</span>
                            </div>
                            <h3 className="text-lg font-black uppercase mb-2 text-white font-bukra">Amélia Império</h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-open-sans">O Centro Acadêmico da Física (CEFISMA). Representação estudantil e convivência.</p>
                        </div>
                        <a href="https://cefisma.com.br" target="_blank" rel="noopener noreferrer" className="mt-auto text-brand-blue font-black uppercase tracking-wider text-xs flex items-center gap-1.5 hover:underline">Conhecer <ArrowRight className="w-4 h-4" /></a>
                    </div>

                    {/* Lab Demo */}
                    <div className="snap-center shrink-0 w-[300px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl flex flex-col justify-between group">
                        <div>
                            <div className="size-14 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red mb-6">
                                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                            </div>
                            <h3 className="text-lg font-black uppercase mb-2 text-white font-bukra">Lab Demo</h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-open-sans">Demonstrações lúdicas e experimentos interativos de física.</p>
                        </div>
                        <a href="https://portal.if.usp.br/demonstracoes/" target="_blank" rel="noopener noreferrer" className="mt-auto text-brand-red font-black uppercase tracking-wider text-xs flex items-center gap-1.5 hover:underline">Ver Fenômenos <ArrowRight className="w-4 h-4" /></a>
                    </div>

                    {/* Parque CienTec */}
                    <div className="snap-center shrink-0 w-[380px] bg-[#1E1E1E] rounded-[40px] p-8 border border-white/10 shadow-xl relative overflow-hidden group flex flex-col justify-between">
                        <div>
                            <div className="size-16 bg-white rounded-2xl p-3 mb-6">
                                <img src="/cientec-logo.png" alt="CienTec" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-2 text-white font-bukra">CienTec</h3>
                            <p className="text-xs text-gray-400 font-open-sans leading-relaxed mb-6">Física a céu aberto. Museus, trilhas e observação estelar.</p>
                        </div>
                        <a href="https://parquecientec.usp.br" target="_blank" rel="noopener noreferrer" className="mt-auto px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-black uppercase tracking-widest text-[10px] text-center transition-colors">Acessar Parque</a>
                    </div>
                </NetflixFeed>
            </div>

            {/* 4. Campus Interativo & Mapa */}
            <div id="mapa-campus" data-tour="gcif-instituto-mapa" className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white font-bukra italic uppercase tracking-tighter">
                            Campus Interativo & Mapa
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 font-open-sans">
                            Navegue pelas descobertas e registros através da geografia do Instituto.
                        </p>
                    </div>
                </div>

                <div className="w-full max-w-4xl mx-auto aspect-square rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 bg-[#1B2B1B]/40">
                    <CampusMap items={mapItems} />
                </div>
            </div>

            {/* 5. Linha do Tempo & Marcos Históricos (Último lugar da página com aviso de Em Desenvolvimento) */}
            <div id="historico-instituto" className="space-y-12 border-t border-white/10 pt-16">
                {/* Banner / Aviso de Em Desenvolvimento */}
                <div className="relative overflow-hidden rounded-3xl bg-[#1E1E1E] border border-brand-yellow/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-start sm:items-center gap-4 relative z-10">
                        <div className="size-14 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center shrink-0 text-brand-yellow">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-[10px] font-black uppercase tracking-wider font-bukra">
                                    Em Desenvolvimento
                                </span>
                                <span className="text-xs text-gray-400 font-open-sans">Acervo em Curadoria</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white font-bukra italic uppercase tracking-tight">
                                Linha do Tempo & Marcos Históricos
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1 max-w-2xl leading-relaxed">
                                A reconstrução cronológica e os registros históricos do IFUSP estão em fase de validação e catalogação pelo Lab-Div. Novos marcos, documentos e depoimentos serão integrados em breve.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Linha do Tempo */}
                <div id="timeline-instituto" className="scroll-mt-24">
                    <InstitutoTimeline />
                </div>

                {/* Marcos Históricos */}
                <div id="marcos-historicos" className="scroll-mt-24">
                    <HistoricalPosts />
                </div>
            </div>
        </div>
    );
}
