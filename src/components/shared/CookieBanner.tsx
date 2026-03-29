'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Opt-in absoluto: Nunca iniciamos em true. Só perguntamos se estiver nulo.
        const consent = localStorage.getItem('cookie_consent');
        if (consent === null) { 
            setIsVisible(true);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookie_consent', 'true');
        window.dispatchEvent(new Event('cookie_consent_changed'));
        setIsVisible(false);
    };

    const handleRejectAll = () => {
        localStorage.setItem('cookie_consent', 'false');
        window.dispatchEvent(new Event('cookie_consent_changed'));
        setIsVisible(false);
    };

    if (!mounted || !isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 pointer-events-none flex justify-center">
            <div className="w-full max-w-4xl bg-white dark:bg-[#121212] border-t-4 border-t-brand-blue border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 pointer-events-auto flex flex-col md:flex-row gap-6 items-center justify-between animate-fade-in-up">
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                        <span className="material-symbols-outlined text-brand-blue">cookie</span>
                        Sua Privacidade, Nossas Regras.
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                        Utilizamos cookies e telemetria anônima estritamente para corrigir bugs e melhorar a sua experiência educacional no Instituto. Respeitamos de ponta a ponta a <strong>LGPD</strong> e o <strong>ECA</strong>. Não vendemos dados. Leia a nossa{' '}
                        <Link href="/privacy-policy" onClick={() => setIsVisible(false)} className="text-brand-blue hover:text-brand-yellow font-bold underline transition-colors">
                            Política de Privacidade
                        </Link>{' '}
                        simplificada para entender mais.
                    </p>
                </div>
                
                {/* Zero Dark Patterns: Mesma proporção e legibilidade para Aceitar e Recusar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <button
                        onClick={handleRejectAll}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-white/5 hover:border-gray-500 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[18px]">gpp_maybe</span>
                        Apenas Essenciais
                    </button>
                    <button
                        onClick={handleAcceptAll}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-brand-blue bg-brand-blue text-white font-bold hover:bg-brand-blue/90 hover:border-brand-blue/90 shadow-lg shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                        Aceito (Telemetria)
                    </button>
                </div>
            </div>
        </div>
    );
};
