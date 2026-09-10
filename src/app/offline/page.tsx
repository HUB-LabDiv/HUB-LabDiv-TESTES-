'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    User as UserIcon, 
    BookOpen, 
    Search, 
    RefreshCw, 
    Home, 
    Clock, 
    MapPin, 
    FileText,
    CheckCircle2
} from 'lucide-react';

const GCIF_CELLS = [
    {
        id: 'calouro',
        title: 'Iniciação de Partículas (Calouros)',
        badge: 'Sobrevivência',
        color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
        desc: 'Logística essencial do campus USP e do Instituto de Física para novos ingressantes e veteranos.',
        bullets: [
            'Bandejão Central, Química e Prefeitura (SAS)',
            'CRUSP (Blocos A a G) e Apoio Moradia',
            'Edifício Principal, Ala Central e Didática',
            'Acesso ao JúpiterWeb e Cartão USP'
        ],
        keywords: 'calouro bandejao crusp jupiter sas matao didatica logistica alimentacao'
    },
    {
        id: 'bolsas',
        title: 'Energia de Permanência (Bolsas & PAPFE)',
        badge: 'Permanência',
        color: 'text-red-400 bg-red-400/10 border-red-400/30',
        desc: 'Informações sobre auxílios financeiros, bolsas de estudo e editais da Pró-Reitoria de Inclusão (PRIP).',
        bullets: [
            'PAPFE: Auxílio Permanência e Moradia Estudantil',
            'Monitoria Didática no IFUSP e Pró-Aluno',
            'Apoio a grupos vulneráveis e PcD',
            'Editais vigentes no ano letivo'
        ],
        keywords: 'bolsas papfe prip permanencia dinheiro monitoria auxilio pro-aluno edital'
    },
    {
        id: 'pesquisa',
        title: 'Sistemas de Pesquisa (IC & Labs)',
        badge: 'Acadêmico',
        color: 'text-red-400 bg-red-400/10 border-red-400/30',
        desc: 'Guia passo a passo para encontrar orientador, iniciar Iniciação Científica e navegar no Sistema Ateneu.',
        bullets: [
            'Como abordar orientadores e pesquisadores do IF',
            'Laboratórios de Pesquisa Teórica e Experimental',
            'Cadastro de Iniciação Científica no Ateneu',
            'Bolsas FAPESP e PIBIC/CNPq'
        ],
        keywords: 'pesquisa ic iniciacao cientifica ateneu fapesp pibic cnpq orientador laboratorio'
    },
    {
        id: 'protecao',
        title: 'Protocolos de Proteção & Saúde Mental',
        badge: 'Apoio',
        color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
        desc: 'Diretrizes de acolhimento, inclusão de neurodivergentes e canais de escuta ativa da USP.',
        bullets: [
            'Portaria PRIP 059/2024 (Inclusão TEA e Neurodiversidade)',
            'Apoio Psicológico gratuito via Instituto de Psicologia (IP-USP)',
            'Canais de Ouvidoria e Grupos de Afinidade do IFUSP',
            'Acolhimento humanizado para momentos de crise'
        ],
        keywords: 'saude mental psicologia tea neurodiversidade inclusao prip acolhimento protecao ouvidoria'
    },
    {
        id: 'ifusp',
        title: 'Estrutura da Matéria (Cursos & PPPs)',
        badge: 'Cursos',
        color: 'text-red-400 bg-red-400/10 border-red-400/30',
        desc: 'Estrutura curricular dos cursos de Bacharelado, Licenciatura e Física Médica com base nos PPPs.',
        bullets: [
            'Bacharelado e Licenciatura em Física (PPP atualizado)',
            'Habilitação em Física Médica',
            'Papel da Comissão de Graduação (CG) e CoCs',
            'Disciplinas Obrigatórias, Eletivas e ATPAs'
        ],
        keywords: 'ppp bacharelado licenciatura fisica medica grade optativas eletivas coc cg comissao'
    },
    {
        id: 'carreira',
        title: 'Vetores de Carreira & Futuro',
        badge: 'Profissional',
        color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
        desc: 'Caminhos pós-graduação, mercado corporativo, ciência de dados, física médica e docência.',
        bullets: [
            'Mestrado e Doutorado no IFUSP',
            'Física no mercado financeiro e de tecnologia',
            'Atuação em Física Médica e Radiologia Hospitalar',
            'Licenciatura e Ensino em Redes Públicas e Privadas'
        ],
        keywords: 'carreira mercado pós mestrado doutorado financas dados trabalho estagio'
    },
    {
        id: 'veteranos',
        title: 'IFUSP 101: Dicas de Veteranos',
        badge: 'Metodologia',
        color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
        desc: 'Conselhos práticos transmitidos por veteranos para navegar pelas disciplinas sem surpresas.',
        bullets: [
            'Como estudar para Física I a IV e Cálculo',
            'Salas de estudo: Biblioteca do IF e Grêmio (GEOF)',
            'Uso de provas antigas e listas de exercícios resolvidas',
            'Regras de frequência de 70% e recuperação'
        ],
        keywords: 'veteranos dicas 101 calculo fisica 1 2 3 4 geof biblioteca provas listas'
    },
    {
        id: 'metodologia',
        title: 'Como Pesquisar & Fontes Científicas',
        badge: 'Pesquisa',
        color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
        desc: 'Operadores booleanos, Sci-Hub, arXiv e bases de periódicos internacionais.',
        bullets: [
            'Google Scholar com VPN da USP (acesso aos periódicos CAPES)',
            'arXiv.org para pré-prints de física',
            'Operadores AND, OR e busca exata com aspas',
            'Gerenciadores de referências Zotero e Mendeley'
        ],
        keywords: 'metodologia arxiv scholar zotero periodicos capes busca artigos referencias'
    }
];

