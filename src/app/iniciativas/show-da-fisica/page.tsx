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
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { ArrowRight, Clock, CalendarDays, GraduationCap, Terminal } from 'lucide-react';
import { Orbitron } from 'next/font/google';
import { ShowCarousel } from './ShowCarousel';
import { ShowDetailsAccordion } from './ShowDetailsAccordion';
import { Breadcrumbs } from '@/components/wiki/WikiComponents';
import { ShowActionButtons } from './ShowActionButtons';

export const metadata = {
    title: 'Show de Fisica | Iniciativas IFUSP',
    description: 'Levando demonstrações de fenômenos físicos ao público em geral.',
};

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function ShowDaFisicaPage() {
    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className={`min-h-screen bg-black text-white ${orbitron.className}`}>
                <style dangerouslySetInnerHTML={{__html: `
                    .neon-text-blue {
                        text-shadow: 0 0 5px #002ffe, 0 0 10px #002ffe, 0 0 20px #002ffe, 0 0 40px #002ffe;
                        color: #fff;
                    }
                    .neon-text-red {
                        text-shadow: 0 0 5px #f60011, 0 0 10px #f60011, 0 0 20px #f60011, 0 0 40px #f60011;
                        color: #fff;
                    }
                    .neon-text-green {
                        text-shadow: 0 0 5px #01f300, 0 0 10px #01f300, 0 0 20px #01f300, 0 0 40px #01f300;
                        color: #fff;
                    }
                    .neon-border-blue {
                        border: 2px solid #002ffe;
                        box-shadow: 0 0 10px #002ffe, inset 0 0 10px #002ffe;
                    }
                    .neon-border-red {
                        border: 2px solid #f60011;
                        box-shadow: 0 0 10px #f60011, inset 0 0 10px #f60011;
                    }
                    .neon-border-green {
                        border: 2px solid #01f300;
                        box-shadow: 0 0 10px #01f300, inset 0 0 10px #01f300;
                    }
                `}} />

                <div className="max-w-7xl mx-auto px-4 pt-6 pb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <Breadcrumbs 
                        title="Show de Física" 
                        section="Iniciativas de Impacto" 
                        sectionHref="/gcif/instituto" 
                        backHref="/gcif/instituto" 
                    />
                    
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-widest mb-8 uppercase flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <span className="neon-text-red">Show</span>
                            <span className="neon-text-blue">de</span>
                            <span className="neon-text-green">Fisica</span>
                        </h1>
                        <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-sans tracking-wide text-gray-300">
                            O Show de Fisica é um espetáculo de demonstrações experimentais que abordam os mais variados temas. Contamos com uma performance lúdica, divertida, dinâmica, envolvente e interativa! A proposta é permitir que os visitantes contextualizem, ampliem e estimulem o seu perfil científico.
                        </p>
                    </div>

                    {/* Detalhes expansíveis */}
                    <div className="mb-24">
                        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center uppercase neon-text-blue tracking-wider">
                            Nossa Trajetória e Proposta
                        </h2>
                        <ShowDetailsAccordion />
                    </div>

                    {/* Vitrine de Experimentos (Carousel) */}
                    <div className="mb-24">
                        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center uppercase neon-text-green tracking-wider">
                            Nossos Experimentos
                        </h2>
                        
                        <ShowCarousel />
                    </div>

                    {/* Orientações para Escolas */}
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center uppercase neon-text-red tracking-wider">
                            Orientações para Escolas
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-black p-8 neon-border-green flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                                <GraduationCap className="w-16 h-16 text-[#01f300] mb-6 drop-shadow-[0_0_10px_#01f300] group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold mb-4 uppercase text-[#01f300]">Público Alvo</h3>
                                <div className="font-sans text-gray-300 space-y-2">
                                    <p>Do 1º ano do E.F. ao 3º ano do E.M.</p>
                                    <p className="pt-4 font-bold text-white">Dividido em Faixas:</p>
                                    <ul className="text-sm">
                                        <li>Faixa 1: 1º ao 4º ano (E.F.)</li>
                                        <li>Faixa 2: 5º ao 7º ano (E.F.)</li>
                                        <li>Faixa 3: 8º (E.F.) ao 3º ano (E.M.)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-black p-8 neon-border-blue flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                                <Clock className="w-16 h-16 text-[#002ffe] mb-6 drop-shadow-[0_0_10px_#002ffe] group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold mb-4 uppercase text-[#002ffe]">Duração</h3>
                                <p className="font-sans text-gray-300 mt-4">
                                    Cada apresentação tem aproximadamente<br/>
                                    <span className="text-3xl font-bold text-white block mt-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">2 HORAS</span>
                                </p>
                            </div>

                            <div className="bg-black p-8 neon-border-red flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                                <CalendarDays className="w-16 h-16 text-[#f60011] mb-6 drop-shadow-[0_0_10px_#f60011] group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold mb-4 uppercase text-[#f60011]">Dias e Horários</h3>
                                <p className="font-sans text-gray-300 mt-4">
                                    Sessões realizadas às<br/>
                                    <strong className="text-white">Terças, Quartas e Quintas-feiras</strong>
                                </p>
                                <div className="mt-4 flex gap-4 w-full justify-center">
                                    <span className="px-3 py-1 border border-[#f60011] text-[#f60011]">10:00</span>
                                    <span className="px-3 py-1 border border-[#f60011] text-[#f60011]">14:00</span>
                                </div>
                            </div>
                        </div>
                        
                        <ShowActionButtons />
                    </div>

                </div>
            </div>
        </MainLayoutWrapper>
    );
}
