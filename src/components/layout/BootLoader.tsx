'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export function BootLoader() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Only show the bootloader once per session (upon entering the site)
        const hasShown = sessionStorage.getItem('bootLoaderShown');
        if (hasShown) {
            setIsVisible(false);
            return;
        }

        const MIN_LOADING_TIME = 1000; // reduced to 1s
        const startTime = Date.now();

        const handleLoad = () => {
            const timeElapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, MIN_LOADING_TIME - timeElapsed);

            setTimeout(() => {
                setIsVisible(false);
                sessionStorage.setItem('bootLoaderShown', 'true');
            }, remainingTime);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => window.removeEventListener('load', handleLoad);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#121212] transition-opacity duration-500 ease-in-out">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-6">
                <Image
                    src="/icone-HUBLabDiv.svg"
                    alt="HUB LabDiv Logo"
                    fill
                    className="object-contain animate-pulse"
                    priority
                />
            </div>
            <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0F4780] via-[#F14343] to-[#FFCC00] w-full animate-shimmer-labdiv" />
            </div>
        </div>
    );
}
