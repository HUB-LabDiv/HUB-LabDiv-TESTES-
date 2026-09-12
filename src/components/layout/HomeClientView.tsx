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


import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MediaCard, MediaCardProps } from "@/components/media/MediaCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { fetchSubmissions } from '@/app/actions/submissions';
import { checkUserLikes, checkUserSaves } from '@/app/actions/media';
import { useAuth } from '@/providers/AuthProvider';
import { FeaturedCarousel } from "@/components/shared/FeaturedCarousel";
import {
    Sparkles,
    ChevronLeft,
    ChevronRight,
    SearchX,
    ChevronDown,
    Zap,
    Image as ImageIcon,
    Video,
    FileText,
    BarChart,
    FolderArchive,
    Edit3,
    Plus,
    Minus,
    Flame,
    Satellite,
    Atom,
    MessageSquare,
    Palette,
    SlidersHorizontal,
    Tag,
    Building2,
    Calendar,
    RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogsView } from '@/components/comunidade/LogsView';

import { useSearch } from '@/providers/SearchProvider';
import { CATEGORIES as CATEGORY_LIST, CATEGORY_STYLES, DEFAULT_STYLE, INSTITUTES, INSTITUTE_FILTER_OPTIONS } from '@/lib/constants';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { useTelemetry } from '@/hooks/useTelemetry';
import { toast } from 'react-hot-toast';

interface HomeClientViewProps {
    initialItems: MediaCardProps[];
    initialHasMore: boolean;
    initialArteItems?: MediaCardProps[];
    initialArteHasMore?: boolean;
    initialCategory?: string;
    trendingItems?: MediaCardProps[];
    featuredItems?: MediaCardProps[];
    trendingTags?: string[];
    initialLikedIds?: string[];
    initialSavedIds?: string[];
}

