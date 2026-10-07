"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, History, Users } from 'lucide-react';

const DETAILS = [
    {
        id: 'conceito',
        icon: <Info className="w-6 h-6 text-[#01f300]" />,
        title: 'Conceito e Criação',
        colorClass: 'neon-border-green',
        textClass: 'neon-text-green',
        content: (
            <div className="space-y-4">
                <p>
                    O Show de Fisica promoveu a formação de centenas de monitores (estudantes de diversos cursos) com o desenvolvimento de habilidades em ciências, comunicação e mediação cultural. Em 2024, são quase quarenta anos de participação de eventos em todo o país e de apresentações cheias, todas as semanas.
                </p>
                <p>
                    O projeto busca articular diversas demonstrações na busca da transposição dos fenômenos, dos limites frios e muitas vezes áridos do ensino em sala de aula, para um novo cenário, rico de estímulos e fortemente interativo, capaz de atingir o emocional de cada espectador.
                </p>
            </div>
        )
    },
    {
        id: 'historia',
        icon: <History className="w-6 h-6 text-[#002ffe]" />,
        title: 'História e Localização',
        colorClass: 'neon-border-blue',
        textClass: 'neon-text-blue',
        content: (
            <div className="space-y-4">
                <p>
                    Nos primórdios de sua longeva história no IFUSP, o Show de Fisica era realizado em espaço compartilhado com o Laboratório de Demonstrações Ernst W. Hamburger e, posteriormente, já se realizou em diversos outros ambientes no Instituto.
                </p>
                <p>
                    Desde 2008, o programa se instalou em sua "residência" atual, o <strong>auditório Alessandro Volta</strong>, que tem recebido reparos e investimentos contínuos para sua modernização.
                </p>
            </div>
        )
    },
    {
        id: 'agendamento',
        icon: <Users className="w-6 h-6 text-[#f60011]" />,
        title: 'Como funciona a Dinâmica',
        colorClass: 'neon-border-red',
        textClass: 'neon-text-red',
        content: (
            <div className="space-y-4">
                <p>
                    O Show não visa "ensinar" Física no sentido tradicional, mas sim preparar o emocional de cada estudante para o aprender. As apresentações ocorrem com a participação ativa da plateia, criando um clima de suspense e curiosidade.
                </p>
                <p>
                    Os principais elementos presentes no espetáculo costumam ser: o inesperado, o imprevisível, o curioso, o desafio a ser vencido, o artístico/estético, o increditável e o mágico/lúdico. Tudo isso focado em estimular a busca das explicações e dos significados subjacentes aos fenômenos demonstrados.
                </p>
            </div>
        )
    }
];

export function ShowDetailsAccordion() {
    const [openId, setOpenId] = useState<string | null>('conceito');

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {DETAILS.map((item) => (
                <div key={item.id} className={`bg-black transition-all duration-300 ${item.colorClass}`}>
                    <button
                        onClick={() => toggle(item.id)}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        <div className="flex items-center gap-4">
                            {item.icon}
                            <h3 className={`text-xl md:text-2xl font-bold uppercase tracking-wide ${item.textClass}`}>
                                {item.title}
                            </h3>
                        </div>
                        {openId === item.id ? (
                            <ChevronUp className="w-6 h-6 text-white" />
                        ) : (
                            <ChevronDown className="w-6 h-6 text-white" />
                        )}
                    </button>
                    
                    <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            openId === item.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="px-6 pb-6 pt-2 text-lg text-gray-200 font-sans leading-relaxed border-t border-white/10 mt-2">
                            {item.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
