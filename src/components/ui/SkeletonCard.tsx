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

/**
 * V8.0 SkeletonCard - CLS Zero Edition
 * Perfectly mirrors MediaCard structure to prevent Layout Shift.
 */
export const SkeletonCard = ({ className }: { className?: string }) => {
    return (
        <div className={`flex flex-col overflow-hidden rounded-2xl bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-shimmer-glass ${className || ''}`}>
            {/* Header Mirror */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100/50 dark:border-white/5">
                <div className="flex items-center gap-2 relative z-10">
                    <div className="h-8 w-8 rounded-full bg-gray-200/50 dark:bg-white/10 shrink-0" />
                    <div className="h-3 w-24 bg-gray-200/50 dark:bg-white/10 rounded" />
                </div>
                <div className="h-8 w-32 bg-gray-200/50 dark:bg-white/10 rounded-lg relative z-10" />
            </div>

            {/* Media Mirror */}
            <div className="webkit-aspect-guard w-full bg-gray-200/30 dark:bg-white/5 relative z-10" />

            {/* Actions Mirror */}
            <div className="flex flex-col p-4 md:p-6 pt-3 md:pt-4 gap-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-12 bg-gray-200/50 dark:bg-white/10 rounded-full" />
                        <div className="h-6 w-8 bg-gray-200/50 dark:bg-white/10 rounded" />
                        <div className="size-6 bg-gray-200/50 dark:bg-white/10 rounded-full" />
                    </div>
                    <div className="h-6 w-12 bg-gray-200/50 dark:bg-white/10 rounded-full" />
                </div>

                {/* Content Mirror */}
                <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-gray-200/50 dark:bg-white/10 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200/50 dark:bg-white/10 rounded" />
                </div>

                {/* Tags Mirror */}
                <div className="flex flex-wrap gap-2 mt-2">
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
                    <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-md" />
                </div>
            </div>
        </div>
    );
};
