'use client';

import React from 'react';
import Link from 'next/link';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

export default function PrivacyPolicy() {
    return (
        <MainLayoutWrapper>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <header className="mb-10 text-center">
                <div className="w-16 h-16 mx-auto bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-4 border border-brand-blue/20">
                    <span className="material-symbols-outlined text-4xl text-brand-blue">shield_person</span>
                </div>
                <h1 className="text-3xl font-bukra font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-3">
                    Políticas de <span className="text-brand-yellow drop-shadow-sm">Privacidade</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                    Aqui você descobre exatamente o que fazemos com as suas informações, regras de segurança do IFUSP e porque o seu clique está blindado pelo ECA e pela LGPD.
                </p>
            </header>

            <main className="space-y-4">
                {/* Rule 1: Como pegamos seus dados? */}
                <details className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 [&_summary::-webkit-details-marker]:hidden open:shadow-lg open:border-brand-blue/30">
                    <summary className="flex items-center justify-between p-6 cursor-pointer select-none font-bold text-gray-900 dark:text-white outline-none">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-red/10 text-brand-red shrink-0 border border-brand-red/20">
                                <span className="material-symbols-outlined">data_usage</span>
                            </span>
                            <span>O que pegamos e por quê?</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform duration-300">
                            expand_more
                        </span>
                    </summary>
                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-white/5 leading-relaxed bg-gray-50/50 dark:bg-black/20">
                        <p className="mb-3">
                            <strong className="text-gray-900 dark:text-white">Se você navega de fininho (Anônimo):</strong> Não coletamos <strong>NADA</strong> que te identifique. Ferramentas de rastreio de comportamento (Telemetria) ficam paradas, como estátuas.
                        </p>
                        <p>
                            <strong className="text-gray-900 dark:text-white">Quando você faz Check-in (Login):</strong> Para você participar ativamente do Laboratório de Divulgação (postando dúvidas, artigos e lendo PDFs), armazenamos o seu <em>Nickname</em>, seu <em>Avatar</em> e as suas perguntas/interações (que são propriedade sua licenciadas sob CC BY 4.0).
                        </p>
                    </div>
                </details>

                {/* Rule 2: Eca e Menores de Idade */}
                <details className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 [&_summary::-webkit-details-marker]:hidden open:shadow-lg open:border-brand-blue/30" open>
                    <summary className="flex items-center justify-between p-6 cursor-pointer select-none font-bold text-gray-900 dark:text-white outline-none">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-yellow/10 text-brand-yellow shrink-0 border border-brand-yellow/20">
                                <span className="material-symbols-outlined">family_star</span>
                            </span>
                            <span>Adolescentes & Estatuto da Criança e do Adolescente (ECA)</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform duration-300">
                            expand_more
                        </span>
                    </summary>
                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-white/5 leading-relaxed bg-gray-50/50 dark:bg-black/20">
                        <p className="mb-4">
                            Se seu cadastro acender a luz vermelha da faixa pre-18 anos, algumas portinhas serão trancadas automaticamente. O HUB bloqueia:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 font-medium">
                            <li>O botão de Lançar à Órbita (Publicação aberta).</li>
                            <li>Tornar seu <em>Emaranhamento</em> público e conectável por desconhecidos sem Moderação Especial.</li>
                            <li>A coleta de Analytics / Calor de mouse da Microsoft (Clarity).</li>
                        </ul>
                        <p>
                            Sua voz não será calada: Apenas garantimos que todo o seu envio de material, <em>feedback</em> ou dúvidas aos cientistas caia de forma privada e segura para os curadores antes de qualquer exibição.
                        </p>
                    </div>
                </details>

                {/* Rule 3: O que é esse Banner de Cookies? */}
                <details className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 [&_summary::-webkit-details-marker]:hidden open:shadow-lg open:border-brand-blue/30">
                    <summary className="flex items-center justify-between p-6 cursor-pointer select-none font-bold text-gray-900 dark:text-white outline-none">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1F9FCF]/10 text-[#1F9FCF] shrink-0 border border-[#1F9FCF]/20">
                                <span className="material-symbols-outlined">cookie</span>
                            </span>
                            <span>Os Famosos Cookies e Rastreio Ético</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform duration-300">
                            expand_more
                        </span>
                    </summary>
                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-white/5 leading-relaxed bg-gray-50/50 dark:bg-black/20">
                        <p className="mb-3">
                            Nosso Opt-In é autêntico e inverteu a velha lógica mercenária (Zero Dark Patterns).
                        </p>
                        <ul className="space-y-2">
                            <li className="flex gap-2 items-start"><span className="material-symbols-outlined text-brand-red text-xl">close</span> <span>Não te empurramos botões de &quot;Aceitar Todos&quot; escondendo a rejeição.</span></li>
                            <li className="flex gap-2 items-start"><span className="material-symbols-outlined text-brand-red text-xl">close</span> <span>Não ativamos Scripts Comportamentais antes do seu &quot;De Acordo&quot;.</span></li>
                            <li className="flex gap-2 items-start"><span className="material-symbols-outlined text-brand-blue text-xl">check</span> <span>Apenas pedimos Telemetria Comportamental se você for maior de idade e ativá-las manualmente (para sabermos onde a interface é frustrante e consertar).</span></li>
                        </ul>
                        <div className="mt-5">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('cookie_consent');
                                    window.location.reload();
                                }}
                                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                Reconfigurar minhas Preferências
                            </button>
                        </div>
                    </div>
                </details>
            </main>

            <footer className="mt-12 text-center border-t border-gray-200 dark:border-white/10 pt-8 pb-4">
                <p className="text-xs text-brand-blue font-bold uppercase tracking-[0.2em] mb-4">Atualizado sob supervisão legal e acadêmica da V3.0 (2025)</p>
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-yellow font-bold transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Voltar para o Início
                </Link>
            </footer>
            </div>
        </MainLayoutWrapper>
    );
}
