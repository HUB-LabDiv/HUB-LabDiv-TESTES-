'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';

export default function PendingConsentPage() {
    const router = useRouter();
    const [guardianEmail, setGuardianEmail] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchGuardianEmail();
    }, [supabase]);



    const fetchGuardianEmail = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('profiles').select('guardian_email').eq('id', user.id).single();
        if (data?.guardian_email) setGuardianEmail(data.guardian_email);
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-yellow-100 dark:bg-[#FFCC00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl text-yellow-600 dark:text-[#FFCC00]">pending_actions</span>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Aguardando Autorização</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Seus dados foram enviados com sucesso! Como você é <strong>menor de 18 anos</strong>, enviamos um link de segurança para o e-mail:
                    <div className="mt-2 font-bold text-[#0F4780] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/10 py-2 rounded-lg break-all px-2">
                        {guardianEmail || 'p...l@r...l.com'}
                    </div>
                </p>
                
                <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-lg mb-8 text-sm text-left border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Próximos Passos:</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li className="flex gap-2">
                            <span className="text-[#0F4780] font-bold">1.</span>
                            Peça para seu responsável verificar o e-mail informado.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-[#0F4780] font-bold">2.</span>
                            Ele(a) deve clicar no link e confirmar a maioridade via CPF.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-[#0F4780] font-bold">3.</span>
                            Assim que ele autorizar, seu acesso será liberado instantaneamente.
                        </li>
                    </ul>
                </div>



                <div className="flex flex-col gap-4 mt-8">
                    <button
                        onClick={() => router.push('/re-accept-terms')}
                        className="w-full py-4 bg-white dark:bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:border-[#0F4780] hover:text-[#0F4780] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Alterar e-mail informado
                    </button>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors text-sm font-medium"
                    >
                        Voltar para o Início
                    </button>
                </div>
            </div>
        </main>
    );
}
