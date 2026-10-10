'use client';

import React, { useState, useTransition } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { validateShowPin } from '@/app/actions/show-da-fisica';
import toast from 'react-hot-toast';

export function ShowActionButtons() {
    const [mode, setMode] = useState<'buttons' | 'input'>('buttons');
    const [pin, setPin] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pin.trim()) return;

        startTransition(async () => {
            const res = await validateShowPin(pin);
            if (res.success) {
                if (res.role === 'teacher') {
                    router.push(`/iniciativas/show-da-fisica/sessao/professor/${res.code}`);
                } else {
                    router.push(`/iniciativas/show-da-fisica/sessao/aluno/${res.code}`);
                }
            } else {
                toast.error(res.error || 'Código inválido');
                // Mantemos no input para ele tentar novamente
            }
        });
    };

    return (
        <div className="mt-20 text-center relative min-h-[120px]">
            <p className="text-lg font-sans text-gray-400 mb-6 transition-opacity duration-300">
                {mode === 'buttons' 
                    ? "Pronto para agendar a sua escola ou acessar as interações do seu show?" 
                    : "Digite o PIN (Ex: S1-ALUNO-ABCD) e pressione Enter"}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-3xl mx-auto">
                {mode === 'buttons' ? (
                    <>
                        <a 
                            href="/iniciativas/show-da-fisica/monte-seu-show" 
                            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-black neon-border-red text-[#f60011] font-bold uppercase tracking-widest hover:bg-[#f60011] hover:text-white hover:shadow-[0_0_20px_#f60011] transition-all duration-300 rounded-none shrink-0"
                        >
                            Monte seu Show
                            <ArrowRight className="w-6 h-6" />
                        </a>
                        <button 
                            onClick={() => setMode('input')}
                            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-black neon-border-green text-[#01f300] font-bold uppercase tracking-widest hover:bg-[#01f300] hover:text-black hover:shadow-[0_0_20px_#01f300] transition-all duration-300 rounded-none shrink-0"
                        >
                            Acompanhe seu Show
                            <Terminal className="w-6 h-6" />
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full relative flex items-center animate-in zoom-in-95 duration-300">
                        <input
                            type="text"
                            placeholder="S1-ALUNO-XXXX"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.toUpperCase())}
                            autoFocus
                            className="w-full bg-black border-2 border-[#01f300] shadow-[0_0_20px_rgba(1,243,0,0.3),inset_0_0_10px_rgba(1,243,0,0.1)] rounded-none px-6 py-5 text-center text-xl font-black uppercase tracking-widest text-[#01f300] outline-none transition-all placeholder:text-[#01f300]/30"
                        />
                        <button
                            type="submit"
                            disabled={isPending || pin.length < 5}
                            className="absolute right-3 top-3 bottom-3 aspect-square flex items-center justify-center bg-[#01f300] hover:bg-[#00cc00] text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(1,243,0,0.4)]"
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="w-6 h-6" />
                            )}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => {
                                setMode('buttons');
                                setPin('');
                            }}
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 hover:text-white uppercase tracking-wider transition-colors"
                        >
                            Voltar
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
