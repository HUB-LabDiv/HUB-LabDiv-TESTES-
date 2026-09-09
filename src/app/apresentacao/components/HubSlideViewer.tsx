'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  BookOpen, 
  Presentation, 
  ExternalLink,
  Users,
  FileText,
  Wrench,
  CheckCircle2,
  Download,
  MessageSquare,
  Palette,
  Smartphone,
  Globe
} from 'lucide-react';

export interface SlideLink {
  label: string;
  url: string;
  variant?: 'yellow' | 'blue' | 'red' | 'outline' | 'green';
}

export interface HubSlideItem {
  id: number;
  title: string;
  category: string;
  subtitle?: string;
  description: string;
  showFirstSlideLogo?: boolean;
  showThreeAxes?: boolean;
  showComunidadeDescriptions?: boolean;
  highlights?: string[];
  notes?: string[];
  links?: SlideLink[];
}

export const HUB_INSTITUCIONAL_SLIDES: HubSlideItem[] = [
  {
    id: 1,
    title: 'Visão Geral & Conceito do HUB LabDiv',
    subtitle: 'O Super App de Comunicação Científica para romper os muros da Universidade',
    category: 'HUB LABDIV • IFUSP | ABERTURA & CONCEITO',
    description: 'Plataforma digital WebApp open source (AGPLv3) concebida por João Stangorlini sob orientação do Prof. Caetano Miranda no IFUSP.',
    showFirstSlideLogo: true,
    highlights: [
      'Super App: Diferente de um app padrão ele reúne diversas funções em um único lugar (como 99, WeChat, Mercado Livre, etc.), acessível pela PlayStore (beta fechado) ou direto pelo navegador.',
      'Comunicação Dialógica: Rompe a mera "divulgação passiva", promovendo a co-construção de significado e compreensão do processo científico e não do saber individual, com base teórica entre outras em "Extensão ou Comunicação?" de Paulo Freire.',
      'Integração Acadêmica: Une o controle do semestre, evolução no curso nas ferramentas, uma Wiki com todas as informações do IFUSP, seus espaços, mapa e a aba Comunidade onde você pode interagir com colegas em um único lugar.',
      'Código Aberto (AGPLv3): Projeto transparente hospedado no GitHub (JoaoStangorlini/HUB-LabDiv) pronto para ser replicado.'
    ],
    notes: [
      'Apresentar a logo oficial do HUB e a fusão de Visão Geral e Conceito.',
      'Destacar as 3 cores da marca LabDiv (Amarelo, Azul e Vermelho).'
    ],
    links: [
      { label: 'Acessar WebApp', url: 'https://hub-lab-div.vercel.app', variant: 'yellow' },
      { label: 'Google PlayStore', url: 'https://play.google.com/store/apps/details?id=br.usp.ifusp.hublabdiv', variant: 'blue' },
      { label: 'Repositório GitHub', url: 'https://github.com/JoaoStangorlini/HUB-LabDiv', variant: 'outline' }
    ]
  },
  {
    id: 2,
    title: 'Divisão do HUB em 3 Eixos Principais',
    subtitle: 'As 3 Frentes Fundamentais da Plataforma HUB LabDiv',
    category: 'ESTRUTURA DOS 3 EIXOS | HUB LABDIV',
    description: 'Organização da plataforma nas 3 frentes de atuação: Social, Informativo e Ferramentas.',
    showThreeAxes: true,
    notes: [
      'Destacar a divisão tricolor oficial dos eixos: Azul (Social), Vermelho (Informativo) e Amarelo (Ferramentas).'
    ]
  },
  {
    id: 3,
    title: 'Aba Comunidade: Fluxo, Logs & Arte',
    subtitle: 'Descrição detalhada das 3 seções integradas do Eixo Comunidade',
    category: 'EIXO 1 — COMUNIDADE | HUB LABDIV',
    description: 'A aba Comunidade reúne a comunicação dialógica (Fluxo), as vivências cotidianas (Logs) e a expressão criativa (Arte).',
    showComunidadeDescriptions: true,
    notes: [
      'Apresentar a descrição das 3 abas da comunidade: Fluxo, Logs e Arte.'
    ],
    links: [
      { label: 'Ir para Aba Comunidade', url: '/comunidade', variant: 'yellow' }
    ]
  },
  {
    id: 4,
    title: 'Aba CGIF: Acesso à Informação & Wiki Institucional',
    subtitle: 'Centralização do Conhecimento & Memória do IFUSP',
    category: 'EIXO 2 — CGIF | HUB LABDIV',
    description: 'A aba CGIF reúne a Wiki institucional, oportunidades de bolsa (PUB/IC), guias do curso e o mapa interativo.',
    highlights: [
      'Wiki CGIF: Onde se encontram informações espalhadas por Manuais do curso, Projetos Político-Pedagógicos (PPPs), Editais, protocolos… De uma forma simples de achar e compreender.',
      'Oportunidades & Iniciativas: Catálogo em tempo real de bolsas PUB, Iniciações Científicas, estágios, simpósios, empregos…',
      'Espaços & Mapa Interativo: Conexão direta dos laboratórios físicos do IFUSP via leitura de QR Codes (ainda em desenvolvimento).',
      'Influenciadores & Teste de Radiação: Divulgação de criadores do IFUSP e quiz interativo de fixação da Wiki.'
    ],
    notes: [
      'Explicação detalhada da Wiki CGIF e da integração com o espaço físico.'
    ],
    links: [
      { label: 'Explorar Wiki CGIF', url: '/cgif', variant: 'blue' }
    ]
  },
  {
    id: 5,
    title: 'Aba Ferramentas: Apoio ao Estudo & Pesquisa',
    subtitle: 'Produtividade acadêmica, retenção discente e aproximação com pesquisadores',
    category: 'EIXO 3 — FERRAMENTAS | HUB LABDIV',
    description: 'Ferramentas utilitárias para organizar o tempo de estudo (1h:1h) e conectar alunos a Iniciações Científicas.',
    highlights: [
      'Grade Horária (1h:1h): Planejador semanal de estudos que associa 1 hora de aula a 1 hora de estudo individual, contador de faltas, podendo sincronizar com o Júpiter para suas matérias do semestre, adicionar outros compromissos e exportar para o seu calendário.',
      'Trilhas do Curso: Acompanhamento de disciplinas cursadas, pendências e pré-requisitos com sincronização com o Júpiter para acompanhar o seu andamento no curso.',
      'Match Acadêmico ("Quero uma IC"): União entre alunos interessados em iniciar uma IC com os pesquisadores que buscam por ajudantes.',
      'Como Ingressar & Observatório: Guia para vestibulandos, apoio à permanência e arena dos pesquisadores.'
    ],
    notes: [
      'Explicar o funcionamento das ferramentas acadêmicas e a proporção de 1h aula = 1h estudo.'
    ],
    links: [
      { label: 'Abrir Ferramentas HUB', url: '/ferramentas', variant: 'yellow' },
      { label: 'Ir para Match Acadêmico', url: '/ferramentas/match', variant: 'red' }
    ]
  }
];

