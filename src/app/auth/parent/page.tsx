'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';

export default function ParentLoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // Redireciona o responsável para o fluxo do Age Gate e LGPD:
                emailRedirectTo: `${window.location.origin}/auth/parent/consent`,
            },
        });

        if (error) {
            toast.error('Erro ao enviar link mágico. Tente novamente.');
            console.error('[Parent-Auth]', error);
        } else {
            setSent(true);
            toast.success('Link de acesso enviado! Verifique seu e-mail.');
        }

        setLoading(false);
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-[#121212]">
            <div className="w-full max-w-md p-8 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">
                        Acesso de Responsáveis
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Área de Gestão e Consentimento LGPD (HUB Lab-Div)
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Email do Responsável
                            </label>
                            <input
                                type="email"
                                placeholder="responsavel@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-[#0F4780] hover:bg-[#0c3966] text-white py-2 rounded-md font-semibold disabled:opacity-50"
                            disabled={loading || !email}
                        >
                            {loading ? 'Enviando link...' : 'Receber Magic Link'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-green-800 dark:text-green-300">
                            Enviamos um link mágico de acesso para <b>{email}</b>. 
                        </p>
                        <p className="text-sm opacity-80 text-green-700 dark:text-green-400">
                            Por favor, verifique sua caixa de entrada e clique no botão para continuar para a etapa final de verificação de maioridade.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
