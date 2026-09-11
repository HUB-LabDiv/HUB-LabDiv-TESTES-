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


/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre sob os termos da AGPLv3.
 */

import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    Lightbulb,
    HelpCircle,
    X,
    Camera,
    Send,
    CheckCircle2,
    MessageCircle,
    Mail,
    Loader2,
} from 'lucide-react';
import { submitFeedback } from '@/app/actions/feedback';
import { toast } from 'react-hot-toast';
import { useNavigationStore } from '@/store/useNavigationStore';
import { offlineCrud } from '@/lib/offline-sync';
import { supabase } from '@/lib/supabase/client';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ReportType = 'bug' | 'sugestao' | 'outro';

const TYPE_CONFIG: Record<ReportType, {
    title: string;
    label: string;
    placeholder: string;
    btnLabel: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    successTitle: string;
    successMsg: string;
}> = {
    bug: {
        title: 'Reportar Erro',
        label: 'Falha',
        placeholder: 'Descreva o erro encontrado: o que aconteceu, em qual página e como reproduzir...',
        btnLabel: 'Enviar Relatório de Erro',
        icon: AlertCircle,
        color: 'text-brand-red',
        bg: 'bg-brand-red/10',
        successTitle: 'Erro Reportado!',
        successMsg: 'Nossa equipe de manutenção já foi notificada e vai investigar o problema.',
    },
    sugestao: {
        title: 'Enviar Sugestão',
        label: 'Sugestão',
        placeholder: 'Descreva sua sugestão de melhoria para o Hub...',
        btnLabel: 'Enviar Sugestão',
        icon: Lightbulb,
        color: 'text-brand-yellow',
        bg: 'bg-brand-yellow/10',
        successTitle: 'Sugestão Recebida!',
        successMsg: 'Obrigado pela sua contribuição! Vamos analisar sua ideia com cuidado.',
    },
    outro: {
        title: 'Enviar Mensagem',
        label: 'Outro',
        placeholder: 'Descreva o que você gostaria de comunicar à equipe LabDiv...',
        btnLabel: 'Enviar Mensagem',
        icon: HelpCircle,
        color: 'text-brand-blue',
        bg: 'bg-brand-blue/10',
        successTitle: 'Mensagem Enviada!',
        successMsg: 'Recebemos sua mensagem e retornaremos em breve.',
    },
};

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
    const { reportType, reportContext } = useNavigationStore();
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<ReportType>('bug');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Carrega usuário logado
    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            if (!data.user) return;
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, username')
                .eq('id', data.user.id)
                .single();
            setCurrentUser({
                name: profile?.full_name || (profile?.username ? `@${profile.username}` : data.user.email || 'Usuário'),
                email: data.user.email || '',
            });
        });
    }, []);

    // Sincroniza tipo ao abrir
    useEffect(() => {
        if (isOpen) {
            setStep('form');
            setDescription('');
            setType((reportType as ReportType) || 'bug');
            setScreenshot(null);
            setPreviewUrl(null);
        }
    }, [isOpen, reportType]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setScreenshot(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            toast.error('Por favor, descreva o ocorrido.');
            return;
        }

        const payload = {
            type,
            description,
            user_agent: navigator.userAgent,
            url: window.location.href,
            // Passa o email do usuário logado para o servidor identificar melhor
            email: currentUser?.email,
            context: reportContext
        };

        setIsSubmitting(true);
        try {
            const result = await submitFeedback(payload);
            if (result.success) {
                setStep('success');
            } else {
                throw new Error('Erro ao enviar.');
            }
        } catch (err: any) {
            const isOffline = !navigator.onLine || err.message?.includes('fetch') || err.message?.includes('Network');
            if (isOffline) {
                await offlineCrud.enqueueMutation({ endpoint: '/api/sync', method: 'POST', payload });
                toast.success('Salvo localmente! Será enviado quando houver conexão.');
                onClose();
            } else {
                toast.error('Erro ao enviar. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const config = TYPE_CONFIG[type];
    const Icon = config.icon;

    const activeColor = type === 'bug' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
        : type === 'sugestao' ? 'bg-brand-yellow text-black shadow-lg shadow-brand-yellow/20'
            : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20';

    const submitBtnStyle = type === 'bug'
        ? 'bg-brand-red hover:bg-brand-red/90 text-white shadow-brand-red/20'
        : type === 'sugestao'
            ? 'bg-brand-yellow hover:bg-brand-yellow/90 text-black shadow-brand-yellow/20'
            : 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-brand-blue/20';

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
                        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <m.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="report-modal-title"
                        className="relative w-full max-w-lg bg-[#1E1E1E] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        {step === 'form' ? (
                            <form onSubmit={handleSubmit} className="p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 ${config.bg} rounded-xl flex items-center justify-center`}>
                                            <Icon className={`${config.color} size-5`} aria-hidden="true" />
                                        </div>
                                        <h2 id="report-modal-title" className="text-xl font-black text-white italic uppercase tracking-tighter">
                                            {config.title}
                                        </h2>
                                    </div>
                                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Identificação do remetente enviada nos bastidores para o admin */}

                                <div className="space-y-5">
                                    {/* Type Selector */}
                                    <div className="flex gap-2">
                                        {(['bug', 'sugestao', 'outro'] as ReportType[]).map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className={`flex-1 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === t
                                                    ? activeColor
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {TYPE_CONFIG[t].label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">
                                            {type === 'bug' ? 'O que aconteceu?' : type === 'sugestao' ? 'Sua sugestão' : 'Sua mensagem'}
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder={config.placeholder}
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none text-sm"
                                        />
                                    </div>

                                    {/* Screenshot — só para bugs */}
                                    {type === 'bug' && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-white/5 transition-all"
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="max-h-28 rounded-lg" />
                                            ) : (
                                                <>
                                                    <Camera className="text-gray-600 group-hover:text-brand-red transition-colors mb-2" size={20} />
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Anexar Captura de Tela (opcional)</span>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Contato direto */}
                                    <div className="flex gap-4 items-center py-3 border-t border-white/5">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Ou mande direto:</span>
                                        <div className="flex gap-4">
                                            <a href="https://wa.me/5511968401823" target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:scale-110 transition-transform">
                                                <MessageCircle size={18} />
                                            </a>
                                            <a href="mailto:hublabdiv@gmail.com" className="text-brand-blue hover:scale-110 transition-transform">
                                                <Mail size={18} />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg ${submitBtnStyle}`}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                {config.btnLabel}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-12 text-center" aria-live="polite" role="status">
                                <div className={`size-20 ${config.bg} rounded-[32px] flex items-center justify-center mx-auto mb-8`}>
                                    <CheckCircle2 className={`${config.color} size-10`} aria-hidden="true" />
                                </div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">
                                    {config.successTitle}
                                </h2>
                                <p className="text-gray-400 font-medium mb-12">{config.successMsg}</p>
                                <button
                                    onClick={onClose}
                                    className="w-full h-14 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/5 transition-colors"
                                >
                                    Fechar
                                </button>
                            </div>
                        )}
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
}
