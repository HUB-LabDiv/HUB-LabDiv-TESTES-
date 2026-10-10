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


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ShieldCheck,
    Zap,
    Atom,
    Coins,
    Telescope,
    Brain,
    ChevronRight,
    AlertCircle,
    ArrowLeft,
    HeartHandshake,
    Network,
    Microscope,
    Compass, 
    Landmark,
    MessageSquare,
    BookOpen,
    Search
} from 'lucide-react';
import { SacSection } from '@/components/sac/SacSection';

// --- DATA STRUCTURE (O Síncrotron) ---
export const WIKI_CATEGORIES = [
    {
        id: 'vida-universitaria',
        name: 'Vida Universitária & Apoio',
        shortName: 'Vida Universitária',
        color: 'brand-yellow',
        description: 'Tudo o que você precisa para navegar pelo campus, acessar auxílios de permanência e cuidar do seu bem-estar.'
    },
    {
        id: 'formacao-pesquisa',
        name: 'Formação Acadêmica & Pesquisa',
        shortName: 'Formação & Pesquisa',
        color: 'brand-red',
        description: 'Guias essenciais sobre o currículo do IFUSP, ingresso na Iniciação Científica e planejamento de carreira.'
    },
    {
        id: 'divulgacao-extensao',
        name: 'Divulgação Científica & Extensão',
        shortName: 'Divulgação & Extensão',
        color: 'brand-blue',
        description: 'Padrões de produção de mídia, design visual do LabDiv e catálogo de grupos de extensão ativos.'
    }
] as const;

