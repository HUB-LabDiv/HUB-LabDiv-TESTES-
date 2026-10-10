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
import { Shield, MessageSquare, BookOpen, ArrowRight, Briefcase, Headset, Calendar } from 'lucide-react';

export default function AdminCGIFHubPage() {
    return (
        <div className="p-8">
            <div className="mb-12">
                <h1 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3">
                    <Shield className="w-8 h-8 text-brand-blue" />
                    Moderação do CGIF
                </h1>
                <p className="text-gray-500 mt-2">Hub centralizado de moderação para os serviços da wiki e do CGIF.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* USP 101 */}
                <Link href="/admin/dicas" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-blue transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <MessageSquare className="w-32 h-32 text-brand-blue" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-blue/10 rounded-2xl w-max mb-6">
                            <MessageSquare className="w-8 h-8 text-brand-blue" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">USP 101</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Moderação de dicas, conselhos e informações transgeracionais para todos os institutos da USP.</p>
                        <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Central SAC */}
                <Link href="/admin/sac" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-yellow transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-yellow/10 rounded-2xl w-max mb-6">
                            <Headset className="w-8 h-8 text-brand-yellow" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Central SAC</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Atendimento a chamados, dúvidas e suporte técnico/acadêmico da comunidade.</p>
                        <div className="flex items-center gap-2 text-brand-yellow font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Glossário Translacional */}
                <Link href="/admin/glossario" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-red transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <BookOpen className="w-32 h-32 text-brand-red" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-red/10 rounded-2xl w-max mb-6">
                            <BookOpen className="w-8 h-8 text-brand-red" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Glossário</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Moderação de verbetes e termos do Glossário Translacional do instituto.</p>
                        <div className="flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Oportunidades */}
                <Link href="/admin/oportunidades" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-blue transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <Briefcase className="w-32 h-32 text-brand-blue" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-blue/10 rounded-2xl w-max mb-6">
                            <Briefcase className="w-8 h-8 text-brand-blue" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Oportunidades</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Gerencie murais de bolsas, vagas de IC e demais oportunidades acadêmicas.</p>
                        <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Tópicos da Wiki */}
                <Link href="/admin/wiki" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-blue transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <BookOpen className="w-32 h-32 text-brand-blue" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-blue/10 rounded-2xl w-max mb-6">
                            <BookOpen className="w-8 h-8 text-brand-blue" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Tópicos da Wiki</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Avalie, aprove ou responda sugestões de novos tópicos, complementos e ramificações enviadas por estudantes.</p>
                        <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Show da Física - Moderação de Agenda */}
                <Link href="/admin/cgif/show-da-fisica" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-red transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <Calendar className="w-32 h-32 text-brand-red" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-red/10 rounded-2xl w-max mb-6">
                            <Calendar className="w-8 h-8 text-brand-red" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Show da Física</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Gerencie a disponibilidade de atrações, bloqueie dias da semana e configure horários para evitar combinações impossíveis.</p>
                        <div className="flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
