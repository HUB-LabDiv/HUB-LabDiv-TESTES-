'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Inicializa o estado com base na rede atual
        if (typeof window !== 'undefined') {
            setIsOffline(!navigator.onLine);

            const handleOnline = () => setIsOffline(false);
            const handleOffline = () => setIsOffline(true);

            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);

            return () => {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
            };
        }
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full bg-[#FFCC00] text-[#0F4780] flex items-center justify-center py-1.5 px-4 z-[9999] shadow-md overflow-hidden relative"
                >
                    <div className="flex flex-col items-center gap-1 max-w-7xl mx-auto w-full justify-center text-center">
                        <div className="flex items-center gap-2">
                            <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider leading-tight">
                                Você está Offline
                            </span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold leading-tight opacity-90 max-w-md">
                            O CGIF e a Grade Horária nas Ferramentas são locais e podem ser acessados enquanto você não se reconecta. Demais recursos dinâmicos exibirão apenas a estrutura.
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