interface OfflineCalendarEvent {
    discipline_code?: string;
    subject_name?: string;
    title?: string;
    start_time?: string;
    end_time?: string;
    classroom?: string;
    room?: string;
    professor?: string;
    day_of_week?: number;
    dayOfWeek?: number;
    recurrence_day?: number;
}

interface OfflineCustomBlock {
    title?: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    day_of_week?: number;
    dayOfWeek?: number;
}

interface OfflineUserProfile {
    id?: string;
    name?: string;
    full_name?: string;
    avatar_url?: string;
    user_category?: string;
    role?: string;
    bio?: string;
    nusp?: string;
    institute?: string;
    course?: string;
    research_line?: string;
    interests?: string[];
}

export default function OfflinePage() {
    const [activeTab, setActiveTab] = useState<'ferramentas' | 'lab' | 'gcif'>('ferramentas');
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [reconnectMsg, setReconnectMsg] = useState<string | null>(null);

    // Ferramentas State
    const [selectedDay, setSelectedDay] = useState(() => {
        if (typeof window !== 'undefined') {
            const d = new Date().getDay();
            return d === 0 ? 1 : d;
        }
        return 1;
    });

    const [offlineEvents] = useState<OfflineCalendarEvent[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem('hub_offline_events');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const [customBlocks] = useState<OfflineCustomBlock[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem('hub_offline_custom_blocks');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const [quickNotes, setQuickNotes] = useState<string>(() => {
        if (typeof window === 'undefined') return '';
        try {
            return localStorage.getItem('hub_offline_quick_notes') || '';
        } catch {
            return '';
        }
    });
    const [notesStatus, setNotesStatus] = useState('Salvo no dispositivo');

    // Lab Pessoal State
    const [profile] = useState<OfflineUserProfile | null>(() => {
        if (typeof window === 'undefined') return null;
        try {
            const raw = localStorage.getItem('hub_offline_profile');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    // GCIF Search
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Listener de Reconexão Online
        const handleOnline = () => {
            setReconnectMsg('🟢 Conexão restabelecida! Redirecionando...');
            setTimeout(() => {
                window.location.href = '/';
            }, 800);
        };
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);

    const handleNotesChange = (val: string) => {
        setQuickNotes(val);
        setNotesStatus('Salvando...');
        try {
            localStorage.setItem('hub_offline_quick_notes', val);
            setNotesStatus('Salvo no dispositivo');
        } catch {}
    };

    const handleReconnect = async () => {
        setIsReconnecting(true);
        setReconnectMsg('Verificando conexão com a rede...');
        try {
            const res = await fetch('/manifest.json?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
            if (res.ok) {
                setReconnectMsg('🟢 Conectado! Recarregando aplicação...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 600);
                return;
            }
            throw new Error('Offline');
        } catch {
            setTimeout(() => {
                setIsReconnecting(false);
                setReconnectMsg('Você ainda está desconectado. O HUB continua funcionando com seus dados locais abaixo.');
                setTimeout(() => setReconnectMsg(null), 4000);
            }, 600);
        }
    };

    const handleGoHome = () => {
        if (typeof navigator !== 'undefined' && navigator.onLine) {
            window.location.href = '/';
        } else {
            setActiveTab('ferramentas');
            setReconnectMsg('Você está offline. Exibindo suas ferramentas e dados salvos no dispositivo.');
            setTimeout(() => setReconnectMsg(null), 4000);
        }
    };

    // Filtra eventos do dia
    const dayEvents = offlineEvents.filter(ev => {
        if (typeof ev.day_of_week === 'number') return ev.day_of_week === selectedDay;
        if (ev.dayOfWeek === selectedDay) return ev.dayOfWeek === selectedDay;
        if (ev.recurrence_day === selectedDay) return true;
        return false;
    });

    const dayBlocks = customBlocks.filter(b => b.day_of_week === selectedDay || b.dayOfWeek === selectedDay);

    const filteredGcif = GCIF_CELLS.filter(c => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.keywords.includes(q);
    });

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center p-4 sm:p-6 font-sans">
            <div className="w-full max-w-3xl space-y-6 pb-12">
                
                {/* Header Card com Logo Oficial LabDiv */}
                <div className="relative overflow-hidden rounded-3xl bg-[#1E1E1E] border border-white/10 p-6 sm:p-8 text-center shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F4780] via-[#F14343] to-[#FFCC00]" />
                    
                    <div className="flex flex-col items-center gap-3 mb-4">
                        {/* Logo Oficial Vetorial HUB LabDiv */}
                        <div className="w-16 h-16 rounded-2xl bg-[#0F4780]/20 border border-[#0F4780]/40 flex items-center justify-center p-2 shadow-lg shadow-[#0F4780]/20">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <defs>
                                    <linearGradient id="offWaveGrad" x1="45" y1="0" x2="467" y2="0" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#0F4780" />
                                        <stop offset="50%" stopColor="#F14343" />
                                        <stop offset="100%" stopColor="#FFCC00" />
                                    </linearGradient>
                                    <linearGradient id="offCapTop" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#0E4277" />
                                        <stop offset="50%" stopColor="#F14343" />
                                        <stop offset="100%" stopColor="#FFCC00" />
                                    </linearGradient>
                                    <linearGradient id="offCapBase" x1="5%" y1="0%" x2="95%" y2="0%">
                                        <stop offset="0%" stopColor="#0B3764" />
                                        <stop offset="50%" stopColor="#F14343" />
                                        <stop offset="100%" stopColor="#FFCC00" />
                                    </linearGradient>
                                </defs>
                                <g stroke="url(#offWaveGrad)" strokeWidth="14" strokeLinecap="round" fill="none">
                                    <path d="M 53 225 C 27 168 27 104 53 50" />
                                    <path d="M 94 196 C 72 157 72 109 94 72" />
                                    <path d="M 138 183 C 120 153 120 118 138 88" />
                                    <path d="M 178 165 C 164 145 164 125 178 105" />
                                    <path d="M 210 110 C 235 92 277 92 302 110" />
                                    <path d="M 224 128 C 242 114 270 114 288 128" />
                                    <path d="M 238 146 C 248 136 264 136 274 146" strokeWidth="12" />
                                    <path d="M 334 165 C 348 145 348 125 334 105" />
                                    <path d="M 374 183 C 392 153 392 118 374 88" />
                                    <path d="M 418 196 C 440 157 440 109 418 72" />
                                    <path d="M 459 225 C 485 168 485 104 459 50" />
                                </g>
                                <path d="M 120 300 L 120 355 C 120 430, 392 430, 392 355 L 392 300 Z" fill="url(#offCapBase)" stroke="#000000" strokeWidth="8" strokeLinejoin="round" />
                                <path d="M 276 175 L 456 260 Q 476 270 456 280 L 276 365 Q 256 375 236 365 L 56 280 Q 36 270 56 260 L 236 175 Q 256 165 276 175 Z" fill="url(#offCapTop)" stroke="#000000" strokeWidth="8" strokeLinejoin="round" />
                                <polygon points="57,270 73,277 73,321 57,321" fill="#0F4780" stroke="#000000" strokeWidth="6" />
                                <path d="M 49 346 L 39 408 Q 65 420 91 408 L 81 346 Z" fill="#0F4780" stroke="#000000" strokeWidth="6" />
                                <circle cx="65" cy="335" r="14" fill="#0F4780" stroke="#000000" strokeWidth="6" />
                            </svg>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            Modo Offline Ativo
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white font-bukra">
                        HUB <span className="text-gradient-brand">LabDiv</span>
                    </h1>
                    
                    <p className="text-sm text-gray-400 max-w-md mx-auto mt-2 leading-relaxed">
                        Você está desconectado da rede. Suas ferramentas, grade horária, dados do lab e o guia GCIF continuam disponíveis no dispositivo.
                    </p>

                    {reconnectMsg && (
                        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-yellow-300 font-semibold max-w-md mx-auto animate-fade-in">
                            {reconnectMsg}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleReconnect}
                            disabled={isReconnecting}
                            className="px-6 py-3 bg-[#0F4780] hover:bg-[#15599e] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#0F4780]/30 flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isReconnecting ? 'animate-spin' : ''}`} />
                            Tentar Reconectar
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleGoHome}
                            className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-xl transition-all border border-white/10 flex items-center gap-2"
                        >
                            <Home className="w-4 h-4 text-gray-300" />
                            Voltar ao Início
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex bg-[#1E1E1E] border border-white/10 rounded-2xl p-1 gap-1 sticky top-4 z-40 backdrop-blur-md shadow-xl">
                    <button
                        type="button"
                        onClick={() => setActiveTab('ferramentas')}
                        className={`flex-1 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'ferramentas'
                                ? 'bg-[#262626] text-[#FFCC00] shadow-md border border-[#FFCC00]/30'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Ferramentas
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('lab')}
                        className={`flex-1 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'lab'
                                ? 'bg-[#262626] text-[#FFCC00] shadow-md border border-[#FFCC00]/30'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <UserIcon className="w-4 h-4" />
                        Lab Pessoal
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('gcif')}
                        className={`flex-1 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'gcif'
                                ? 'bg-[#262626] text-[#FFCC00] shadow-md border border-[#FFCC00]/30'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        GCIF (Guia)
                    </button>
                </div>

                {/* TAB 1: FERRAMENTAS & GRADE HORÁRIA */}
                {activeTab === 'ferramentas' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Card Grade Semanal */}
                        <div className="bg-[#1E1E1E] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h2 className="text-lg font-bold text-white font-bukra flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#00A3FF]" />
                                    Grade Horária Semanal
                                </h2>
                                <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-[#FFCC00]">
                                    Armazenamento Local
                                </span>
                            </div>

                            {/* Dias da Semana */}
                            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                                {[
                                    { day: 1, label: 'Segunda' },
                                    { day: 2, label: 'Terça' },
                                    { day: 3, label: 'Quarta' },
                                    { day: 4, label: 'Quinta' },
                                    { day: 5, label: 'Sexta' },
                                    { day: 6, label: 'Sábado' }
                                ].map(d => (
                                    <button
                                        key={d.day}
                                        type="button"
                                        onClick={() => setSelectedDay(d.day)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                            selectedDay === d.day
                                                ? 'bg-[#0F4780] text-white border border-[#00A3FF]'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>

                            {/* Lista de Aulas e Blocos */}
                            <div className="space-y-3">
                                {dayEvents.length === 0 && dayBlocks.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">
                                        Nenhuma aula ou compromisso agendado para este dia da semana.
                                        <p className="text-xs text-gray-500 mt-2">
                                            Quando estiver online, sincronize sua grade com o JúpiterWeb para salvá-la offline.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {dayEvents.map((ev, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 rounded-2xl bg-[#262626] border border-white/10 border-l-4 border-l-[#00A3FF] space-y-1"
                                            >
                                                <div className="flex items-center gap-2 text-xs font-bold text-[#00A3FF]">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {ev.start_time ? ev.start_time.substring(0, 5) : '08:00'} - {ev.end_time ? ev.end_time.substring(0, 5) : '10:00'}
                                                </div>
                                                <h3 className="font-bold text-white text-sm sm:text-base">
                                                    {ev.discipline_code ? `[${ev.discipline_code}] ` : ''}
                                                    {ev.subject_name || ev.discipline_code || ev.title || 'Disciplina'}
                                                </h3>
                                                <div className="flex flex-wrap gap-3 text-xs text-gray-400 pt-1">
                                                    {ev.classroom && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                                            {ev.classroom}
                                                        </span>
                                                    )}
                                                    {ev.professor && (
                                                        <span className="flex items-center gap-1">
                                                            Prof. {ev.professor}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {dayBlocks.map((b, idx) => (
                                            <div
                                                key={`b-${idx}`}
                                                className="p-4 rounded-2xl bg-[#262626] border border-white/10 border-l-4 border-l-[#FFCC00] space-y-1"
                                            >
                                                <div className="flex items-center gap-2 text-xs font-bold text-[#FFCC00]">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {b.start_time?.substring(0, 5)} - {b.end_time?.substring(0, 5)}
                                                </div>
                                                <h3 className="font-bold text-white text-sm sm:text-base">
                                                    {b.title || 'Atividade Personalizada'}
                                                </h3>
                                                {b.location && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                                        {b.location}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bloco de Anotações Rápidas */}
                        <div className="bg-[#1E1E1E] border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <h2 className="text-lg font-bold text-white font-bukra flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#FFCC00]" />
                                    Anotações Rápidas Offline
                                </h2>
                                <span className="text-xs text-gray-400">{notesStatus}</span>
                            </div>

                            <textarea
                                value={quickNotes}
                                onChange={e => handleNotesChange(e.target.value)}
                                placeholder="Anote lembretes rápidos de aula, horários ou recados aqui. Eles ficam salvos no seu dispositivo mesmo sem internet..."
                                className="w-full h-28 bg-[#262626] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A3FF] transition-colors resize-y"
                            />
                        </div>
                    </div>
                )}

                {/* TAB 2: LAB PESSOAL OFFLINE */}
                {activeTab === 'lab' && (
                    <div className="bg-[#1E1E1E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <h2 className="text-lg font-bold text-white font-bukra flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-[#FFCC00]" />
                                Identidade Estudantil • Lab Pessoal
                            </h2>
                            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                                {profile ? 'Perfil Sincronizado' : 'Dispositivo Local'}
                            </span>
                        </div>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-24 h-24 rounded-full border-4 border-[#FFCC00] bg-[#262626] flex items-center justify-center text-2xl font-bold text-white shadow-xl overflow-hidden">
                                {profile?.avatar_url ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    'IF'
                                )}
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white font-bukra">
                                    {profile?.full_name || profile?.name || 'Estudante IFUSP'}
                                </h3>
                                <div className="mt-1">
                                    <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-[#FFCC00]">
                                        {(profile?.user_category || profile?.role || 'Comunidade USP').toUpperCase().replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-400 max-w-md">
                                {profile?.bio || 'Identidade estudantil e informações acadêmicas preservadas localmente.'}
                            </p>

                            {/* Informações em Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left mt-2">
                                <div className="p-4 rounded-2xl bg-[#262626] border border-white/10">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">Número USP</span>
                                    <span className="text-sm font-bold text-white mt-0.5 block">{profile?.nusp || 'Sincronizado na nuvem'}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-[#262626] border border-white/10">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">Unidade</span>
                                    <span className="text-sm font-bold text-white mt-0.5 block">{profile?.institute || 'Instituto de Física (IFUSP)'}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-[#262626] border border-white/10">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">Curso</span>
                                    <span className="text-sm font-bold text-white mt-0.5 block">{profile?.course || 'Física'}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-[#262626] border border-white/10">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">Linha de Pesquisa</span>
                                    <span className="text-sm font-bold text-white mt-0.5 block">{profile?.research_line || (profile?.interests && profile.interests.slice(0, 2).join(', ')) || 'Geral'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: GCIF (GRANDE COLISOR DO IF) KNOWLEDGE BASE */}
                {activeTab === 'gcif' && (
                    <div className="bg-[#1E1E1E] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white font-bukra flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-[#00A3FF]" />
                                    GCIF • Guia de Convivência do IFUSP
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    Células de conhecimento, sobrevivência universitária e dicas úteis salvas offline.
                                </p>
                            </div>
                            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 hidden sm:inline-block">
                                Base Completa
                            </span>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Buscar no GCIF (ex: bandejão, bolsas, IC, CRUSP, TEA, veteranos)..."
                                className="w-full bg-[#262626] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFCC00] transition-colors"
                            />
                        </div>

                        {/* Células em Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredGcif.map(cell => (
                                <div
                                    key={cell.id}
                                    className="p-5 rounded-2xl bg-[#262626] border border-white/10 hover:border-white/20 transition-all space-y-2 flex flex-col justify-between"
                                >
                                    <div>
                                        <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${cell.color} mb-1.5`}>
                                            {cell.badge}
                                        </span>
                                        <h3 className="font-bold text-white text-base font-bukra">
                                            {cell.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                            {cell.desc}
                                        </p>
                                    </div>

                                    <div className="space-y-1 pt-3 border-t border-white/5">
                                        {cell.bullets.map((b, bIdx) => (
                                            <div key={bIdx} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFCC00] shrink-0 mt-0.5" />
                                                <span>{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer License Note */}
                <p className="text-center text-[10px] text-gray-500 uppercase font-black tracking-widest pt-4">
                    Software Livre (Licença AGPLv3) • Hub LabDiv IFUSP v6.4.0
                </p>
            </div>
        </div>
    );
}
