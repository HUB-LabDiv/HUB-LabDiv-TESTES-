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
 * SkeletonProfile - Glassmorphism Edition
 * Usado para perfis na barra lateral, Em Órbita e Lab Pessoal.
 */
export const SkeletonProfile = ({ className, compact = false }: { className?: string, compact?: boolean }) => {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-100 dark:border-white/5 shadow-sm animate-shimmer-glass ${className || ''}`}>
            {/* Avatar */}
            <div className={`rounded-full bg-gray-200/50 dark:bg-white/10 shrink-0 border border-white/10 relative z-10 ${compact ? 'h-10 w-10' : 'h-14 w-14'}`} />
            
            <div className="flex-1 space-y-2 relative z-10">
                {/* Nome */}
                <div className={`bg-gray-200/50 dark:bg-white/10 rounded ${compact ? 'h-3 w-24' : 'h-4 w-32'}`} />
                {/* Info / Cargo */}
                <div className={`bg-gray-200/50 dark:bg-white/10 rounded ${compact ? 'h-2 w-16' : 'h-3 w-24'}`} />
            </div>
            
            {!compact && (
                <div className="h-8 w-8 rounded-full bg-gray-200/50 dark:bg-white/10 relative z-10 shrink-0" />
            )}
        </div>
    );
};
