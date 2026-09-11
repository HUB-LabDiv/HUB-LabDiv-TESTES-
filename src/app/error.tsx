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


import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('🔴 Application Error:', error);
    }, [error]);

    const isOfflineError = (typeof window !== 'undefined' && !navigator.onLine) || error.message.includes('503') || error.message.includes('fetch');

    if (isOfflineError) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
                {/* Cabeçalho Skeleton */}
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-800 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-1/4"></div>
                    </div>
                </div>
                {/* Conteúdo Skeleton */}
                <div className="space-y-4">
                    <div className="h-32 bg-gray-300 dark:bg-gray-800 rounded-2xl w-full"></div>
                    <div className="h-32 bg-gray-300 dark:bg-gray-800 rounded-2xl w-full"></div>
                    <div className="h-32 bg-gray-300 dark:bg-gray-800 rounded-2xl w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-brand-red/20 blur-2xl rounded-full"></div>
                    <span className="material-symbols-outlined text-6xl text-brand-red relative z-10">error</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Ops! Algo deu errado.</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Encontramos um erro inesperado. O sistema foi blindado e os dados estão seguros.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-[#0055ff] hover:bg-[#0044cc] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#0055ff]/20 active:scale-95"
                    >
                        Tentar Novamente
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-bold transition-all active:scale-95"
                    >
                        Voltar para Início
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg text-left overflow-auto max-h-40">
                        <code className="text-xs text-brand-red dark:text-brand-red">
                            {error.message}
                        </code>
                    </div>
                )}
            </div>
        </div>
    );
}