export const HomeClientView = ({
    initialItems,
    initialHasMore,
    initialArteItems = [],
    initialArteHasMore = false,
    initialCategory = 'Todos',
    trendingItems = [],
    featuredItems = [],
    trendingTags = [],
    initialLikedIds = [],
    initialSavedIds = []
}: HomeClientViewProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { query: searchQuery, setQuery: setSearchQuery } = useSearch();
    const { trackEvent } = useTelemetry();

    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<'fluxo' | 'logs' | 'arte'>(
        tabParam === 'logs' ? 'logs' : tabParam === 'arte' ? 'arte' : 'fluxo'
    );

    const handleTabChange = (newTab: 'fluxo' | 'logs' | 'arte') => {
        setActiveTab(newTab);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', newTab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const [items, setItems] = useState<MediaCardProps[]>(initialItems);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [feedScope, setFeedScope] = useState<'todos' | 'seguindo'>('todos');
    
    // Arte State
    const [arteItems, setArteItems] = useState<MediaCardProps[]>(initialArteItems);
    const [artePage, setArtePage] = useState(1);
    const [arteHasMore, setArteHasMore] = useState(initialArteHasMore);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set(initialLikedIds));
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set(initialSavedIds));
    const [isSyncing, setIsSyncingState] = useState(false);
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

    const { user } = useAuth();
    const { institution } = usePersonalizacaoStore();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([initialCategory]);
    const [selectedInstitutes, setSelectedInstitutes] = useState<string[]>(['Todos']);
    const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>(['Todos']);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [activeFilterGroup, setActiveFilterGroup] = useState<'formato' | 'categoria' | 'instituto' | 'ano' | null>(null);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllYears, setShowAllYears] = useState(false);
    const swipeStartX = useRef<number | null>(null);
    const swipeStartY = useRef<number | null>(null);
    const wheelAccumulator = useRef<number>(0);
    const lastWheelTime = useRef<number>(0);
    const wheelCooldown = useRef<boolean>(false);

    const totalActiveFilters = useMemo(() => {
        let count = 0;
        if (selectedMediaTypes.length > 0) count += selectedMediaTypes.length;
        if (!selectedCategories.includes('Todos') || selectedCategories.length > 1) {
            count += selectedCategories.filter(c => c !== 'Todos').length;
        }
        if (!selectedInstitutes.includes('Todos') || selectedInstitutes.length > 1) {
            count += selectedInstitutes.filter(i => i !== 'Todos').length;
        }
        if (!selectedYears.includes('Todos') || selectedYears.length > 1) {
            count += selectedYears.filter(y => y !== 'Todos').length;
        }
        return count;
    }, [selectedMediaTypes, selectedCategories, selectedInstitutes, selectedYears]);

    const currentInstitutionInfo = useMemo(() => {
        return INSTITUTES.find(i => i.id === institution) || INSTITUTES[0];
    }, [institution]);

    const orbitItems = useMemo(() => {
        const activeInstId = institution ? institution.toLowerCase() : 'ifusp';
        const filtered = trendingItems.filter(item => {
            const postInst = (item.post.institute || 'ifusp').toLowerCase();
            return postInst === activeInstId;
        });
        if (filtered.length > 0) return filtered;
        const fallback = items.filter(item => {
            const postInst = (item.post.institute || 'ifusp').toLowerCase();
            return postInst === activeInstId;
        });
        return fallback.slice(0, 6);
    }, [trendingItems, items, institution]);

    // Trending Scroll State
    const trendingScrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (trendingScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = trendingScrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

            // Calculate active page index (0, 1, or 2)
            const page = Math.round((scrollLeft / (scrollWidth - clientWidth)) * 2);
            setActivePageIndex(page);
        }
    };

    useEffect(() => {
        const carousel = trendingScrollRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', checkScroll);
            checkScroll();
        }
        return () => {
            if (carousel) carousel.removeEventListener('scroll', checkScroll);
        };
    }, [trendingItems, orbitItems]);

    // Fetch user likes and saves on client side to populate hearts and stars
    useEffect(() => {
        if (!user) {
            setLikedIds(new Set());
            setSavedIds(new Set());
            return;
        }

        const fetchInteractions = async () => {
            const allIds = new Set<string>();
            items.forEach(i => allIds.add(i.post.id));
            trendingItems.forEach(i => allIds.add(i.post.id));
            featuredItems.forEach(i => allIds.add(i.post.id));

            const idsArray = Array.from(allIds);
            if (idsArray.length === 0) return;

            try {
                const [userLikes, userSaves] = await Promise.all([
                    checkUserLikes(idsArray),
                    checkUserSaves(idsArray)
                ]);
                setLikedIds(new Set(userLikes));
                setSavedIds(new Set(userSaves));
            } catch (err) {
                console.error("Failed to fetch interactions", err);
            }
        };

        fetchInteractions();
    }, [user, items, trendingItems, featuredItems]);

    const scrollTrending = (direction: 'left' | 'right') => {
        if (trendingScrollRef.current) {
            const offset = direction === 'left' ? -350 : 350;
            trendingScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    const categories = CATEGORY_LIST;
    const currentYear = new Date().getFullYear();
    const years = ['Todos', ...Array.from({ length: currentYear - 1934 + 1 }, (_, i) => (currentYear - i).toString())];

    const mediaTypeOptions = [
        { label: 'Imagens', value: 'image', icon: ImageIcon, color: 'brand-blue' },
        { label: 'Vídeos', value: 'video', icon: Video, color: 'brand-red' },
        { label: 'Docs (PDF)', value: 'pdf', icon: FolderArchive, color: 'brand-yellow' },
        { label: 'Notes', value: 'sdocx', icon: Edit3, color: 'brand-red' },
        { label: 'Texto', value: 'text', icon: FileText, color: 'brand-blue' },
        { label: 'Outros', value: 'other', icon: Sparkles, color: 'gray-500' },
    ];

    // Sync filters with data fetching
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchFiltered = async () => {
            setIsLoading(true);
            try {
                const res = await fetchSubmissions({
                    page: 1,
                    limit: 12,
                    query: debouncedQuery,
                    categories: selectedCategories.filter(c => c !== 'Todos'),
                    institutes: selectedInstitutes.includes('Todos') ? undefined : selectedInstitutes,
                    mediaTypes: selectedMediaTypes,
                    years: selectedYears.includes('Todos') ? undefined : selectedYears.map(y => parseInt(y)),
                    sort: 'recentes',
                    feedScope
                });
                setItems(res.items);
                setHasMore(res.hasMore);
                setPage(1);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        // Telemetry for no results
        if (!isLoading && items.length === 0 && debouncedQuery) {
            trackEvent('SEARCH_FAIL', { query: debouncedQuery });
        }

        // Don't run on mount if we already have initialItems and no custom filters
        if (
            debouncedQuery === '' &&
            selectedCategories.length === 1 && selectedCategories[0] === 'Todos' &&
            selectedInstitutes.length === 1 && selectedInstitutes[0] === 'Todos' &&
            selectedMediaTypes.length === 0 &&
            selectedYears.length === 1 && selectedYears[0] === 'Todos' &&
            feedScope === 'todos'
        ) {
            setItems(initialItems);
            setHasMore(initialHasMore);
            return;
        }

        fetchFiltered();
    }, [debouncedQuery, selectedCategories, selectedInstitutes, selectedMediaTypes, selectedYears, feedScope]);

    const loadItems = async (pageNumber: number, append = false, forceCategory = 'Todos') => {
        try {
            setIsLoading(true);
            
            if (activeTab === 'arte') {
                const result = await fetchSubmissions({
                    page: pageNumber,
                    limit: 12,
                    query: searchQuery,
                    sort: 'recentes',
                    categories: ['Arte'],
                    feedScope
                });

                if (append) {
                    setArteItems(prev => [...prev, ...result.items]);
                } else {
                    setArteItems(result.items);
                }
                setArteHasMore(result.hasMore);
                setArtePage(pageNumber);
            } else {
                const result = await fetchSubmissions({
                    page: pageNumber,
                    limit: 12,
                    query: searchQuery,
                    sort: 'recentes',
                    categories: forceCategory === 'Todos' ? (selectedCategories.includes('Todos') ? [] : selectedCategories) : [forceCategory],
                    institutes: selectedInstitutes.includes('Todos') ? undefined : selectedInstitutes,
                    mediaTypes: selectedMediaTypes,
                    years: selectedYears.includes('Todos') ? undefined : selectedYears.map(y => parseInt(y)),
                    excludeCategories: ['Arte'],
                    feedScope
                });

                if (append) {
                    setItems(prev => [...prev, ...result.items]);
                } else {
                    setItems(result.items);
                }
                setHasMore(result.hasMore);
                setPage(pageNumber);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = useCallback(() => {
        if (activeTab === 'arte') {
            if (!isLoadingMore && arteHasMore) {
                setIsLoadingMore(true);
                loadItems(artePage + 1, true).finally(() => setIsLoadingMore(false));
            }
        } else {
            if (!isLoadingMore && hasMore) {
                setIsLoadingMore(true);
                loadItems(page + 1, true).finally(() => setIsLoadingMore(false));
            }
        }
    }, [page, hasMore, isLoadingMore, activeTab, artePage, arteHasMore]);

    return (
        <div 
            className="w-full max-w-[100vw] min-h-[100dvh]"
            onTouchStart={(e) => {
                if ((e.target as Element)?.closest?.('.overflow-x-auto, .scroll-x, .masonry-item, .no-swipe, a, button, input')) return;
                const touch = e.touches[0];
                if (touch) {
                    swipeStartX.current = touch.clientX;
                    swipeStartY.current = touch.clientY;
                }
            }}
            onTouchEnd={(e) => {
                const touch = e.changedTouches[0];
                if (!touch || swipeStartX.current === null || swipeStartY.current === null) return;
                
                const deltaX = touch.clientX - swipeStartX.current;
                const deltaY = touch.clientY - swipeStartY.current;
                const threshold = 40;
                
                if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                    const tabs = ['logs', 'fluxo', 'arte'];
                    const currentIndex = tabs.indexOf(activeTab);
                    
                    if (deltaX < 0 && currentIndex < tabs.length - 1) {
                        handleTabChange(tabs[currentIndex + 1] as any);
                    } else if (deltaX > 0 && currentIndex > 0) {
                        handleTabChange(tabs[currentIndex - 1] as any);
                    }
                }
                swipeStartX.current = null;
                swipeStartY.current = null;
            }}
            onTouchCancel={() => {
                swipeStartX.current = null;
                swipeStartY.current = null;
            }}
            onWheel={(e) => {
                if ((e.target as Element).closest('.overflow-x-auto, .scroll-x')) return;

                const now = Date.now();
                if (now - lastWheelTime.current > 400) {
                    wheelAccumulator.current = 0;
                }
                lastWheelTime.current = now;

                if (wheelCooldown.current) return;

                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    wheelAccumulator.current += e.deltaX;
                    
                    if (Math.abs(wheelAccumulator.current) > 150) {
                        const tabs = ['logs', 'fluxo', 'arte'];
                        const currentIndex = tabs.indexOf(activeTab);
                        
                        if (wheelAccumulator.current > 0 && currentIndex < tabs.length - 1) {
                            handleTabChange(tabs[currentIndex + 1] as any);
                            wheelCooldown.current = true;
                            setTimeout(() => { wheelCooldown.current = false; }, 800);
                        } else if (wheelAccumulator.current < 0 && currentIndex > 0) {
                            handleTabChange(tabs[currentIndex - 1] as any);
                            wheelCooldown.current = true;
                            setTimeout(() => { wheelCooldown.current = false; }, 800);
                        }
                        wheelAccumulator.current = 0;
                    }
                } else {
                    wheelAccumulator.current = 0;
                }
            }}
        >
            <div 
                className="sticky z-40 flex justify-center mb-6 pointer-events-none"
                style={{ top: 'calc(4.5rem + env(safe-area-inset-top, 0px))' }}
            >
                <div data-tour="comunidade-subnav" className="flex p-1.5 bg-white/50 dark:bg-background-dark/40 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl pointer-events-auto">
                    <button
                        onClick={() => handleTabChange('logs')}
                        className={`relative flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[9px] sm:text-xs font-black font-bukra uppercase tracking-widest transition-all ${
                            activeTab === 'logs' ? 'text-white' : 'text-gray-500 hover:text-brand-red'
                        }`}
                    >
                        {activeTab === 'logs' && (
                            <motion.div
                                layoutId="activeTabHome"
                                className="absolute inset-0 bg-brand-red rounded-xl shadow-lg shadow-brand-red/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <MessageSquare className={`w-4 h-4 ${activeTab === 'logs' ? 'animate-bounce' : ''}`} />
                            Logs
                        </span>
                    </button>

                    <button
                        onClick={() => handleTabChange('fluxo')}
                        className={`relative flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[9px] sm:text-xs font-black font-bukra uppercase tracking-widest transition-all ${
                            activeTab === 'fluxo' ? 'text-white' : 'text-gray-500 hover:text-brand-blue'
                        }`}
                    >
                        {activeTab === 'fluxo' && (
                            <motion.div
                                layoutId="activeTabHome"
                                className="absolute inset-0 bg-brand-blue rounded-xl shadow-lg shadow-brand-blue/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <Zap className={`w-4 h-4 ${activeTab === 'fluxo' ? 'animate-pulse' : ''}`} />
                            Fluxo
                        </span>
                    </button>

                    <button
                        onClick={() => handleTabChange('arte')}
                        className={`relative flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[9px] sm:text-xs font-black font-bukra uppercase tracking-widest transition-all ${
                            activeTab === 'arte' ? 'text-white' : 'text-gray-500 hover:text-brand-yellow'
                        }`}
                    >
                        {activeTab === 'arte' && (
                            <motion.div
                                layoutId="activeTabHome"
                                className="absolute inset-0 bg-brand-yellow rounded-xl shadow-lg shadow-brand-yellow/20"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <Palette className={`w-4 h-4 ${activeTab === 'arte' ? 'animate-pulse' : ''}`} />
                            Arte
                        </span>
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'logs' ? (
                    <motion.div
                        key="logs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <LogsView />
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {activeTab === 'arte' && (
                            <div data-tour="arte-header" className="w-full mb-8 text-left space-y-8">
                                <div className="flex flex-col gap-3 relative mb-8">
                                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-yellow/5 rounded-full blur-[60px] pointer-events-none"></div>
                                    <h1 className="text-5xl font-black uppercase italic tracking-tighter text-brand-yellow flex items-center gap-4 relative z-10">
                                        <Palette className="w-12 h-12" />
                                        ARTE
                                    </h1>
                                    <p className="text-gray-400 font-medium text-sm border-l-2 border-brand-yellow pl-4 max-w-xl leading-relaxed [text-shadow:var(--text-halo)]">
                                        Espaço dedicado à expressão artística, cultura e criatividade da comunidade da Física USP.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'fluxo' && (
                            <div data-tour="fluxo-header" className="w-full mb-8 text-left space-y-8">
                                <div className="flex flex-col gap-3 relative mb-8 outline-none focus:outline-none">
                                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-blue/5 rounded-full blur-[60px] pointer-events-none"></div>
                                    <h1 className="text-5xl font-black uppercase italic tracking-tighter text-brand-blue flex items-center gap-4 relative z-10 outline-none focus:outline-none">
                                        <Zap className="w-12 h-12" />
                                        FLUXO
                                    </h1>
                                    <p className="text-gray-400 font-medium text-sm border-l-2 border-brand-blue pl-4 max-w-xl leading-relaxed [text-shadow:var(--text-halo)]">
                                        Explore as contribuições, materiais e memórias compartilhadas pela comunidade do IFUSP.
                                    </p>
                                </div>
                            </div>
                        )}


            {/* DESTAQUES (V8.0 optimized) */}
            {activeTab === 'fluxo' && featuredItems.length > 0 && !debouncedQuery && selectedCategories.includes('Todos') && (
                <section data-tour="comunidade-em-orbita" className="mb-8">
                    <FeaturedCarousel items={featuredItems} highlightQuery={searchQuery} hideTitle={true} />
                </section>
            )}

            {/* FILTROS MULTIDIMENSIONAIS (Hierárquico & Expansível) */}
            {activeTab === 'fluxo' && (
                <section data-tour="comunidade-filtros" className="relative z-10 bg-transparent py-3 mb-8">
                    {/* Linha 1: Botão Principal de Filtros e Categorias de Filtro */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Botão Gatilho Principal: [ Filtros ] */}
                        <button
                            onClick={() => {
                                setIsFilterExpanded(prev => {
                                    const next = !prev;
                                    if (!next) setActiveFilterGroup(null);
                                    return next;
                                });
                            }}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black font-bukra uppercase tracking-wider transition-all border cursor-pointer ${
                                isFilterExpanded || totalActiveFilters > 0
                                    ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20 ring-2 ring-brand-blue/20'
                                    : 'bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10 hover:border-brand-blue/40 shadow-sm'
                            }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filtros</span>
                            {totalActiveFilters > 0 && (
                                <span className="flex items-center justify-center size-5 rounded-full bg-brand-yellow text-gray-900 text-[10px] font-black font-sans ml-0.5">
                                    {totalActiveFilters}
                                </span>
                            )}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFilterExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Grupos de Filtros (Aparecem quando o botão Filtros é expandido) */}
                        <AnimatePresence>
                            {isFilterExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, x: -10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-wrap items-center gap-2"
                                >
                                    {/* 1. Formato */}
                                    <button
                                        onClick={() => setActiveFilterGroup(prev => prev === 'formato' ? null : 'formato')}
                                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold font-bukra uppercase tracking-wide transition-all border cursor-pointer ${
                                            activeFilterGroup === 'formato'
                                                ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/40 shadow-sm'
                                                : selectedMediaTypes.length > 0
                                                ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                                                : 'bg-white/80 dark:bg-[#1E1E1E]/80 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-blue/30'
                                        }`}
                                    >
                                        <Video className="w-3.5 h-3.5 text-brand-blue" />
                                        <span>Formato</span>
                                        {selectedMediaTypes.length > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-brand-blue text-white text-[9px] font-black">
                                                {selectedMediaTypes.length}
                                            </span>
                                        )}
                                        <ChevronDown className={`w-3 h-3 transition-transform ${activeFilterGroup === 'formato' ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* 2. Categorias */}
                                    <button
                                        onClick={() => setActiveFilterGroup(prev => prev === 'categoria' ? null : 'categoria')}
                                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold font-bukra uppercase tracking-wide transition-all border cursor-pointer ${
                                            activeFilterGroup === 'categoria'
                                                ? 'bg-brand-red/15 text-brand-red border-brand-red/40 shadow-sm'
                                                : selectedCategories.filter(c => c !== 'Todos').length > 0
                                                ? 'bg-brand-red/10 text-brand-red border-brand-red/20'
                                                : 'bg-white/80 dark:bg-[#1E1E1E]/80 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-red/30'
                                        }`}
                                    >
                                        <Tag className="w-3.5 h-3.5 text-brand-red" />
                                        <span>Categorias</span>
                                        {selectedCategories.filter(c => c !== 'Todos').length > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-brand-red text-white text-[9px] font-black">
                                                {selectedCategories.filter(c => c !== 'Todos').length}
                                            </span>
                                        )}
                                        <ChevronDown className={`w-3 h-3 transition-transform ${activeFilterGroup === 'categoria' ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* 3. Instituto */}
                                    <button
                                        onClick={() => setActiveFilterGroup(prev => prev === 'instituto' ? null : 'instituto')}
                                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold font-bukra uppercase tracking-wide transition-all border cursor-pointer ${
                                            activeFilterGroup === 'instituto'
                                                ? 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/40 shadow-sm'
                                                : selectedInstitutes.filter(i => i !== 'Todos').length > 0
                                                ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20'
                                                : 'bg-white/80 dark:bg-[#1E1E1E]/80 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-yellow/30'
                                        }`}
                                    >
                                        <Building2 className="w-3.5 h-3.5 text-brand-yellow" />
                                        <span>Instituto</span>
                                        {selectedInstitutes.filter(i => i !== 'Todos').length > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-brand-yellow text-gray-900 text-[9px] font-black">
                                                {selectedInstitutes.filter(i => i !== 'Todos').length}
                                            </span>
                                        )}
                                        <ChevronDown className={`w-3 h-3 transition-transform ${activeFilterGroup === 'instituto' ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* 4. Ano */}
                                    <button
                                        onClick={() => setActiveFilterGroup(prev => prev === 'ano' ? null : 'ano')}
                                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold font-bukra uppercase tracking-wide transition-all border cursor-pointer ${
                                            activeFilterGroup === 'ano'
                                                ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/40 shadow-sm'
                                                : selectedYears.filter(y => y !== 'Todos').length > 0
                                                ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                                                : 'bg-white/80 dark:bg-[#1E1E1E]/80 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-blue/30'
                                        }`}
                                    >
                                        <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                                        <span>Ano</span>
                                        {selectedYears.filter(y => y !== 'Todos').length > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-brand-blue text-white text-[9px] font-black">
                                                {selectedYears.filter(y => y !== 'Todos').length}
                                            </span>
                                        )}
                                        <ChevronDown className={`w-3 h-3 transition-transform ${activeFilterGroup === 'ano' ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Botão Limpar Filtros se houver algum ativo */}
                                    {totalActiveFilters > 0 && (
                                        <button
                                            onClick={() => {
                                                setSelectedMediaTypes([]);
                                                setSelectedCategories(['Todos']);
                                                setSelectedInstitutes(['Todos']);
                                                setSelectedYears(['Todos']);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold font-bukra uppercase tracking-wider text-gray-500 hover:text-brand-red hover:bg-brand-red/10 transition-all border border-transparent hover:border-brand-red/20 cursor-pointer"
                                            title="Limpar todos os filtros ativos"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            <span>Limpar</span>
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Linha 2: Gaveta com as Opções do Grupo Ativo Selecionado */}
                    <AnimatePresence>
                        {isFilterExpanded && activeFilterGroup && (
                            <motion.div
                                key={activeFilterGroup}
                                initial={{ opacity: 0, height: 0, y: -8 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -8 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="overflow-hidden mt-3 p-4 bg-white/80 dark:bg-[#1E1E1E]/90 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg"
                            >
                                {/* Opções: FORMATO */}
                                {activeFilterGroup === 'formato' && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bukra font-bold uppercase tracking-widest text-brand-blue">
                                            Selecione o Formato de Mídia:
                                        </span>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {mediaTypeOptions.map((option) => {
                                                const isActive = selectedMediaTypes.includes(option.value);
                                                const Icon = option.icon;
                                                const activeColor = option.color;
                                                const activeBgClass = 
                                                    activeColor === 'brand-yellow' 
                                                        ? 'bg-brand-yellow text-black border-brand-yellow shadow-md ring-2 ring-brand-yellow/20 font-black' 
                                                        : activeColor === 'brand-red' 
                                                        ? 'bg-brand-red text-white border-brand-red shadow-md ring-2 ring-brand-red/20 font-black' 
                                                        : activeColor === 'brand-blue'
                                                        ? 'bg-brand-blue text-white border-brand-blue shadow-md ring-2 ring-brand-blue/20 font-black'
                                                        : 'bg-gray-500 text-white border-gray-500 shadow-md ring-2 ring-gray-500/20 font-black';
                                                return (
                                                    <button
                                                        key={option.label}
                                                        onClick={() => setSelectedMediaTypes(isActive ? prev => prev.filter(t => t !== option.value) : prev => [...prev, option.value])}
                                                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-bukra uppercase tracking-wider transition-all border cursor-pointer ${isActive ? activeBgClass : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-blue/40'}`}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" />
                                                        {option.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Opções: CATEGORIAS */}
                                {activeFilterGroup === 'categoria' && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bukra font-bold uppercase tracking-widest text-brand-red">
                                            Selecione as Categorias:
                                        </span>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {(showAllCategories ? categories : categories.slice(0, 8)).map((c) => {
                                                const isActive = selectedCategories.includes(c);
                                                return (
                                                    <button
                                                        key={c}
                                                        onClick={() => {
                                                            setSelectedCategories(prev => {
                                                                if (c === 'Todos') return ['Todos'];
                                                                const filtered = prev.filter(item => item !== 'Todos');
                                                                if (isActive) {
                                                                    const next = filtered.filter(item => item !== c);
                                                                    return next.length === 0 ? ['Todos'] : next;
                                                                }
                                                                return [...filtered, c];
                                                            });
                                                        }}
                                                        className={`px-3.5 py-2 rounded-xl text-[10px] font-bukra uppercase tracking-wider transition-all border cursor-pointer ${isActive ? (CATEGORY_STYLES[c]?.filterActive || DEFAULT_STYLE.filterActive) : (CATEGORY_STYLES[c]?.filterInactive || DEFAULT_STYLE.filterInactive)}`}
                                                    >
                                                        {c}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => setShowAllCategories(!showAllCategories)}
                                                className="px-3.5 py-2 rounded-xl text-[10px] font-bukra uppercase tracking-wider bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 hover:text-brand-blue transition-all flex items-center gap-1 border border-gray-200 dark:border-white/10 cursor-pointer"
                                            >
                                                {showAllCategories ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                {showAllCategories ? 'Menos' : 'Mais'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Opções: INSTITUTO */}
                                {activeFilterGroup === 'instituto' && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bukra font-bold uppercase tracking-widest text-brand-yellow">
                                            Selecione o Instituto:
                                        </span>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {INSTITUTE_FILTER_OPTIONS.map((inst, idx) => {
                                                const isActive = selectedInstitutes.includes(inst);
                                                const filterColors = ['brand-blue', 'brand-yellow', 'brand-red'];
                                                const activeColor = inst === 'Todos' ? 'brand-blue' : filterColors[idx % filterColors.length];
                                                const activeBgClass = 
                                                    activeColor === 'brand-yellow' 
                                                        ? 'bg-brand-yellow text-black border-brand-yellow shadow-md ring-2 ring-brand-yellow/20 font-black' 
                                                        : activeColor === 'brand-red' 
                                                        ? 'bg-brand-red text-white border-brand-red shadow-md ring-2 ring-brand-red/20 font-black' 
                                                        : 'bg-brand-blue text-white border-brand-blue shadow-md ring-2 ring-brand-blue/20 font-black';
                                                return (
                                                    <button
                                                        key={inst}
                                                        onClick={() => {
                                                            setSelectedInstitutes(prev => {
                                                                if (inst === 'Todos') return ['Todos'];
                                                                const filtered = prev.filter(item => item !== 'Todos');
                                                                if (isActive) {
                                                                    const next = filtered.filter(item => item !== inst);
                                                                    return next.length === 0 ? ['Todos'] : next;
                                                                }
                                                                return [...filtered, inst];
                                                            });
                                                        }}
                                                        className={`px-3.5 py-2 rounded-xl text-[10px] font-bukra uppercase tracking-wider transition-all border cursor-pointer ${isActive ? activeBgClass : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-yellow/40'}`}
                                                    >
                                                        {inst}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Opções: ANO */}
                                {activeFilterGroup === 'ano' && (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bukra font-bold uppercase tracking-widest text-brand-blue">
                                            Selecione o Ano de Publicação:
                                        </span>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {(showAllYears ? years : years.slice(0, 10)).map((y, idx) => {
                                                const isActive = selectedYears.includes(y);
                                                const filterColors = ['brand-blue', 'brand-yellow', 'brand-red'];
                                                const activeColor = y === 'Todos' ? 'brand-blue' : filterColors[idx % filterColors.length];
                                                const activeBgClass = 
                                                    activeColor === 'brand-yellow' 
                                                        ? 'bg-brand-yellow text-black border-brand-yellow shadow-md ring-2 ring-brand-yellow/20 font-black' 
                                                        : activeColor === 'brand-red' 
                                                        ? 'bg-brand-red text-white border-brand-red shadow-md ring-2 ring-brand-red/20 font-black' 
                                                        : 'bg-brand-blue text-white border-brand-blue shadow-md ring-2 ring-brand-blue/20 font-black';
                                                return (
                                                    <button
                                                        key={y}
                                                        onClick={() => {
                                                            setSelectedYears(prev => {
                                                                if (y === 'Todos') return ['Todos'];
                                                                const filtered = prev.filter(item => item !== 'Todos');
                                                                if (isActive) {
                                                                    const next = filtered.filter(item => item !== y);
                                                                    return next.length === 0 ? ['Todos'] : next;
                                                                }
                                                                return [...filtered, y];
                                                            });
                                                        }}
                                                        className={`px-3.5 py-2 rounded-xl text-[10px] font-bukra uppercase tracking-wider transition-all border cursor-pointer ${isActive ? activeBgClass : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-blue/40'}`}
                                                    >
                                                        {y}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => setShowAllYears(!showAllYears)}
                                                className="px-3.5 py-2 rounded-xl text-[10px] font-bukra uppercase tracking-wider bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 hover:text-brand-blue transition-all flex items-center gap-1 border border-gray-200 dark:border-white/10 cursor-pointer"
                                            >
                                                {showAllYears ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                {showAllYears ? 'Menos' : 'Mais'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            )}

            {/* EM ÓRBITA NO [INSTITUTO] (Trending Horizontal dinâmico) */}
            {activeTab === 'fluxo' && !debouncedQuery && selectedCategories.includes('Todos') && selectedInstitutes.includes('Todos') && orbitItems.length > 0 && (
                <section data-tour="comunidade-em-orbita" className="w-full py-8 bg-white dark:bg-card-dark rounded-[40px] border border-gray-100 dark:border-gray-800/50 shadow-sm mb-12">
                    <div className="px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                                    <Satellite className="w-5 h-5 text-brand-blue" />
                                    Em Órbita no <span className="text-brand-blue">{currentInstitutionInfo.name}</span>
                                </h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Contribuições em destaque na comunidade do {currentInstitutionInfo.name}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* PONTO DE NAVEGAÇÃO COLORIDO */}
                                <div className="flex gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-card-dark/50 backdrop-blur-md border border-gray-100 dark:border-gray-800/50">
                                    {[0, 1, 2].map((i) => {
                                        const isActive = activePageIndex === i;
                                        const colors = ['bg-brand-yellow', 'bg-brand-blue', 'bg-brand-red'];
                                        return (
                                            <div
                                                key={i}
                                                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${isActive ? `${colors[i]} scale-125 shadow-lg brightness-110` : 'bg-gray-300 dark:bg-gray-600 opacity-40 scale-90'}`}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => scrollTrending('left')}
                                        className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-brand-blue hover:text-white transition-all disabled:opacity-20"
                                        disabled={!canScrollLeft}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => scrollTrending('right')}
                                        className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-brand-blue hover:text-white transition-all disabled:opacity-20"
                                        disabled={!canScrollRight}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={trendingScrollRef}
                            className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
                        >
                            {orbitItems.map((item, index) => (
                                <div
                                    key={item.post.id}
                                    className="min-w-[280px] md:min-w-[320px] snap-start"
                                >
                                    <MediaCard post={item.post} priority={false} isLikedByUser={likedIds.has(item.post.id)} isSavedByUser={savedIds.has(item.post.id)} highlightQuery={searchQuery} setIsSyncing={setIsSyncing} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* TOGGLE SEGUINDO VS TODOS */}
            <div className="flex justify-center mb-6">
                <div className="flex p-1 bg-white/50 dark:bg-card-dark/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full shadow-sm">
                    <button
                        onClick={() => {
                            if (!user) {
                                toast.error('Faça login para ver as publicações de quem você segue!');
                                return;
                            }
                            setFeedScope('todos');
                        }}
                        className={`relative px-5 py-2 rounded-full text-[10px] sm:text-xs font-black font-bukra uppercase tracking-widest transition-all ${
                            feedScope === 'todos' 
                                ? 'text-white' 
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {feedScope === 'todos' && (
                            <motion.div
                                layoutId="feedScope"
                                className={`absolute inset-0 rounded-full shadow-lg ${activeTab === 'fluxo' ? 'bg-brand-blue shadow-brand-blue/20' : 'bg-brand-yellow text-black shadow-brand-yellow/20'}`}
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={`relative z-10 ${feedScope === 'todos' && activeTab === 'arte' ? 'text-black' : ''}`}>Explorar Todos</span>
                    </button>

                    <button
                        onClick={() => {
                            if (!user) {
                                toast.error('Faça login para ver as publicações de quem você segue!');
                                return;
                            }
                            setFeedScope('seguindo');
                        }}
                        className={`relative px-5 py-2 rounded-full text-[10px] sm:text-xs font-black font-bukra uppercase tracking-widest transition-all ${
                            feedScope === 'seguindo' 
                                ? 'text-white' 
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {feedScope === 'seguindo' && (
                            <motion.div
                                layoutId="feedScope"
                                className={`absolute inset-0 rounded-full shadow-lg ${activeTab === 'fluxo' ? 'bg-brand-blue shadow-brand-blue/20' : 'bg-brand-yellow text-black shadow-brand-yellow/20'}`}
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={`relative z-10 ${feedScope === 'seguindo' && activeTab === 'arte' ? 'text-black' : ''}`}>Seguindo</span>
                    </button>
                </div>
            </div>

            {/* FEED PRINCIPAL */}
            <div data-tour="comunidade-feed-vertical" className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 min-h-[600px]">
                {(activeTab === 'arte' ? arteItems : items).length > 0 ? (
                    (activeTab === 'arte' ? arteItems : items).map((item, index) => {
                        const isAboveFold = index < 2;

                        if (isAboveFold) {
                            return (
                                <div key={item.post.id}>
                                    <MediaCard
                                        post={item.post}
                                        priority={true}
                                        isLikedByUser={likedIds.has(item.post.id)}
                                        isSavedByUser={savedIds.has(item.post.id)}
                                        highlightQuery={searchQuery}
                                        setIsSyncing={setIsSyncing}
                                    />
                                </div>
                            );
                        }

                        return (
                            <div
                                key={item.post.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${(index % 6) * 0.1}s` }}
                            >
                                <MediaCard
                                    post={item.post}
                                    priority={false}
                                    isLikedByUser={likedIds.has(item.post.id)}
                                    isSavedByUser={savedIds.has(item.post.id)}
                                    highlightQuery={searchQuery}
                                    setIsSyncing={setIsSyncing}
                                />
                            </div>
                        );
                    })
                ) : !isLoading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <SearchX className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-xl font-bold text-gray-400">Nenhum rastro encontrado...</p>
                        <button onClick={() => { setSearchQuery(''); setSelectedCategories(['Todos']); setSelectedMediaTypes([]); }} className="mt-4 text-brand-blue font-bold">Limpar Filtros</button>
                    </div>
                ) : null}

                {/* Skeletons for Load More */}
                {(isLoading || isLoadingMore) && (
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}
            </div>

            {(activeTab === 'arte' ? arteHasMore : hasMore) && !isLoading && !isLoadingMore && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="group relative px-10 py-4 bg-brand-blue text-white rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Zap className="w-5 h-5 fill-current" />
                            Expandir Acervo
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue to-brand-blue translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-30" />
                    </button>
                </div>
            )}

            {/* Sincronizador Atômico (Canto Superior Direito) */}
            <AnimatePresence>
                {isSyncing && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        className="fixed top-24 right-6 z-[200] bg-background-dark/80 backdrop-blur-xl border border-brand-blue-accent/30 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(31,159,207,0.15)]"
                    >
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-brand-blue-accent/30 rounded-full"
                            />
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="w-2 h-2 bg-brand-blue-accent rounded-full shadow-[0_0_10px_#1F9FCF]"
                                />
                                <Atom className="absolute -top-3 -left-3 w-8 h-8 text-white/10 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex flex-col pr-2">
                            <h2 className="text-[10px] font-black font-mono text-white uppercase tracking-[0.2em]">
                                Sinc_Atômico
                            </h2>
                            <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest leading-none">
                                Atualizando_Comunidade_IFUSP...
                            </p>
                        </div>

                        {/* Barra de Carregamento (4s) */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 4, ease: "linear" }}
                                className="h-full bg-brand-blue-accent shadow-[0_0_10px_#1F9FCF]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

