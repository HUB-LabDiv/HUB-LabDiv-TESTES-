'use client';

import React from 'react';
import Link from 'next/link';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

/**
 * 🏛️ Transparency Panel V6.0 (WCAG 2.1 & Transparency Act)
 * Página centralizadora de normas, licenciamento e governança do HUB.
 */
export default function TransparenciaPage() {
    return (
        <MainLayoutWrapper>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-yellow/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-yellow/20">
                        <span className="material-symbols-outlined text-4xl text-brand-yellow">gavel</span>
                    </div>
                    <h1 
                        tabIndex={-1}
                        className="text-4xl font-bukra font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4 outline-none focus:ring-2 focus:ring-brand-yellow rounded-lg px-2"
                    >
                        Painel de <span className="text-brand-yellow">Transparência</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Compromisso do Laboratório de Divulgação (IFUSP) com a acessibilidade plena, 
                        o direito à informação e a ética científica digital.
                    </p>
                </header>

                <nav className="mb-12 flex flex-wrap justify-center gap-4" aria-label="Navegação rápida">
                    {[
                        { id: 'termos', label: 'Termos de Uso', icon: 'description' },
                        { id: 'moderacao', label: 'Moderação', icon: 'security' },
                        { id: 'acessibilidade', label: 'Acessibilidade', icon: 'accessibility_new' },
                        { id: 'contato', label: 'SLA & Contato', icon: 'contact_support' }
                    ].map(item => (
                        <a 
                            key={item.id}
                            href={`#${item.id}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-brand-blue hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            {item.label}
                        </a>
                    ))}
                </nav>

                <main className="space-y-8">
                    {/* Seção 1: Termos de Uso e Licenciamento */}
                    <section id="termos" className="scroll-mt-24 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px]">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="p-3 bg-brand-blue/10 rounded-xl">
                                <span className="material-symbols-outlined text-brand-blue">description</span>
                            </span>
                            <h2 className="text-2xl font-bukra font-bold text-gray-900 dark:text-white">Termos de Uso & Licenciamento</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p>
                                Todo conteúdo científico submetido ao HUB Lab-Div (artigos, micro-artigos e submissões do Fluxo) é regido pela licença 
                                <strong> Creative Commons Attribution 4.0 International (CC BY 4.0)</strong>.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                                <li className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl">
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                    <span className="text-sm"><strong>Compartilhar:</strong> Copiar e redistribuir o material em qualquer suporte ou formato.</span>
                                </li>
                                <li className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl">
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                    <span className="text-sm"><strong>Adaptar:</strong> Remixar, transformar e criar a partir do material para qualquer fim.</span>
                                </li>
                            </ul>
                            <p className="mt-4 text-sm opacity-80 italic">
                                * É obrigatório dar o crédito apropriado ao HUB Lab-Div e ao autor original, provendo um link para a licença.
                            </p>
                        </div>
                    </section>

                    {/* Seção 2: Regras de Moderação */}
                    <section id="moderacao" className="scroll-mt-24 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px]">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="p-3 bg-brand-red/10 rounded-xl">
                                <span className="material-symbols-outlined text-brand-red">security</span>
                            </span>
                            <h2 className="text-2xl font-bukra font-bold text-gray-900 dark:text-white">Regras de Moderação Ética</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-brand-red/5 border border-brand-red/10 rounded-2xl">
                                <h3 className="flex items-center gap-2 text-brand-red font-bold mb-2">
                                    <span className="material-symbols-outlined text-lg">policy</span>
                                    Código Penal e Denúncia Falsa
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Conforme o <strong>Art. 340 do Código Penal Brasileiro</strong>, provocar a ação de autoridade, comunicando-lhe a ocorrência de crime ou de contravenção que sabe não se ter verificado, é crime. Denúncias falsas ou uso abusivo do sistema de <em>Report</em> resultarão em suspensão imediata da conta.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 italic">O que moderamos:</h4>
                                    <ul className="text-sm space-y-2 list-disc pl-5 opacity-90">
                                        <li>Discurso de ódio ou assédio.</li>
                                        <li>Plágio acadêmico nítido.</li>
                                        <li>Desinformação anticientífica.</li>
                                        <li>Conteúdo inapropriado para menores.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 italic">Fluxo de Análise:</h4>
                                    <ol className="text-sm space-y-2 list-decimal pl-5 opacity-90">
                                        <li>Denúncia recebida via HUB.</li>
                                        <li>Item ocultado após 5 reports automáticos.</li>
                                        <li>Revisão humana por curadores do IFUSP.</li>
                                        <li>Veredito final (Manter, Editar ou Excluir).</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Seção 3: Acessibilidade Digital */}
                    <section id="acessibilidade" className="scroll-mt-24 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px]">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="p-3 bg-brand-blue-accent/10 rounded-xl">
                                <span className="material-symbols-outlined text-brand-blue-accent">accessibility_new</span>
                            </span>
                            <h2 className="text-2xl font-bukra font-bold text-gray-900 dark:text-white">Acessibilidade Digital (WCAG 2.1)</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300">
                            <p>
                                O HUB Lab-Div utiliza tecnologias de ponta para garantir que o conhecimento chegue a todos:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-brand-yellow">verified</span>
                                    <span>Nível AA de contraste e tamanhos de fonte.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-brand-yellow">verified</span>
                                    <span>Integração com VLibras para tradução automática.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-brand-yellow">verified</span>
                                    <span>Navegação via teclado aprimorada.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-brand-yellow">verified</span>
                                    <span>Suporte semântico para leitores de tela.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Seção 4: SLA e Contato */}
                    <section id="contato" className="scroll-mt-24 p-8 bg-brand-blue text-white rounded-[32px] shadow-xl shadow-brand-blue/20">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="p-3 bg-white/10 rounded-xl">
                                <span className="material-symbols-outlined text-white">contact_support</span>
                            </span>
                            <h2 className="text-2xl font-bukra font-bold">Governança, SLA & Contato</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <p className="opacity-90 leading-relaxed">
                                    Dúvidas sobre o funcionamento técnico, remoção de dados ou parcerias institucionais?
                                </p>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-3 font-bold">
                                        <span className="material-symbols-outlined">mail</span>
                                        hublabdiv@gmail.com
                                    </p>
                                    <p className="flex items-center gap-3 text-xs opacity-75">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        Tempo médio de resposta: 48 horas úteis.
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h4 className="font-bold mb-2 uppercase text-xs tracking-widest text-brand-yellow">Documentação Geral</h4>
                                <div className="space-y-3">
                                    <Link href="/privacy-policy" className="flex items-center justify-between group">
                                        <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">Política de Privacidade</span>
                                        <span className="material-symbols-outlined text-brand-yellow group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="mt-16 text-center border-t border-gray-200 dark:border-white/10 pt-10">
                    <Link href="/" className="inline-flex items-center gap-3 text-brand-blue dark:text-white font-black uppercase tracking-tighter hover:text-brand-yellow transition-colors group">
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        VOLTAR PARA O INÍCIO DO HUB
                    </Link>
                </footer>
            </div>
        </MainLayoutWrapper>
    );
}
