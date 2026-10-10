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

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    MessageSquare,
    ThumbsUp,
    Send,
    Loader2,
    X,
    AlertCircle,
    Search,
    Compass,
    BookOpen,
    ExternalLink,
    Sparkles,
    Building2,
    Filter
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { getApprovedTips, submitTip, upvoteTip } from '@/app/actions/veterans';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { USP_INSTITUTES, VeteransTip } from '@/types/veterans';

const CATEGORIAS = [
    { id: 'comunicacao', label: 'Comunicação', color: 'brand-blue' },
    { id: 'permanencia', label: 'Permanência', color: 'brand-yellow' },
    { id: 'academica', label: 'Acadêmica', color: 'brand-red' }
];

const CONSELHOS_RAPIDOS = [
    {
        id: 'scholar',
        nome: 'Google Scholar',
        url: 'https://scholar.google.com.br',
        icon: Search,
        badgeCor: 'bg-brand-blue/15 text-brand-blue border-brand-blue/30',
        botaoCor: 'bg-brand-blue hover:bg-brand-blue/80 text-white shadow-lg shadow-brand-blue/20',
        conselho: 'Configure a Universidade de São Paulo (SIBiUSP) nas preferências de Bibliotecas do Scholar para liberar o botão "FullText @ USP" em papers pagos. Dica de ouro: use aspas duplas ("termo exato") para achar resoluções de provas antigas e artigos de IC do IFUSP rapidamente.'
    },
    {
        id: 'portal',
        nome: 'Portal do IFUSP',
        url: 'https://portal.if.usp.br',
        icon: Compass,
        badgeCor: 'bg-brand-blue/15 text-brand-blue border-brand-blue/30',
        botaoCor: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
        conselho: 'Salve nos seus favoritos a aba de Graduação > Calendário e Oferecimento de Disciplinas e os Editais de Monitoria/PUB. As listas de turmas, salas de aula, bancas e datas de trancamento saem no portal dias antes de aparecerem no JúpiterWeb.'
    },
    {
        id: 'scihub',
        nome: 'Sci-Hub',
        url: 'https://sci-hub.box',
        icon: BookOpen,
        badgeCor: 'bg-brand-red/15 text-brand-red border-brand-red/30',
        botaoCor: 'bg-brand-red/20 hover:bg-brand-red/30 text-brand-red border border-brand-red/30',
        conselho: 'Nunca tente buscar pelo título longo ou palavras-chave gerais. Copie diretamente o código DOI do artigo (ex: 10.1103/...) na barra de pesquisa; é o método garantido para abrir o PDF instantaneamente sem cair em bloqueios.'
    },
    {
        id: 'salunos',
        nome: 'Seção de Alunos',
        url: 'mailto:salunosif@usp.br?subject=Dúvida%20Acadêmica%20-%20IFUSP&body=Olá,%20saudações%20equipe%20da%20Seção%20de%20Alunos,%0D%0A%0D%0ASou%20aluno(a)%20do%20IFUSP.%0D%0ANome:%20%0D%0ANUSP:%20%0D%0ACurso:%20%0D%0ADisciplina/Turma:%20%0D%0A%0D%0ADúvida/Solicitação:%20',
        icon: MessageSquare,
        badgeCor: 'bg-brand-yellow/15 text-brand-yellow border-brand-yellow/30',
        botaoCor: 'bg-brand-yellow hover:bg-brand-yellow/90 text-gray-950 font-bold shadow-lg shadow-brand-yellow/20',
        conselho: 'Ao mandar e-mail para a Seção de Alunos, coloque obrigatoriamente Nome Completo, Número USP e Curso logo na primeira linha. Pedidos já formatados com o código da disciplina (ex: FEP0111) são processados com prioridade e respondidos com muito mais agilidade.'
    }
];

