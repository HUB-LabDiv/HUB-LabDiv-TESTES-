'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MessageSquare, ArrowRight, ClipboardCheck, Palette, HelpCircle, Network } from 'lucide-react';

export default function AdminComunidadeHubPage() {
    return (
        <div className="p-8">
            <div className="mb-12">
                <h1 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-brand-blue" />
                    Moderação do Eixo Social
                </h1>
                <p className="text-gray-500 mt-2">Hub centralizado de moderação para fluxos e interações da comunidade.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Moderação do Fluxo (Submissões) */}
                <Link href="/admin/moderacao/fluxo" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-blue transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <ClipboardCheck className="w-32 h-32 text-brand-blue" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-blue/10 rounded-2xl w-max mb-6">
                            <ClipboardCheck className="w-8 h-8 text-brand-blue" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Aprovação do Fluxo</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Aprove ou rejeite as submissões gerais enviadas pela comunidade para o Hub.</p>
                        <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Logs do IFUSP */}
                <Link href="/admin/drops" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-yellow transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <MessageSquare className="w-32 h-32 text-brand-yellow" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-yellow/10 rounded-2xl w-max mb-6">
                            <MessageSquare className="w-8 h-8 text-brand-yellow" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Moderação de Logs</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Gerenciamento de logs da comunidade, moderação de conteúdo e promoção para o USP 101 (Dicas dos Veteranos).</p>
                        <div className="flex items-center gap-2 text-brand-yellow font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
                {/* Aprovação de Arte */}
                <Link href="/admin/moderacao/arte" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-red transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <Palette className="w-32 h-32 text-brand-red" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-red/10 rounded-2xl w-max mb-6">
                            <Palette className="w-8 h-8 text-brand-red" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Aprovação de Galeria</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Aprove ou rejeite expressões criativas, desenhos e ilustrações da comunidade.</p>
                        <div className="flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>


                {/* Pergunte a um Cientista */}
                <Link href="/admin/perguntas" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-emerald-500 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <HelpCircle className="w-32 h-32 text-emerald-500" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl w-max mb-6">
                            <HelpCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Pergunte a um Cientista</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Moderação e resposta de perguntas científicas enviadas pela comunidade.</p>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Emaranhamento */}
                <Link href="/admin/emaranhamento" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-purple-500 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <Network className="w-32 h-32 text-purple-500" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-purple-500/10 rounded-2xl w-max mb-6">
                            <Network className="w-8 h-8 text-purple-500" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Emaranhamento</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Painel administrativo de conexões e networking da comunidade acadêmica.</p>
                        <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
