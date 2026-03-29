'use client';

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    X,
    Send,
    Loader2,
    ShieldAlert,
    Scale
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/providers/AuthProvider';

interface ContentReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** UUID do item sendo denunciado */
    reportedItemId: string;
    /** Tipo do item: submission, micro_article, comment, pergunta */
    itemType: 'submission' | 'micro_article' | 'comment' | 'pergunta';
    /** Título ou trecho do conteúdo para contexto visual */
    itemTitle?: string;
}

const REPORT_CATEGORIES = [
    { value: 'spam', label: 'Spam / Conteúdo Irrelevante', icon: '🚫', severity: 'low' },
    { value: 'plagio', label: 'Plágio / Violação de Direitos Autorais', icon: '©️', severity: 'medium' },
    { value: 'desinformacao', label: 'Desinformação Científica', icon: '🔬', severity: 'medium' },
    { value: 'discurso_odio', label: 'Discurso de Ódio / Discriminação', icon: '⚠️', severity: 'high' },
    { value: 'assedio', label: 'Assédio / Intimidação', icon: '🛑', severity: 'high' },
    { value: 'abuso_infantil', label: 'Abuso ou Exploração Infantil', icon: '🚨', severity: 'critical' },
    { value: 'outro', label: 'Outro', icon: '📝', severity: 'low' },
] as const;

export function ContentReportModal({ isOpen, onClose, reportedItemId, itemType, itemTitle }: ContentReportModalProps) {
    const { user } = useAuth();
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [category, setCategory] = useState<string>('');
    const [justification, setJustification] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            setStep('form');
            setCategory('');
            setJustification('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!category) {
            toast.error('Selecione a categoria da denúncia.');
            return;
        }
        if (!justification.trim() || justification.trim().length < 10) {
            toast.error('A justificativa deve ter ao menos 10 caracteres.');
            return;
        }
        if (!user) {
            toast.error('Você precisa estar logado para denunciar.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reported_item_id: reportedItemId,
                    item_type: itemType,
                    category,
                    justification: justification.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao enviar denúncia.');
            }

            setStep('success');

            if (data.action === 'suspended') {
                toast.success('Denúncia registrada. O conteúdo foi suspenso para análise imediata.');
            } else if (data.action === 'flagged') {
                toast.success('Denúncia registrada. O conteúdo foi sinalizado para revisão da equipe.');
            } else {
                toast.success('Denúncia registrada com sucesso.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Erro ao enviar denúncia.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedCat = REPORT_CATEGORIES.find(c => c.value === category);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <m.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-[#1E1E1E] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        {step === 'form' ? (
                            <form onSubmit={handleSubmit} className="p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-brand-red/10 rounded-xl flex items-center justify-center">
                                            <ShieldAlert className="text-brand-red size-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Denunciar Conteúdo</h2>
                                            {itemTitle && (
                                                <p className="text-[10px] text-gray-500 truncate max-w-[250px]">{itemTitle}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* ⚖️ ALERTA LEGAL - ART. 340 DO CÓDIGO PENAL */}
                                    <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-4 space-y-2">
                                        <div className="flex items-start gap-3">
                                            <Scale className="text-brand-red size-5 mt-0.5 shrink-0" />
                                            <div>
                                                <h3 className="text-xs font-black text-brand-red uppercase tracking-widest">Aviso Legal Obrigatório</h3>
                                                <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                                                    A <strong className="text-white">falsa comunicação de crime ou infração</strong>, feita de má-fé, configura crime previsto no{' '}
                                                    <strong className="text-brand-red">Art. 340 do Código Penal Brasileiro</strong>, com pena de detenção de 1 a 6 meses ou multa.
                                                </p>
                                                <p className="text-[10px] text-gray-500 mt-2 italic">
                                                    Denuncie com responsabilidade. Todas as denúncias são registradas com identificação do autor.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Categoria (Taxonomia) */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 px-1">
                                            QUAL O MOTIVO DA DENÚNCIA?
                                        </label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {REPORT_CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    type="button"
                                                    onClick={() => setCategory(cat.value)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border-2 ${
                                                        category === cat.value
                                                            ? cat.severity === 'critical' || cat.severity === 'high'
                                                                ? 'bg-brand-red/10 border-brand-red/50 text-brand-red'
                                                                : 'bg-brand-blue/10 border-brand-blue/50 text-brand-blue'
                                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                                                    }`}
                                                >
                                                    <span className="text-lg">{cat.icon}</span>
                                                    {cat.label}
                                                    {cat.severity === 'critical' && (
                                                        <span className="ml-auto text-[8px] font-black uppercase tracking-widest bg-brand-red/20 text-brand-red px-2 py-0.5 rounded-full">
                                                            Urgente
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Justificativa */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">
                                            JUSTIFIQUE SUA DENÚNCIA
                                        </label>
                                        <textarea
                                            value={justification}
                                            onChange={(e) => setJustification(e.target.value)}
                                            placeholder="Descreva com detalhes o motivo da denúncia. Seja específico e forneça evidências se possível..."
                                            className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red/50 transition-colors resize-none text-sm"
                                            minLength={10}
                                            required
                                        />
                                        <p className="text-[9px] text-gray-600 mt-1 px-1">Mínimo de 10 caracteres.</p>
                                    </div>

                                    {/* Aviso de severidade dinâmico */}
                                    {selectedCat && (selectedCat.severity === 'high' || selectedCat.severity === 'critical') && (
                                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                                            <AlertTriangle className="text-amber-500 size-4 mt-0.5 shrink-0" />
                                            <p className="text-[10px] text-amber-400 leading-relaxed">
                                                <strong>Categoria grave selecionada.</strong> Denúncias desta natureza disparam suspensão imediata do conteúdo para análise. Falsas denúncias graves serão tratadas com rigor.
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !category}
                                        className="w-full h-14 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-red/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                ENVIAR DENÚNCIA
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="size-20 bg-brand-yellow/10 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                                    <ShieldAlert className="text-brand-yellow size-10" />
                                </div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Denúncia Registrada</h2>
                                <p className="text-gray-400 font-medium mb-12">
                                    Sua denúncia foi recebida e será analisada pela equipe de moderação do Hub Lab-Div.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="w-full h-14 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/5 transition-colors"
                                >
                                    FECHAR
                                </button>
                            </div>
                        )}
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
}
