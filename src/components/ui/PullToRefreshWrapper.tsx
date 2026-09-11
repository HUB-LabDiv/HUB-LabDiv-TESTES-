'use client';

import React, { useState, TouchEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function PullToRefreshWrapper({ children }: { children: React.ReactNode }) {
    const [startY, setStartY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();
    
    const PULL_THRESHOLD = 80;
    const MAX_PULL = 120;

    const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (window.scrollY === 0) {
            setStartY(e.touches[0].clientY);
        } else {
            setStartY(0);
        }
    };

    const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (startY === 0 || isRefreshing) return;
        
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0 && window.scrollY === 0) {
            setPullDistance(Math.min(diff * 0.4, MAX_PULL));
        }
    };

    const onTouchEnd = () => {
        if (startY === 0 || isRefreshing) return;

        if (pullDistance >= PULL_THRESHOLD) {
            setIsRefreshing(true);
            setTimeout(() => {
                router.refresh();
                setIsRefreshing(false);
                setPullDistance(0);
            }, 800); 
        } else {
            setPullDistance(0);
        }
        setStartY(0);
    };

    const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
    
    return (
        <div 
            className="w-full relative min-h-screen overscroll-y-contain"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div 
                className={`fixed top-0 left-0 w-full flex justify-center pointer-events-none z-[99999] ${!isRefreshing && pullDistance === 0 ? 'transition-transform duration-300' : ''}`}
                style={{ 
                    transform: `translateY(${isRefreshing ? '24px' : (pullDistance > 0 ? pullDistance - 40 : '-60')}px)`,
                    opacity: isRefreshing ? 1 : pullProgress
                }}
            >
                <div className="relative w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-full shadow-xl border border-gray-100 dark:border-white/10">
                    <img 
                        src="/icone-HUBLabDiv-circular.svg" 
                        alt="Recarregar" 
                        className="w-6 h-6 object-contain z-10" 
                    />
                    <div 
                        className={`absolute inset-0 border-4 border-zinc-200 dark:border-zinc-700 border-t-[#FFCC00] border-r-[#F14343] border-b-[#0F4780] rounded-full ${isRefreshing ? 'animate-spin' : ''}`}
                        style={{ transform: isRefreshing ? undefined : `rotate(${pullProgress * 360}deg)` }}
                    />
                </div>
            </div>

            <div 
                className={`w-full ${!isRefreshing && pullDistance === 0 ? 'transition-transform duration-300' : ''}`}
                style={{ transform: `translateY(${isRefreshing ? '60px' : pullDistance}px)` }}
            >
                {children}
            </div>
        </div>
    );
}
