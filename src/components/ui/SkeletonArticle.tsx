'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';

/**
 * SkeletonArticle - Glassmorphism Edition
 * Para uso no CGIF e nas Ferramentas (textos longos)
 */
export const SkeletonArticle = ({ className }: { className?: string }) => {
    return (
        <div className={`space-y-8 animate-shimmer-glass p-6 rounded-3xl bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-100 dark:border-white/5 ${className || ''}`}>
            {/* Header / Title */}
            <div className="space-y-4 relative z-10">
                <div className="h-4 w-24 bg-gray-200/50 dark:bg-white/10 rounded-full" />
                <div className="h-10 w-3/4 bg-gray-200/50 dark:bg-white/10 rounded-lg" />
                <div className="h-4 w-1/2 bg-gray-200/50 dark:bg-white/10 rounded" />
            </div>

            {/* Imagem de Capa */}
            <div className="w-full h-64 sm:h-96 bg-gray-200/30 dark:bg-white/5 rounded-2xl relative z-10" />

            {/* Parágrafos */}
            <div className="space-y-4 relative z-10">
                <div className="h-4 w-full bg-gray-200/50 dark:bg-white/10 rounded" />
                <div className="h-4 w-full bg-gray-200/50 dark:bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-gray-200/50 dark:bg-white/10 rounded" />
                <div className="h-4 w-full bg-gray-200/50 dark:bg-white/10 rounded" />
                <div className="h-4 w-4/5 bg-gray-200/50 dark:bg-white/10 rounded" />
            </div>
            
            <div className="space-y-4 relative z-10 pt-4">
                <div className="h-6 w-1/3 bg-gray-200/50 dark:bg-white/10 rounded mb-4" />
                <div className="h-4 w-full bg-gray-200/50 dark:bg-white/10 rounded" />
                <div className="h-4 w-11/12 bg-gray-200/50 dark:bg-white/10 rounded" />
            </div>
        </div>
    );
};