export const wikiCells = [
    // --- Categoria 1: Vida Universitária & Apoio (Amarelo) ---
    {
        id: 'calouro',
        title: 'Manual do Calouro & Sobrevivência',
        subtitle: 'Guia Prático da USP e do IFUSP.',
        category: 'vida-universitaria',
        icon: <Zap className="w-8 h-8" />,
        color: 'brand-yellow',
        href: '/wiki/calouro',
        description: 'Tudo sobre bandejão, moradia no CRUSP, JúpiterWeb, rotas de circulares, prédios e serviços essenciais do campus.',
        details: [
            'Localização: Edifício Principal, Ala Central e Didática',
            'Bandejão (SAS), Júpiter Web e e-mail institucional',
            'Moradia: CRUSP (Blocos A a G) e Circulares BUSP'
        ],
        keywords: ['bandejão', 'crusp', 'matão', 'sobrevivência', 'calouro', 'ajuda', 'logística', 'jupiter', 'sas'],
        cta: 'Ver Guia do Calouro'
    },
    {
        id: 'bolsas',
        title: 'Bolsas & Auxílios de Permanência',
        subtitle: 'PAPFE, PUB, Monitoria e Moradia.',
        category: 'vida-universitaria',
        icon: <Coins className="w-8 h-8" />,
        color: 'brand-yellow',
        href: '/wiki/bolsas',
        description: 'Programas de apoio financeiro, bolsas de ensino e pesquisa, auxílios moradia e alimentação (PAPFE/PRIP) e editais abertos.',
        details: [
            'PAPFE: Auxílio Permanência e Alimentação (PRIP)',
            'Editais 2026: Monitoria, Pró-Aluno, PUB e IC',
            'Inclusão: Apoio a grupos vulneráveis e moradia'
        ],
        keywords: ['bolsas', 'papfe', 'permanência', 'monitoria', 'ic', 'iniciação científica', 'dinheiro', 'editais', 'auxílio', 'prip'],
        cta: 'Ver Bolsas e Auxílios'
    },
    {
        id: 'protecao',
        title: 'Saúde Mental & Apoio Estudantil',
        subtitle: 'Inclusão, Acolhimento e Suporte.',
        category: 'vida-universitaria',
        icon: <HeartHandshake className="w-8 h-8" />,
        color: 'brand-yellow',
        href: '/wiki/protecao',
        description: 'Políticas de permanência humanizada, rotas de atendimento em saúde mental, apoio à neurodiversidade (TEA) e acolhimento.',
        details: [
            'Neurodiversidade: Guia Portaria PRIP 059/2024 (TEA)',
            'Apoio Psicológico: Rotas de acolhimento (IP-USP)',
            'Canais de Escuta e Grupos de Afinidade IFUSP'
        ],
        keywords: ['proteção', 'saúde mental', 'tea', 'neurodiversidade', 'acolhimento', 'prip', 'suporte', 'ajuda', 'inclusão', 'bem-estar', 'pcd'],
        cta: 'Acessar Rede de Apoio'
    },

    // --- Categoria 2: Formação Acadêmica & Pesquisa (Vermelho) ---
    {
        id: 'ifusp',
        title: 'Cursos, Grades & Graduação IFUSP',
        subtitle: 'Bacharelado, Licenciatura, PPPs e Comissões.',
        category: 'formacao-pesquisa',
        icon: <Atom className="w-8 h-8" />,
        color: 'brand-red',
        href: '/wiki/ifusp',
        description: 'Estrutura curricular, regras de transição de PPP, disciplinas eletivas/optativas, comissões de graduação (CG/CoCs) e formação.',
        details: [
            'Bacharelado, Licenciatura e Física Médica (PPP 2025)',
            'Governança: Papel da CG e CoCs do Instituto',
            'Grade: Optativas, Eletivas e Atividades de Extensão'
        ],
        keywords: ['ppp', 'bacharelado', 'licenciatura', 'física médica', 'grade', 'optativas', 'atpa', 'comissão', 'cg', 'coc'],
        cta: 'Ver Estrutura Curricular'
    },
    {
        id: 'pesquisa',
        title: 'Iniciação Científica & Laboratórios',
        subtitle: 'Como Conseguir IC, Orientadores e Labs.',
        category: 'formacao-pesquisa',
        icon: <Microscope className="w-8 h-8" />,
        color: 'brand-red',
        href: '/wiki/pesquisa',
        description: 'Guia prático para conseguir Iniciação Científica (IC), mapa dos laboratórios de pesquisa do IFUSP e uso do Sistema Ateneu.',
        details: [
            'Como encontrar e contatar um orientador de IC',
            'Laboratórios de Pesquisa e Infraestrutura Científica',
            'Sistema Ateneu: Cadastro, Bolsas e Relatórios'
        ],
        keywords: ['pesquisa', 'ic', 'iniciação científica', 'laboratório', 'ateneu', 'orientador', 'ciência'],
        cta: 'Explorar Pesquisa e Labs'
    },
    {
        id: 'metodologia',
        title: 'Como Pesquisar & Metodologia',
        subtitle: 'Metodologia Científica e Busca de Artigos.',
        category: 'formacao-pesquisa',
        icon: <Search className="w-8 h-8" />,
        color: 'brand-red',
        href: '/wiki/metodologia',
        description: 'Dicas práticas de como formular buscas eficientes, usar operadores booleanos, acessar Sci-Hub, Google Scholar e bases da USP.',
        details: [
            'Bases de Dados: Google Scholar, Sci-Hub e arXiv',
            'Operadores Booleanos e Sintaxe de Busca Avançada',
            'Gestão Bibliográfica e Metodologia Científica'
        ],
        keywords: ['metodologia', 'pesquisa', 'busca', 'artigos', 'scholar', 'sci-hub', 'base de dados', 'periódicos', 'arxiv'],
        cta: 'Aprender a Pesquisar'
    },
    {
        id: 'carreira',
        title: 'Carreira & Mercado de Trabalho',
        subtitle: 'Pós-Graduação, Indústria e Docência.',
        category: 'formacao-pesquisa',
        icon: <Compass className="w-8 h-8" />,
        color: 'brand-red',
        href: '/wiki/carreira',
        description: 'Caminhos profissionais para graduandos: pós-graduação acadêmica, física médica, transição para inovação, dados e docência.',
        details: [
            'Pós-Graduação: Mestrado, Doutorado e Exame Unificado',
            'Mercado de Trabalho: Ciência de Dados, Finanças e Indústria',
            'Física Médica, Ensino de Física e Setor Tecnológico'
        ],
        keywords: ['carreira', 'futuro', 'trabalho', 'indústria', 'academia', 'pós-graduação', 'ensino', 'vagas'],
        cta: 'Explorar Carreiras'
    },

    // --- Categoria 3: Divulgação Científica & Extensão (Azul) ---
    {
        id: 'guia-de-boas-praticas',
        title: 'Guia de Produção & Boas Práticas',
        subtitle: 'Padrões de Mídia, Créditos e Formatos.',
        category: 'divulgacao-extensao',
        icon: <ShieldCheck className="w-8 h-8" />,
        color: 'brand-blue',
        href: '/wiki/guia-de-boas-praticas',
        description: 'Diretrizes oficiais para produção de artigos, fotos, vídeos, ilustrações e atribuição correta de coautorias no HUB.',
        details: [
            'Co-autoria e Créditos: Como marcar sua equipe',
            'Fotografia e Vídeo: Padrões de iluminação e enquadramento',
            'Submissão nos 3 Feeds: Fluxo, Arte e Logs'
        ],
        keywords: ['guia', 'boas práticas', 'manual', 'foto', 'vídeo', 'créditos', 'qualidade', 'padrões'],
        cta: 'Ver Guia de Boas Práticas'
    },
    {
        id: 'divulgacao',
        title: 'Divulgação Científica & Mídia',
        subtitle: 'Toolkit LabDiv, Posters e Design Visual.',
        category: 'divulgacao-extensao',
        icon: <Telescope className="w-8 h-8" />,
        color: 'brand-blue',
        href: '/wiki/divulgacao',
        description: 'Metodologias, manuais de design e recursos visuais para transformar pesquisas complexas em comunicação de alto impacto.',
        details: [
            'Mapeamento 360°, VR e vídeos imersivos',
            'Guia Visual LabDiv (Azul Elétrico) e MIT Style',
            'Toolkit de design para posters e redes sociais'
        ],
        keywords: ['divulgação', 'design', 'labdiv', '360', 'vr', 'poster', 'mídia', 'comunicação', 'impacto', 'toolkit'],
        cta: 'Ver Toolkit de Divulgação'
    },
    {
        id: 'extensao',
        title: 'Extensão Universitária & Cultura',
        subtitle: 'Grupos de Extensão, Eventos e Projetos.',
        category: 'divulgacao-extensao',
        icon: <Network className="w-8 h-8" />,
        color: 'brand-blue',
        href: '/wiki/extensao',
        description: 'Catálogo de grupos de extensão do IFUSP, projetos como Física para Todos e oportunidades de integração com a sociedade.',
        details: [
            'Catálogo de Grupos de Extensão do IFUSP',
            'Eventos: Física para Todos, Mostras e Palestras',
            'Projetos de Cultura e Proposição de Ações Estudantis'
        ],
        keywords: ['extensão', 'cultura', 'eventos', 'física para todos', 'grupos', 'projetos'],
        cta: 'Ver Grupos de Extensão'
    }
];

