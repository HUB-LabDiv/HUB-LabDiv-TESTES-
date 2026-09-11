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
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    BookOpen,
    ChevronRight,
    Search,
    ShieldCheck,
    Zap,
    Atom,
    CheckCircle2,
    Flag
} from 'lucide-react';
import { wikiCells } from '@/components/wiki/WikiView';
import { useNavigationStore } from '@/store/useNavigationStore';

const colorVariants: Record<string, {
    text: string;
    textHover: string;
    bg: string;
    bgHover: string;
    border: string;
    borderHover: string;
    pillBg: string;
    ctaText: string;
    ctaBg: string;
    progressBar: string;
    dotBg: string;
}> = {
    'brand-blue': {
        text: 'text-[#00A3FF]',
        textHover: 'group-hover:text-[#00A3FF]',
        bg: 'bg-brand-blue/10',
        bgHover: 'group-hover:bg-brand-blue/20',
        border: 'border-brand-blue/30',
        borderHover: 'hover:border-brand-blue/60',
        pillBg: 'bg-brand-blue/15 text-[#00A3FF]',
        ctaText: 'text-[#00A3FF]',
        ctaBg: 'bg-brand-blue/10 text-[#00A3FF]',
        progressBar: 'bg-[#00A3FF]',
        dotBg: 'bg-brand-blue',
    },
    'brand-yellow': {
        text: 'text-brand-yellow',
        textHover: 'group-hover:text-brand-yellow',
        bg: 'bg-brand-yellow/10',
        bgHover: 'group-hover:bg-brand-yellow/20',
        border: 'border-brand-yellow/30',
        borderHover: 'hover:border-brand-yellow/60',
        pillBg: 'bg-brand-yellow/15 text-brand-yellow',
        ctaText: 'text-brand-yellow',
        ctaBg: 'bg-brand-yellow/10 text-brand-yellow',
        progressBar: 'bg-brand-yellow',
        dotBg: 'bg-brand-yellow',
    },
    'brand-red': {
        text: 'text-brand-red',
        textHover: 'group-hover:text-brand-red',
        bg: 'bg-brand-red/10',
        bgHover: 'group-hover:bg-brand-red/20',
        border: 'border-brand-red/30',
        borderHover: 'hover:border-brand-red/60',
        pillBg: 'bg-brand-red/15 text-brand-red',
        ctaText: 'text-brand-red',
        ctaBg: 'bg-brand-red/10 text-brand-red',
        progressBar: 'bg-brand-red',
        dotBg: 'bg-brand-red',
    },
};

