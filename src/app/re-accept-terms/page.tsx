'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import { TermsOfUse } from '@/components/auth/TermsOfUse';

export default function ReAcceptTermsPage() {
    const [cpf, setCpf] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!termsAccepted) {
            toast.error('Você deve ler e aceitar os Novos Termos (v2.0).');
            return;
        }

        if (cpf.length < 11) {
            toast.error('CPF incompleto.');
            return;
        }

        setLoading(true);

        try {
            // 1. Validate CPF (Age Gate Híbrido Obrigatório das Contas Legadas)
            const cpfRes = await fetch('/api/auth/verify-cpf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf }),
            });

            const cpfData = await cpfRes.json();
            
            if (!cpfRes.ok) {
                toast.error(cpfData.error || 'Falha ao validar CPF.');
                setLoading(false);
                return;
            }

            // 2. Refresh de Sessão para Perfil
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Falha de Sessão');

            // 3. Update Accepted Terms
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    accepted_terms_version: 'v2.0',
                    accepted_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (profileError) {
                throw new Error(profileError.message);
            }

            toast.success('Regularização concluída! Redirecionando...');
            router.push('/');
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error('Ocorreu um erro na atualização do servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen py-10 items-center justify-center p-4 bg-gray-50 dark:bg-[#121212]">
            <div className="w-full max-w-3xl space-y-8 bg-white dark:bg-[#1E1E1E] p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                
                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-extrabold text-[#0F4780] dark:text-blue-400">
                        Atualização Obrigatória LGPD
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xl mx-auto">
                        Identificamos que a sua conta de pesquisador é antiga. Para prosseguir o uso da plataforma de forma anônima e legal, 
                        você deve aceitar a licença <strong className="text-gray-900 dark:text-gray-100">(CC BY 4.0)</strong> e realizar nossa nova verificação demográfica de 
                        <strong className="text-gray-900 dark:text-gray-100"> Age Gate</strong> (Mock Paridade).
                    </p>
                </div>

                {/* Termos de Uso */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                     <TermsOfUse 
                        acceptedVersion={termsAccepted ? 'v2.0' : ''}
                        onAccept={() => {
                            setTermsAccepted(true);
                            toast.success('Termos selecionados com sucesso!');
                        }}
                     />
                </div>

                {/* Gatekeeper Check Form */}
                {termsAccepted && (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-gray-50 p-6 rounded-lg dark:bg-[#151515] border border-gray-200 dark:border-gray-800">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Etapa 2/2: Confirmar Maioridade</h3>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Seu CPF (Mock: final Par = Aprovado)
                            </label>
                            <input
                                type="text"
                                placeholder="Apenas números..."
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))} // only numbers
                                required
                                maxLength={11}
                                className="w-full px-4 py-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-[#0F4780] hover:bg-[#0c3966] text-white py-3 rounded-md font-semibold text-lg transition-colors disabled:opacity-50"
                            disabled={loading || cpf.length < 11 || !termsAccepted}
                        >
                            {loading ? 'Sincronizando Banco de Dados...' : 'Concluir Regularização de Cadastro'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
