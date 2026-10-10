"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function InteractivePamphlet() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-md mx-auto px-4">
      {/* 3D Container */}
      <div 
        className="relative w-full aspect-[1/1.414] cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Front Cover */}
          <div 
            className="absolute w-full h-full rounded-xl shadow-2xl overflow-hidden bg-brand-dark/90 border border-white/10 flex flex-col p-6 items-center justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full flex justify-between items-start">
               <div className="flex items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow font-bold">
                    <span className="material-symbols-outlined">hub</span>
                 </div>
               </div>
               <span className="material-symbols-outlined text-white/50 animate-bounce">touch_app</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="font-bukra text-4xl text-white font-bold leading-tight">
                JÁ TESTOU <br /> <span className="text-brand-yellow">O HUB?</span>
              </h1>
              <p className="font-open-sans text-white/80">O Hub de Comunicação Científica oficial do IFUSP. O LabDiv agora na palma da sua mão.</p>
            </div>

            <div className="text-center font-open-sans text-sm text-white/50 animate-pulse bg-white/5 py-2 px-4 rounded-full">
              Toque para virar o panfleto
            </div>
          </div>

          {/* Back Cover */}
          <div 
            className="absolute w-full h-full rounded-xl shadow-2xl overflow-hidden bg-surface-base border border-white/10 flex flex-col p-6 items-center justify-between"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)' 
            }}
          >
             <div className="w-full flex flex-col h-full">
               <h2 className="font-bukra text-xl text-brand-blue mb-6 text-center">NOSSOS 3 EIXOS</h2>
               
               <div className="flex flex-col gap-5 w-full font-open-sans flex-1 justify-center">
                  {/* Eixo Social */}
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-brand-blue/30 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-brand-blue/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-brand-blue text-3xl">groups</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">Comunidade</h3>
                      <p className="text-white/70 text-sm mt-1">Interaja, compartilhe e encontre seu grupo de estudos.</p>
                    </div>
                  </div>

                  {/* Eixo Informativo */}
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-brand-red/30 shadow-[0_0_15px_rgba(241,67,67,0.1)]">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-brand-red/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-brand-red text-3xl">menu_book</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">Informativo</h3>
                      <p className="text-white/70 text-sm mt-1">A Wiki centralizada com tudo sobre a graduação.</p>
                    </div>
                  </div>

                  {/* Eixo Ferramentas */}
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-brand-yellow/30 shadow-[0_0_15px_rgba(255,204,0,0.1)]">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-brand-yellow text-3xl">construction</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">Ferramentas</h3>
                      <p className="text-white/70 text-sm mt-1">Recursos e auxílio para o seu dia a dia na pesquisa.</p>
                    </div>
                  </div>
               </div>
             </div>

             <div className="text-center font-open-sans text-sm text-white/50 animate-pulse bg-white/5 py-2 px-4 rounded-full mt-4">
              Toque para voltar à capa
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <Link 
          href="/"
          className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 px-6 rounded-xl text-center transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 font-bukra text-sm tracking-wide"
        >
          <span className="material-symbols-outlined">public</span>
          ENTRAR NO HUB
        </Link>
        <Link 
          href="/offline"
          className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 px-6 rounded-xl text-center transition-all flex items-center justify-center gap-2 font-bukra text-sm tracking-wide"
        >
          <span className="material-symbols-outlined">install_mobile</span>
          TESTAR O APP
        </Link>
      </div>
    </div>
  );
}
