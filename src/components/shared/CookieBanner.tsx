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

        const handleManualShow = () => {
            setIsVisible(true);
        };

        window.addEventListener('show_cookie_banner', handleManualShow);
        return () => window.removeEventListener('show_cookie_banner', handleManualShow);
    }, []);

    const handleAcceptAll = () => {
        // Agora o banner principal só lida com cookies ESSENCIAIS por padrão (Opt-in reestrito)
        localStorage.setItem('cookie_consent', 'false'); // 'false' no sentido de 'telemetria desativada'
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
                        Respeitamos de ponta a ponta a <strong>LGPD</strong>, o <strong>ECA</strong> e o <strong>Marco Civil da Internet</strong>. Utilizamos cookies essenciais para navegação. A telemetria anônima para melhoria de bugs é ativada <strong>exclusivamente após a criação do perfil</strong> e apenas para usuários <strong>maiores de 18 anos</strong> que optarem pelo aceite em nossa{' '}
                        <Link href="/re-accept-terms" onClick={() => setIsVisible(false)} className="text-brand-blue hover:text-brand-yellow font-bold underline transition-colors">
                            Política de Privacidade
                        </Link>.
                    </p>
                </div>
                
                {/* Zero Dark Patterns: Mesma proporção e legibilidade para Aceitar e Recusar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <button
                        onClick={handleAcceptAll}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0F4780] text-white font-bukra font-bold hover:bg-[#0c3966] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-[#0F4780]/20 uppercase tracking-widest text-xs"
                    >
                        <span className="material-symbols-outlined text-[18px]">gpp_good</span>
                        Aceitar Cookies Essenciais (Navegação)
                    </button>
                </div>
            </div>
        </div>
    );
};
