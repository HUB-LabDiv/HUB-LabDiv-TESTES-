'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Brain, Clock, Users, XCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStudentResponses } from '@/app/actions/show-da-fisica';

export function TeacherSessionClient({ 
    sessionCode,
    sessionId,
    sessionData
}: { 
    sessionCode: string,
    sessionId: string,
    sessionData: any
}) {
    const [activeTab, setActiveTab] = useState<'pre' | 'pos'>('pre');
    const [responses, setResponses] = useState<any[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchResponses = async () => {
        setIsRefreshing(true);
        const res = await getStudentResponses(sessionId);
        if (res.success && res.data) {
            setResponses(res.data);
        }
        setIsRefreshing(false);
    };

    useEffect(() => {
        fetchResponses();
        const interval = setInterval(() => {
            fetchResponses();
        }, 5000);
        return () => clearInterval(interval);
    }, [sessionId]);

    const handleReschedule = () => {
        toast('Em breve: Funcionalidade de reagendamento!', { icon: '📅' });
    };

    const handleCancel = () => {
        toast.error('Em breve: Funcionalidade de cancelamento.');
    };

    const currentResponses = responses.filter(r => r.stage === activeTab);
    
    // Agrupa respostas comuns
    const commonResponsesMap = new Map<string, {text: string, count: number}>();
    const freeTextResponses: string[] = [];

    currentResponses.forEach(r => {
        if (r.selected_misconception_id && r.show_experiment_misconceptions) {
            const miscId = r.selected_misconception_id;
            const text = r.show_experiment_misconceptions.misconception_text;
            if (commonResponsesMap.has(miscId)) {
                commonResponsesMap.get(miscId)!.count++;
            } else {
                commonResponsesMap.set(miscId, { text, count: 1 });
            }
        } else if (r.free_text_answer) {
            freeTextResponses.push(r.free_text_answer);
        }
    });

    const commonResponses = Array.from(commonResponsesMap.values()).sort((a, b) => b.count - a.count);

    return (
        <div className="max-w-4xl mx-auto px-4">
            {/* Cabeçalho */}
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-widest font-bukra mb-2">
                        Painel do <span className="text-white" style={{ textShadow: '0 0 10px #f60011' }}>Professor</span>
                    </h1>
                    <p className="text-gray-400 font-open-sans flex items-center gap-2">
                        <Users className="w-4 h-4" /> Escola: {sessionData?.school_name || 'Desconhecida'}
                    </p>
                    <p className="text-gray-400 font-open-sans mt-1">
                        Seu Código: <strong className="text-[#f60011]">{sessionCode}</strong> | Código da Turma: <strong className="text-[#01f300]">{sessionData?.student_code}</strong>
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={handleReschedule}
                        className="px-6 py-3 bg-white/5 border border-white/10 hover:border-[#002ffe] hover:text-[#002ffe] rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-4 h-4" /> Reagendar
                    </button>
                    <button 
                        onClick={handleCancel}
                        className="px-6 py-3 bg-white/5 border border-white/10 hover:border-[#f60011] hover:text-[#f60011] rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                    >
                        <XCircle className="w-4 h-4" /> Cancelar
                    </button>
                </div>
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
                    Respostas: Pré-Show
                </button>
                <button
                    onClick={() => setActiveTab('pos')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${
                        activeTab === 'pos' 
                        ? 'bg-[#002ffe] text-white shadow-[0_0_15px_rgba(0,47,254,0.4)]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Respostas: Pós-Show
                </button>
            </div>

            {/* Área de Respostas */}
            <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3 text-white">
                    <Brain className={`w-6 h-6 ${activeTab === 'pre' ? 'text-[#01f300]' : 'text-[#002ffe]'}`} />
                    Percepções da Turma
                </h2>
                
                {currentResponses.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Aguardando respostas dos alunos...</p>
                        <div className="mt-4 w-8 h-8 border-2 border-white/10 border-t-[#01f300] rounded-full animate-spin mx-auto" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {commonResponses.map((item, idx) => (
                            <div key={`common-${idx}`} className="bg-[#121216] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-1 bg-[#01f300]" />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Opção Mais Votada</span>
                                <p className="text-gray-300 font-open-sans">"{item.text}"</p>
                                <div className="mt-3 text-xs text-[#01f300] font-bold">{item.count} {item.count === 1 ? 'Aluno escolheu' : 'Alunos escolheram'} esta opção</div>
                            </div>
                        ))}

                        {freeTextResponses.map((text, idx) => (
                            <div key={`free-${idx}`} className="bg-[#121216] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-1 bg-[#002ffe]" />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">Resposta Livre</span>
                                <p className="text-gray-300 font-open-sans">"{text}"</p>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                    <button 
                        onClick={fetchResponses}
                        disabled={isRefreshing}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                        <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Atualizar Respostas
                    </button>
                </div>
            </div>
        </div>
    );
}
