'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import Link from 'next/link';
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { ArrowRight } from 'lucide-react';
import { PostDTO } from '@/dtos/media';
import { MediaCard } from '@/components/media/MediaCard';
import { Breadcrumbs } from '@/components/wiki/WikiComponents';

interface LabdivClientProps {
    posts: PostDTO[];
}

export function LabdivClient({ posts }: LabdivClientProps) {
    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <Breadcrumbs 
                    title="Lab-Div" 
                    section="Iniciativas de Impacto" 
                    sectionHref="/gcif/instituto" 
                    backHref="/gcif/instituto" 
                />

                {/* Hero Lab-Div */}
                <section className="relative overflow-hidden py-16 bg-gradient-to-br from-brand-blue/10 via-white to-brand-red/5 dark:from-brand-blue/20 dark:via-background-dark dark:to-brand-red/10 border border-gray-200 dark:border-gray-800 rounded-3xl mb-12 text-left">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4 text-gray-900 dark:text-white">
                                O que é o <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-red to-brand-yellow">Lab-Div</span>?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                                É um laboratório de divulgação científica que produz, reúne e ajuda a criar material de divulgação científica para melhorar a divulgação científica do IF.
                            </p>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <Link 
                                    href="/iniciativas/hub" 
                                    className="px-6 py-3 bg-brand-yellow text-[#121212] rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-yellow/20 flex items-center gap-2 hover:-translate-y-1 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-[20px]">hub</span>
                                    Sobre o HUB
                                </Link>
                                <a 
                                    href="https://sites.google.com/usp.br/labdiv/in%C3%ADcio" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-6 py-3 bg-white/10 dark:bg-white/5 border border-brand-blue/30 text-brand-blue rounded-2xl font-black uppercase tracking-widest text-[11px] backdrop-blur-md flex items-center gap-2 hover:-translate-y-1 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-[20px]">language</span>
                                    Site Oficial
                                </a>
                                <a 
                                    href="https://sites.google.com/usp.br/labdiv/people?authuser=0" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-6 py-3 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-blue/20 flex items-center gap-2 hover:-translate-y-1 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-[20px]">groups</span>
                                    Conhecer a Equipe
                                </a>
                            </div>
                        </div>
                        <div className="hidden md:block w-48 h-48 relative opacity-80">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-brand-red rounded-full blur-3xl opacity-20 animate-pulse" />
                            <span className="material-symbols-outlined text-[120px] text-brand-blue drop-shadow-2xl absolute inset-0 flex items-center justify-center">library_books</span>
                        </div>
                    </div>
                </section>

                {/* Section About Lab-Div */}
                <div className="bg-gradient-to-br from-brand-blue/5 to-brand-red/5 dark:from-blue-900/10 dark:to-red-900/10 rounded-3xl p-8 md:p-12 border border-brand-blue/10 mb-20">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white uppercase italic tracking-tighter">
                                O Papel do <span className="text-brand-blue">Lab-Div</span>
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                                O Laboratório de Divulgação Científica do IFUSP atua como o motor técnico e curatorial desta plataforma. Inspirado no modelo do <strong>MIT Comm Lab</strong>, nosso trabalho se estende da produção de conteúdo "Padrão Ouro" à moderação, suporte e mentoria contínua para garantir a qualidade da comunicação.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a 
                                    href="https://sites.google.com/usp.br/labdiv/in%C3%ADcio" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-6 py-3 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-blue/20 flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-[18px]">launch</span>
                                    Conferir o Site
                                </a>
                                <a 
                                    href="https://sites.google.com/usp.br/labdiv/joinus?authuser=0" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-6 py-3 bg-brand-red text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-red/20 flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                                    Venha fazer parte
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium CTAs */}
                <section className="py-4 max-w-7xl mx-auto mb-16 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kit Div CTA */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-brand-red/10 to-transparent dark:from-brand-red/20 dark:to-card-dark rounded-3xl p-8 border border-brand-red/20 hover:border-brand-red/40 transition-colors group flex flex-col items-start">
                            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-brand-red text-2xl">inventory_2</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Kit Div</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
                                Ferramentas exclusivas, templates de design, guias de linguagem e assets audiovisuais da marca do IFUSP para acelerar suas produções.
                            </p>
                            <a href="https://sites.google.com/usp.br/labdiv/kitdiv?authuser=0" target="_blank" rel="noopener noreferrer" className="mt-auto px-6 py-3 bg-brand-red text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform group-hover:shadow-lg group-hover:shadow-brand-red/20">
                                Explorar Kit Div
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>

                        {/* Mentoria CTA */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue/10 to-transparent dark:from-brand-blue/20 dark:to-card-dark rounded-3xl p-8 border border-brand-blue/20 hover:border-brand-blue/40 transition-colors group flex flex-col items-start">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[120px] text-brand-blue">psychology</span>
                            </div>
                            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-brand-blue text-2xl">group_add</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mentoria Premium</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-sm relative z-10">
                                Agende reuniões individuais com Veteranos do Lab-Div para revisar roteiros, artigos, refinar a didática e traçar planos de divulgação para suas pesquisas.
                            </p>
                            <a href="https://sites.google.com/usp.br/labdiv/schedule?authuser=0" target="_blank" rel="noopener noreferrer" className="mt-auto relative z-10 px-6 py-3 bg-brand-blue text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform group-hover:shadow-lg group-hover:shadow-brand-blue/20">
                                Solicitar Mentoria
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>

                        {/* Entrar para a Equipe CTA */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-brand-yellow/10 to-transparent dark:from-brand-yellow/20 dark:to-card-dark rounded-3xl p-8 border border-brand-yellow/20 hover:border-brand-yellow/40 transition-colors group flex flex-col items-start">
                            <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[120px] text-brand-yellow">diversity_3</span>
                            </div>
                            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-brand-yellow text-2xl">person_add</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Faça Parte da Equipe</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-sm relative z-10">
                                Quer contribuir com a divulgação científica do IFUSP? Junte-se ao Lab-Div como colaborador, roteirista, designer ou desenvolvedor. Vamos construir juntos.
                            </p>
                            <a href="https://sites.google.com/usp.br/labdiv/joinus?authuser=0" target="_blank" rel="noopener noreferrer" className="mt-auto relative z-10 px-6 py-3 bg-brand-yellow text-gray-900 text-sm font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform group-hover:shadow-lg group-hover:shadow-brand-yellow/20">
                                Quero Participar
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>

                        {/* Espaço Novo Milênio CTA */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-brand-red/10 to-transparent dark:from-brand-red/20 dark:to-card-dark rounded-3xl p-8 border border-brand-red/20 hover:border-brand-red/40 transition-colors group flex flex-col items-start">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[120px] text-brand-red">meeting_room</span>
                            </div>
                            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-brand-red text-2xl">event_available</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Espaço Novo Milênio</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-sm relative z-10">
                                Um espaço multimídia do IFUSP disponível para gravações, reuniões e eventos acadêmicos. Agende a utilização e transforme suas ideias em produções profissionais.
                            </p>
                            <a href="https://sites.google.com/usp.br/labdiv/digitalab?authuser=0" target="_blank" rel="noopener noreferrer" className="mt-auto relative z-10 px-6 py-3 bg-brand-red text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform group-hover:shadow-lg group-hover:shadow-brand-red/20">
                                Agendar Espaço
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Lab-Div Posts Carousel */}
                {posts && posts.length > 0 && (
                    <section className="mb-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase italic tracking-tighter">
                            Produções Recentes
                        </h3>
                        <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar">
                            {posts.map(post => (
                                <div key={post.id} className="min-w-[300px] sm:min-w-[350px] max-w-[350px] snap-center">
                                    <MediaCard post={post} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </MainLayoutWrapper>
    );
}