export default function VeteranosPage() {
    const [tips, setTips] = useState<VeteransTip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('todas');
    const [selectedInstitute, setSelectedInstitute] = useState<string>('todas');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTip, setNewTip] = useState({
        titulo: '',
        conteudo: '',
        categoria: 'comunicacao',
        instituto: 'geral'
    });
    const [upvotedTips, setUpvotedTips] = useState<string[]>([]);

    useEffect(() => {
        loadTips();
    }, []);

    const loadTips = async () => {
        setIsLoading(true);
        const res = await getApprovedTips();
        if (res.success) {
            setTips((res.data || []) as VeteransTip[]);
        } else {
            toast.error('Erro ao carregar dicas');
        }
        setIsLoading(false);
    };

    const handleUpvote = async (id: string) => {
        if (upvotedTips.includes(id)) return;

        const originalTips = [...tips];
        setTips(tips.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
        setUpvotedTips([...upvotedTips, id]);

        const res = await upvoteTip(id);
        if (!res.success) {
            setTips(originalTips);
            setUpvotedTips(upvotedTips.filter(t => t !== id));
            toast.error(res.error || 'Erro ao curtir. Você está logado?');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const res = await submitTip(newTip);
        if (res.success) {
            toast.success('Conselho enviado! Será analisado pelos moderadores.');
            setIsModalOpen(false);
            setNewTip({ titulo: '', conteudo: '', categoria: 'comunicacao', instituto: 'geral' });
        } else {
            toast.error(res.error || 'Erro ao enviar conselho. Você está logado?');
        }
        setIsSubmitting(false);
    };

    const filteredTips = tips.filter(tip => {
        const matchesCategory = activeFilter === 'todas' || tip.categoria === activeFilter;
        const matchesInstitute = selectedInstitute === 'todas' || (tip.instituto || 'geral') === selectedInstitute;
        return matchesCategory && matchesInstitute;
    });

    const getInstituteInfo = (id?: string) => {
        return USP_INSTITUTES.find(inst => inst.id === (id || 'geral')) || USP_INSTITUTES[0];
    };

    return (
        <MainLayoutWrapper>
            <div className="min-h-screen bg-transparent text-white selection:bg-brand-blue selection:text-white pb-20">
                {/* Header Substituto (abaixo da Navbar Global) */}
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/gcif/interativo" className="flex items-center gap-2 hover:bg-white/10 rounded-full transition-colors px-4 py-2 border border-white/10 bg-white/5">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-brand-blue">Interativo</span>
                        </Link>
                        <h1 className="text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-red flex items-center gap-2 hidden md:flex font-bukra">
                            <Compass className="w-5 h-5 text-white" />
                            USP 101
                        </h1>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 md:px-6 md:py-3 bg-brand-yellow text-gray-950 font-black uppercase tracking-widest text-xs rounded-full hover:bg-brand-yellow/90 transition-all flex items-center gap-2 shadow-lg shadow-brand-yellow/20 hover:scale-105 active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                        <span className="hidden md:block">Transmitir Conselho</span>
                        <span className="md:hidden">Enviar</span>
                    </button>
                </div>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-6 space-y-12">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs font-black uppercase tracking-wider mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            Todos os Institutos da Universidade de São Paulo
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4 font-bukra">
                            USP 101: Conhecimento Transgeracional & Conselhos de Veteranos
                        </h2>
                        <p className="text-gray-300 text-sm md:text-base max-w-2xl font-open-sans leading-relaxed">
                            Canais essenciais, atalhos acadêmicos e macetes transmitidos por quem já passou pelos perrengues — válidos para toda a USP ou específicos para o seu instituto.
                        </p>
                    </div>

                    {/* Quick Advice Cards: Atalho à esquerda com Conselho ao lado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {CONSELHOS_RAPIDOS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.id}
                                    className="p-6 rounded-3xl bg-[#1E1E1E]/95 border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col sm:flex-row gap-5 items-stretch relative group"
                                >
                                    {/* Lado Esquerdo: Identificação do Atalho e Ação */}
                                    <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-between w-full sm:w-44 shrink-0 gap-3 border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-4">
                                        <div className="flex items-center sm:flex-col sm:items-start gap-3">
                                            <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border mb-1 ${item.badgeCor}`}>
                                                    Atalho
                                                </span>
                                                <h4 className="text-sm font-bold font-bukra text-white leading-tight">
                                                    {item.nome}
                                                </h4>
                                            </div>
                                        </div>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-auto sm:w-full text-center px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all sm:mt-3 shrink-0 hover:scale-[1.02] active:scale-95 ${item.botaoCor}`}
                                        >
                                            <span>Acessar</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>

                                    {/* Lado Direito: Texto com o Conselho de Veterano */}
                                    <div className="flex-1 flex flex-col justify-center bg-black/30 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-1.5 mb-2 text-brand-yellow font-bukra font-bold text-[11px] uppercase tracking-wider">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Conselho de Veterano</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed">
                                            {item.conselho}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* --- Seção de Conselhos da Comunidade USP --- */}
                    <div className="space-y-6 pt-6 border-t border-white/10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h3 className="text-2xl font-black font-bukra uppercase text-white tracking-tight flex items-center gap-2">
                                    <MessageSquare className="w-6 h-6 text-brand-blue" />
                                    Mural de Conselhos da Comunidade
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1">
                                    Filtre por instituto da USP ou por categoria para encontrar o conselho exato que você precisa.
                                </p>
                            </div>

                            <span className="text-xs text-gray-400 font-mono shrink-0">
                                {filteredTips.length} conselhos exibidos
                            </span>
                        </div>

                        {/* Filtro 1: Institutos da USP */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-brand-yellow" />
                                Filtrar por Instituto:
                            </span>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                <button
                                    onClick={() => setSelectedInstitute('todas')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-bukra uppercase tracking-wider transition-all shrink-0 ${
                                        selectedInstitute === 'todas'
                                            ? 'bg-white text-gray-950 shadow-md font-bold'
                                            : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                                    }`}
                                >
                                    Todos os Institutos
                                </button>
                                {USP_INSTITUTES.map((inst) => {
                                    const isSelected = selectedInstitute === inst.id;
                                    const count = tips.filter(t => (t.instituto || 'geral') === inst.id).length;
                                    return (
                                        <button
                                            key={inst.id}
                                            onClick={() => setSelectedInstitute(inst.id)}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-bukra uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                                                isSelected
                                                    ? 'bg-brand-blue text-white shadow-md border border-brand-blue/50'
                                                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                                            }`}
                                        >
                                            <span>{inst.shortLabel}</span>
                                            <span className="text-[10px] opacity-70 font-mono">({count})</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Filtro 2: Categorias */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-brand-blue" />
                                Filtrar por Categoria:
                            </span>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                <button 
                                    onClick={() => setActiveFilter('todas')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-bukra uppercase tracking-widest transition-all shrink-0 ${
                                        activeFilter === 'todas'
                                            ? 'bg-white/20 text-white border border-white/30'
                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Todas as Categorias
                                </button>
                                {CATEGORIAS.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveFilter(cat.id)}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-bukra uppercase tracking-widest transition-all shrink-0 ${
                                            activeFilter === cat.id
                                                ? cat.color === 'brand-yellow'
                                                    ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40'
                                                    : cat.color === 'brand-red'
                                                    ? 'bg-brand-red/20 text-brand-red border border-brand-red/40'
                                                    : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40'
                                                : 'bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid de Dicas */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-32">
                                <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                            </div>
                        ) : filteredTips.length > 0 ? (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                {filteredTips.map((tip, idx) => {
                                    const isUpvoted = upvotedTips.includes(tip.id);
                                    const categoryColor = CATEGORIAS.find(c => c.id === tip.categoria)?.color || 'brand-blue';
                                    const instituteInfo = getInstituteInfo(tip.instituto);
                                    
                                    return (
                                        <motion.div 
                                            key={tip.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="break-inside-avoid p-6 sm:p-8 rounded-[32px] bg-[#1E1E1E] border border-white/5 hover:border-white/15 transition-all shadow-xl relative group flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-3">
                                                    {/* Badge de Instituto */}
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30 px-2.5 py-0.5 rounded-full font-bukra">
                                                        <Building2 className="w-3 h-3" />
                                                        {instituteInfo.shortLabel}
                                                    </span>

                                                    {/* Upvotes */}
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                                                        <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'text-brand-blue fill-brand-blue' : ''}`} />
                                                        <span className={isUpvoted ? 'text-brand-blue' : ''}>{tip.upvotes || 0}</span>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest text-${categoryColor} bg-${categoryColor}/10 px-2.5 py-0.5 rounded-full font-bukra`}>
                                                        {tip.categoria}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-bold font-bukra text-white mb-2 leading-snug group-hover:text-brand-blue transition-colors">
                                                    {tip.titulo}
                                                </h3>
                                                <p className="text-gray-300 text-xs sm:text-sm font-open-sans leading-relaxed mb-6 whitespace-pre-wrap">
                                                    {tip.conteudo}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <span className="text-xs text-gray-500 font-medium truncate max-w-[180px]">
                                                    — {tip.autor_nome}
                                                </span>
                                                <button 
                                                    onClick={() => handleUpvote(tip.id)}
                                                    disabled={isUpvoted}
                                                    className={`p-2 rounded-full transition-all ${
                                                        isUpvoted
                                                            ? 'bg-brand-blue/20 text-brand-blue cursor-default'
                                                            : 'bg-white/5 text-white hover:bg-white/20 active:scale-95'
                                                    }`}
                                                    title={isUpvoted ? 'Conselho apoiado!' : 'Apoiar este conselho'}
                                                >
                                                    <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-[#1E1E1E]/60 rounded-[40px] border border-dashed border-white/10 p-8">
                                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h4 className="text-white font-bold font-bukra uppercase tracking-wider text-sm mb-1">
                                    Nenhum conselho encontrado
                                </h4>
                                <p className="text-gray-400 font-open-sans text-xs max-w-sm mx-auto">
                                    Não há dicas cadastradas para este instituto ou categoria. Seja o primeiro veterano a transmitir um conselho!
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Modal de Transmissão de Conselho (Multi-Instituto) */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#1E1E1E] border border-white/10 p-6 sm:p-8 rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <div className="flex items-center gap-2 mb-2 text-brand-yellow text-xs font-black uppercase tracking-widest font-bukra">
                                <Sparkles className="w-4 h-4" />
                                USP 101 • Transmissão de Conselho
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white font-bukra mb-1">
                                Transmitir Conselho
                            </h2>
                            <p className="text-gray-400 text-xs font-open-sans mb-6 leading-relaxed">
                                Sua experiência pode salvar o semestre de alguém. Escolha se o conselho é válido para toda a USP ou para um instituto específico.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Destino / Instituto */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 font-bukra">
                                        Destino do Conselho (Instituto)
                                    </label>
                                    <select 
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-brand-blue outline-none transition-colors font-open-sans"
                                        value={newTip.instituto}
                                        onChange={e => setNewTip({...newTip, instituto: e.target.value})}
                                        disabled={isSubmitting}
                                    >
                                        {USP_INSTITUTES.map(inst => (
                                            <option key={inst.id} value={inst.id} className="bg-gray-900 text-white">
                                                {inst.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Categoria */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 font-bukra">
                                        Categoria
                                    </label>
                                    <select 
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-brand-blue outline-none transition-colors font-open-sans"
                                        value={newTip.categoria}
                                        onChange={e => setNewTip({...newTip, categoria: e.target.value})}
                                        disabled={isSubmitting}
                                    >
                                        {CATEGORIAS.map(c => (
                                            <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Título */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 font-bukra">
                                        Título do Conselho
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        maxLength={100}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-brand-blue outline-none transition-colors font-open-sans"
                                        placeholder="Ex: Como sobreviver a Física 1 ou Dicas do bandejão central"
                                        value={newTip.titulo}
                                        onChange={e => setNewTip({...newTip, titulo: e.target.value})}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Conteúdo */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 font-bukra">
                                        Conselho / Dica de Veterano
                                    </label>
                                    <textarea 
                                        required
                                        maxLength={800}
                                        rows={4}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-brand-blue outline-none transition-colors resize-none font-open-sans"
                                        placeholder="Escreva detalhadamente o conselho, macetes de provas, materiais recomendados ou rotas de sobrevivência..."
                                        value={newTip.conteudo}
                                        onChange={e => setNewTip({...newTip, conteudo: e.target.value})}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full mt-2 bg-brand-yellow text-gray-950 font-black uppercase tracking-widest py-3.5 rounded-xl hover:bg-brand-yellow/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 hover:scale-102 active:scale-95 text-xs font-bukra"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {isSubmitting ? 'Enviando...' : 'Publicar Conselho no USP 101'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </MainLayoutWrapper>
    );
}
