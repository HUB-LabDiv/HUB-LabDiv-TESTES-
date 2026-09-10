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
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
    return (
        <div 
            style={{ backgroundColor: '#121212', color: '#ffffff' }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background-light dark:bg-background-dark"
        >
            <div className="size-24 bg-brand-blue/10 rounded-full flex items-center justify-center mb-8 text-brand-blue" style={{ backgroundColor: 'rgba(15, 71, 128, 0.15)', color: '#FFCC00' }}>
                <WifiOff size={48} />
            </div>

            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4" style={{ color: '#ffffff' }}>
                Oops! Sem conexão?
            </h1>

            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-12">
                O Hub de Comunicação Científica requer internet para sincronizar novos dados.
                Verifique sua conexão ou tente novamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="px-8 py-4 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-2xl transition-all shadow-xl shadow-brand-blue/20"
                >
                    Tentar reconectar
                </Link>
                <Link
                    href="/"
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/10"
                >
                    Voltar ao Início
                </Link>
            </div>

            <p className="mt-12 text-[10px] uppercase font-black tracking-widest text-gray-400 text-brand-blue/40">
                Lab-Div Offline Resilience V3.0
            </p>
        </div>
    );
}
