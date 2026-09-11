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


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/app/actions/auth';
import { getAvatarUrl } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';
import { ReportModal } from '../feedback/ReportModal';
import { SearchOverlay } from './SearchOverlay';
import { useTheme } from '@/hooks/useTheme';
import { useNavigationStore } from '@/store/useNavigationStore';
import { Avatar } from "@/components/ui/Avatar";
import { UserMinimalDTO } from '@/types/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useTelemetry } from '@/hooks/useTelemetry';
import { IFUSPLogo } from '../icons/IFUSPLogo';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { CacheManagerModal } from '../pwa/CacheManagerModal';
import { useUserRoleNavigation } from '@/hooks/useUserRoleNavigation';

/**
 * V8.0 Header - Fort Knox Edition
 * Implements Layer Isolation, Strict Typing, and Sharded Navigation State.
 */
export function Header() {
    const { trackEvent } = useTelemetry();
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { institution } = usePersonalizacaoStore();

    // Sharded UI State (V8.0 Navigation Store)
    const {
        isProfileMenuOpen,
        setProfileMenuOpen,
        isReportModalOpen,
        setReportModalOpen,
        closeAll
    } = useNavigationStore();

    const [user, setUser] = useState<UserMinimalDTO | null>(null);
    const { user: authUser } = useAuth();
    const { navbarThirdAxis } = useUserRoleNavigation();
    const [isSearchOverlayOpen, setSearchOverlayOpen] = useState(false);
    const [isCacheModalOpen, setCacheModalOpen] = useState(false);

    // Handle Clicks Outside (Profile menu only)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#profile-menu-container')) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [setProfileMenuOpen]);

    // Sync with AuthProvider — no duplicate auth calls
    useEffect(() => {
        if (!authUser) {
            setUser(null);
            return;
        }
        const baseUser: UserMinimalDTO = {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || 'Usuário',
            avatar_url: authUser.user_metadata?.avatar_url,
            email: authUser.email || '',
        };
        setUser(baseUser);
        supabase
            .from('profiles')
            .select('xp, level, avatar_url, full_name, username, use_nickname, is_labdiv')
            .eq('id', authUser.id)
            .single()
            .then(({ data: profile }) => {
                if (profile) {
                    setUser(prev => prev ? {
                        ...prev,
                        full_name: (profile.use_nickname && profile.username)
                            ? profile.username
                            : (profile.full_name || prev.full_name),
                        avatar_url: profile.avatar_url || prev.avatar_url,
                        xp: profile.xp || 0,
                        level: profile.level || 1,
                        is_labdiv: profile.is_labdiv || false,
                    } : prev);
                }
            });
    }, [authUser]);

    // Close all menus on route change
    useEffect(() => {
        closeAll();
    }, [pathname, closeAll]);

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 bg-white/30 dark:bg-background-dark/30 backdrop-blur-md border-b border-white/20 dark:border-white/10 z-50 transition-colors pwa-header shadow-sm"
                style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
            >
                <div className="max-w-[1800px] mx-auto h-16 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
                    {/* Left: Branding */}
                    <Link href="/" data-tour="logo-home" className="flex items-center gap-1.5 sm:gap-3 group shrink-0" onClick={closeAll}>
                        <div className="flex items-center gap-1.5 sm:gap-3">
                            <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                <div className="absolute -inset-1 bg-gradient-brand rounded-lg blur opacity-0 group-hover:opacity-40 transition-opacity animate-premium-glow"></div>
                                <Image
                                    src="/icone-HUBLabDiv.svg"
                                    alt="HUB LabDiv Logo"
                                    width={36}
                                    height={36}
                                    className="relative w-full h-full object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col -space-y-1">
                                <div className="text-base sm:text-xl font-bukra font-bold tracking-tight flex items-baseline gap-1 sm:gap-1.5 leading-tight">
                                    <span className="text-gray-900 dark:text-white uppercase">HUB</span>
                                    <span className="text-gradient-brand font-black">LabDiv</span>
                                    <div className="hidden sm:flex items-center opacity-90">
                                        <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-blue/10 dark:bg-white/10 text-brand-blue dark:text-gray-400 ml-1">BETA</span>
                                    </div>
                                </div>
                                <span className="text-[6px] sm:text-[9px] font-bukra font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                    {institution === 'ime' ? 'IME-USP' : institution === 'iag' ? 'IAG-USP' : institution === 'igc' ? 'IGC-USP' : institution === 'io' ? 'IO-USP' : 'IFUSP'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2.5 ml-0 sm:ml-1 scale-75 sm:scale-100 origin-left">
                                <div className="w-px h-5 sm:h-7 bg-gray-200 dark:bg-white/15"></div>
                                {institution === 'ime' ? (
                                    <Image 
                                        src="/instituto_de_matemtica_e_estatstica_universidade_de_so_paulo_ime_usp_logo.jpeg"
                                        alt="IME USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-white/15"
                                        priority
                                    />
                                ) : institution === 'iag' ? (
                                    <Image 
                                        src="/2oj0z6xd_400x400.jpg"
                                        alt="IAG USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-white/15"
                                        priority
                                    />
                                ) : institution === 'igc' ? (
                                    <Image 
                                        src="/unnamed.jpg"
                                        alt="IGC USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-white/15"
                                        priority
                                    />
                                ) : institution === 'io' ? (
                                    <Image 
                                        src="/image.png"
                                        alt="IO USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-white/15"
                                        priority
                                    />
                                ) : (
                                    <IFUSPLogo size={42} className="text-brand-blue dark:text-brand-blue-accent transition-opacity" />
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Middle: Nav Tabs + Search (The Notch) - Hardened V8.1 with Static Centering */}
                    <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 top-0 z-50">
                        <div className="bg-[#0F4780] rounded-b-[24px] px-8 py-3 flex items-center gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-x border-b border-white/10 backdrop-blur-xl transition-colors duration-300">
                            {[
                                { label: 'Social', href: '/', color: '#38BDF8', dataTour: 'navbar-eixo-comunidade' },
                                { label: 'Informativo', href: '/gcif', color: '#F14343', dataTour: 'navbar-eixo-cgif' },
                                navbarThirdAxis,
                                { label: 'Interações', href: '/interacao', color: '#38BDF8', dataTour: 'navbar-eixo-interacoes' },
                            ].map((tab) => {
                                const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
                                
                                return (
                                    <Link
                                        key={tab.href}
                                        href={tab.href}
                                        data-tour={tab.dataTour}
                                        className={`px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all whitespace-nowrap relative group/tab border border-transparent ${
                                            isActive
                                                ? `text-white bg-white/10 border-white/10 ring-1 ring-inset ${tab.color === 'white' ? 'ring-white/30' : `ring-[${tab.color}]/50`}`
                                                : `text-white/60 hover:bg-white/5`
                                        }`}
                                        style={{ 
                                            color: isActive ? tab.color : undefined,
                                            ['--tab-hover-color' as any]: tab.color
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) e.currentTarget.style.color = tab.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) e.currentTarget.style.color = '';
                                        }}
                                    >
                                        {tab.label}
                                        {(isActive) && (
                                            <div 
                                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full animate-premium-glow"
                                                style={{ backgroundColor: tab.color }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
    
                            {/* Global Search Trigger (Adjusted for Notch) */}
                            <button
                                data-tour="global-search"
                                onClick={() => setSearchOverlayOpen(true)}
                                className="ml-4 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/50 hover:text-[#FFCC00] hover:border-[#FFCC00]/50 hover:bg-[#FFCC00]/10 transition-all group"
                            >
                                <span className="material-symbols-outlined text-[18px] group-hover:text-[#FFCC00] transition-colors">search</span>
                                <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest">Buscar</span>
                                <kbd className="hidden lg:flex items-center px-1.5 py-0.5 bg-white/5 group-hover:bg-[#FFCC00]/20 rounded text-[9px] font-mono text-white/20 group-hover:text-[#FFCC00]/80 transition-colors">/</kbd>
                            </button>
                        </div>
                    </div>

                    {/* Right: Sharded Actions */}
                    <div className="flex items-center gap-1 sm:gap-4 shrink-0">
                        {/* Mobile Search Toggle */}
                        <button
                            data-tour="global-search-mobile"
                            onClick={() => setSearchOverlayOpen(true)}
                            className="xl:hidden flex-shrink-0 size-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-brand-yellow transition-all border border-gray-200 dark:border-white/10"
                            aria-label="Abrir Busca"
                        >
                            <span className="material-symbols-outlined text-[22px]">search</span>
                        </button>

                        <div className="flex items-center gap-1 sm:gap-2 pr-1.5 sm:pr-4 border-r border-gray-100 dark:border-white/10">


                            <div className="flex items-center gap-2">
                                <button
                                    data-tour="report-button"
                                    onClick={() => setReportModalOpen(true)}
                                    aria-label="Reportar Erro ou Enviar Feedback"
                                    className="hidden md:flex relative size-10 items-center justify-center rounded-xl bg-brand-red/10 text-red-700 dark:text-brand-red hover:bg-brand-red/20 transition-all border border-brand-red/20 group animate-pulse hover:animate-none"
                                    title="Reportar Erro / Feedback"
                                >
                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">report</span>
                                    <span className="absolute -top-1 -right-1 size-2 bg-brand-red rounded-full ring-2 ring-background-dark"></span>
                                </button>

                                <NotificationBell userId={user?.id} />

                                <button
                                    data-tour="theme-toggle"
                                    onClick={toggleTheme}
                                    aria-label="Alternar Tema Claro e Escuro"
                                    className="hidden md:flex relative w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                >
                                    <div className="relative size-full flex items-center justify-center">
                                        <span
                                            key={theme}
                                            className={`material-symbols-outlined absolute text-[20px] transition-all duration-300 transform ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-100 rotate-0'}`}
                                        >
                                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                        </span>
                                    </div>
                                </button>

                                {user ? (
                                    <div className="relative" id="profile-menu-container" data-tour="user-profile-menu">
                                        <button
                                            onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                                            className="relative flex items-center justify-center group"
                                            aria-label="Menu do Perfil"
                                        >
                                            <Avatar
                                                src={user.avatar_url}
                                                name={user.full_name}
                                                size="md"
                                                customSize="w-10 h-10"
                                                xp={user.xp}
                                                level={user.level}
                                                isLabDiv={user.is_labdiv}
                                            />
                                        </button>

                                        {/* Profile Menu Dropdown - CSS Animation */}
                                        <div
                                            className={`absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-[60] flex flex-col transition-all duration-200 transform origin-top-right ${isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none translate-y-2'}`}
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                    {user.full_name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/lab"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-[#0F4780] dark:text-[#8bb8e8]">science</span>
                                                Meu Laboratório
                                            </Link>
                                            <Link
                                                href="/configuracoes"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-[#0F4780] dark:text-[#8bb8e8]">settings</span>
                                                Configurações
                                            </Link>
                                            <div className="h-[1px] bg-gray-100 dark:bg-white/10 my-1"></div>
                                            <button
                                                onClick={async () => {
                                                    setProfileMenuOpen(false);
                                                    await signOut('/login');
                                                    window.location.reload();
                                                }}
                                                className="px-4 py-3 text-sm text-brand-red hover:bg-brand-red/10 transition-colors flex items-center gap-2 font-bold w-full text-left"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                                Sair
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                                        <Link
                                            href="/configuracoes"
                                            data-tour="header-settings"
                                            className="size-9 sm:size-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-brand-blue hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 shrink-0"
                                            title="Configurações"
                                            aria-label="Abrir Configurações"
                                        >
                                            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">settings</span>
                                        </Link>
                                        <Link
                                            href="/login"
                                            data-tour="header-login"
                                            className="flex items-center gap-1.5 sm:gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-bukra font-bold px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-sm shadow-md shadow-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/40 border border-white/10 active:scale-95 transition-all shrink-0"
                                            title="Fazer Login no HUB"
                                        >
                                            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">login</span>
                                            <span className="hidden sm:inline tracking-wider uppercase text-xs">Login</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Floating Action Buttons (FABs) */}
            <button
                data-tour="theme-toggle-mobile"
                onClick={toggleTheme}
                aria-label="Alternar Tema Claro e Escuro"
                className="md:hidden fixed left-2 z-[50] size-9 flex items-center justify-center rounded-full bg-white dark:bg-[#282828] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 shadow-md dark:shadow-lg dark:shadow-black/50 transition-colors active:scale-95"
                style={{ top: 'calc(76px + env(safe-area-inset-top, 0px))' }}
            >
                <span className="material-symbols-outlined text-[18px]">
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
            </button>

            <button
                data-tour="report-button-mobile"
                onClick={() => setReportModalOpen(true)}
                aria-label="Reportar Erro ou Enviar Feedback"
                className="md:hidden fixed right-2 z-[50] size-9 flex items-center justify-center rounded-full bg-brand-red text-white shadow-md shadow-brand-red/30 transition-transform active:scale-95"
                title="Reportar Erro / Feedback"
                style={{ top: 'calc(76px + env(safe-area-inset-top, 0px))' }}
            >
                <span className="material-symbols-outlined text-[18px]">report</span>
            </button>

            <SearchOverlay
                isOpen={isSearchOverlayOpen}
                onClose={() => setSearchOverlayOpen(false)}
            />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
            />

            <CacheManagerModal
                isOpen={isCacheModalOpen}
                onClose={() => setCacheModalOpen(false)}
            />
        </>
    );
}
