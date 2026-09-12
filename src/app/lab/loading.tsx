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

import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

export default function LabLoading() {
    return (
        <MainLayoutWrapper>
            <div className="animate-in fade-in duration-500 w-full w-full max-w-4xl mx-auto mt-4 sm:mt-8">
                <div className="bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-xl rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-white/5 mb-8 mx-auto animate-shimmer-glass relative overflow-hidden isolate">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12 w-full relative z-10">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200/50 dark:bg-white/10 shrink-0 border border-white/10"></div>
                        <div className="flex-1 w-full space-y-4 pt-2">
                            <div className="h-8 bg-gray-200/50 dark:bg-white/10 rounded-lg w-1/2 mx-auto sm:mx-0"></div>
                            <div className="flex gap-4 justify-center sm:justify-start">
                               <div className="h-10 bg-gray-200/50 dark:bg-white/10 rounded-lg w-16"></div>
                               <div className="h-10 bg-gray-200/50 dark:bg-white/10 rounded-lg w-16"></div>
                               <div className="h-10 bg-gray-200/50 dark:bg-white/10 rounded-lg w-16"></div>
                            </div>
                            <div className="h-6 bg-gray-200/50 dark:bg-white/10 rounded-lg w-3/4 mx-auto sm:mx-0 mt-4"></div>
                            <div className="h-4 bg-gray-200/50 dark:bg-white/10 rounded-lg w-full"></div>
                            <div className="h-4 bg-gray-200/50 dark:bg-white/10 rounded-lg w-5/6"></div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center gap-4 border-t border-gray-200 dark:border-white/5 mb-8 max-w-3xl mx-auto pt-8">
                    <div className="h-6 w-24 bg-white/40 dark:bg-[#1E1E1E]/40 rounded-xl animate-shimmer-glass border border-white/5"></div>
                    <div className="h-6 w-24 bg-white/40 dark:bg-[#1E1E1E]/40 rounded-xl animate-shimmer-glass border border-white/5"></div>
                    <div className="h-6 w-24 bg-white/40 dark:bg-[#1E1E1E]/40 rounded-xl animate-shimmer-glass border border-white/5"></div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
                   <div className="aspect-video bg-white/40 dark:bg-[#1E1E1E]/40 border border-white/5 rounded-2xl animate-shimmer-glass"></div>
                   <div className="aspect-video bg-white/40 dark:bg-[#1E1E1E]/40 border border-white/5 rounded-2xl animate-shimmer-glass"></div>
                   <div className="aspect-video bg-white/40 dark:bg-[#1E1E1E]/40 border border-white/5 rounded-2xl animate-shimmer-glass"></div>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}
