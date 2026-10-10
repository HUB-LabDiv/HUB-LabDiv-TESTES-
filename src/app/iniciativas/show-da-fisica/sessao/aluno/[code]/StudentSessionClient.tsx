'use client';

import React, { useState, useEffect } from 'react';
import { Send, Clock, Brain, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitStudentResponse } from '@/app/actions/show-da-fisica';

type Misconception = {
    id: string;
    experiment_id: string;
    stage: string;
    misconception_text: string;
};

export function StudentSessionClient({ 
    sessionCode, 
    sessionId, 
    misconceptions 
}: { 
    sessionCode: string, 
    sessionId: string, 
    misconceptions: Misconception[] 
}) {
    const [activeTab, setActiveTab] = useState<'pre' | 'pos'>('pre');
    const [thought, setThought] = useState('');
    const [canUseCommon, setCanUseCommon] = useState(false);
    const [showCommon, setShowCommon] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efeito da Trava Cognitiva de 3s
    useEffect(() => {
        setCanUseCommon(false);
        setShowCommon(false);
        const timer = setTimeout(() => {
            setCanUseCommon(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const handleThoughtSubmit = async () => {
        if (!thought.trim()) {
            toast.error("Escreva algo primeiro!");
            return;
        }
        setIsSubmitting(true);
        const res = await submitStudentResponse({
            session_id: sessionId,
            stage: activeTab,
            free_text_answer: thought.trim()
        });
        
        if (res.success) {
            toast.success("Resposta enviada! O professor já pode ver no painel dele.");
            setThought('');
            setShowCommon(false);
        } else {
            toast.error("Erro ao enviar resposta.");
        }
        setIsSubmitting(false);
    };

    const handleCommonSelect = async (misc: Misconception) => {
        setIsSubmitting(true);
        const res = await submitStudentResponse({
            session_id: sessionId,
            experiment_id: misc.experiment_id,
            stage: activeTab,
            selected_misconception_id: misc.id
        });

        if (res.success) {
            toast.success(`Você selecionou: "${misc.misconception_text}". Resposta enviada!`);
            setShowCommon(false);
        } else {
            toast.error("Erro ao enviar resposta.");
        }
        setIsSubmitting(false);
    };

    // Filtra as percepções de acordo com a aba atual (pre/pos)
    const currentMisconceptions = misconceptions.filter(m => m.stage === activeTab);

    return (
        <div className="max-w-3xl mx-auto px-4">

            {/* Cabeçalho da Sessão */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black uppercase tracking-widest font-bukra mb-2">
                    <span className="text-white" style={{ textShadow: '0 0 10px #01f300' }}>Show</span> de Física
                </h1>
                <p className="text-gray-400 font-open-sans">
                    Sessão ativa: <strong className="text-[#01f300] tracking-widest">{sessionCode}</strong>
                </p>
            </div>

            {/* Abas Temporais */}
            <div className="flex bg-[#121216] p-1 rounded-2xl border border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('pre')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${
                        activeTab === 'pre' 
                        ? 'bg-[#01f300] text-black shadow-[0_0_15px_rgba(1,243,0,0.3)]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Antes do Show (Pré)
                </button>
                <button
                    onClick={() => setActiveTab('pos')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${
                        activeTab === 'pos' 
                        ? 'bg-[#002ffe] text-white shadow-[0_0_15px_rgba(0,47,254,0.4)]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Depois do Show (Pós)
                </button>
            </div>

            {/* Área Central Cognitiva */}
            <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#01f300]/5 rounded-full blur-3xl pointer-events-none" />

                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3 text-white">
                    <Brain className={`w-6 h-6 ${activeTab === 'pre' ? 'text-[#01f300]' : 'text-[#002ffe]'}`} />
                    O que você sabe sobre isso?
                </h2>

                <div className="relative">
                    <textarea
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                        placeholder="Escreva seu pensamento..."
                        className="w-full h-32 bg-[#121216] border-2 border-white/10 focus:border-[#01f300] rounded-2xl p-5 text-white font-open-sans resize-none transition-colors outline-none placeholder:text-gray-500"
                    />
                    
                    <button
                        onClick={handleThoughtSubmit}
                        disabled={isSubmitting || !thought.trim()}
                        className="absolute bottom-4 right-4 p-3 bg-[#01f300] text-black rounded-xl hover:bg-[#00cc00] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(1,243,0,0.3)]"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                {/* Botão de Respostas Comuns (Delay de 3s) */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
                    {!showCommon ? (
                        <button
                            onClick={() => setShowCommon(true)}
                            disabled={!canUseCommon}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wide text-xs transition-all duration-500 ${
                                canUseCommon 
                                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                                : 'bg-transparent text-gray-600 border border-transparent cursor-not-allowed'
                            }`}
                        >
                            <List className="w-4 h-4" />
                            Ou escolha respostas comuns
                        </button>
                    ) : (
                        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-300">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-4 text-center">
                                Percepções Comuns de Outros Alunos
                            </p>
                            <div className="flex flex-col gap-3">
                                {currentMisconceptions.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center italic mt-2">
                                        Nenhuma resposta comum sugerida para esta etapa.
                                    </p>
                                )}
                                {currentMisconceptions.map((misc, idx) => (
                                    <button
                                        key={misc.id || idx}
                                        onClick={() => handleCommonSelect(misc)}
                                        className="w-full text-left p-4 bg-[#121216] hover:bg-white/5 border border-white/5 hover:border-white/20 rounded-xl text-gray-300 hover:text-white transition-all text-sm font-open-sans"
                                    >
                                        "{misc.misconception_text}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
