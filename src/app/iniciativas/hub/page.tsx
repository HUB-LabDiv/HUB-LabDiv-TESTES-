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

import React from 'react';
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/wiki/WikiComponents';

export const metadata = {
    title: 'O que é o HUB? | Iniciativas IFUSP',
    description: 'Conheça o Hub de Comunicação Científica do IFUSP.',
};

export default function HubPage() {
    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <Breadcrumbs 
                    title="Sobre o HUB" 
                    section="Iniciativas de Impacto" 
                    sectionHref="/gcif/instituto" 
                    backHref="/gcif/instituto" 
                />
                
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                        O que é o <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-red to-brand-yellow">Hub de Comunicação</span>?
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                        O projeto nasceu com a ideia de apenas criar material de divulgação, mas evoluiu para uma nova categoria de plataforma digital: um <strong>Hub Acadêmico</strong> que transforma a simples divulgação em comunicação viva.
                    </p>
                    <div className="flex justify-center items-center">
                        <Link href="/apresentacao" className="bg-gradient-to-r from-brand-blue to-brand-red p-[2px] rounded-3xl hover:scale-105 transition-transform shadow-2xl shadow-brand-blue/20 w-full sm:w-auto inline-block">
                            <div className="bg-white dark:bg-background-dark rounded-[22px] px-8 py-4 flex items-center justify-center gap-3 h-full">
                                <BookOpen className="w-6 h-6 text-brand-yellow" />
                                <span className="font-black uppercase tracking-widest text-gray-900 dark:text-white text-sm md:text-base">
                                    Apresentação do HUB
                                </span>
                                <ArrowRight className="w-5 h-5 text-gray-900 dark:text-white" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Ecosystem Sections */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-20 px-4 md:px-0">
                    <div className="col-span-2 lg:col-span-3 mb-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Ecossistema em Expansão</h3>
                        <div className="h-px bg-gradient-to-r from-brand-blue/20 via-brand-red/20 to-transparent w-full mb-8"></div>
                    </div>

                    <div className="glass-card rounded-3xl p-5 md:p-10 hover:border-brand-blue/20 transition-all group h-full flex flex-col hover:shadow-lg">
                        <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-brand-blue text-xl md:text-2xl">grain</span>
                        </div>
                        <h4 className="text-sm md:text-xl font-black uppercase italic tracking-tight mb-2 md:mb-4">A Comunidade</h4>
                        <p className="text-gray-500 text-[10px] md:text-sm leading-relaxed mb-4 md:mb-6 flex-1">
                            O pulso do IFUSP em tempo real. Uma timeline dinâmica que transforma a divulgação científica em comunicação interativa, reunindo materiais do Lab-Div, contribuições da rede e mentorados em um só lugar.
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-5 md:p-10 hover:border-brand-red/20 transition-all group h-full flex flex-col hover:shadow-lg">
                        <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-brand-red/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-brand-red text-xl md:text-2xl">list_alt</span>
                        </div>
                        <h4 className="text-sm md:text-xl font-black uppercase italic tracking-tight mb-2 md:mb-4">Registros do IFUSP</h4>
                        <p className="text-gray-500 text-[10px] md:text-sm leading-relaxed mb-4 md:mb-6 flex-1">
                            O mural da nossa gente. Um espaço informal para desabafos, avisos rápidos e aquelas fofocas de laboratório que fazem parte do dia a dia, sem o peso do rigor acadêmico ou oficial.
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-5 md:p-10 hover:border-brand-yellow/20 transition-all group h-full flex flex-col hover:shadow-lg col-span-2 lg:col-span-1">
                        <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-brand-yellow/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-brand-yellow text-xl md:text-2xl">science</span>
                        </div>
                        <h4 className="text-sm md:text-xl font-black uppercase italic tracking-tight mb-2 md:mb-4">Match Acadêmico</h4>
                        <p className="text-gray-500 text-[10px] md:text-sm leading-relaxed mb-4 md:mb-6 flex-1">
                            Onde pesquisadores e talentos se encontram. Uma ponte direta entre alunos buscando iniciação científica e laboratórios precisando de mentes brilhantes.
                        </p>
                    </div>
                </div>

                {/* Project Overview Card (Premium) */}
                <div className="glass-card rounded-[40px] p-8 md:p-16 shadow-2xl shadow-brand-blue/5 relative overflow-hidden mb-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                                O Futuro da <br />
                                <span className="text-brand-blue">Comunicação</span> Científica
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                <p>
                                    O Hub Lab-Div não é apenas um repositório; é um motor de visibilidade. Nosso objetivo é transformar a ciência "invisível" que acontece nos laboratórios em narrativas visuais potentes.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <h4 className="text-brand-red font-black uppercase tracking-widest text-xs mb-3">Nossa Missão</h4>
                                        <p className="text-sm">Humanizar a ciência do IFUSP através de conteúdos autênticos, aproximando pesquisadores e sociedade.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-brand-yellow font-black uppercase tracking-widest text-xs mb-3">Nossa Meta 2026</h4>
                                        <p className="text-sm">Alcançar 100% dos laboratórios do IF cadastrados e 5.000 registros históricos preservados.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Panel */}
                        <div className="w-full lg:w-72 shrink-0 grid grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col justify-center text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Comunidade</span>
                                <span className="text-4xl font-black text-brand-blue">~500</span>
                                <span className="text-xs font-bold text-gray-500 mt-1">Usuários Ativos</span>
                                <span className="text-[10px] text-gray-400 mt-1">*estimativa de alunos da graduação</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col justify-center text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Acervo Digital</span>
                                <span className="text-4xl font-black text-brand-red">1.2k</span>
                                <span className="text-xs font-bold text-gray-500 mt-1">Posts & Mídias</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}
