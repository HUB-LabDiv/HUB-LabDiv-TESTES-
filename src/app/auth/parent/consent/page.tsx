'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ParentConsentPage() {
    const [cpf, setCpf] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdult, setIsAdult] = useState<boolean | null>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // Verifica se o pai já passou pelo portão de idade anteriormente
        const checkAdultStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Sessão expirada. Faça login novamente.');
                router.push('/auth/parent');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('is_adult')
                .eq('id', user.id)
                .single();

            if (profile?.is_adult === true) {
                setIsAdult(true);
            }
        };
        checkAdultStatus();
    }, [supabase, router]);

    const handleVerifyCpf = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify-cpf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf }),
            });

            const data = await res.json();

            if (res.ok && data.is_adult) {
                toast.success('Identidade adulta confirmada.');
                setIsAdult(true);
            } else if (res.ok && !data.is_adult) {
                toast.error('Classificação etária negada para responsáveis.');
            } else {
                toast.error(data.error || 'Erro na verificação.');
            }
        } catch (err) {
            toast.error('Erro de conexão ao verificar CPF.');
        } finally {
            setLoading(false);
        }
    };

    if (isAdult) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#121212]">
                <div className="w-full max-w-lg p-8 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-green-200 dark:border-green-800 text-center">
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
                        Age Gate Aprovado
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Você confirmou sua maioridade e está apto a consentir atividades para menores tutelados, conforme exigência da LGPD.
                    </p>
                    <button 
                         onClick={() => router.push('/')}
                         className="px-6 py-2 bg-[#0F4780] hover:bg-[#0c3966] text-white rounded-md font-semibold"
                    >
                        Ir para o Painel Parental
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-[#121212]">
            <div className="w-full max-w-md p-8 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">
                        Verificação de Idade
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Obrigatório: Confirme sua identidade (Mock: Par = Aprovado).
                    </p>
                </div>

                <form onSubmit={handleVerifyCpf} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            CPF (Apenas números)
                        </label>
                        <input
                            type="text"
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-[#0F4780] hover:bg-[#0c3966] text-white py-2 rounded-md font-semibold disabled:opacity-50"
                        disabled={loading || cpf.length < 11}
                    >
                        {loading ? 'Validando e Hasheando...' : 'Confirmar Maioridade'}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-4">
                        * O CPF será processado através de um Hash Bcrypt Seguro e deletado da memória instantaneamente. Seu texto original <b>não</b> será salvo em nosso banco de dados.
                    </p>
                </form>
            </div>
        </main>
    );
}
