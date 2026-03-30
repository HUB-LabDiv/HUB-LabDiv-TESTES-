'use client';

import React from 'react';

interface HubLogoProps {
    size?: number;
    className?: string;
    showText?: boolean;
}

export function HubLogo({ size = 48, className = "", showText = false }: HubLogoProps) {
    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <div 
                className="relative flex-shrink-0 transition-transform duration-500 hover:scale-110"
                style={{ width: size, height: size }}
            >
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#0F4780] via-[#F14343] to-[#FFCC00] rounded-xl blur opacity-30 animate-premium-glow"></div>
                <div className="relative w-full h-full">
                    {/* The Official Square-Cut Sharded Logo */}
                    <div className="absolute w-[60%] h-[75%] bg-[#0F4780] rounded-[3px] top-0 left-0 z-0 shadow-sm border border-white/10"></div>
                    <div className="absolute w-[60%] h-[75%] bg-[#F14343] rounded-[3px] bottom-0 right-0 z-0 translate-y-1 shadow-sm border border-white/10"></div>
                    <div className="absolute w-[60%] h-[60%] bg-[#FFCC00] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-md border-2 border-white dark:border-[#1E1E1E]"></div>
                </div>
            </div>
            
            {showText && (
                <div className="flex flex-col -space-y-1 text-center">
                    <div className="text-xl font-bukra font-bold tracking-tight flex items-baseline justify-center gap-1.5 leading-tight">
                        <span className="text-[#0F4780] dark:text-white uppercase">HUB</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4780] via-[#F14343] to-[#FFCC00] font-black italic">LabDiv</span>
                    </div>
                </div>
            )}
        </div>
    );
}
