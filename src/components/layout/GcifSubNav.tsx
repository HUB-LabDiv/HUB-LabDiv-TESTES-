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

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Landmark, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigationStore } from '@/store/useNavigationStore';

const gcifTabs = [
    { name: 'Wiki', href: '/gcif/wiki', icon: BookOpen },
    { name: 'Instituto', href: '/gcif/instituto', icon: Landmark },
    { name: 'Interativo', href: '/gcif/interativo', icon: Sparkles },
];

export function GcifSubNav() {
    const pathname = usePathname();
    const { isSidebarCollapsed } = useNavigationStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeTabRef = useRef<HTMLAnchorElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const isActive = (href: string) => {
        if (pathname === '/gcif' && href === '/gcif/wiki') return true;
        return pathname === href || pathname.startsWith(href + '/');
    };

    const checkScroll = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const hasOverflow = el.scrollWidth > el.clientWidth + 2;
            setCanScrollLeft(el.scrollLeft > 6);
            setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
        }
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);

        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);

    // Auto-scroll para centralizar a aba ativa em telas menores
    useEffect(() => {
        if (activeTabRef.current) {
            activeTabRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
        checkScroll();
    }, [pathname, checkScroll]);

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -140, behavior: 'smooth' });
        }
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 140, behavior: 'smooth' });
        }
    };

    return (
        <nav 
            data-tour="gcif-subnav"
            className="w-full mb-6 sticky z-40 py-2 pointer-events-none"
            style={{ top: 'calc(4rem + env(safe-area-inset-top, 0px))' }}
        >
            <div className={`flex items-center justify-center transition-all duration-300 pointer-events-auto px-2 sm:px-0 ${
                isSidebarCollapsed 
                    ? 'xl:-translate-x-[calc((80px+1.5rem)/2)]' 
                    : 'xl:-translate-x-[calc((280px+1.5rem)/2)]'
            }`}>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 max-w-full">
                    {/* Left Scroll Arrow */}
                    {canScrollLeft && (
                        <button
                            onClick={handleScrollLeft}
                            className="shrink-0 p-1.5 sm:p-2 rounded-full bg-white/90 dark:bg-[#1E1E1E]/95 border border-gray-200 dark:border-white/20 text-brand-yellow hover:text-black dark:hover:text-white shadow-lg hover:scale-110 active:scale-95 transition-all backdrop-blur-md cursor-pointer"
                            title="Ver abas anteriores"
                            aria-label="Rolar para a esquerda"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    )}

                    {/* Scrollable Tabs Pill */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-1.5 sm:gap-2 p-1 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[20px] w-fit overflow-x-auto scrollbar-hide max-w-full shadow-lg scroll-smooth"
                    >
                        {gcifTabs.map((tab) => {
                            const active = isActive(tab.href);
                            const tabTourKey = tab.href.split('/').pop();
                            return (
                                <Link
                                    key={tab.href}
                                    ref={active ? activeTabRef : null}
                                    href={tab.href}
                                    data-tour={`gcif-tab-${tabTourKey}`}
                                    className={`
                                        flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-[16px] text-[8px] sm:text-[9px] font-black uppercase tracking-widest
                                        transition-all duration-300 whitespace-nowrap shrink-0
                                        ${active
                                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                                            : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span>{tab.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Scroll Arrow - Posicionada à direita do switch pílula */}
                    {canScrollRight && (
                        <button
                            onClick={handleScrollRight}
                            className="shrink-0 p-1.5 sm:p-2 rounded-full bg-white/90 dark:bg-[#1E1E1E]/95 border border-gray-200 dark:border-white/20 text-brand-yellow hover:text-black dark:hover:text-white shadow-lg hover:scale-110 active:scale-95 transition-all backdrop-blur-md animate-pulse cursor-pointer"
                            title="Ver mais abas"
                            aria-label="Rolar para a direita"
                        >
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
