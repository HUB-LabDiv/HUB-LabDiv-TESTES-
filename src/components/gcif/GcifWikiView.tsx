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
    ChevronLeft,
    ChevronRight,
    Search,
    ShieldCheck,
    Zap,
    Atom,
    CheckCircle2,
    Flag,
    PlusCircle,
    Edit3,
    Layers,
    Sparkles,
    Compass
} from 'lucide-react';
import { wikiCells, WIKI_CATEGORIES } from '@/components/wiki/WikiView';
import { ProposeWikiTopicModal } from '@/components/wiki/ProposeWikiTopicModal';
import { WikiProposalType } from '@/types/wiki';
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

    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
    const [isProposalModalOpen, setIsProposalModalOpen] = React.useState(false);
    const [proposalModalType, setProposalModalType] = React.useState<WikiProposalType>('new_topic');
    const [targetTopicId, setTargetTopicId] = React.useState<string | undefined>();
    const [targetTopicTitle, setTargetTopicTitle] = React.useState<string | undefined>();

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    React.useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [selectedCategory]);

    const filteredCells = React.useMemo(() => {
        if (selectedCategory === 'all') return wikiCells;
        return wikiCells.filter((c: any) => c.category === selectedCategory);
    }, [selectedCategory]);

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
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white font-bukra flex items-center gap-2">
                            <Atom className="w-6 h-6 text-brand-blue" />
                            Tópicos de Conhecimento
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1.5 max-w-2xl leading-relaxed">
                            Base de conhecimento viva do IFUSP dividida em 3 eixos essenciais. Navegue por sobrevivência universitária, formação científica e divulgação acadêmica.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-400 font-bold shrink-0">
                            {filteredCells.length} de {wikiCells.length} tópicos
                        </span>
                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="p-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm"
                                aria-label="Rolar para esquerda"
                                title="Rolar para esquerda"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="p-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm"
                                aria-label="Rolar para direita"
                                title="Rolar para direita"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtro por Categorias */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-bukra uppercase tracking-wider transition-all shrink-0 ${
                            selectedCategory === 'all'
                                ? 'bg-white/15 text-white border border-white/20 shadow-md'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                        }`}
                    >
                        Todos ({wikiCells.length})
                    </button>
                    {WIKI_CATEGORIES.map(cat => {
                        const count = wikiCells.filter((c: any) => c.category === cat.id).length;
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold font-bukra uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
                                    isSelected
                                        ? cat.color === 'brand-yellow'
                                            ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40'
                                            : cat.color === 'brand-red'
                                            ? 'bg-brand-red/20 text-brand-red border border-brand-red/40'
                                            : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40'
                                        : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${
                                    cat.color === 'brand-yellow' ? 'bg-brand-yellow' : cat.color === 'brand-red' ? 'bg-brand-red' : 'bg-brand-blue'
                                }`} />
                                {cat.name} ({count})
                            </button>
                        );
                    })}
                </div>

                <div 
                    ref={scrollContainerRef}
                    className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth no-scrollbar"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCells.map((cell: any, idx: number) => {
                            const colors = colorVariants[cell.color] || colorVariants['brand-blue'];
                            return (
                                <motion.div
                                    key={cell.id}
                                    layout
                                    data-tour={cell.id === 'metodologia' ? 'gcif-wiki-guias' : undefined}
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                                    className="snap-start shrink-0 w-[280px] xs:w-[290px] sm:w-[320px] md:w-auto md:shrink flex flex-col"
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

                {/* Card Final: Escrever / Propor Novo Tópico para a Wiki */}
                <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-brand-blue/10 via-[#1E1E1E] to-[#121212] border-2 border-dashed border-brand-blue/30 hover:border-brand-blue transition-all shadow-xl group mt-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 border border-brand-blue/40 text-brand-blue flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <PlusCircle className="w-7 h-7" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">
                                    Colabore com a Comunidade
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black font-bukra text-white uppercase italic tracking-tight">
                                    Escrever ou Propor Novo Tópico
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-open-sans mt-1 max-w-xl leading-relaxed">
                                    Sentiu falta de algum guia, laboratório, conselho ou conteúdo essencial? Envie sua proposta para a moderação da Wiki no Eixo de Informação.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setProposalModalType('new_topic');
                                setTargetTopicId(undefined);
                                setTargetTopicTitle(undefined);
                                setIsProposalModalOpen(true);
                            }}
                            className="px-6 py-3 rounded-2xl bg-brand-blue hover:bg-brand-blue/80 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-blue/25 flex items-center gap-2 transition-all shrink-0 hover:scale-105 active:scale-95"
                        >
                            <Edit3 className="w-4 h-4" />
                            Escrever Tópico
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Proposta / Complemento */}
            <ProposeWikiTopicModal
                isOpen={isProposalModalOpen}
                onClose={() => setIsProposalModalOpen(false)}
                initialType={proposalModalType}
                initialTopicId={targetTopicId}
                initialTopicTitle={targetTopicTitle}
            />

            {/* USP 101: Conselhos de Veteranos (Multi-Instituto) */}
            <div data-tour="gcif-wiki-usp101" className="space-y-4 pt-6 border-t border-white/10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative group w-full"
                >
                    <div className="absolute -inset-0.5 bg-brand-yellow/25 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Link
                        href="/wiki/veteranos"
                        className="relative flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-12 rounded-[32px] bg-[#1E1E1E] border border-white/10 hover:border-brand-yellow/60 transition-all overflow-hidden text-left shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="size-20 bg-brand-yellow/10 text-brand-yellow rounded-[28px] flex items-center justify-center ring-1 ring-brand-yellow/30 group-hover:scale-110 transition-transform shadow-2xl shrink-0">
                                <Compass className="w-10 h-10 text-brand-yellow" />
                            </div>
                            <div className="text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-[10px] font-black uppercase tracking-wider mb-2">
                                    <Sparkles className="w-3 h-3" />
                                    Todos os Institutos da USP • Vivência &amp; Sobrevivência
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-black text-white font-bukra italic uppercase tracking-tighter mb-2 group-hover:text-brand-yellow transition-colors">
                                    USP 101 &amp; Dicas de Veteranos
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-open-sans max-w-xl leading-relaxed">
                                    Central colaborativa de conselhos transgeracionais. Encontre ou envie macetes acadêmicos para a USP como um todo ou direcionados para o seu instituto (IFUSP, Poli, IME, IQ, FFLCH e outros).
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-0 relative z-10 shrink-0">
                            <div className="px-8 py-4 bg-brand-yellow text-gray-950 font-black rounded-2xl group-hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-brand-yellow/20">
                                <span>Explorar USP 101</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
