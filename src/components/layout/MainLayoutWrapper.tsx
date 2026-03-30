'use client';

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

interface MainLayoutWrapperProps {
    children: React.ReactNode;
    focusMode?: boolean;
    wide?: boolean; // New prop for broader layouts
    fullWidth?: boolean; // New prop for edge-to-edge fluid layouts
    userId?: string;
    rightSidebar?: React.ReactNode;
}

/**
 * Standardized structure for V4.0 Golden Master pages.
 * Ensures consistent padding, header, and footer mounting.
 */
export function MainLayoutWrapper({ children, focusMode = false, wide = false, fullWidth = false, userId, rightSidebar }: MainLayoutWrapperProps) {
    const { 
        isSidebarCollapsed, 
        isRightSidebarCollapsed, 
        setRightSidebarCollapsed,
        isReportModalOpen,
        setReportModalOpen
    } = useNavigationStore();
    const { profile } = useAuth();

    return (
        <div className="min-h-screen bg-transparent font-sans text-gray-900 dark:text-gray-100 flex flex-col">
            <Header />

            {!focusMode ? (
                <div className="flex-1 w-full max-w-[1920px] mx-auto flex justify-center">
                    {/* Left Sidebar (Desktop) */}
                    <aside className={`hidden xl:block ${isSidebarCollapsed ? 'w-20' : 'w-[280px]'} shrink-0 border-r border-gray-200 dark:border-gray-800 bg-transparent sticky top-20 mt-20 h-[calc(100vh-5rem)] self-start overflow-y-auto hidden-scrollbar transition-all duration-300`}>
                        <SidebarLeft userId={userId} />
                    </aside>

                    {/* Content Area */}
                    <main className={`flex-1 min-w-0 ${fullWidth ? 'max-w-full' : wide ? 'max-w-[1400px]' : 'max-w-[800px]'} w-full px-4 sm:px-6 pt-20 pb-8 lg:pb-12 transition-all duration-500`}>
                        {children}
                    </main>

                    {/* Right Sidebar */}
                    <aside className={`hidden lg:block ${isRightSidebarCollapsed ? 'w-20' : 'w-[320px]'} shrink-0 border-l border-gray-200 dark:border-gray-800 bg-transparent sticky top-20 mt-20 h-[calc(100vh-5rem)] overflow-y-auto hidden-scrollbar self-start transition-all duration-300`}>
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
                </div>
            ) : (
                <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {children}
                </main>
            )}

            {!focusMode && <Footer />}
            <BottomNavBar />

            {/* Nova Submissão FAB (Desktop Only — xl+) */}
            {!focusMode && profile?.is_adult === true && (
                <Link
                    href="/enviar"
                    className="hidden xl:flex fixed bottom-8 right-8 z-[60] bg-brand-blue text-white px-6 h-14 rounded-full shadow-2xl items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all group border border-white/10"
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
    );
}