export const institutoCell = {
    id: 'instituto',
    title: 'O Instituto de Física',
    subtitle: 'Estrutura, História e Espaços.',
    icon: <Landmark className="w-8 h-8" />,
    color: 'brand-blue-ifusp',
    href: '/wiki/instituto',
    description: 'Mergulhe na história do IFUSP e entenda como um dos institutos de física mais respeitados do mundo é organizado atualmente.',
    details: [
        'Organização: Diretoria, Conselhos e Comissões',
        'História: Legado e Pioneirismo na Ciência',
        'Departamentos e Centros de Pesquisa'
    ],
    keywords: ['ifusp', 'instituto', 'física', 'departamento', 'auditório', 'história', 'alimentação', 'convivência', 'mapa'],
    cta: 'Aprender sobre o IFUSP'
};

const quizCell = {
    id: 'quiz',
    title: 'Teste de Radiação',
    subtitle: 'Quiz de Conhecimento Hub.',
    icon: <Brain className="w-8 h-8" />,
    color: 'brand-red',
    href: '/wiki/quiz',
    description: 'Desafie seus conhecimentos e exploda o contador Geiger ao acertar os desafios.',
    details: [
        'Curiosidades históricas do IFUSP',
        'Desafios de física e divulgação',
        'Ranking de colisão da comunidade'
    ],
    keywords: ['quiz', 'teste', 'desafio', 'conhecimento', 'história', 'ranking', 'geiger'],
    cta: 'Iniciar Varredura'
};