export function HubSlideViewer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const currentSlide = HUB_INSTITUCIONAL_SLIDES[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < HUB_INSTITUCIONAL_SLIDES.length - 1 ? prev + 1 : prev));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    if (thumbsRef.current) {
      const activeThumb = thumbsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const renderButtonLink = (link: SlideLink, index: number) => {
    const isExternal = link.url.startsWith('http');
    const colorClasses = {
      yellow: 'bg-[#FFCC00] text-black hover:bg-[#e6b800] shadow-md shadow-brand-yellow/30 font-black',
      blue: 'bg-[#0F4780] text-white hover:bg-[#0c3866] shadow-md shadow-brand-blue/40 border border-brand-blue/50 font-black',
      red: 'bg-[#F14343] text-white hover:bg-[#d63838] shadow-md shadow-brand-red/40 border border-brand-red/50 font-black',
      green: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md border border-emerald-500 font-black',
      outline: 'bg-white/10 text-white hover:bg-white/20 border border-white/20 font-bold'
    }[link.variant || 'yellow'];

    return (
      <a
        key={index}
        href={link.url}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : ''}
        className={`inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 ${colorClasses}`}
      >
        {link.label.includes('PlayStore') ? (
          <Smartphone className="w-4 h-4 shrink-0 text-brand-yellow" />
        ) : link.label.includes('WebApp') ? (
          <Globe className="w-4 h-4 shrink-0" />
        ) : (
          <ExternalLink className="w-4 h-4 shrink-0" />
        )}
        <span>{link.label}</span>
      </a>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header Info - Standard site glass-card */}
      <div className="glass-card p-6 rounded-3xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Top 3 Brand Color Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="w-1/3 bg-[#FFCC00]"></div>
          <div className="w-1/3 bg-[#0F4780]"></div>
          <div className="w-1/3 bg-[#F14343]"></div>
        </div>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-black uppercase tracking-wider mb-2 border border-brand-yellow/40">
            <Presentation className="w-4 h-4" />
            Apresentação do HUB em Linhas Gerais (5 Slides)
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Super App de Comunicação Científica (LabDiv • IFUSP)
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Visão Geral & Conceito, Logo, 3 Eixos e Descrição das Abas (Comunidade, CGIF & Ferramentas)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="/Apresentação - HUB LabDiv.pptx"
            download="Apresentação - HUB LabDiv.pptx"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-yellow hover:bg-[#e6b800] text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg"
            title="Baixar Apresentação em PowerPoint (.pptx)"
          >
            <Download className="w-4 h-4" />
            Baixar PPTX
          </a>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-blue/50 hover:bg-brand-blue/80 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md"
            title="Apresentar em Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-brand-yellow" /> : <Maximize2 className="w-4 h-4 text-brand-yellow" />}
            {isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas - Displays bg-if.svg in both Normal and Fullscreen modes */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center group ${
          isFullscreen 
            ? 'h-screen p-6 rounded-none border-none bg-[#09090B] bg-[url("/bg-if.svg")] bg-repeat bg-center' 
            : 'aspect-video max-h-[750px] bg-transparent border border-white/15'
        }`}
      >
        {/* Top 3 Brand Colors Bar on Canvas Frame */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex z-20">
          <div className="w-1/3 bg-[#FFCC00]"></div>
          <div className="w-1/3 bg-[#0F4780]"></div>
          <div className="w-1/3 bg-[#F14343]"></div>
        </div>

        {/* Slide Canvas Inner Area */}
        <div className="relative z-10 w-full h-full p-6 sm:p-10 flex flex-col justify-between overflow-y-auto pt-8">
          
          {/* Top Bar inside Slide Frame */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-brand-blue/90 text-brand-yellow font-black text-xs uppercase tracking-wider border border-brand-yellow/30 shadow-md">
                {currentSlide.category}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-300 hidden sm:inline-block">
                HUB LabDiv • IFUSP
              </span>
            </div>

            {/* 3 Brand Colors Dots Badge & Slide Counter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]" title="Amarelo LabDiv"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F4780]" title="Azul LabDiv"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#F14343]" title="Vermelho LabDiv"></div>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-black/80 border border-white/20 text-xs font-black text-brand-yellow tracking-wider shadow-lg">
                SLIDE {currentSlide.id} / {HUB_INSTITUCIONAL_SLIDES.length}
              </div>
            </div>
          </div>

          {/* SLIDE CONTENT RENDERER */}
          <div className="my-auto w-full max-w-5xl mx-auto py-2">
            
            {/* SLIDE 1: Visão Geral & Conceito com Logo Oficial */}
            {currentSlide.showFirstSlideLogo && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase italic mb-2">
                      {currentSlide.title}
                    </h3>
                    {currentSlide.subtitle && (
                      <p className="text-lg md:text-xl font-bold text-brand-yellow">
                        {currentSlide.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Logo Badge */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-3 border-2 border-brand-yellow/60 shadow-2xl shrink-0 flex items-center justify-center self-center md:self-auto">
                    <Image
                      src="/icone-HUBLabDiv-white.png"
                      alt="Logo Oficial HUB LabDiv"
                      fill
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                </div>

                {/* Highlights List with 3 Brand Colors */}
                {currentSlide.highlights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-1">
                    {currentSlide.highlights.map((item, idx) => {
                      const colorBorder = idx % 3 === 0 
                        ? 'border-brand-yellow/50' 
                        : idx % 3 === 1 
                        ? 'border-brand-blue/50' 
                        : 'border-brand-red/50';
                      const colorIcon = idx % 3 === 0 
                        ? 'text-brand-yellow' 
                        : idx % 3 === 1 
                        ? 'text-brand-blue-accent' 
                        : 'text-brand-red';

                      return (
                        <div key={idx} className={`glass-card p-4 md:p-5 rounded-2xl border ${colorBorder} shadow-lg flex items-start gap-3.5 hover:scale-102 transition-all`}>
                          <CheckCircle2 className={`w-5 h-5 ${colorIcon} shrink-0 mt-0.5`} />
                          <span className="text-sm font-semibold text-gray-200 leading-relaxed">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SLIDE 2: Divisão nos 3 Eixos Principais */}
            {currentSlide.showThreeAxes && (
              <div className="flex flex-col gap-6 text-center">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mb-2">
                    {currentSlide.title}
                  </h3>
                  <p className="text-lg font-bold text-brand-yellow">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* 3 Eixos Cards Tricolores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left my-2">
                  <div className="glass-card p-6 rounded-3xl border-2 border-brand-blue/60 bg-gradient-to-b from-brand-blue/20 to-black/80 shadow-2xl flex flex-col justify-between hover:scale-105 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-brand-blue/30 border border-brand-blue/60 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-brand-blue-accent" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-1">1. Eixo Social</h4>
                      <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/30 text-brand-blue-accent text-xs font-black uppercase mb-3 border border-brand-blue/50">
                        REDE SOCIAL &amp; INTERAÇÕES
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                        Feed focado na comunicação científica (Fluxo), galeria artística (Arte), vivências cotidianas (Logs) e a Central de Interações com Emaranhamento Quântico e Pergunte a um Cientista.
                      </p>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border-2 border-brand-red/60 bg-gradient-to-b from-brand-red/20 to-black/80 shadow-2xl flex flex-col justify-between hover:scale-105 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-brand-red/20 border border-brand-red/50 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-brand-red" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-1">2. Eixo Informativo</h4>
                      <span className="inline-block px-3 py-1 rounded-full bg-brand-red/20 text-brand-red text-xs font-black uppercase mb-3 border border-brand-red/40">
                        INFORMATIVO &amp; WIKI
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                        Central de Gestão e Informação (CGIF), espaços, iniciativas, coletivos e divulgadores do instituto, mapa interativo do IFUSP e Wiki centralizada reunindo portais, manuais e editais.
                      </p>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border-2 border-brand-yellow/60 bg-gradient-to-b from-brand-yellow/15 to-black/80 shadow-2xl flex flex-col justify-between hover:scale-105 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 border border-brand-yellow/50 flex items-center justify-center mb-4">
                        <Wrench className="w-6 h-6 text-brand-yellow" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-1">3. Eixo Ferramentas</h4>
                      <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-black uppercase mb-3 border border-brand-yellow/40">
                        ESTUDO &amp; PESQUISA
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                        Planejador de grade horária 1h:1h, acompanhamento de faltas, evolução no curso e Match Acadêmico ("Quero uma IC" e grupos de estudo).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 3: Aba Comunidade com Descrição Detalhada das 3 Seções (Fluxo, Logs e Arte) */}
            {currentSlide.showComunidadeDescriptions && (
              <div className="flex flex-col gap-5 text-left">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mb-1">
                    {currentSlide.title}
                  </h3>
                  <p className="text-base font-bold text-brand-yellow">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* 3 Section Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 my-1">
                  
                  {/* Seção 1: Fluxo (Amarelo) */}
                  <div className="glass-card p-6 rounded-3xl border-2 border-brand-yellow/60 bg-black/80 shadow-xl flex flex-col justify-between hover:scale-103 transition-all">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-brand-yellow/30">
                        <MessageSquare className="w-5 h-5 text-brand-yellow" />
                        <h4 className="text-lg font-black uppercase tracking-wider text-white">1. Fluxo</h4>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow text-[11px] font-black uppercase mb-3 border border-brand-yellow/40">
                        COMUNICAÇÃO DIALÓGICA
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                        Feed principal onde o conteúdo científico é compartilhado com foco em estabelecer uma relação dialógica dos usuários com o conteúdo, focando em métricas pedagógicas e não de vaidade.
                      </p>
                    </div>
                  </div>

                  {/* Seção 2: Logs (Azul) */}
                  <div className="glass-card p-6 rounded-3xl border-2 border-brand-blue/60 bg-black/80 shadow-xl flex flex-col justify-between hover:scale-103 transition-all">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-brand-blue/30">
                        <Users className="w-5 h-5 text-brand-blue-accent" />
                        <h4 className="text-lg font-black uppercase tracking-wider text-white">2. Logs</h4>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-blue/30 text-brand-blue-accent text-[11px] font-black uppercase mb-3 border border-brand-blue/50">
                        VIVÊNCIA DISCENTE
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                        Espaço relatos/notícias/fofocas — um espaço para a vivência acadêmica, trocas cotidianas e desabafos entre alunos com sistema de fios energizados que conectam a comunidade.
                      </p>
                    </div>
                  </div>

                  {/* Seção 3: Arte (Vermelho) */}
                  <div className="glass-card p-6 rounded-3xl border-2 border-brand-red/60 bg-black/80 shadow-xl flex flex-col justify-between hover:scale-103 transition-all">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-brand-red/30">
                        <Palette className="w-5 h-5 text-brand-red" />
                        <h4 className="text-lg font-black uppercase tracking-wider text-white">3. Arte</h4>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-red/20 text-brand-red text-[11px] font-black uppercase mb-3 border border-brand-red/40">
                        EXPRESSÃO ARTÍSTICA
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                        Galeria autoral de expressão visual, fotográfica, poética… Um espaço para mostrar que o ambiente acadêmico é feito por seres humanos.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Standard Slide Layouts for Slides 4 e 5 */}
            {!currentSlide.showFirstSlideLogo && !currentSlide.showThreeAxes && !currentSlide.showComunidadeDescriptions && (
              <div className="flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase italic mb-3">
                    {currentSlide.title}
                  </h3>
                  {currentSlide.subtitle && (
                    <p className="text-lg md:text-xl font-bold text-brand-yellow">
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>

                {/* Highlights List with 3 Brand Colors */}
                {currentSlide.highlights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-1">
                    {currentSlide.highlights.map((item, idx) => {
                      const colorBorder = idx % 3 === 0 
                        ? 'border-brand-yellow/50' 
                        : idx % 3 === 1 
                        ? 'border-brand-blue/50' 
                        : 'border-brand-red/50';
                      const colorIcon = idx % 3 === 0 
                        ? 'text-brand-yellow' 
                        : idx % 3 === 1 
                        ? 'text-brand-blue-accent' 
                        : 'text-brand-red';

                      return (
                        <div key={idx} className={`glass-card p-4 md:p-5 rounded-2xl border ${colorBorder} shadow-lg flex items-start gap-3.5 hover:scale-102 transition-all`}>
                          <CheckCircle2 className={`w-5 h-5 ${colorIcon} shrink-0 mt-0.5`} />
                          <span className="text-sm font-semibold text-gray-200 leading-relaxed">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Bottom Action Bar inside Slide Frame */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/15">
            <p className="text-xs text-gray-300 font-medium max-w-xl line-clamp-2 text-left">
              {currentSlide.description}
            </p>

            {/* Clickable Action Link Buttons */}
            {currentSlide.links && currentSlide.links.length > 0 && (
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                {currentSlide.links.map((link, idx) => renderButtonLink(link, idx))}
              </div>
            )}
          </div>

        </div>

        {/* Left Arrow Navigation */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all ${
            currentIndex === 0 
              ? 'opacity-20 cursor-not-allowed' 
              : 'hover:bg-brand-yellow hover:text-black hover:scale-110 opacity-80 group-hover:opacity-100 shadow-xl'
          }`}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Navigation */}
        <button
          onClick={goToNext}
          disabled={currentIndex === HUB_INSTITUCIONAL_SLIDES.length - 1}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all ${
            currentIndex === HUB_INSTITUCIONAL_SLIDES.length - 1 
              ? 'opacity-20 cursor-not-allowed' 
              : 'hover:bg-brand-yellow hover:text-black hover:scale-110 opacity-80 group-hover:opacity-100 shadow-xl'
          }`}
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails Carousel Bar */}
      <div className="glass-card p-4 rounded-3xl border-white/10">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Presentation className="w-4 h-4 text-brand-yellow" />
            Navegação por Miniaturas (5 Slides Tricolores)
          </span>
          <span className="text-xs text-brand-yellow font-bold">
            {currentIndex + 1} de {HUB_INSTITUCIONAL_SLIDES.length} selecionado
          </span>
        </div>

        <div 
          ref={thumbsRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-yellow/30"
        >
          {HUB_INSTITUCIONAL_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-36 aspect-video rounded-xl overflow-hidden border-2 transition-all group ${
                  isActive 
                    ? 'border-brand-yellow scale-105 shadow-lg shadow-brand-yellow/30' 
                    : 'border-white/15 hover:border-white/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-brand-blue/80 to-black p-2 flex flex-col justify-between text-left">
                  <span className="text-[10px] font-black text-brand-yellow uppercase tracking-wider line-clamp-1">{slide.category}</span>
                  <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{slide.title}</span>
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                <div className={`absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/90 text-[10px] font-bold ${isActive ? 'text-brand-yellow' : 'text-white'}`}>
                  {slide.id}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide Details & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card p-6 rounded-3xl border-white/10">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-yellow mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Resumo do Slide
          </h3>
          <p className="text-gray-200 font-medium text-base leading-relaxed mb-6">
            {currentSlide.description}
          </p>

          {currentSlide.links && currentSlide.links.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3">
                Links e Recursos Clicáveis:
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                {currentSlide.links.map((link, idx) => renderButtonLink(link, idx))}
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6 rounded-3xl border-white/10">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue-accent mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-yellow" />
            Notas de Apresentação
          </h3>
          {currentSlide.notes && currentSlide.notes.length > 0 ? (
            <ul className="space-y-2.5">
              {currentSlide.notes.map((note, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5 leading-relaxed">
                  <span className="text-brand-yellow font-bold text-sm">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">Sem notas adicionais para este slide.</p>
          )}
        </div>
      </div>

    </div>
  );
}
