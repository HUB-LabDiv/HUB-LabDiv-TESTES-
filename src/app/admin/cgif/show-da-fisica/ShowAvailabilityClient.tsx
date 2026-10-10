'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Save, Trash2, AlertCircle, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { EXPERIMENTS_CATALOG } from '@/app/iniciativas/show-da-fisica/data/experiments';
import { getAvailabilityRules, addAvailabilityRule, deleteAvailabilityRule } from '@/app/actions/show-da-fisica';

type AvailabilityRule = {
    id: string;
    experiment_id: string;
    unavailable_date: string | null;
    unavailable_weekday: number | null; // 0 = Dom, 1 = Seg, 2 = Ter...
    reason: string;
};

export function ShowAvailabilityClient() {
    const [rules, setRules] = useState<AvailabilityRule[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [newRule, setNewRule] = useState<Partial<AvailabilityRule>>({
        experiment_id: 'basket',
        unavailable_date: '',
        unavailable_weekday: null,
        reason: ''
    });

    useEffect(() => {
        const fetchRules = async () => {
            setIsLoading(true);
            const res = await getAvailabilityRules();
            if (res.success && res.data) {
                setRules(res.data);
            } else {
                toast.error("Erro ao carregar regras de moderação.");
            }
            setIsLoading(false);
        };
        fetchRules();
    }, []);

    const handleSaveRule = async () => {
        if (!newRule.experiment_id || !newRule.reason) {
            toast.error("Preencha o experimento e o motivo!");
            return;
        }

        setIsSaving(true);
        const res = await addAvailabilityRule({
            experiment_id: newRule.experiment_id as string,
            unavailable_date: newRule.unavailable_date || null,
            unavailable_weekday: newRule.unavailable_weekday !== null ? Number(newRule.unavailable_weekday) : null,
            reason: newRule.reason || ''
        });

        if (res.success && res.data) {
            setRules(prev => [res.data, ...prev]);
            setNewRule({
                experiment_id: 'basket',
                unavailable_date: '',
                unavailable_weekday: null,
                reason: ''
            });
            toast.success("Regra de bloqueio salva com sucesso no Supabase!");
        } else {
            toast.error("Erro ao salvar no banco.");
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        const res = await deleteAvailabilityRule(id);
        if (res.success) {
            toast.success("Regra deletada!");
            setRules(rules.filter(r => r.id !== id));
        } else {
            toast.error("Falha ao deletar regra.");
        }
    };

    const getWeekdayName = (day: number | null) => {
        if (day === null) return '-';
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[day];
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3 mb-2">
                    <Calendar className="w-8 h-8 text-[#f60011]" />
                    Agenda & Disponibilidade
                </h1>
                <p className="text-gray-500">
                    Bloqueie experimentos do Show da Física por dias específicos ou dias da semana para evitar que os professores montem roteiros que o laboratório não pode atender.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulário de Nova Regra */}
                <div className="lg:col-span-1 bg-white dark:bg-card-dark rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[#f60011]" /> Novo Bloqueio
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Experimento Afetado *</label>
                            <select 
                                value={newRule.experiment_id}
                                onChange={(e) => setNewRule({...newRule, experiment_id: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#f60011]"
                            >
                                {EXPERIMENTS_CATALOG.map(exp => (
                                    <option key={exp.id} value={exp.id}>{exp.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bloquear Dia Específico</label>
                            <input 
                                type="date" 
                                value={newRule.unavailable_date || ''}
                                onChange={(e) => setNewRule({...newRule, unavailable_date: e.target.value, unavailable_weekday: null})}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#f60011]"
                            />
                        </div>

                        <div className="relative flex items-center justify-center">
                            <hr className="w-full border-gray-200 dark:border-white/10" />
                            <span className="absolute bg-white dark:bg-card-dark px-2 text-xs font-bold uppercase text-gray-400">OU</span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bloquear Dia da Semana Fixo</label>
                            <select 
                                value={newRule.unavailable_weekday === null ? '' : newRule.unavailable_weekday}
                                onChange={(e) => setNewRule({...newRule, unavailable_weekday: e.target.value ? Number(e.target.value) : null, unavailable_date: ''})}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#f60011]"
                            >
                                <option value="">Nenhum (Usar data)</option>
                                <option value="2">Terça-feira</option>
                                <option value="3">Quarta-feira</option>
                                <option value="4">Quinta-feira</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Motivo Interno *</label>
                            <textarea 
                                value={newRule.reason}
                                onChange={(e) => setNewRule({...newRule, reason: e.target.value})}
                                placeholder="Ex: Equipamento em conserto"
                                className="w-full h-24 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#f60011] resize-none"
                            />
                        </div>

                        <button 
                            onClick={handleSaveRule}
                            disabled={isSaving}
                            className="w-full py-3 bg-[#f60011] hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Adicionar Restrição
                        </button>
                    </div>
                </div>

                {/* Lista de Regras */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-card-dark rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-gray-500" /> Restrições Ativas
                        </h2>

                        {rules.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">Nenhum bloqueio cadastrado no banco.</p>
                        ) : (
                            <div className="space-y-4">
                                {rules.map(rule => {
                                    const exp = EXPERIMENTS_CATALOG.find(e => e.id === rule.experiment_id);
                                    return (
                                        <div key={rule.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl gap-4">
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block">{exp ? exp.title : rule.experiment_id}</strong>
                                                <div className="flex gap-4 mt-1 text-sm text-gray-500">
                                                    {rule.unavailable_date && <span>📅 {rule.unavailable_date}</span>}
                                                    {rule.unavailable_weekday !== null && <span>🔄 Toda {getWeekdayName(rule.unavailable_weekday)}</span>}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2 font-medium">Motivo: {rule.reason}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(rule.id)}
                                                className="p-2 text-gray-400 hover:text-[#f60011] hover:bg-[#f60011]/10 rounded-lg transition-colors shrink-0"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