const acessoRapidoCell = {
    id: 'acesso-rapido',
    title: 'Acesso Rápido & IFUSP 101',
    subtitle: 'Links Úteis e Conselhos de Veteranos',
    icon: <Search className="w-8 h-8" />,
    href: '/wiki/veteranos',
    description: 'Não achou sua resposta? Acesse links diretos para Scholar, Sci-Hub e Portal do IF, além de dicas essenciais enviadas por veteranos.',
    cta: 'Conferir o IFUSP 101'
};

const ferramentasAcademicasCell = {
    id: 'ferramentas-academicas',
    title: 'Aceleradores de Pesquisa',
    subtitle: 'Sci-Hub, Google Scholar e GEM',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'brand-blue',
    href: '/wiki/ferramentas-academicas',
    description: 'Acesse rapidamente as principais plataformas de busca de artigos, dados abertos e a inteligência GEM do HUB.',
    cta: 'Acessar Ferramentas'
};



const renderIFUSP = (text: string) => {
    if (!text) return text;
    return text.replace(/IF-USP|IF USP/gi, 'IFUSP');
};

export function WikiView() {
    return (
        <div className="bg-transparent pb-12 overflow-x-hidden pt-8">
            <div className="max-w-6xl mx-auto">
                {/* --- Elite Header --- */}
                <div className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] mb-4 text-gray-900 dark:text-white">
                                WIKI <span className="text-gradient-brand">HUB</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl font-medium leading-relaxed [text-shadow:var(--text-halo)]">
                                {renderIFUSP('O Síncrotron de Conhecimento do IFUSP. O repositório definitivo para sobrevivência, ética e divulgação científica.')}
                            </p>
                        </motion.div>


                    </div>
                </div>



                {/* --- Wiki Matrix (Grid de Elite 3x3) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <AnimatePresence mode="popLayout">
                        {wikiCells.map((cell: any, idx) => (
                            <motion.div
                                key={cell.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <Link
                                    href={cell.href}
                                    className={`relative block h-full group glass-card rounded-[40px] p-8 hover:border-${cell.color} transition-all shadow-2xl overflow-hidden`}
                                >
                                    <div className={`absolute -right-20 -top-20 size-64 bg-${cell.color}/5 blur-[100px] group-hover:bg-${cell.color}/10 transition-colors`}></div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className={`size-16 rounded-[24px] bg-${cell.color}/10 text-${cell.color} flex items-center justify-center ring-1 ring-${cell.color}/20 group-hover:scale-110 group-hover:ring-${cell.color}/50 transition-all duration-500`}>
                                                {cell.icon}
                                            </div>
                                            <div className="h-2 w-12 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full bg-${cell.color}`}
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: '100%' }}
                                                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                                                />
                                            </div>
                                        </div>
                                        <h3 className={`text-2xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-${cell.color} transition-colors italic uppercase tracking-tighter`}>
                                            {renderIFUSP(cell.title)}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                                            {cell.subtitle}
                                        </p>
                                        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6 line-clamp-2">
                                            {renderIFUSP(cell.description)}
                                        </p>
                                        <div className="space-y-2 mb-8">
                                            {cell.details.map((detail: string, dIdx: number) => (
                                                <div key={dIdx} className="flex items-start gap-2 text-[11px] text-gray-500 font-bold group-hover:text-gray-300 transition-colors">
                                                    <div className={`size-1.5 rounded-full bg-${cell.color}/40 mt-1 cursor-default`} />
                                                    <span>{detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                            <span className={`text-[10px] font-black text-${cell.color} uppercase tracking-[0.2em]`}>{cell.cta}</span>
                                            <div className={`size-8 rounded-full bg-${cell.color}/10 flex items-center justify-center text-${cell.color} group-hover:translate-x-1 transition-transform`}>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>



                {/* --- Novos Banners Inferiores --- */}
                {/* 1. Horizontal Instituto Banner (Top) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative group w-full mb-6"
                >
                    <div className="absolute -inset-0.5 bg-brand-blue-ifusp/30 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Link
                        href={institutoCell.href}
                        className="relative flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-12 rounded-[32px] bg-white dark:bg-card-dark backdrop-blur-2xl border border-gray-200 dark:border-white/20 hover:border-brand-blue-ifusp/40 transition-all overflow-hidden text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-none"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue-ifusp/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="size-20 bg-brand-blue-ifusp/10 text-brand-blue-ifusp rounded-[28px] flex items-center justify-center ring-1 ring-brand-blue-ifusp/20 group-hover:scale-110 transition-all duration-700 shadow-2xl shadow-brand-blue-ifusp/20">
                                {institutoCell.icon}
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-2">
                                    {renderIFUSP(institutoCell.title)}
                                </h3>
                                <p className="text-gray-400 font-medium max-w-md">
                                    {renderIFUSP(institutoCell.description)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-0 relative z-10">
                            <div className="px-12 py-5 bg-brand-blue-ifusp text-white font-black rounded-[24px] group-hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-brand-blue-ifusp/30">
                                {institutoCell.cta} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* 2. IFUSP 101 Banner (Middle - Pure Yellow) */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="relative group w-full"
                    >
                        <a
                            href={acessoRapidoCell.href}
                            onClick={(e) => {
                                // Fallback hard redirect
                                window.location.href = acessoRapidoCell.href;
                            }}
                            className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-12 rounded-[32px] bg-white dark:bg-card-dark backdrop-blur-2xl border border-gray-200 dark:border-white/20 hover:border-brand-yellow transition-all overflow-hidden text-left cursor-pointer block pointer-events-auto shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-none"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 pointer-events-none">
                                <div className="size-20 bg-brand-yellow/10 text-brand-yellow rounded-[28px] flex items-center justify-center ring-1 ring-brand-yellow/20 group-hover:scale-110 transition-all duration-700 shadow-2xl">
                                    {acessoRapidoCell.icon}
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-2">
                                        {acessoRapidoCell.title}
                                    </h3>
                                    <p className="text-gray-400 font-medium max-w-md">
                                        {acessoRapidoCell.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 md:mt-0 relative z-10 pointer-events-none">
                                <div className="px-8 py-4 bg-brand-yellow text-gray-900 font-black rounded-full transition-all text-xs uppercase tracking-widest flex items-center gap-3 overflow-hidden shadow-xl shadow-brand-yellow/20">
                                    {acessoRapidoCell.cta} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </a>
                    </motion.div>
                </div>

                {/* 3. Horizontal Quiz Banner (Bottom) */}
                <motion.div
                    id="teste-radiacao"
                    data-tour="cgif-section-teste-radiacao"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative group w-full mb-4 scroll-mt-32"
                >
                    <div className="absolute -inset-0.5 bg-brand-red/30 rounded-[32px] blur opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
                    <Link
                        href={quizCell.href}
                        className="relative flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-12 rounded-[32px] bg-white dark:bg-card-dark backdrop-blur-2xl border border-gray-200 dark:border-white/20 hover:border-brand-red transition-all overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-none"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="size-20 bg-brand-red/10 text-brand-red rounded-[28px] flex items-center justify-center ring-1 ring-brand-red/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl shadow-brand-red/20">
                                {quizCell.icon}
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-2">
                                    {quizCell.title}
                                </h3>
                                <p className="text-gray-400 font-medium max-w-md">
                                    {quizCell.description} <span className="text-brand-red font-bold">Exploda o contador Geiger.</span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-0 relative z-10">
                            <div className="px-12 py-5 bg-brand-red text-white font-black rounded-[24px] group-hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-brand-red/30">
                                {quizCell.cta} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* --- SAC Section --- */}
                <SacSection />
            </div>

        </div>
    );
}
