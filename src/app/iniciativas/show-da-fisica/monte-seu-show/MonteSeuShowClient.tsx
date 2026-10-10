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

import React, { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    Check, 
    Sparkles, 
    ArrowRight, 
    ArrowLeft, 
    Calendar, 
    Send, 
    CheckCircle2, 
    School, 
    User, 
    Mail, 
    Users, 
    GraduationCap, 
    Clock, 
    AlertCircle,
    RotateCcw,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { EXPERIMENTS_CATALOG, SHOW_ACTS } from '../data/experiments';
import { ShowActType, ShowSelectedExperiments } from '@/types/show-da-fisica';
import { submitShowBooking, getAvailabilityRules } from '@/app/actions/show-da-fisica';

type AvailabilityRule = {
    id: string;
    experiment_id: string;
    unavailable_date: string | null;
    unavailable_weekday: number | null;
    reason: string;
};

const ACT_KEYS: Record<ShowActType, keyof ShowSelectedExperiments> = {
    'pre-show': 'preShow',
    'abertura': 'abertura',
    'principal': 'principal',
    'encerramento': 'encerramento'
};

const ACT_MAX_LIMITS: Record<ShowActType, number> = {
    'pre-show': 1,
    'abertura': 1,
    'principal': 2,
    'encerramento': 1
};

interface MonteSeuShowClientProps {
    orbitronClassName?: string;
}

export function MonteSeuShowClient({ orbitronClassName = '' }: MonteSeuShowClientProps) {
    // Etapa ativa: 0 = Pre-Show, 1 = Abertura, 2 = Principal, 3 = Encerramento, 4 = Agendamento
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isPending, startTransition] = useTransition();

    // Seleção de experimentos por ato (máx 1 no pré-show, abertura e encerramento; máx 2 no principal)
    const [selected, setSelected] = useState<ShowSelectedExperiments>({
        preShow: ['basket'],
        abertura: ['marie-curie'],
        principal: ['tesla', 'fumaca'],
        encerramento: ['nitrogenio']
    });

    // Formulário de dados
    const [formData, setFormData] = useState({
        email: '',
        schoolName: '',
        teacherName: '',
        studentCount: '40',
        schoolGrade: 'Faixa 3: 8º ano E.F. ao 3º ano E.M.',
        preferredShift: '10:00' as '10:00' | '14:00' | 'outro',
        preferredDate: '',
        notes: ''
    });

    // Estado pós envio
    const [bookingSuccess, setBookingSuccess] = useState<{
        bookingId: string;
        email: string;
    } | null>(null);

    // Regras de bloqueio da Moderação
    const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>([]);

    // Carregar cache e regras
    useEffect(() => {
        try {
            const savedForm = localStorage.getItem('hub_show_form_cache');
            const savedSelection = localStorage.getItem('hub_show_selection_cache');
            if (savedForm) setFormData(JSON.parse(savedForm));
            if (savedSelection) setSelected(JSON.parse(savedSelection));
        } catch (e) {
            console.error('Falha ao ler cache', e);
        }

        // Buscar bloqueios no Supabase
        const fetchRules = async () => {
            const res = await getAvailabilityRules();
            if (res.success && res.data) {
                setAvailabilityRules(res.data);
            }
        };
        fetchRules();
    }, []);

    // Salvar cache sempre que mudar
    useEffect(() => {
        localStorage.setItem('hub_show_form_cache', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        localStorage.setItem('hub_show_selection_cache', JSON.stringify(selected));
    }, [selected]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (bookingSuccess) return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === 'ArrowRight') {
                setCurrentStep(prev => prev < 4 ? prev + 1 : prev);
            } else if (e.key === 'ArrowLeft') {
                setCurrentStep(prev => prev > 0 ? prev - 1 : prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [bookingSuccess]);

    const toggleExperiment = (act: ShowActType, id: string) => {
        const key = ACT_KEYS[act];
        const max = ACT_MAX_LIMITS[act];

        setSelected(prev => {
            const list = prev[key];
            const exists = list.includes(id);

            if (exists) {
                return {
                    ...prev,
                    [key]: list.filter(item => item !== id)
                };
            }

            if (max === 1) {
                // Para etapas com limite de 1, substitui diretamente o anterior
                return {
                    ...prev,
                    [key]: [id]
                };
            } else {
                // Para o corpo/principal (limite de 2):
                if (list.length >= max) {
                    return {
                        ...prev,
                        [key]: [list[list.length - 1], id]
                    };
                }
                return {
                    ...prev,
                    [key]: [...list, id]
                };
            }
        });
    };

    const totalSelected = 
        selected.preShow.length + 
        selected.abertura.length + 
        selected.principal.length + 
        selected.encerramento.length;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.email.includes('@')) {
            toast.error('Por favor, informe um e-mail válido para receber a confirmação.');
            return;
        }

        if (!formData.schoolName.trim()) {
            toast.error('Informe o nome da escola ou instituição.');
            return;
        }

        if (!formData.teacherName.trim()) {
            toast.error('Informe o nome do responsável.');
            return;
        }

        if (totalSelected === 0) {
            toast.error('Selecione pelo menos um experimento para o seu show!');
            return;
        }

        startTransition(async () => {
            const payload = {
                email: formData.email.trim(),
                schoolName: formData.schoolName.trim(),
                teacherName: formData.teacherName.trim(),
                studentCount: parseInt(formData.studentCount, 10) || 1,
                schoolGrade: formData.schoolGrade,
                preferredShift: formData.preferredShift,
                preferredDate: formData.preferredDate.trim() || undefined,
                notes: formData.notes.trim() || undefined,
                selectedExperiments: selected,
            };

            const result = await submitShowBooking(payload);

            if (result.success && result.bookingId) {
                toast.success('Agendamento enviado com sucesso!');
                try {
                    confetti({
                        particleCount: 90,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                } catch {
                    // Ignore canvas confetti error if unsupported
                }
                setBookingSuccess({
                    bookingId: result.bookingId,
                    email: formData.email
                });
            } else {
                toast.error(result.error || result.message || 'Falha ao agendar show.');
            }
        });
    };

    const currentAct = SHOW_ACTS[currentStep] || null;
    const currentExperiments = currentAct 
        ? EXPERIMENTS_CATALOG.filter(e => e.act === currentAct.id) 
        : [];

    return (
        <div className={`min-h-screen bg-[#070708] text-white flex flex-col ${orbitronClassName}`}>
            <style dangerouslySetInnerHTML={{__html: `
                .neon-text-blue {
                    text-shadow: 0 0 6px #002ffe, 0 0 14px #002ffe, 0 0 28px #002ffe;
                    color: #fff;
                }
                .neon-text-red {
                    text-shadow: 0 0 6px #f60011, 0 0 14px #f60011, 0 0 28px #f60011;
                    color: #fff;
                }
                .neon-text-green {
                    text-shadow: 0 0 6px #01f300, 0 0 14px #01f300, 0 0 28px #01f300;
                    color: #fff;
                }
                .neon-border-green {
                    border: 2px solid #01f300;
                    box-shadow: 0 0 15px rgba(1, 243, 0, 0.4), inset 0 0 10px rgba(1, 243, 0, 0.2);
                }
                .neon-border-blue {
                    border: 2px solid #002ffe;
                    box-shadow: 0 0 15px rgba(0, 47, 254, 0.45), inset 0 0 10px rgba(0, 47, 254, 0.2);
                }
                .neon-border-red {
                    border: 2px solid #f60011;
                    box-shadow: 0 0 15px rgba(246, 0, 17, 0.4), inset 0 0 10px rgba(246, 0, 17, 0.2);
                }
            `}} />

            {/* Standalone Header */}
            <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 py-3 md:py-4">
                <div className="w-full max-w-none px-4 md:px-8 xl:px-12 mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/iniciativas/show-da-fisica" 
                            className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-open-sans uppercase tracking-wider"
                            title="Voltar ao Show da Física"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Voltar</span>
                        </Link>
                        <div className="h-5 w-[1px] bg-white/20 hidden sm:block" />
                        <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider flex items-center gap-1.5">
                            <span className="neon-text-red">Show</span>
                            <span className="neon-text-blue">de</span>
                            <span className="neon-text-green">Física</span>
                            <span className="text-xs md:text-sm font-light text-gray-400 ml-2 font-sans lowercase hidden md:inline">
                                / monte seu show
                            </span>
                        </h1>
                    </div>
                </div>
            </header>

            {/* Navegador de Passos (Stepper) */}
            <nav className="bg-[#0e0e12] border-b border-white/5 px-2 md:px-4 py-3 overflow-x-auto no-scrollbar">
                <div className="w-full max-w-none px-4 md:px-8 xl:px-12 mx-auto flex items-center justify-between min-w-[550px] gap-2">
                    {SHOW_ACTS.map((act, index) => {
                        const isCurrent = currentStep === index;
                        const isPast = currentStep > index;
                        const key = ACT_KEYS[act.id];
                        const countInAct = selected[key].length;

                        return (
                            <button
                                key={act.id}
                                onClick={() => setCurrentStep(index)}
                                className={`flex-1 flex items-center gap-2 p-2.5 rounded-lg text-left transition-all duration-200 border ${
                                    isCurrent
                                        ? act.themeColor === 'green'
                                            ? 'bg-black neon-border-green text-white'
                                            : act.themeColor === 'blue'
                                            ? 'bg-black neon-border-blue text-white'
                                            : 'bg-black neon-border-red text-white'
                                        : isPast
                                        ? 'bg-[#141418] border-white/15 text-gray-200 hover:bg-[#1a1a20]'
                                        : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-sans ${
                                    isCurrent 
                                        ? 'bg-white text-black' 
                                        : isPast 
                                        ? 'bg-gray-700 text-white' 
                                        : 'bg-gray-800 text-gray-500'
                                }`}>
                                    {isPast ? <Check className="w-3.5 h-3.5" /> : index + 1}
                                </span>
                                <div className="truncate">
                                    <p className="text-xs uppercase font-bold tracking-wider leading-none">
                                        {act.title}
                                    </p>
                                    <span className="text-[10px] font-sans text-gray-400">
                                        {countInAct}/{ACT_MAX_LIMITS[act.id]} sel.
                                    </span>
                                </div>
                            </button>
                        );
                    })}

                    {/* Step 5: Agendamento */}
                    <button
                        onClick={() => setCurrentStep(4)}
                        className={`flex-1 flex items-center gap-2 p-2.5 rounded-lg text-left transition-all duration-200 border ${
                            currentStep === 4
                                ? 'bg-black neon-border-red text-white'
                                : 'bg-[#141418] border-white/10 text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-sans ${
                            currentStep === 4 ? 'bg-[#f60011] text-white' : 'bg-gray-800 text-gray-400'
                        }`}>
                            5
                        </span>
                        <div className="truncate">
                            <p className="text-xs uppercase font-bold tracking-wider leading-none">
                                Agendar
                            </p>
                            <span className="text-[10px] font-sans text-gray-400">
                                Finalizar & E-mail
                            </span>
                        </div>
                    </button>
                </div>
            </nav>

            {/* Conteúdo Principal */}
            <main className="flex-1 w-full max-w-none mx-auto px-4 md:px-8 xl:px-12 py-8 pb-32">
                {bookingSuccess ? (
                    /* Tela de Confirmação de Agendamento */
                    <div className="max-w-2xl mx-auto my-8 p-8 md:p-12 bg-black neon-border-green rounded-2xl text-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-[#01f300]/10 border-2 border-[#01f300] rounded-full flex items-center justify-center mx-auto mb-6 text-[#01f300] shadow-[0_0_20px_#01f300]">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-3 neon-text-green">
                            Agendamento Solicitado!
                        </h2>
                        
                        <div className="inline-block px-4 py-1.5 bg-[#141416] border border-[#01f300]/40 rounded-full font-mono text-sm text-[#01f300] mb-6">
                            Protocolo: #{bookingSuccess.bookingId}
                        </div>

                        <p className="font-sans text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                            Enviamos a confirmação detalhada do seu show para o e-mail: <br />
                            <strong className="text-white underline">{bookingSuccess.email}</strong>, com cópia direta para a equipe do HUB Lab-Div.
                        </p>

                        <div className="bg-[#121214] p-5 rounded-xl border border-white/10 text-left font-sans text-sm text-gray-300 space-y-2 mb-8">
                            <p className="font-bold text-white uppercase font-sans tracking-wide">Próximos passos:</p>
                            <p>1. Verifique sua caixa de entrada (e a pasta de spam, se necessário).</p>
                            <p>2. A equipe do Show de Física entrará em contato para confirmar a reserva do auditório para a data solicitada.</p>
                            <p>3. Prepare seus alunos para uma experiência inesquecível de ciência!</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    setBookingSuccess(null);
                                    setCurrentStep(0);
                                }}
                                className="w-full sm:w-auto px-6 py-3 bg-[#1e1e24] hover:bg-[#25252d] text-white font-sans font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Montar outro show
                            </button>
                            <Link
                                href="/iniciativas/show-da-fisica"
                                className="w-full sm:w-auto px-6 py-3 bg-[#01f300] text-black font-sans font-bold rounded-lg hover:bg-[#00dd00] shadow-[0_0_15px_#01f300] transition-all flex items-center justify-center gap-2"
                            >
                                Conhecer mais do Show
                            </Link>
                        </div>
                    </div>
                ) : currentStep < 4 && currentAct ? (
                    /* Exibição dos Cards de Experimentos para o Ato Ativo */
                    <div>
                        {/* Header do Ato */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                <span className={`px-2.5 py-0.5 rounded border text-black font-extrabold ${
                                    currentAct.themeColor === 'green' ? 'bg-[#01f300] border-[#01f300]' :
                                    currentAct.themeColor === 'blue' ? 'bg-[#002ffe] text-white border-[#002ffe]' :
                                    'bg-[#f60011] text-white border-[#f60011]'
                                }`}>
                                    {currentAct.badgeText}
                                </span>
                                <span>{currentAct.subtitle}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-3">
                                {currentAct.title}
                            </h2>
                            <p className="font-sans text-gray-300 text-base md:text-lg max-w-3xl leading-relaxed">
                                {currentAct.description}
                            </p>
                        </div>

                        {/* Miniaturas selecionadas abaixo do título do ato */}
                        {(() => {
                            const actKey = ACT_KEYS[currentAct.id];
                            const selectedIds = selected[actKey];
                            const selectedInCurrentAct = EXPERIMENTS_CATALOG.filter(e => selectedIds.includes(e.id));
                            const maxLimit = ACT_MAX_LIMITS[currentAct.id];

                            return (
                                <div className="mb-8 p-4 rounded-xl bg-[#111115] border border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="w-2.5 h-2.5 rounded-full inline-block animate-pulse" 
                                                style={{ backgroundColor: currentAct.accentHex, boxShadow: `0 0 8px ${currentAct.accentHex}` }} 
                                            />
                                            <span className="text-xs uppercase font-bold tracking-wider text-gray-200">
                                                Miniatura{maxLimit > 1 ? 's' : ''} Selecionada{maxLimit > 1 ? 's' : ''} no {currentAct.title}:
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-mono font-bold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                                            {selectedInCurrentAct.length} de {maxLimit} selecionado{maxLimit > 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {selectedInCurrentAct.length === 0 ? (
                                        <p className="text-xs font-sans text-gray-500 italic py-2">
                                            Nenhum experimento selecionado. Toque em um card abaixo para escolher para o {currentAct.title.toLowerCase()}.
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            {selectedInCurrentAct.map((exp) => (
                                                <div
                                                    key={exp.id}
                                                    className={`flex items-center gap-3 p-2 pr-3 rounded-lg bg-black/90 border transition-all ${
                                                        exp.themeColor === 'green' ? 'neon-border-green' :
                                                        exp.themeColor === 'blue' ? 'neon-border-blue' :
                                                        'neon-border-red'
                                                    }`}
                                                >
                                                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-neutral-900 border border-white/10">
                                                        <Image
                                                            src={exp.image}
                                                            alt={exp.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 pr-1">
                                                        <p className="text-xs font-bold text-white uppercase tracking-wide truncate">
                                                            {exp.title}
                                                        </p>
                                                        <p className="text-[10px] font-sans text-gray-400 truncate">
                                                            {exp.concept}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleExperiment(exp.act, exp.id);
                                                        }}
                                                        className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
                                                        title="Remover seleção"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Grid de Cards com Foto do Experimento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentExperiments.map((exp) => {
                                const actKey = ACT_KEYS[exp.act];
                                const isSelected = selected[actKey].includes(exp.id);

                                return (
                                    <div
                                        key={exp.id}
                                        onClick={() => toggleExperiment(exp.act, exp.id)}
                                        className={`group relative rounded-xl overflow-hidden cursor-pointer bg-[#101014] transition-all duration-300 border flex flex-col ${
                                            isSelected
                                                ? exp.themeColor === 'green'
                                                    ? 'neon-border-green -translate-y-1'
                                                    : exp.themeColor === 'blue'
                                                    ? 'neon-border-blue -translate-y-1'
                                                    : 'neon-border-red -translate-y-1'
                                                : 'border-white/10 hover:border-white/30 hover:-translate-y-0.5'
                                        }`}
                                    >
                                        {/* Foto do Experimento */}
                                        <div className="relative w-full h-56 bg-black overflow-hidden">
                                            <Image
                                                src={exp.image}
                                                alt={exp.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                                                    isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
                                                }`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-black/30 to-transparent" />
                                            
                                            {/* Badge do Conceito */}
                                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-md text-[10px] font-sans font-semibold text-gray-200 tracking-wide uppercase">
                                                    {exp.concept}
                                                </span>
                                                {availabilityRules.some(r => r.experiment_id === exp.id) && (
                                                    <span className="px-2.5 py-1 bg-[#f60011]/90 backdrop-blur-md border border-white/20 rounded-md text-[10px] font-sans font-bold text-white tracking-wide uppercase flex items-center gap-1 shadow-lg shadow-red-500/20">
                                                        <AlertCircle className="w-3 h-3" /> Agenda Restrita
                                                    </span>
                                                )}
                                            </div>

                                            {/* Badge Indicador de Seleção */}
                                            <div className="absolute top-3 right-3 z-10">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                    isSelected
                                                        ? exp.themeColor === 'green'
                                                            ? 'bg-[#01f300] text-black shadow-[0_0_12px_#01f300]'
                                                            : exp.themeColor === 'blue'
                                                            ? 'bg-[#002ffe] text-white shadow-[0_0_12px_#002ffe]'
                                                            : 'bg-[#f60011] text-white shadow-[0_0_12px_#f60011]'
                                                        : 'bg-black/60 border border-white/30 text-white/40 group-hover:border-white/60'
                                                }`}>
                                                    <Check className={`w-4 h-4 ${isSelected ? 'stroke-[3]' : ''}`} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detalhes do Experimento */}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className={`text-xl font-bold uppercase tracking-wide mb-1 transition-colors ${
                                                    isSelected
                                                        ? exp.themeColor === 'green'
                                                            ? 'text-[#01f300]'
                                                            : exp.themeColor === 'blue'
                                                            ? 'text-[#4d79ff]'
                                                            : 'text-[#ff4d5a]'
                                                        : 'text-white'
                                                }`}>
                                                    {exp.title}
                                                </h3>
                                                <p className="text-xs font-sans text-gray-400 font-medium mb-3">
                                                    {exp.subtitle}
                                                </p>
                                                <p className="text-sm font-sans text-gray-300 leading-relaxed">
                                                    {exp.description}
                                                </p>
                                            </div>

                                            {/* Botão de Toggle */}
                                            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                                                <span className="text-xs font-sans text-gray-400">
                                                    {isSelected ? 'Incluído no roteiro' : 'Toque para selecionar'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExperiment(exp.act, exp.id);
                                                    }}
                                                    className={`px-3 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                                                        isSelected
                                                            ? 'bg-white text-black hover:bg-gray-200'
                                                            : 'bg-white/10 text-white hover:bg-white/20'
                                                    }`}
                                                >
                                                    {isSelected ? '✓ Selecionado' : '+ Adicionar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Passo 5: Formulário de Agendamento e Resumo Completo */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Coluna Esquerda: Formulário de Agendamento */}
                        <div className="lg:col-span-7 bg-[#101014] border border-white/10 rounded-2xl p-6 md:p-8">
                            <div className="mb-6">
                                <span className="px-2.5 py-1 bg-[#f60011] text-white rounded text-xs font-bold uppercase tracking-wider">
                                    Etapa Final
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider mt-2 mb-1">
                                    Agendar o Show
                                </h2>
                                <p className="font-sans text-sm text-gray-300">
                                    Informe os dados da sua escola. Você receberá a confirmação completa por e-mail, e a equipe do HUB Lab-Div receberá uma cópia direta para organizar a sua visita.
                                </p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4 font-sans">
                                <div>
                                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-1.5">
                                        Seu E-mail (Receberá a confirmação) *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="exemplo@escola.sp.gov.br"
                                            className="w-full bg-[#16161b] border border-white/15 focus:border-[#f60011] focus:ring-1 focus:ring-[#f60011] rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
                                        />
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        O HUB receberá uma cópia deste agendamento na caixa de entrada oficial.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-1.5">
                                            Nome da Escola / Instituição *
                                        </label>
                                        <div className="relative">
                                            <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.schoolName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                                                placeholder="Ex: E.E. Santos Dumont"
                                                className="w-full bg-[#16161b] border border-white/15 focus:border-[#002ffe] rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-1.5">
                                            Professor / Responsável *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.teacherName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, teacherName: e.target.value }))}
                                                placeholder="Nome completo"
                                                className="w-full bg-[#16161b] border border-white/15 focus:border-[#002ffe] rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-1.5">
                                            Quantidade de Alunos *
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                min="1"
                                                max="120"
                                                required
                                                value={formData.studentCount}
                                                onChange={(e) => setFormData(prev => ({ ...prev, studentCount: e.target.value }))}
                                                className="w-full bg-[#16161b] border border-white/15 focus:border-[#01f300] rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
                                            />
                                        </div>
                                        <span className="text-[10px] text-gray-400">Capacidade usual: até ~90 alunos</span>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-1.5">
                                            Horário da Sessão
                                        </label>
                                        <div className="relative">
                                            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                value={formData.preferredShift}
                                                onChange={(e) => setFormData(prev => ({ ...prev, preferredShift: e.target.value as any }))}
                                                className="w-full bg-[#16161b] border border-white/15 focus:border-[#01f300] rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
                                            >
                                                <option value="10:00">Manhã — 10:00</option>
                                                <option value="14:00">Tarde — 14:00</option>
                                                <option value="outro">A combinar com a equipe</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-1.5">
                                        Faixa Escolar dos Alunos *
                                    </label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            value={formData.schoolGrade}
                                            onChange={(e) => setFormData(prev => ({ ...prev, schoolGrade: e.target.value }))}
                                            className="w-full bg-[#16161b] border border-white/15 focus:border-[#01f300] rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
                                        >
                                            <option value="Faixa 1: 1º ao 4º ano (E.F.)">Faixa 1: 1º ao 4º ano (E.F.)</option>
                                            <option value="Faixa 2: 5º ao 7º ano (E.F.)">Faixa 2: 5º ao 7º ano (E.F.)</option>
                                            <option value="Faixa 3: 8º ano E.F. ao 3º ano E.M.">Faixa 3: 8º ano E.F. ao 3º ano E.M.</option>
                                            <option value="Ensino Técnico / Pré-Vestibular">Ensino Técnico / Pré-Vestibular</option>
                                            <option value="Graduação / Público Geral">Graduação / Público Geral</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-1.5">
                                        Previsão de Data Exata *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            required
                                            value={formData.preferredDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-[#16161b] border border-white/15 focus:border-white/40 rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
                                        />
                                    </div>
                                    <span className="text-[11px] text-gray-400">Sessões acontecem às Terças, Quartas e Quintas.</span>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-1.5">
                                        Observações / Acessibilidade
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Informações adicionais, alunos com deficiência motora/auditiva, objetivos pedagógicos específicos..."
                                        className="w-full bg-[#16161b] border border-white/15 focus:border-white/40 rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors resize-none"
                                    />
                                </div>

                                {/* Validação Dinâmica de Agenda */}
                                {(() => {
                                    let conflictMessage = null;
                                    if (formData.preferredDate) {
                                        const dateObj = new Date(formData.preferredDate);
                                        const tzOffset = dateObj.getTimezoneOffset() * 60000;
                                        const localDate = new Date(dateObj.getTime() + tzOffset);
                                        const weekday = localDate.getDay();
                                        
                                        const allSelectedIds = [
                                            ...selected.preShow, 
                                            ...selected.abertura, 
                                            ...selected.principal, 
                                            ...selected.encerramento
                                        ];

                                        for (const id of allSelectedIds) {
                                            const rule = availabilityRules.find(r => r.experiment_id === id && (r.unavailable_date === formData.preferredDate || r.unavailable_weekday === weekday));
                                            if (rule) {
                                                const expName = EXPERIMENTS_CATALOG.find(e => e.id === id)?.title;
                                                conflictMessage = `Conflito! O experimento "${expName}" está bloqueado nesta data. Motivo: ${rule.reason}. Altere o dia ou remova o experimento.`;
                                                break;
                                            }
                                        }
                                    }

                                    if (conflictMessage) {
                                        return (
                                            <div className="bg-[#f60011]/20 border border-[#f60011] text-white p-4 rounded-xl flex items-start gap-3">
                                                <AlertCircle className="w-6 h-6 text-[#f60011] shrink-0" />
                                                <p className="font-sans text-sm font-bold">{conflictMessage}</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                                isPending 
                                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                    : 'bg-[#f60011] text-white hover:bg-[#ff1a2b] shadow-[0_0_20px_#f60011] hover:shadow-[0_0_30px_#f60011]'
                                            }`}
                                        >
                                            {isPending ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Enviando Agendamento...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    <span>Agendar o Show</span>
                                                </>
                                            )}
                                        </button>
                                    );
                                })()}
                            </form>
                        </div>

                        {/* Coluna Direita: Resumo do Roteiro Montado */}
                        <div className="lg:col-span-5 bg-[#121216] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#01f300]" />
                                Seu Roteiro Customizado
                            </h3>

                            <div className="space-y-4">
                                {SHOW_ACTS.map((act) => {
                                    const key = ACT_KEYS[act.id];
                                    const ids = selected[key];
                                    const experiments = EXPERIMENTS_CATALOG.filter(e => ids.includes(e.id));

                                    return (
                                        <div key={act.id} className="bg-[#18181e] p-4 rounded-xl border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                                    act.themeColor === 'green' ? 'text-[#01f300]' :
                                                    act.themeColor === 'blue' ? 'text-[#4d79ff]' :
                                                    'text-[#ff4d5a]'
                                                }`}>
                                                    {act.title}
                                                </span>
                                                <span className="text-[11px] font-sans text-gray-400">
                                                    {experiments.length} {experiments.length === 1 ? 'item' : 'itens'}
                                                </span>
                                            </div>

                                            {experiments.length === 0 ? (
                                                <p className="text-xs font-sans text-gray-500 italic">
                                                    Nenhum selecionado neste ato.
                                                </p>
                                            ) : (
                                                <div className="space-y-2 mt-2">
                                                    {experiments.map(e => (
                                                        <div key={e.id} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg">
                                                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-black">
                                                                <Image
                                                                    src={e.image}
                                                                    alt={e.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs font-bold text-white truncate">
                                                                    {e.title}
                                                                </p>
                                                                <p className="text-[10px] font-sans text-gray-400 truncate">
                                                                    {e.concept}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-black/50 border border-white/10 flex items-start gap-3 text-xs font-sans text-gray-400">
                                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <p>
                                    Você pode voltar a qualquer momento pelas abas acima para adicionar ou remover experimentos do seu show.
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </main>

            {/* Barra Flutuante Inferior de Navegação (Dock) */}
            {!bookingSuccess && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-t border-white/15 px-4 py-3">
                    <div className="w-full max-w-none px-4 md:px-8 xl:px-12 mx-auto flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                            className={`px-6 py-3.5 rounded-lg text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                                currentStep === 0 
                                    ? 'opacity-30 cursor-not-allowed text-gray-500' 
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Ato Anterior
                        </button>

                        <div className="hidden sm:flex items-center gap-3 text-xs font-sans text-gray-400">
                            <span>Total Selecionado:</span>
                            <span className="text-sm font-bold text-white font-mono">{totalSelected}</span>
                        </div>

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                className="px-8 py-3.5 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            >
                                <span>{currentStep === 3 ? 'Avançar para Agendamento' : 'Próximo Ato'}</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(0)}
                                className="px-4 py-2 text-xs font-sans text-gray-400 hover:text-white transition-colors"
                            >
                                Revisar Experimentos
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
