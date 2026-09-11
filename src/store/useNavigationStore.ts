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


import { create } from 'zustand';

/**
 * V8.0 Apocalypse Protocol - Navigation Sharding
 * Isolated store for UI state to prevent Ghost Re-renders when UserContext or Feed updates.
 */

interface NavigationState {
    isDrawerOpen: boolean;
    isProfileMenuOpen: boolean;
    isSuggestionsVisible: boolean;
    isReportModalOpen: boolean;
    reportType: string;
    reportContext?: any;
    isContentReportModalOpen: boolean;
    reportSubmissionId: string | null;
    isBetaModalOpen: boolean;
    isSidebarCollapsed: boolean;
    isRightSidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setRightSidebarCollapsed: (collapsed: boolean) => void;
    setDrawerOpen: (open: boolean) => void;
    setProfileMenuOpen: (open: boolean) => void;
    setSuggestionsVisible: (visible: boolean) => void;
    setReportModalOpen: (open: boolean, type?: string, context?: any) => void;
    setBetaModalOpen: (open: boolean) => void;
    openContentReport: (id: string) => void;
    closeContentReport: () => void;
    closeAll: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    isDrawerOpen: false,
    isProfileMenuOpen: false,
    isSuggestionsVisible: false,
    isReportModalOpen: false,
    reportType: 'bug',
    reportContext: null,
    isContentReportModalOpen: false,
    reportSubmissionId: null,
    isBetaModalOpen: false,
    isSidebarCollapsed: false,
    isRightSidebarCollapsed: false,
    setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
    setRightSidebarCollapsed: (collapsed) => set({ isRightSidebarCollapsed: collapsed }),
    setDrawerOpen: (open) => set({ isDrawerOpen: open }),
    setProfileMenuOpen: (open) => set({ isProfileMenuOpen: open }),
    setSuggestionsVisible: (visible) => set({ isSuggestionsVisible: visible }),
    setReportModalOpen: (open, type, context) => set({ 
        isReportModalOpen: open, 
        ...(type && { reportType: type }),
        ...(context !== undefined && { reportContext: context })
    }),
    setBetaModalOpen: (open) => set({ isBetaModalOpen: open }),
    openContentReport: (id) => set({ isContentReportModalOpen: true, reportSubmissionId: id }),
    closeContentReport: () => set({ isContentReportModalOpen: false, reportSubmissionId: null }),
    closeAll: () => set({
        isDrawerOpen: false,
        isProfileMenuOpen: false,
        isSuggestionsVisible: false,
        isReportModalOpen: false,
        isContentReportModalOpen: false,
        isBetaModalOpen: false,
        reportSubmissionId: null,
        reportType: 'bug'
    }),
}));
