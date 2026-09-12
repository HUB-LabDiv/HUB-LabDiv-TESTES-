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
 * SkeletonLog - Glassmorphism Edition
 * Para uso no LogsView, simulando os mini-cards do log.
 */
export const SkeletonLog = ({ className }: { className?: string }) => {
    return (
        <div className={`flex flex-col overflow-hidden rounded-2xl bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 sm:p-5 mb-4 animate-shimmer-glass ${className || ''}`}>
            
            <div className="flex items-start gap-4 relative z-10">
                {/* Avatar */}
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200/50 dark:bg-white/10 shrink-0 border border-white/10" />
                
                <div className="flex-1 space-y-3">
                    {/* Cabeçalho do Usuário */}
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-32 bg-gray-200/50 dark:bg-white/10 rounded" />
                        <div className="h-3 w-16 bg-gray-200/50 dark:bg-white/10 rounded ml-auto" />
                    </div>
                    
                    {/* Conteúdo Textual (Drop) */}
                    <div className="space-y-2 pt-1">
                        <div className="h-4 w-full bg-gray-200/50 dark:bg-white/10 rounded" />
                        <div className="h-4 w-5/6 bg-gray-200/50 dark:bg-white/10 rounded" />
                        <div className="h-4 w-2/3 bg-gray-200/50 dark:bg-white/10 rounded" />
                    </div>

                    {/* Footer / Reações */}
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100/50 dark:border-white/5">
                        <div className="h-6 w-14 bg-gray-200/50 dark:bg-white/10 rounded-full" />
                        <div className="h-6 w-14 bg-gray-200/50 dark:bg-white/10 rounded-full" />
                        <div className="h-6 w-14 bg-gray-200/50 dark:bg-white/10 rounded-full ml-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
};
