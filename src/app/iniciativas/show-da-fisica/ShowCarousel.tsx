"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EXPERIMENTS = [
    { id: 1, title: 'Gerador de Van de Graaff', desc: 'Eletricidade estática e arrepios!', img: '/show/IMG_00004.JPG' },
    { id: 2, title: 'Cadeira de Pregos', desc: 'A física da pressão e distribuição de força.', img: '/show/IMG_00031.JPG' },
    { id: 3, title: 'Bobina de Tesla', desc: 'Raios e campos eletromagnéticos.', img: '/show/IMG_00143.JPG' },
    { id: 4, title: 'Levitação Magnética', desc: 'Supercondutores e o efeito Meissner.', img: '/show/IMG_00224.JPG' },
    { id: 5, title: 'Óptica e Cores', desc: 'Composição da luz e ilusões visuais.', img: '/show/IMG_00312.JPG' },
    { id: 6, title: 'Gases e Termodinâmica', desc: 'Experiências com nitrogênio líquido.', img: '/show/IMG_8793.JPG' },
];

export function ShowCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % EXPERIMENTS.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + EXPERIMENTS.length) % EXPERIMENTS.length);
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[500px] neon-border-blue bg-black overflow-hidden group">
            {EXPERIMENTS.map((exp, index) => (
                <div 
                    key={exp.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <Image 
                        src={exp.img} 
                        alt={exp.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="opacity-70"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <h3 className="text-3xl font-bold mb-2 neon-text-red uppercase tracking-wider">{exp.title}</h3>
                        <p className="text-lg font-sans text-white/90">{exp.desc}</p>
                    </div>
                </div>
            ))}
            
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 hover:bg-black neon-border-blue text-white transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 hover:bg-black neon-border-blue text-white transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 right-8 z-30 flex gap-2">
                {EXPERIMENTS.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-[#01f300] shadow-[0_0_10px_#01f300]' : 'bg-white/30'}`}
                        aria-label={`Ir para o slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
