'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Rocket, ExternalLink } from 'lucide-react';

export default function SuccessConsentPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-800"
            >
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white dark:border-[#1E1E1E] shadow-lg">
                    <CheckCircle2 className="w-14 h-14 text-green-600 dark:text-green-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Missão Cumprida!</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                    Você autorizou o acesso do seu jovem pesquisador com sucesso. O <strong>HUB Lab-Div</strong> agora é um espaço seguro de aprendizado para ele.
                </p>
                
                <div className="bg-[#0F4780]/5 dark:bg-[#0F4780]/10 rounded-2xl p-8 mb-10 border border-[#0F4780]/20 text-left relative overflow-hidden">
                    <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-[#0F4780]/10" />
                    
                    <h3 className="text-[#0F4780] dark:text-blue-300 font-bold text-lg mb-3 flex items-center gap-2">
                        <Rocket className="w-5 h-5" />
                        Que tal participar também?
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        A universidade fica ainda melhor quando a família está por perto. Crie sua conta para explorar pesquisas, interagir com acadêmicos e acompanhar a jornada científica brasileira.
                    </p>
                    
                    <button
                        onClick={() => router.push('/register')}
                        className="flex items-center gap-2 bg-[#0F4780] hover:bg-[#0c3966] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
                    >
                        Criar minha conta agora
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors font-medium underline underline-offset-4"
                    >
                        Ir para a Página Inicial
                    </button>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        Obrigado por apoiar a ciência no IFUSP
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
