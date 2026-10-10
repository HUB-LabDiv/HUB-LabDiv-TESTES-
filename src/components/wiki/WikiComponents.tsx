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
import { m } from 'framer-motion';
import Link from 'next/link';
import {
    ChevronRight,
    ArrowLeft,
    Clock
} from 'lucide-react';

// --- ELITE COMPONENTS ---

export interface BreadcrumbsProps {
    slug?: string;
    title: React.ReactNode;
    section?: React.ReactNode;
    sectionHref?: string;
    backHref?: string;
}

export const Breadcrumbs = ({ 
    title, 
    section = 'Wiki Hub', 
    sectionHref = '/gcif#wiki-hub-section', 
    backHref = '/gcif' 
}: BreadcrumbsProps) => (
    <nav className="flex items-center gap-2 text-xs font-bold font-bukra uppercase tracking-[0.2em] mb-8 text-gray-400 dark:text-gray-400 flex-wrap">
        <Link href={backHref} className="flex items-center gap-2 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full mr-4 text-brand-blue hover:bg-brand-blue/10">
            <ArrowLeft className="w-3 h-3" />
            <span>Voltar ao GCIF</span>
        </Link>
        <Link href={sectionHref} className="hover:text-brand-blue transition-colors">{section}</Link>
        <ChevronRight className="w-3 h-3 text-black/20 dark:text-white/20" />
        <span className="text-brand-blue italic">{title}</span>
    </nav>
);

export const TechnicalAccordion = ({ title, children }: { title: React.ReactNode, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden mb-4 bg-gray-50 dark:bg-white/2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
            >
                <span className="text-sm font-black font-bukra uppercase tracking-wider text-gray-800 dark:text-gray-200">{title}</span>
                <ChevronRight className={`w-5 h-5 text-brand-blue transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            <m.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div className="px-8 pb-8 text-gray-700 dark:text-gray-400 text-sm leading-relaxed font-medium">
                    {children}
                </div>
            </m.div>
        </div>
    );
};

export const DataCard = ({ label, value, icon, color = 'brand-blue' }: { label: string, value: string, icon?: React.ReactNode, color?: string }) => {
    const isRed = color === 'brand-red';
    const isYellow = color === 'brand-yellow';

    const iconStyles = isRed
        ? 'bg-brand-red/10 text-brand-red border border-brand-red/20'
        : isYellow
            ? 'bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20'
            : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20';

    const hoverBorder = isRed
        ? 'hover:border-brand-red/40'
        : isYellow
            ? 'hover:border-brand-yellow/40'
            : 'hover:border-brand-blue/40';

    return (
        <div className={`p-6 rounded-[32px] bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl ${hoverBorder} group transition-all`}>
            <div className="flex items-center gap-4 mb-3">
                <div className={`size-10 rounded-2xl ${iconStyles} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                    {icon || <Clock className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-black font-bukra uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {label}
                </span>
            </div>
            <div className="text-xl font-black font-bukra text-gray-900 dark:text-white italic tracking-tighter pl-1">
                {value}
            </div>
        </div>
    );
};

export const ActionButton = ({ label, icon, href, variant = 'primary', color = 'brand-blue' }: { label: string, icon: React.ReactNode, href: string, variant?: 'primary' | 'secondary', color?: string }) => {
    const isExternal = href.startsWith('http');
    const colorClass = color.startsWith('#') ? `bg-[${color}]` : `bg-${color}`;
    const shadowClass = color.startsWith('#') ? `shadow-[${color}]/20` : `shadow-${color}/20`;

    return (
        <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-[24px] font-black font-bukra text-xs uppercase tracking-wider transition-all active:scale-95 ${variant === 'primary'
                ? `${colorClass} text-white shadow-xl ${shadowClass} hover:scale-105`
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
        >
            {icon}
            {label}
        </Link>
    );
};

export const ContentSection = ({ title, children, color = 'brand-blue' }: { title: React.ReactNode, children: React.ReactNode, color?: string }) => (
    <section className="mb-16">
        <h2 className="text-3xl font-black font-bukra text-gray-900 dark:text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <div className={`h-8 w-1.5 ${color.startsWith('#') ? `bg-[${color}]` : `bg-${color}`} rounded-full`} />
            {title}
        </h2>
        <div className="space-y-6">
            {children}
        </div>
    </section>
);