export function GcifWikiView() {
    const { setReportModalOpen } = useNavigationStore();

    return (
        <div className="w-full space-y-12 pb-16">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1E1E] via-[#161616] to-[#0f0f0f] border border-white/10 p-6 sm:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-[#00A3FF] text-xs font-black uppercase tracking-wider mb-3">
                        <BookOpen className="w-3.5 h-3.5" />
                        O Síncrotron de Conhecimento • IFUSP
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white font-bukra tracking-tight">
                        WIKI <span className="text-gradient-brand">HUB</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans mt-3 leading-relaxed">
                        O repositório definitivo para sobrevivência universitária, pesquisa acadêmica, ética científica, bolsas e permanência estudantil no IFUSP.
                    </p>
                </div>
            </div>

            {/* Wiki Matrix Grid (Síncrotron) */}
            <div data-tour="gcif-wiki-sincrotron" className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-black text-white font-bukra flex items-center gap-2">
                        <Atom className="w-6 h-6 text-brand-blue" />
                        Células de Conhecimento
                    </h2>
                    <span className="text-xs text-gray-400 font-bold">
                        {wikiCells.length} seções disponíveis
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {wikiCells.map((cell: any, idx: number) => {
                            const colors = colorVariants[cell.color] || colorVariants['brand-blue'];
                            return (
                                <motion.div
                                    key={cell.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                                >
                                    <Link
                                        href={cell.href}
                                        className={`
                                            group relative flex flex-col justify-between h-full rounded-3xl p-6 sm:p-8
                                            bg-[#1E1E1E]/90 hover:bg-[#232323]
                                            border border-white/10 ${colors.borderHover}
                                            transition-all duration-300 shadow-xl hover:shadow-2xl
                                        `}
                                    >
                                        <div>
                                            {/* Icon Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center border ${colors.border} group-hover:scale-110 transition-transform`}>
                                                    {cell.icon}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setReportModalOpen(true, 'outro', { id: cell.id, titulo: cell.title, local: 'Célula da Wiki' });
                                                        }}
                                                        title="Sugerir Alteração / Reportar Erro"
                                                        className="text-gray-500 hover:text-brand-red transition-colors p-1"
                                                    >
                                                        <Flag size={14} />
                                                    </button>
                                                    <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                        <div className={`w-full h-full ${colors.progressBar}`} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title & Subtitle */}
                                            <h3 className={`text-xl font-bold text-white font-bukra ${colors.textHover} transition-colors mb-1`}>
                                                {cell.title}
                                            </h3>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-4">
                                                {cell.subtitle}
                                            </p>

                                            {/* Description */}
                                            <p className="text-xs text-gray-300 font-open-sans leading-relaxed mb-6 line-clamp-3">
                                                {cell.description}
                                            </p>

                                            {/* Details Bullet points */}
                                            {cell.details && (
                                                <div className="space-y-1.5 mb-6 p-3 rounded-2xl bg-black/30 border border-white/5">
                                                    {cell.details.map((detail: string, dIdx: number) => (
                                                        <div key={dIdx} className="flex items-start gap-1.5 text-[11px] text-gray-400 font-medium">
                                                            <CheckCircle2 className={`w-3.5 h-3.5 ${colors.text} shrink-0 mt-0.5`} />
                                                            <span className="line-clamp-1">{detail}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Footer */}
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                            <span className={`text-[10px] font-black ${colors.ctaText} uppercase tracking-widest`}>
                                                {cell.cta}
                                            </span>
                                            <div className={`w-7 h-7 rounded-full ${colors.ctaBg} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Banners em Destaque: IFUSP 101 & Como Pesquisar */}
            <div data-tour="gcif-wiki-guias" className="space-y-6 pt-6 border-t border-white/10">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white font-bukra flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-brand-yellow" />
                        Guias Essenciais & Metodologia
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1">
                        Conselhos práticos de sobrevivência acadêmica e técnicas de pesquisa científica.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* 1. Card Grande: IFUSP 101 & Dicas de Veteranos */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative group w-full"
                    >
                        <div className="absolute -inset-0.5 bg-brand-yellow/20 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Link
                            href="/wiki/veteranos"
                            className="relative flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-10 rounded-[32px] bg-[#1E1E1E] border border-white/10 hover:border-brand-yellow/60 transition-all overflow-hidden text-left shadow-2xl group"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
                                <div className="size-20 bg-brand-yellow/10 text-brand-yellow rounded-[28px] flex items-center justify-center ring-1 ring-brand-yellow/30 group-hover:scale-110 transition-transform shadow-2xl shrink-0">
                                    <Zap className="w-10 h-10 text-brand-yellow" />
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-[10px] font-black uppercase tracking-wider">
                                            Sobrevivência & Vivência Acadêmica
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setReportModalOpen(true, 'outro', { id: 'veteranos', titulo: 'IFUSP 101', local: 'Guia Interativo' });
                                            }}
                                            title="Sugerir Alteração / Reportar Erro"
                                            className="text-gray-500 hover:text-brand-red transition-colors p-1 bg-black/20 rounded-full"
                                        >
                                            <Flag size={14} />
                                        </button>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white font-bukra italic uppercase tracking-tighter mb-2 group-hover:text-brand-yellow transition-colors">
                                        IFUSP 101 & Dicas de Veteranos
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans max-w-2xl leading-relaxed">
                                        Conselhos essenciais passados de geração em geração, atalhos do campus, links rápidos para Scholar/Portal e tudo o que você precisa saber para navegar no IFUSP sem sustos.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 relative z-10 shrink-0">
                                <div className="px-8 py-4 bg-brand-yellow text-gray-900 font-black rounded-2xl group-hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-brand-yellow/20">
                                    <span>Conferir o IFUSP 101</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* 2. Card Grande: Como Pesquisar & Metodologia Científica */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative group w-full"
                    >
                        <div className="absolute -inset-0.5 bg-brand-blue/20 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Link
                            href="/wiki/metodologia"
                            className="relative flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-10 rounded-[32px] bg-[#1E1E1E] border border-white/10 hover:border-brand-blue/60 transition-all overflow-hidden text-left shadow-2xl group"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
                                <div className="size-20 bg-brand-blue/10 text-brand-blue flex items-center justify-center rounded-[28px] ring-1 ring-brand-blue/30 group-hover:scale-110 transition-transform shadow-2xl shrink-0">
                                    <Search className="w-10 h-10 text-[#00A3FF]" />
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-[#00A3FF] text-[10px] font-black uppercase tracking-wider">
                                            Metodologia & Ferramentas de Busca
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setReportModalOpen(true, 'outro', { id: 'metodologia', titulo: 'Como Pesquisar', local: 'Guia Interativo' });
                                            }}
                                            title="Sugerir Alteração / Reportar Erro"
                                            className="text-gray-500 hover:text-brand-red transition-colors p-1 bg-black/20 rounded-full"
                                        >
                                            <Flag size={14} />
                                        </button>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white font-bukra italic uppercase tracking-tighter mb-2 group-hover:text-brand-blue transition-colors">
                                        Como Pesquisar & Metodologia Científica
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans max-w-2xl leading-relaxed">
                                        Dicas práticas de como formular buscas eficientes, usar operadores booleanos, acessar Sci-Hub, Google Scholar e navegar pelas bases de dados da USP.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 relative z-10 shrink-0">
                                <div className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl group-hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-brand-blue/30">
                                    <span>Aprender a Pesquisar</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
