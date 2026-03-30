'use client';

import React, { useState, useEffect } from 'react';
import { useNavigationStore } from '@/store/useNavigationStore';
import { X, AlertTriangle, ShieldCheck, Flag, Info, Loader2 } from 'lucide-react';
import { submitContentReport } from '@/app/actions/reports';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
    { id: 'abuso', label: 'Abuso/Exploração Infantil', severity: 'gravissima' },
    { id: 'odio', label: 'Discurso de Ódio Real', severity: 'gravissima' },
    { id: 'apologia', label: 'Apologia ao Crime', severity: 'gravissima' },
    { id: 'honra', label: 'Crimes contra a Honra', severity: 'gravissima' },
    { id: 'spam', label: 'Spam / Propaganda', severity: 'padrao' },
    { id: 'plagio', label: 'Plágio / Direitos Autorais', severity: 'padrao' },
    { id: 'desinformacao', label: 'Desinformação / Fake News', severity: 'padrao' },
    { id: 'offtopic', label: 'Fora de Tópico', severity: 'padrao' },
    { id: 'outro', label: 'Outros (Zona de Segurança)', severity: 'safe' }
];

export function ContentReportModal() {
    const { isContentReportModalOpen, reportSubmissionId, closeContentReport } = useNavigationStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const categoryInfo = CATEGORIES.find(c => c.id === selectedCategory);
    const isGravissima = categoryInfo?.severity === 'gravissima';
    const isSafe = categoryInfo?.severity === 'safe';

    // Clear state when modal closes
    useEffect(() => {
        if (!isContentReportModalOpen) {
            setSelectedCategory('');
            setReason('');
            setIsSubmitting(false);
        }
    }, [isContentReportModalOpen]);

    if (!isContentReportModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) {
            toast.error('Selecione uma categoria.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('submission_id', reportSubmissionId || '');
        formData.append('category', selectedCategory);
        formData.append('reason', reason);
        formData.append('url', typeof window !== 'undefined' ? window.location.href : '');

        try {
            const res = await submitContentReport(formData);
            if (res.success) {
                toast.success('Denúncia enviada com sucesso. Obrigado por colaborar!');
                closeContentReport();
            } else {
                toast.error(res.error || 'Erro ao enviar denúncia.');
            }
        } catch (err) {
            toast.error('Falha na comunicação com o servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div 
                className={`w-full max-w-lg bg-gray-900 border-2 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    isGravissima ? 'border-brand-red/50 shadow-brand-red/10' : 'border-gray-800'
                }`}
            >
                {/* Header */}
                <div className={`px-6 py-5 flex items-center justify-between border-b ${
                    isGravissima ? 'bg-brand-red/5 border-brand-red/20' : 'bg-gray-800/30 border-gray-800'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isGravissima ? 'bg-brand-red/20 text-brand-red' : 'bg-brand-blue/20 text-brand-blue'}`}>
                            <Flag size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Reportar Conteúdo</h2>
                            <p className="text-xs text-gray-400 font-medium">Protocolo de Moderação LabDiv</p>
                        </div>
                    </div>
                    <button 
                        onClick={closeContentReport}
                        className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Legal Alert */}
                    <div className={`p-4 rounded-2xl border flex gap-3 transition-colors duration-300 ${
                        isGravissima 
                            ? 'bg-brand-red/10 border-brand-red/30 animate-pulse' 
                            : 'bg-amber-400/5 border-amber-400/20'
                    }`}>
                        <AlertTriangle className={isGravissima ? 'text-brand-red shrink-0' : 'text-amber-400 shrink-0'} size={20} />
                        <div className="space-y-1">
                            <h4 className={`text-xs font-bold tracking-wider uppercase ${isGravissima ? 'text-brand-red' : 'text-amber-400'}`}>
                                Aviso de Responsabilidade
                            </h4>
                            <p className="text-[11px] leading-relaxed text-gray-300">
                                Denúncias em categorias <strong className="text-white">'Gravíssimas'</strong> suspendem o conteúdo imediatamente. 
                                O uso desta ferramenta para falsa acusação, calúnia ou difamação (Art. 138, 139 e 140 do CP) é crime.
                            </p>
                        </div>
                    </div>

                    {/* Safe Harbor Suggestion */}
                    {isSafe && (
                        <div className="p-3 bg-brand-blue/10 border border-brand-blue/30 rounded-xl flex gap-3 items-center">
                            <ShieldCheck className="text-brand-blue shrink-0" size={18} />
                            <p className="text-[11px] text-brand-blue-light font-medium">
                                <strong>Porto Seguro:</strong> Esta categoria nunca suspende um post automaticamente. Ideal se você tiver dúvidas.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Category Picker */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                                Por que você está denunciando?
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                                            selectedCategory === cat.id
                                                ? cat.severity === 'gravissima' 
                                                    ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/20'
                                                    : 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                                                : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Additional Context */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                                Mais detalhes (Opcional)
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Ajude os moderadores a entender o problema..."
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 placeholder:text-gray-600 min-h-[100px] resize-none transition-all"
                            />
                        </div>

                        {/* Footer / Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting || !selectedCategory}
                                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
                                    isSubmitting || !selectedCategory
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : isGravissima
                                            ? 'bg-brand-red text-white hover:brightness-110 shadow-xl shadow-brand-red/20'
                                            : 'bg-brand-blue text-white hover:brightness-110 shadow-xl shadow-brand-blue/20'
                                }`}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck size={18} />
                                        <span>Confirmar Denúncia</span>
                                    </>
                                )}
                            </button>
                            
                            <p className="mt-4 text-[10px] text-center text-gray-600 px-4">
                                DICA DE SEGURANÇA: Denúncias feitas de má-fé resultarão em banimento e encaminhamento de logs às autoridades.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
