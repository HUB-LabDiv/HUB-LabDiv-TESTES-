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


import React from 'react';
import Link from 'next/link';
import { Header } from './Header';
import { Footer } from './Footer';
import { SidebarLeft } from './SidebarLeft';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useAuth } from '@/providers/AuthProvider';
import { ContentReportModal } from '../modals/ContentReportModal';
import { ReportModal } from '../feedback/ReportModal';

import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { OnboardingBanner } from '../onboarding/OnboardingBanner';
import { PullToRefreshWrapper } from '@/components/ui/PullToRefreshWrapper';

interface MainLayoutWrapperProps {
    children: React.ReactNode;
    focusMode?: boolean;
    wide?: boolean; // New prop for broader layouts
    fullWidth?: boolean; // New prop for edge-to-edge fluid layouts
    userId?: string;
    rightSidebar?: React.ReactNode;
    hideHeader?: boolean;
}

/**
 * Standardized structure for V4.0 Golden Master pages.
 * Ensures consistent padding, header, and footer mounting.
 */
export function MainLayoutWrapper({ children, focusMode = false, wide = true, fullWidth = false, userId, rightSidebar, hideHeader = false }: MainLayoutWrapperProps) {
    const { 
        isSidebarCollapsed, 
        isRightSidebarCollapsed, 
        setRightSidebarCollapsed,
        isReportModalOpen,
        setReportModalOpen
    } = useNavigationStore();
    const { profile } = useAuth();
    const { institution } = usePersonalizacaoStore();

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-institution', institution);
            if (document.body) {
                document.body.setAttribute('data-institution', institution);
            }
        }
    }, [institution]);

    // Left Sidebar é oculta em < xl (1280px). Quando visível (xl+): 80px (recolhida) ou 280px (expandida)
    const leftPaddingClass = isSidebarCollapsed 
        ? 'xl:pl-[calc(80px+1.5rem)]' 
        : 'xl:pl-[calc(280px+1.5rem)]';

    // Right Sidebar é oculta em < lg (1024px). Quando presente e visível (lg+): 80px (recolhida) ou 320px (expandida)
    const rightPaddingClass = rightSidebar 
        ? (isRightSidebarCollapsed ? 'lg:pr-[calc(80px+1.5rem)]' : 'lg:pr-[calc(320px+1.5rem)]') 
        : '';

    return (
        <PullToRefreshWrapper>
        <div className="min-h-screen bg-transparent font-sans text-gray-900 dark:text-gray-100 flex flex-col overflow-x-clip">
            {!hideHeader && <Header />}

            {!focusMode ? (
                <div className="flex-1 w-full flex relative">
                    {/* Left Sidebar — fixada na borda esquerda do viewport */}
                    <aside
                        className={`hidden xl:flex flex-col fixed left-0 top-20 ${isSidebarCollapsed ? 'w-20' : 'w-[280px]'} h-[calc(100vh-5rem)] border-r border-gray-200 dark:border-gray-800 bg-transparent overflow-y-auto hidden-scrollbar transition-all duration-300 z-30`}
                    >
                        <SidebarLeft userId={userId} />
                    </aside>

                    {/* Right Sidebar — fixada na borda direita do viewport apenas se rightSidebar for fornecido */}
                    {Boolean(rightSidebar) && (
                        <aside
                            className={`hidden lg:flex flex-col fixed right-0 top-20 ${isRightSidebarCollapsed ? 'w-20' : 'w-[320px]'} h-[calc(100vh-5rem)] border-l border-gray-200 dark:border-gray-800 bg-transparent overflow-y-auto hidden-scrollbar transition-all duration-300 z-30`}
                        >
                            <div className={`p-4 ${isRightSidebarCollapsed ? 'flex flex-col items-center' : 'lg:pt-8'}`}>
                                {/* Toggle Button for Right Sidebar */}
                                <div className={`flex items-center ${isRightSidebarCollapsed ? 'justify-center' : 'justify-start'} mb-4`}>
                                    <button
                                        onClick={() => setRightSidebarCollapsed(!isRightSidebarCollapsed)}
                                        className="p-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-400 hover:text-brand-blue transition-all shadow-sm group"
                                        title={isRightSidebarCollapsed ? "Expandir" : "Recolher"}
                                    >
                                        {isRightSidebarCollapsed ? <ChevronLeft size={16} className="group-hover:scale-110 transition-transform" /> : <ChevronRight size={16} className="group-hover:scale-110 transition-transform" />}
                                    </button>
                                </div>

                                {!isRightSidebarCollapsed && (
                                    <div className="py-2">
                                        {rightSidebar}
                                    </div>
                                )}
                            </div>
                        </aside>
                    )}

                    {/* Content Area — com padding lateral responsivo CSS para não sobrepor sidebars */}
                    <main
                        className={`flex-1 min-w-0 w-full pt-20 pb-28 xl:pb-12 transition-all duration-300 px-4 sm:px-6 ${leftPaddingClass} ${rightPaddingClass}`}
                        style={{ paddingBottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))' }}
                    >
                        <div className="w-full flex flex-col min-h-full">
                            <OnboardingBanner />
                            <div className="flex-1">
                                {children}
                            </div>
                            <Footer />
                        </div>
                    </main>
                </div>
            ) : (
                <main 
                    className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-28 xl:pb-12"
                    style={{ paddingBottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))' }}
                >
                    <div className="w-full flex flex-col min-h-full">
                        <OnboardingBanner />
                        {children}
                    </div>
                </main>
            )}

            <BottomNavBar />

            {/* Nova Submissão FAB (Desktop Only — xl+) */}
            {!focusMode && (profile?.is_adult === true || profile?.user_category === 'pesquisador' || profile?.user_category === 'docente_pesquisador') && (
                <Link
                    href="/enviar"
                    data-tour="desktop-fab-enviar"
                    className="hidden xl:flex fixed bottom-8 right-8 z-[60] bg-brand-blue hover:bg-brand-blue-hover text-white px-6 h-14 rounded-full shadow-2xl items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all group border border-white/10"
                    title="Lançar à Órbita"
                >
                    <span className="material-symbols-outlined text-2xl group-hover:-translate-y-1 transition-transform">rocket_launch</span>
                    <span className="font-bold text-sm tracking-wide">Lançar à Órbita</span>
                </Link>
            )}

            {/* Modais Globais */}
            <ContentReportModal />
            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setReportModalOpen(false)} 
            />
        </div>
        </PullToRefreshWrapper>
    );
}
