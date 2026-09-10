'use client';

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

import Link from 'next/link';
import Image from 'next/image';
import { ColisorIcon } from '../icons/ColisorIcon';
import { USPLogo } from '../icons/USPLogo';
import { IFUSPLogo } from '../icons/IFUSPLogo';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { Atom } from 'lucide-react';

export function Footer() {
    const { institution } = usePersonalizacaoStore();

    const copyEmail = (email: string) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(email);
            import('react-hot-toast').then(m => m.toast.success('E-mail copiado!'));
        }
        window.location.href = `mailto:${email}`;
    };

    // 1. BRAND CARD & APRESENTAÇÃO
    const BrandCardBlock = () => (
        <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl rounded-2xl px-4 py-3.5 border border-white/30 dark:border-white/10 shadow-2xl w-fit -ml-1">
                <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                        src="/icone-HUBLabDiv.svg"
                        alt="HUB LabDiv Logo"
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex flex-col -space-y-0.5">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-bukra font-bold text-xl text-gray-900 dark:text-white uppercase leading-tight">HUB</span>
                        <span className="font-bukra font-black text-xl text-gradient-brand leading-tight">LabDiv</span>
                        <div className="flex items-center opacity-90">
                            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-blue/10 dark:bg-white/10 text-brand-blue dark:text-gray-400 ml-1">BETA</span>
                        </div>
                    </div>
                    <span className="text-[8px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bukra font-medium">
                        {institution === 'ime' ? 'IME-USP' : institution === 'iag' ? 'IAG-USP' : institution === 'igc' ? 'IGC-USP' : institution === 'io' ? 'IO-USP' : 'Física USP'}
                    </span>
                </div>
                <div className="flex items-center gap-2.5 ml-1">
                    <div className="w-px h-7 bg-gray-200 dark:bg-white/15"></div>
                    {institution === 'ime' ? (
                        <Image 
                            src="/instituto_de_matemtica_e_estatstica_universidade_de_so_paulo_ime_usp_logo.jpeg"
                            alt="IME USP Logo"
                            width={42}
                            height={42}
                            className="object-contain rounded-lg border border-gray-200 dark:border-white/10"
                            priority
                        />
                    ) : institution === 'iag' ? (
                        <Image 
                            src="/2oj0z6xd_400x400.jpg"
                            alt="IAG USP Logo"
                            width={42}
                            height={42}
                            className="object-contain rounded-lg border border-gray-200 dark:border-white/10"
                            priority
                        />
                    ) : institution === 'igc' ? (
                        <Image 
                            src="/unnamed.jpg"
                            alt="IGC USP Logo"
                            width={42}
                            height={42}
                            className="object-contain rounded-lg border border-gray-200 dark:border-white/10"
                            priority
                        />
                    ) : institution === 'io' ? (
                        <Image 
                            src="/image.png"
                            alt="IO USP Logo"
                            width={42}
                            height={42}
                            className="object-contain rounded-lg border border-gray-200 dark:border-white/10"
                            priority
                        />
                    ) : (
                        <IFUSPLogo size={42} className="text-brand-blue dark:text-brand-blue-accent opacity-95" />
                    )}
                </div>
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                Hub de Comunicação Científica do Lab-Div — Um projeto para aprimorar a comunicação acadêmica no IFUSP e reunir em um FLUXO interativo o arquivo de divulgação do laboratório e de toda a comunidade científica.
            </p>
        </div>
    );

    // 2. NAVEGAÇÃO DIVIDIDA NOS 3 EIXOS
    const NavegacaoBlock = () => (
        <div className="space-y-4">
            <h4 className="font-bukra font-bold text-white uppercase text-xs tracking-wider border-l-4 border-white/60 pl-3">
                Navegação
            </h4>
            
            <div className="space-y-4 font-sans">
                {/* EIXO 1: SOCIAL (Barra Azul) */}
                <div className="space-y-2 border-l-2 border-brand-blue pl-3 py-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-blue font-bukra block">
                        1. Social
                    </span>
                    <ul className="space-y-1.5">
                        <li>
                            <Link href="/" className="flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[16px] w-4 h-4 flex items-center justify-center flex-shrink-0 text-white/90">groups</span>
                                Feed da Comunidade
                            </Link>
                        </li>
                        <li>
                            <Link href="/interacao" className="flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[16px] w-4 h-4 flex items-center justify-center flex-shrink-0 text-white/90">hub</span>
                                Central de Interações
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* EIXO 2: INFORMATIVO / WIKI & DADOS (Barra Vermelha) */}
                <div className="space-y-2 border-l-2 border-brand-red pl-3 py-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-red font-bukra block">
                        2. Informativo (Wiki & Dados)
                    </span>
                    <ul className="space-y-1.5">
                        <li>
                            <Link href="/gcif" className="flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors">
                                <ColisorIcon size={16} animate={false} className="w-4 h-4 flex-shrink-0 text-white" />
                                O Grande Colisor do IF
                            </Link>
                        </li>
                        <li>
                            <Link href="/wiki" className="flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[16px] w-4 h-4 flex items-center justify-center flex-shrink-0 text-white/90">menu_book</span>
                                Wiki Centralizada
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* EIXO 3: FERRAMENTAS / ESTUDO & PESQUISA (Barra Amarela) */}
                <div className="space-y-2 border-l-2 border-brand-yellow pl-3 py-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-yellow font-bukra block">
                        3. Ferramentas (Estudo & Pesquisa)
                    </span>
                    <ul className="space-y-1.5">
                        <li>
                            <Link href="/ferramentas" className="flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[16px] w-4 h-4 flex items-center justify-center flex-shrink-0 text-white/90">construction</span>
                                Ferramentas Acadêmicas
                            </Link>
                        </li>
                        <li>
                            <Link href="/ingresso" className="flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[16px] w-4 h-4 flex items-center justify-center flex-shrink-0 text-white">school</span>
                                Como Ingressar
                            </Link>
                        </li>
                        <li>
                            <Link href="/arena" className="flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[16px] w-4 h-4 flex items-center justify-center flex-shrink-0 text-white/90">visibility</span>
                                Observatório de Pesquisa
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin" className="flex items-center gap-2 text-[10px] text-white/60 hover:text-white transition-colors pt-1">
                                <span className="material-symbols-outlined text-[14px] w-4 h-4 flex items-center justify-center flex-shrink-0 text-white/60">admin_panel_settings</span>
                                Painel de Controle
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );

    // 3. LABDIV (COORDENAÇÃO, COFUNDADORES & CONTATO)
    const LabDivBlock = () => (
        <div className="space-y-4">
            <h4 className="font-bukra font-bold text-white uppercase text-xs tracking-wider border-l-4 border-white/60 pl-3">
                LabDiv
            </h4>
            <ul className="space-y-4 text-xs sm:text-sm font-sans">
                {/* Prof. Caetano Miranda */}
                <li className="flex items-start gap-2.5 text-white/80">
                    <span className="material-symbols-outlined text-[18px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">school</span>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Coordenador e Co-fundador:</p>
                        <p className="font-bold text-white">Prof. Caetano Miranda</p>
                        <button
                            onClick={() => copyEmail('cmiranda@if.usp.br')}
                            className="text-xs text-white/70 hover:text-white hover:underline transition-colors text-left"
                            title="Clique para copiar"
                        >
                            cmiranda@if.usp.br
                        </button>
                    </div>
                </li>

                {/* Dani Serafim */}
                <li className="flex items-start gap-2.5 text-white/80">
                    <span className="material-symbols-outlined text-[18px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">person</span>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Co-fundadora:</p>
                        <p className="font-bold text-white">Dani Serafim</p>
                        <button
                            onClick={() => copyEmail('dani.tserafim@usp.br')}
                            className="text-xs text-white/70 hover:text-white hover:underline transition-colors text-left"
                            title="Clique para copiar"
                        >
                            dani.tserafim@usp.br
                        </button>
                    </div>
                </li>

                {/* E-mail geral */}
                <li className="flex items-center gap-2.5 text-white/80">
                    <span className="material-symbols-outlined text-[18px] w-5 h-5 flex items-center justify-center flex-shrink-0 text-white">email</span>
                    <button
                        onClick={() => copyEmail('labdiv@usp.br')}
                        className="text-xs text-white/80 hover:text-white hover:underline transition-colors text-left"
                        title="Clique para copiar"
                    >
                        labdiv@usp.br
                    </button>
                </li>

                {/* Instagram */}
                <li className="flex items-center gap-2.5 text-white/80">
                    <svg className="w-4 h-4 text-white flex-shrink-0 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    <a href="https://www.instagram.com/labdiv.ifusp/" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline transition-colors text-white/80 hover:text-white">
                        @labdiv.ifusp
                    </a>
                </li>

                {/* Endereço */}
                <li className="flex items-start gap-2.5 text-xs text-white/60 pt-1">
                    <span className="material-symbols-outlined text-[18px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white/70">place</span>
                    <span className="leading-relaxed">
                        Ed. Novo Milênio, Instituto de Física, USP.<br />
                        Rua do Matão, 1371, São Paulo - SP.
                    </span>
                </li>
            </ul>
        </div>
    );

    // 4. PESQUISA
    const PesquisaBlock = () => (
        <div className="space-y-3">
            <h4 className="font-bukra font-bold text-white uppercase text-xs tracking-wider border-l-4 border-white/60 pl-3">
                Pesquisa
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-sans">
                {/* Orientação: Prof. José Ortega */}
                <li className="flex items-start gap-2.5 text-white/80">
                    <span className="material-symbols-outlined text-[18px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">school</span>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Orientação da Pesquisa:</p>
                        <p className="font-bold text-white">Prof. José Ortega</p>
                        <button
                            onClick={() => copyEmail('ortega@if.usp.br')}
                            className="text-xs text-white/70 hover:text-white hover:underline transition-colors text-left"
                            title="Clique para copiar"
                        >
                            ortega@if.usp.br
                        </button>
                    </div>
                </li>

                {/* Pesquisador: João Stangorlini */}
                <li className="flex items-start gap-2.5 text-white/80">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                        <Atom className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Pesquisador:</p>
                        <p className="font-bold text-white">João Stangorlini</p>
                        <button
                            onClick={() => copyEmail('joaopaulostangorlini@usp.br')}
                            className="text-xs text-white/70 hover:text-white hover:underline transition-colors text-left"
                            title="Clique para copiar"
                        >
                            joaopaulostangorlini@usp.br
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    );

    // 5. RESPONSÁVEIS PELO SITE
    const ResponsaveisBlock = () => (
        <div className="space-y-3">
            <h4 className="font-bukra font-bold text-white uppercase text-xs tracking-wider border-l-4 border-white/60 pl-3">
                Responsáveis pelo site
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-sans">
                {/* João Stangorlini - Criador e Desenvolvedor */}
                <li className="flex items-start gap-2.5 text-white/80">
                    <span className="material-symbols-outlined text-[18px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">code</span>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Criador e Desenvolvedor:</p>
                        <p className="font-bold text-white">João Stangorlini</p>
                        <button
                            onClick={() => copyEmail('joaopaulostangorlini@usp.br')}
                            className="text-xs text-white/70 hover:text-white hover:underline transition-colors text-left"
                            title="Clique para copiar"
                        >
                            joaopaulostangorlini@usp.br
                        </button>
                    </div>
                </li>

                {/* Adrian Raposo - Desenvolvedor */}
                <li className="flex items-start gap-2.5 text-white/80">
                    <span className="material-symbols-outlined text-[18px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">terminal</span>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Desenvolvedor:</p>
                        <p className="font-bold text-white">Adrian Raposo</p>
                        <button
                            onClick={() => copyEmail('andyraposo@usp.br')}
                            className="text-xs text-white/70 hover:text-white hover:underline transition-colors text-left"
                            title="Clique para copiar"
                        >
                            andyraposo@usp.br
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    );

    return (
        <footer className="w-full mt-16 lg:mt-24 mb-6 bg-brand-blue border border-white/15 rounded-3xl p-6 sm:p-8 lg:p-10 text-white/90 shadow-2xl transition-colors duration-300">
            <div className="w-full">
                
                {/* --- TOPO DO FOOTER: APRESENTAÇÃO E LOGO DO HUB LABDIV --- */}
                {/* Fica em linha própria no topo com largura adequada, sem sobrepor nenhuma coluna */}
                <div className="mb-10">
                    <BrandCardBlock />
                </div>

                {/* LINHA DIVISÓRIA SUTIL */}
                <div className="border-t border-white/15 mb-10" />

                {/* --- GRADE PRINCIPAL DE TÓPICOS --- */}
                {/* Telas reduzidas (<1280px): 2 colunas simétricas (2 tópicos por lado) */}
                {/* Telas grandes (>=1280px): 4 colunas niveladas (1 tópico por coluna) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-8 mb-12">
                    {/* Tópico 1: Navegação (Esquerda no md, Coluna 1 no xl) */}
                    <div className="col-span-1">
                        <NavegacaoBlock />
                    </div>

                    {/* Tópico 2: LabDiv (Direita no md, Coluna 2 no xl) */}
                    <div className="col-span-1">
                        <LabDivBlock />
                    </div>

                    {/* Linha horizontal nivelada para telas reduzidas (md) */}
                    <div className="col-span-1 md:col-span-2 xl:hidden border-t border-white/15 my-1" />

                    {/* Tópico 3: Pesquisa (Esquerda no md, Coluna 3 no xl) */}
                    <div className="col-span-1">
                        <PesquisaBlock />
                    </div>

                    {/* Tópico 4: Responsáveis pelo site (Direita no md, Coluna 4 no xl) */}
                    <div className="col-span-1">
                        <ResponsaveisBlock />
                    </div>
                </div>

                {/* BOTTOM BAR: USP LOGO & COPYRIGHT */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <USPLogo size={100} className="text-white opacity-80 hover:opacity-100 transition-opacity" />
                        <p className="text-xs text-white/40 font-open-sans">
                            © {new Date().getFullYear()} IFUSP. Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center">
                            <span className="text-[9px] font-bold text-white/50 border border-white/20 px-2 py-0.5 rounded font-bukra uppercase tracking-wider">v6.4 BETA</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-3 h-3 rounded-sm bg-brand-blue shadow-sm shadow-brand-blue/50"></div>
                            <div className="w-3 h-3 rounded-sm bg-brand-red shadow-sm shadow-brand-red/50"></div>
                            <div className="w-3 h-3 rounded-sm bg-brand-yellow shadow-sm shadow-brand-yellow/50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
