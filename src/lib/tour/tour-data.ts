/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

export interface TourStepConfig {
    element: string;
    gesture?: 'horizontal' | 'vertical';
    popover: {
        title: string;
        description: string;
        side?: 'top' | 'bottom' | 'left' | 'right';
        align?: 'start' | 'center' | 'end';
    };
}

export type UserRoleCategory = 'aluno_usp' | 'pesquisador' | 'curioso';

export interface TourLevelInfo {
    key: string;
    title: string;
    shortLabel: string;
    steps: TourStepConfig[];
}

/**
 * Detecta reativamente o perfil do usuário a partir dos elementos renderizados no DOM.
 */
export function detectUserRoleFromDOM(): UserRoleCategory {
    if (typeof document === 'undefined') return 'curioso';
    const el = document.querySelector('[data-tour="navbar-eixo-ferramentas"]') ||
               document.querySelector('[data-tour="mobile-eixo-ferramentas"]') ||
               document.querySelector('[data-tour="sidebar-eixo-ferramentas"]');
    if (!el) return 'curioso';
    const href = el.getAttribute('href') || '';
    if (href.startsWith('/arena')) return 'pesquisador';
    if (href.startsWith('/ferramentas')) return 'aluno_usp';
    return 'curioso';
}

// =============================================================================
// NÍVEL 1: TUTORIAL GERAL (GLOBAL TOUR)
// =============================================================================

export function getDesktopGlobalTourSteps(role: UserRoleCategory = detectUserRoleFromDOM()): TourStepConfig[] {
    const steps: TourStepConfig[] = [
        {
            element: '[data-tour="logo-home"]',
            popover: {
                title: '1. Início (Home)',
                description: 'Clique na logo do HUB Lab-Div a qualquer momento para retornar à raiz do site e ao feed principal.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '[data-tour="global-search"], [data-tour="global-search-mobile"]',
            popover: {
                title: '2. Busca Global',
                description: 'Pesquise por publicações científicas, materiais didáticos, membros da comunidade acadêmica, disciplinas e núcleos em toda a plataforma.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '[data-tour="report-button"], [data-tour="report-button-mobile"]',
            popover: {
                title: '3. Reportar Erro & Feedback',
                description: 'Encontrou algum bug, inconsistência visual ou tem uma ideia? Abra o formulário de reporte para enviar detalhes técnicos diretamente aos desenvolvedores.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '[data-tour="notifications-bell"]',
            popover: {
                title: '4. Central de Notificações',
                description: 'Receba avisos em tempo real sobre interações nas suas postagens, mensagens diretas no Emaranhamento Quântico e comunicados acadêmicos.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '[data-tour="theme-toggle"], [data-tour="theme-toggle-mobile"]',
            popover: {
                title: '5. Modo Claro / Escuro',
                description: 'Alterne instantaneamente entre o tema escuro imersivo (#121212) e o tema claro com contraste otimizado para leitura diurna.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '[data-tour="user-profile-menu"], [data-tour="header-settings"]',
            popover: {
                title: '6. Configurações & Perfil',
                description: 'Personalize seu instituto de destaque (IFUSP, IME, IAG...), ajuste preferências do sistema e acesse seu Laboratório pessoal.',
                side: 'bottom',
                align: 'end',
            }
        },
        {
            element: '[data-tour="navbar-eixo-comunidade"]',
            popover: {
                title: '7. Eixo Social: Feed da Comunidade — Barra Superior',
                description: '<b>EIXO SOCIAL:</b> O coração da vida acadêmica do IFUSP. Acompanhe publicações em três formatos: <b>Fluxo</b> (mídias e resumos didáticos), <b>Logs</b> (relatos e vivência) e mural de <b>Arte</b>.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '[data-tour="navbar-eixo-interacoes"]',
            popover: {
                title: '8. Eixo Social: Central de Interações — Barra Superior',
                description: 'Integrada ao Eixo Social, conecta você por chat em tempo real no <b>Emaranhamento Quântico</b> e ao canal tira-dúvidas público <b>Pergunte a um Cientista</b>.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '[data-tour="sidebar-eixo-comunidade"]',
            popover: {
                title: '9. Eixo Social — Painel Lateral',
                description: 'No painel lateral você tem atalhos diretos para o feed da <b>Comunidade</b>, para a <b>Central de Interações</b> e para o seu Laboratório pessoal.',
                side: 'right',
                align: 'start',
            }
        },
        {
            element: '[data-tour="navbar-eixo-cgif"]',
            popover: {
                title: '10. Eixo Informativo (Wiki & Dados) — Barra Superior',
                description: '<b>INFORMAÇÃO & WIKI:</b> A central do Centro de Graduação do IFUSP. Espaços, iniciativas discentes, criadores de conteúdo científico, mapa interativo e a <b>Wiki centralizada</b> com manuais de cursos e editais.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '[data-tour="sidebar-eixo-cgif"]',
            popover: {
                title: '11. Eixo Informativo — Painel Lateral',
                description: 'Acesse rapidamente a <b>Central de Informação (GCIF)</b> pelo menu lateral para consultas curriculares, editais e avisos acadêmicos sempre a um clique.',
                side: 'right',
                align: 'start',
            }
        }
    ];

    if (role === 'aluno_usp') {
        steps.push(
            {
                element: '[data-tour="navbar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Ferramentas: Apoio ao Estudo & Pesquisa — Barra Superior',
                    description: '<b>ESTUDO & PESQUISA:</b> Seu kit universitário completo! Organize sua <b>Grade Horária 1h:1h</b>, monitore o limite de <b>faltas</b>, acompanhe <b>Trilhas</b>, descubra <b>Softwares</b> e conecte-se a grupos no <b>Match Acadêmico</b>.',
                    side: 'bottom',
                    align: 'center',
                }
            },
            {
                element: '[data-tour="sidebar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Ferramentas: Apoio ao Estudo & Pesquisa — Painel Lateral',
                    description: 'No painel lateral você acessa instantaneamente suas <b>Ferramentas Acadêmicas</b> para simular horários, sincronizar com o Júpiter e organizar seu semestre.',
                    side: 'right',
                    align: 'start',
                }
            }
        );
    } else if (role === 'pesquisador') {
        steps.push(
            {
                element: '[data-tour="navbar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Pesquisa: Observatório de Pesquisa — Barra Superior',
                    description: '<b>OBSERVATÓRIO DE PESQUISA:</b> Espaço para docentes e pesquisadores do IFUSP divulgarem linhas de investigação ativas e captarem talentos para Iniciação Científica.',
                    side: 'bottom',
                    align: 'center',
                }
            },
            {
                element: '[data-tour="sidebar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Pesquisa: Observatório de Pesquisa — Painel Lateral',
                    description: 'Acesse o <b>Observatório</b> pelo menu lateral para gerenciar linhas de pesquisa e orientações acadêmicas.',
                    side: 'right',
                    align: 'start',
                }
            }
        );
    } else {
        steps.push(
            {
                element: '[data-tour="navbar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Adaptativo: Ingressar — Barra Superior',
                    description: '<b>EIXO VARIÁVEL:</b> O 3º eixo da plataforma se molda ao seu perfil!<br/><br/>• <b>Para você (Visitante / Não Logado):</b> Exibe a aba <b>Ingressar</b> (Fuvest, ENEM-USP, Provão Paulista, Olimpíadas).<br/>• <b>Para Alunos USP:</b> Exibe <b>Ferramentas</b> (Grade 1h:1h, Faltas e Softwares).<br/>• <b>Para Pesquisadores:</b> Exibe <b>Pesquisa</b>.',
                    side: 'bottom',
                    align: 'center',
                }
            },
            {
                element: '[data-tour="sidebar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Adaptativo: Como Ingressar — Painel Lateral',
                    description: 'No painel lateral, o botão <b>Como Ingressar</b> traz atalhos diretos para vestibulares e editais.',
                    side: 'right',
                    align: 'start',
                }
            }
        );
    }

    // 13. Plataforma de Lançamento & Login (Desktop)
    const isLoggedInDesktop = typeof document !== 'undefined' ? !!document.querySelector('[data-tour="user-profile-menu"]') : false;
    if (isLoggedInDesktop) {
        steps.push({
            element: '[data-tour="desktop-fab-enviar"], [data-tour="user-profile-menu"]',
            popover: {
                title: '13. Plataforma de Lançamento (Lançar à Órbita)',
                description: '<b>CENTRO DE PROPULSÃO CIENTÍFICA:</b> Clique no botão <b>Lançar à Órbita</b> para publicar seus resumos, artigos, podcasts, modelos 3D, notas e quizzes no HUB. Suas publicações entram no Feed da Comunidade e geram pontos de Radiação/XP para seu perfil acadêmico!',
                side: 'top',
                align: 'end',
            }
        });
    } else {
        steps.push({
            element: '[data-tour="header-login"], [data-tour="header-settings"], [data-tour="logo-home"]',
            popover: {
                title: '13. Login & Plataforma de Lançamento',
                description: '<b>ACESSO & PUBLICAÇÃO:</b> Clique em <b>Login</b> para entrar com sua conta USP ou Google. O login desbloqueia a <b>Plataforma de Lançamento</b> (para você enviar seus próprios trabalhos científicos e didáticos), permite participar do chat do <b>Emaranhamento Quântico</b> e evoluir seu <b>Laboratório Pessoal</b>!',
                side: 'bottom',
                align: 'end',
            }
        });
    }

    return steps;
}

export function getMobileGlobalTourSteps(role: UserRoleCategory = detectUserRoleFromDOM()): TourStepConfig[] {
    const steps: TourStepConfig[] = [
        {
            element: '[data-tour="logo-home"]',
            popover: {
                title: '1. Início (Home)',
                description: 'Toque na logo do HUB Lab-Div a qualquer momento para retornar à raiz do site e ao feed principal.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '[data-tour="global-search-mobile"], [data-tour="global-search"]',
            popover: {
                title: '2. Busca Global',
                description: 'Pesquise por publicações, materiais didáticos, pessoas e matérias em toda a plataforma.',
                side: 'bottom',
                align: 'end',
            }
        },
        {
            element: '[data-tour="report-button"], [data-tour="report-button-mobile"]',
            popover: {
                title: '3. Reportar Erro & Feedback',
                description: 'Toque aqui para reportar falhas ou enviar sugestões diretamente para a equipe técnica.',
                side: 'bottom',
                align: 'end',
            }
        },
        {
            element: '[data-tour="notifications-bell"]',
            popover: {
                title: '4. Central de Notificações',
                description: 'Acompanhe interações em publicações, mensagens no Emaranhamento e avisos acadêmicos.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '[data-tour="theme-toggle"], [data-tour="theme-toggle-mobile"]',
            popover: {
                title: '5. Modo Claro / Escuro',
                description: 'Alterne entre o tema escuro imersivo e o tema claro com visual confortável para leitura diurna.',
                side: 'bottom',
                align: 'start',
            }
        },
        {
            element: '[data-tour="user-profile-menu"], [data-tour="header-settings"]',
            popover: {
                title: '6. Configurações & Perfil',
                description: 'Personalize seu instituto de destaque, gerencie preferências e acesse seu perfil ou faça login.',
                side: 'bottom',
                align: 'end',
            }
        },
        {
            element: '[data-tour="mobile-eixo-comunidade"]',
            popover: {
                title: '7. Eixo Social: Feed da Comunidade',
                description: '<b>EIXO SOCIAL:</b> O feed vivo da faculdade. Acompanhe publicações em <b>Fluxo</b> (mídias), <b>Logs</b> (relatos) e <b>Arte</b>.',
                side: 'top',
                align: 'center',
            }
        },
        {
            element: '[data-tour="mobile-eixo-interacoes"]',
            popover: {
                title: '8. Eixo Social: Central de Interações',
                description: 'A segunda aba do Eixo Social reúne conexões diretas: <b>Emaranhamento Quântico</b> (chat) e <b>Pergunte a um Cientista</b> (tira-dúvidas público).',
                side: 'top',
                align: 'center',
            }
        },
        {
            element: '[data-tour="mobile-eixo-cgif"]',
            popover: {
                title: '9. Eixo Informativo (Wiki & Dados)',
                description: '<b>INFORMAÇÃO & WIKI:</b> Conheça espaços do IFUSP, iniciativas discentes, criadores de conteúdo e a Wiki oficial centralizada.',
                side: 'top',
                align: 'center',
            }
        }
    ];

    if (role === 'aluno_usp') {
        steps.push({
            element: '[data-tour="mobile-eixo-ferramentas"]',
            popover: {
                title: '10. Eixo Ferramentas: Apoio ao Estudo & Pesquisa',
                description: '<b>ESTUDO & PESQUISA:</b> Seu kit universitário na palma da mão! Grade 1h:1h, controle de faltas, trilhas, softwares e Match Acadêmico.',
                side: 'top',
                align: 'center',
            }
        });
    } else if (role === 'pesquisador') {
        steps.push({
            element: '[data-tour="mobile-eixo-ferramentas"]',
            popover: {
                title: '10. Eixo Pesquisa: Observatório de Pesquisa',
                description: '<b>OBSERVATÓRIO DE PESQUISA:</b> Mapeie laboratórios, divulgue projetos científicos e recrute alunos para Iniciação Científica.',
                side: 'top',
                align: 'center',
            }
        });
    } else {
        steps.push({
            element: '[data-tour="mobile-eixo-ferramentas"]',
            popover: {
                title: '10. Eixo Adaptativo: Como Ingressar',
                description: '<b>EIXO VARIÁVEL:</b> Guia completo de portas de entrada no IFUSP (Fuvest, ENEM-USP, Provão Paulista, Olimpíadas).',
                side: 'top',
                align: 'center',
            }
        });
    }

    // 11. Botão Central de Ação: Lançar à Órbita / Login (Mobile)
    const isLoggedInMobile = typeof document !== 'undefined' ? !!document.querySelector('[data-tour="user-profile-menu"]') : false;
    if (isLoggedInMobile) {
        steps.push({
            element: '[data-tour="mobile-action-launch"], [data-tour="desktop-fab-enviar"]',
            popover: {
                title: '11. Plataforma de Lançamento (Lançar à Órbita)',
                description: '<b>CENTRO DE PROPULSÃO CIENTÍFICA:</b> O botão central com ícone de foguete permite publicar resumos, podcasts, PDFs, modelos 3D e quizzes gamificados. Suas criações entram no Feed da Comunidade e aumentam seu nível de Radiação/XP!',
                side: 'top',
                align: 'center',
            }
        });
    } else {
        steps.push({
            element: '[data-tour="mobile-action-launch"], [data-tour="header-settings"], [data-tour="user-profile-menu"]',
            popover: {
                title: '11. Login & Plataforma de Lançamento',
                description: '<b>ACESSO & PUBLICAÇÃO:</b> Toque no botão central de <b>Login</b> para entrar com sua conta USP ou Google. Ao entrar, você desbloqueia a <b>Plataforma de Lançamento</b> para enviar materiais, entra no chat do <b>Emaranhamento Quântico</b> e personaliza seu <b>Laboratório</b>!',
                side: 'top',
                align: 'center',
            }
        });
    }

    return steps;
}

export const DESKTOP_GLOBAL_TOUR_STEPS = getDesktopGlobalTourSteps('curioso');
export const MOBILE_GLOBAL_TOUR_STEPS = getMobileGlobalTourSteps('curioso');
export const GLOBAL_TOUR_STEPS = [...DESKTOP_GLOBAL_TOUR_STEPS, ...MOBILE_GLOBAL_TOUR_STEPS];

export function getGlobalTourSteps(role?: UserRoleCategory): TourStepConfig[] {
    const userRole = role || detectUserRoleFromDOM();
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1280 : true;
    return isDesktop ? getDesktopGlobalTourSteps(userRole) : getMobileGlobalTourSteps(userRole);
}

// =============================================================================
// NÍVEL 2: TUTORIAIS DE EIXO (EIXO TOURS)
// =============================================================================

export const EIXO_SOCIAL_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="navbar-eixo-comunidade"], [data-tour="mobile-eixo-comunidade"]',
        popover: {
            title: '1. O Feed da Comunidade',
            description: 'O <b>Feed Social</b> reúne a produção acadêmica e cultural em 3 formatos: <b>Fluxo</b> (mídias, resumos visuais e PDFs), <b>Logs</b> (relatos e reflexões) e <b>Arte</b> (mural cultural do IFUSP).',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="navbar-eixo-interacoes"], [data-tour="mobile-eixo-interacoes"]',
        popover: {
            title: '2. Central de Interações',
            description: 'Conexão direta entre a comunidade: converse em tempo real no <b>Emaranhamento Quântico</b> e envie dúvidas no <b>Pergunte a um Cientista</b>.',
            side: 'bottom',
            align: 'center',
        }
    }
];

export const EIXO_CGIF_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="gcif-subnav"], [data-tour="navbar-eixo-cgif"], [data-tour="mobile-eixo-cgif"]',
        popover: {
            title: '1. As 3 Subabas do Eixo Informativo (GCIF)',
            description: 'O <b>Eixo Informativo (GCIF)</b> organiza todo o conhecimento e vivência do Instituto de Física em 3 áreas integradas: <b>Wiki</b>, <b>Instituto</b> e <b>Interativo</b>.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-tab-wiki"], [data-tour="gcif-wiki-sincrotron"]',
        popover: {
            title: '2. Subaba Wiki: O Síncrotron de Conhecimento',
            description: 'A enciclopédia oficial com 9 células temáticas, guias de sobrevivência, permanência estudantil, bolsas PAPFE e manuais de cursos.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-tab-instituto"], [data-tour="gcif-instituto-card"]',
        popover: {
            title: '3. Subaba Instituto: Espaços, Iniciativas & Mapa',
            description: 'História do IFUSP, projetos de extensão (LabDiv, Show da Física), laboratórios abertos (Hackerspace, CEFISMA) e o mapa geográfico do campus.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-tab-interativo"], [data-tour="gcif-interativo-oportunidades"]',
        popover: {
            title: '4. Subaba Interativo: Oportunidades, Quiz, SAC & Glossário',
            description: 'Mural comunitário de oportunidades ativas, Teste de Radiação (Quiz), Central de Atendimento (SAC) e o Glossário Semântico.',
            side: 'top',
            align: 'center',
        }
    }
];

export const EIXO_FERRAMENTAS_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="tools-subnav"], [data-tour="navbar-eixo-ferramentas"], [data-tour="mobile-eixo-ferramentas"]',
        popover: {
            title: '1. Seu Kit Universitário Completo',
            description: 'O <b>Eixo Ferramentas</b> centraliza utilitários essenciais para o dia a dia do aluno USP: Grade Horária, Trilhas de Formação, Match Acadêmico, Catálogo de Softwares, Caderno de Anotações e Mapa de Serviços.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="ferramentas-grade"], [data-tour="ferramentas-actions"]',
        popover: {
            title: '2. Gestão de Horários & Faltas',
            description: 'Planeje sua grade 1h:1h com detecção de conflitos, sincronização automática com o Júpiter e controle rigoroso de frequência.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="tools-tab-softwares"], [data-tour="softwares-header"]',
        popover: {
            title: '3. Softwares & Ferramentas Comunitárias',
            description: 'Biblioteca de softwares criados por alunos e ferramentas consagradas (LumiFI, Aurtistic, GeoGebra, Wolfram, Photomath) com guias completos.',
            side: 'top',
            align: 'center',
        }
    }
];

export const EIXO_INGRESSO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="ingresso-header"], header',
        popover: {
            title: '1. Guia de Ingresso no IFUSP',
            description: 'O <b>Eixo Adaptativo de Ingresso</b> orienta vestibulandos e visitantes sobre todas as portas de entrada oficiais no Instituto de Física da USP.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="ingresso-portas"]',
        popover: {
            title: '2. Formas de Ingresso',
            description: 'Conheça os processos seletivos: FUVEST, ENEM-USP, Provão Paulista, Olimpíadas Científicas, Transferências e Exame Unificado de Física (EUF).',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="ingresso-faq"]',
        popover: {
            title: '3. FAQ & Dúvidas de Ingresso',
            description: 'Tire dúvidas sobre visitas, bolsas de permanência PAPFE e iniciação científica antes mesmo da matrícula.',
            side: 'top',
            align: 'center',
        }
    }
];

export const EIXO_OBSERVATORIO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="arena-content"], [data-tour="navbar-eixo-ferramentas"]',
        popover: {
            title: '1. Observatório de Pesquisa',
            description: 'Espaço dedicado aos grupos de pesquisa, laboratórios avançados e linhas científicas de ponta do Instituto de Física.',
            side: 'bottom',
            align: 'center',
        }
    }
];

export function getEixoTourInfo(pathname: string): TourLevelInfo {
    if (pathname.startsWith('/gcif') || pathname.startsWith('/cgif') || pathname.startsWith('/colisor') || pathname.startsWith('/wiki') || pathname.startsWith('/informativo')) {
        return {
            key: 'eixo-informativo',
            title: 'Tutorial do Eixo Informativo',
            shortLabel: 'Eixo Informativo',
            steps: EIXO_CGIF_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/ferramentas') || pathname.startsWith('/grade') || pathname.startsWith('/trilhas')) {
        return {
            key: 'eixo-ferramentas',
            title: 'Tutorial do Eixo Ferramentas',
            shortLabel: 'Eixo Ferramentas',
            steps: EIXO_FERRAMENTAS_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/ingresso')) {
        return {
            key: 'eixo-ingresso',
            title: 'Tutorial do Eixo Ingresso',
            shortLabel: 'Eixo Ingresso',
            steps: EIXO_INGRESSO_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/arena')) {
        return {
            key: 'eixo-observatorio',
            title: 'Tutorial do Eixo Pesquisa',
            shortLabel: 'Eixo Pesquisa',
            steps: EIXO_OBSERVATORIO_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/configuracoes')) {
        return {
            key: 'eixo-configuracoes',
            title: 'Configurações do Sistema',
            shortLabel: 'Sistema',
            steps: EIXO_SOCIAL_TOUR_STEPS
        };
    }
    return {
        key: 'eixo-social',
        title: 'Tutorial do Eixo Social',
        shortLabel: 'Eixo Social',
        steps: EIXO_SOCIAL_TOUR_STEPS
    };
}

// =============================================================================
// NÍVEL 3: TUTORIAIS ESPECÍFICOS DE PÁGINAS / ABAS (PAGE TOURS)
// =============================================================================

// --- EIXO SOCIAL: FLUXO ---
export const COMUNIDADE_FLUXO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="comunidade-subnav"]',
        popover: {
            title: '1. Subnav de Formatos',
            description: 'Alterne entre os 3 formatos da comunidade: <b>Fluxo</b> (mídias didáticas e resumos), <b>Logs</b> (relatos) e <b>Arte</b>.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="fluxo-header"], [data-tour="comunidade-subnav"]',
        popover: {
            title: '2. Feed do Fluxo',
            description: 'O <b>Fluxo</b> reúne contribuições visuais, resumos conceituais e PDFs científicos compartilhados pela comunidade do IFUSP.',
            side: 'bottom',
            align: 'start',
        }
    },
    {
        element: '[data-tour="comunidade-filtros"]',
        popover: {
            title: '3. Filtros Multidimensionais',
            description: 'Refine as publicações por tipo de mídia (Vídeos, Imagens, Documentos), categoria de pesquisa, instituto e ano.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="comunidade-em-orbita"]',
        gesture: 'horizontal',
        popover: {
            title: '4. Em Órbita (Destaques por Instituto)',
            description: 'Carrossel horizontal que destaca automaticamente as publicações mais relevantes do seu instituto de preferência.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="comunidade-feed-vertical"]',
        gesture: 'vertical',
        popover: {
            title: '5. Feed de Mídias e Conteúdos',
            description: 'Linha do tempo contínua com todas as publicações científicas e didáticas da comunidade.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="comunidade-feed-vertical"] [data-tour="media-card-interactions"]',
        popover: {
            title: '6. Interações no Card',
            description: 'Curta as publicações, participe dos comentários, compartilhe com colegas e salve os melhores posts na sua constelação!',
            side: 'top',
            align: 'center',
        }
    }
];

// --- EIXO SOCIAL: LOGS ---
export const COMUNIDADE_DROPS_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="comunidade-subnav"]',
        popover: {
            title: '1. Subnav de Formatos',
            description: 'Você está na aba de <b>Logs</b> do Feed da Comunidade.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="logs-header"]',
        popover: {
            title: '2. Logs & Vivência Acadêmica',
            description: 'Microatualizações rápidas, desabafos construtivos, descobertas recentes e notícias dos bastidores da pesquisa no IFUSP.',
            side: 'bottom',
            align: 'start',
        }
    },
    {
        element: '[data-tour="logs-form"]',
        popover: {
            title: '3. Transmitir um Log',
            description: 'Compartilhe uma descoberta ou pensamento rápido de até 260 caracteres diretamente com a comunidade.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="logs-feed"]',
        popover: {
            title: '4. Feed de Logs & Destaques',
            description: 'Acompanhe os logs destacados e as transmissões das últimas 24 horas enviadas por pesquisadores e alunos.',
            side: 'top',
            align: 'center',
        }
    }
];

// --- EIXO SOCIAL: ARTE ---
export const COMUNIDADE_ARTE_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="comunidade-subnav"]',
        popover: {
            title: '1. Subnav de Formatos',
            description: 'Você está na aba de <b>Arte</b> do Feed da Comunidade.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="arte-header"]',
        popover: {
            title: '2. Mural Cultural & Arte Científica',
            description: 'Espaço dedicado à expressão artística, criatividade visual, ilustrações, charges e cultura científica do Instituto de Física.',
            side: 'bottom',
            align: 'start',
        }
    },
    {
        element: '[data-tour="comunidade-feed-vertical"]',
        popover: {
            title: '3. Galeria & Acervo Visual',
            description: 'Navegue pelas obras gráficas e criações artísticas submetidas pelos membros da comunidade.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="comunidade-feed-vertical"] [data-tour="media-card-interactions"]',
        popover: {
            title: '4. Interações com as Obras',
            description: 'Curta, comente sobre a composição e salve as ilustrações favoritas na sua constelação pessoal.',
            side: 'top',
            align: 'center',
        }
    }
];

// --- CENTRAL DE INTERAÇÕES: EMARANHAMENTO ---
export const EMARANHAMENTO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="interacao-subnav"]',
        popover: {
            title: '1. Canais de Interação',
            description: 'Alterne entre o <b>Emaranhamento Quântico</b> (chat direto) e o <b>Pergunte a um Cientista</b> (canal tira-dúvidas).',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="emaranhamento-header"]',
        popover: {
            title: '2. Nexus de Emaranhamento',
            description: 'Inicie conexões síncronas entre membros da rede Lab-Div, alunos, monitores e professores do instituto.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="emaranhamento-busca"]',
        popover: {
            title: '3. Buscar Partícula',
            description: 'Pesquise membros por nome ou @username para abrir uma conversa direta criptografada.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="emaranhamento-chat"], main',
        popover: {
            title: '4. Meus Núcleos & Chat em Tempo Real',
            description: 'Participe de salas de estudo temáticas (Meus Núcleos) ou converse em canais 1-a-1 de forma ágil e segura.',
            side: 'top',
            align: 'center',
        }
    }
];

// --- CENTRAL DE INTERAÇÕES: PERGUNTE A UM CIENTISTA ---
export const PERGUNTAS_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="interacao-subnav"]',
        popover: {
            title: '1. Canais de Interação',
            description: 'Alterne entre <b>Emaranhamento Quântico</b> e <b>Pergunte a um Cientista</b>.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="perguntas-header"]',
        popover: {
            title: '2. Pergunte a um Cientista',
            description: 'Canal de divulgação onde qualquer pessoa pode tirar dúvidas sobre física e ciência diretamente com os pesquisadores do IF-USP.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="perguntas-btn-enviar"]',
        popover: {
            title: '3. Enviar Pergunta',
            description: 'Clique no botão para redigir e submeter sua dúvida sobre teorias, experimentos e curiosidades do universo.',
            side: 'left',
            align: 'center',
        }
    },
    {
        element: '[data-tour="perguntas-feed"]',
        popover: {
            title: '4. Mural de Dúvidas Respondidas',
            description: 'Explore o arquivo completo de perguntas respondidas com explicações didáticas feitas pelo corpo docente e pós-graduandos.',
            side: 'top',
            align: 'center',
        }
    }
];

// --- EIXO CGIF ---
export const CGIF_WIKI_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="gcif-subnav"]',
        popover: {
            title: '1. Subabas do CGIF (Wiki, Instituto & Interativo)',
            description: 'O Centro de Graduação e Informação está dividido em 3 sub-abas integradas. Navegue clicando nas abas ou usando gestos de swipe!',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[title="Sugerir Alteração / Reportar Erro"]',
        popover: {
            title: '2. Curadoria Colaborativa (Reportar Erro)',
            description: 'Notou alguma informação desatualizada? O HUB LabDiv é feito pela comunidade. Clique na <b class="text-brand-red">Bandeira de Reporte</b> presente em todas as células para sugerir correções e atualizações. Sua ajuda mantém o ecossistema saudável!',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-wiki-sincrotron"]',
        popover: {
            title: '3. Células de Conhecimento (O Síncrotron)',
            description: '9 matrizes temáticas: Boas Práticas, Sobrevivência/Calouro, Bolsas PAPFE, Iniciação Científica, Matrículas no Júpiter e PPPs.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-wiki-guias"]',
        popover: {
            title: '3. Guias em Destaque & Sobrevivência',
            description: 'Acesse o manual <b>IFUSP 101</b> com conselhos práticos e o guia de <b>Metodologia Científica</b> para formular buscas eficientes.',
            side: 'top',
            align: 'center',
        }
    }
];

export const CGIF_INSTITUTO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="gcif-subnav"]',
        popover: {
            title: '1. Subabas do CGIF',
            description: 'Alterne rapidamente entre Wiki, Instituto e Interativo.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-instituto-card"]',
        popover: {
            title: '2. O Instituto de Física (IFUSP)',
            description: 'Estrutura institucional, história pioneira, governança, diretoria, conselhos e departamentos de pesquisa.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-instituto-iniciativas"]',
        popover: {
            title: '3. Iniciativas de Impacto & Extensão',
            description: 'Carrossel com coletivos e projetos: Lab-Div, HUB LabDiv, Show da Física, Boletim Supernova, BIFUSP e Grupo Noether.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-instituto-espacos"]',
        popover: {
            title: '4. Espaços de Convivência & Criação',
            description: 'Locais abertos à comunidade: Hackerspace, DigitalLab, CEFISMA (Amélia Império), Lab Demo e Parque CienTec.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-instituto-influenciadores"]',
        popover: {
            title: '5. Influenciadores & Divulgadores',
            description: 'Canais no YouTube, perfis no Instagram e criadores de conteúdo que traduzem a física para a sociedade.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-instituto-mapa"]',
        popover: {
            title: '6. Campus Interativo & Mapa do IFUSP',
            description: 'Mapa geográfico interativo dos edifícios, blocos de aula, laboratórios didáticos, oficinas e auditórios.',
            side: 'top',
            align: 'center',
        }
    }
];

export const CGIF_INTERATIVO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="gcif-subnav"]',
        popover: {
            title: '1. Subabas do CGIF',
            description: 'Navegue entre Wiki, Instituto e Interativo.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-interativo-oportunidades"]',
        popover: {
            title: '2. Oportunidades Ativas & Divulgação Comunitária',
            description: 'Vagas de IC, monitorias, palestras e editais de bolsas. Use o botão <b>+ Divulgar Oportunidade</b> para compartilhar editais com a comunidade!',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-interativo-quiz"]',
        popover: {
            title: '3. Teste de Radiação (Quiz)',
            description: 'Desafie seus conhecimentos sobre física, história do IFUSP e comunicação científica. Exploda o contador Geiger!',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-interativo-sac"]',
        popover: {
            title: '4. SAC • Central de Atendimento & FAQ',
            description: 'Consulte perguntas frequentes sobre a vida acadêmica e envie solicitações institucionais de forma ágil.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="gcif-interativo-glossario"]',
        popover: {
            title: '5. Glossário & Constelações Linguísticas',
            description: 'Dicionário translacional interativo conectando termos da física com a linguagem cotidiana em redes semânticas.',
            side: 'top',
            align: 'center',
        }
    }
];

// --- EIXO FERRAMENTAS ---
export const FERRAMENTAS_GRADE_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="tools-subnav"], [data-tour="ferramentas-subnav"]',
        popover: {
            title: '1. Subabas de Ferramentas',
            description: 'Alterne entre Grade 1h:1h, Trilhas, Match Acadêmico, Softwares, Anotações e Mapa de Salas.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="ferramentas-actions"]',
        popover: {
            title: '2. Ações & Sincronização JúpiterWeb',
            description: 'Sincronize horários do Júpiter, adicione matérias avulsas, crie blocos customizados de estudo e exporte sua grade.',
            side: 'bottom',
            align: 'start',
        }
    },
    {
        element: '[data-tour="ferramentas-grade"]',
        popover: {
            title: '3. Grade Horária Inteligente & Faltas',
            description: 'Visualize sua grade semanal com detecção instantânea de choques de horário e monitor de limite de faltas.',
            side: 'top',
            align: 'center',
        }
    }
];

export const FERRAMENTAS_TRILHAS_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="tools-subnav"], [data-tour="ferramentas-subnav"]',
        popover: {
            title: '1. Subabas de Ferramentas',
            description: 'Navegação pelas ferramentas acadêmicas do estudante.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="trilhas-header"], main',
        popover: {
            title: '2. Trilhas de Formação Curricular',
            description: 'Acompanhe seu progresso de disciplinas obrigatórias e eletivas do Bacharelado e da Licenciatura em Física.',
            side: 'top',
            align: 'center',
        }
    }
];

export const FERRAMENTAS_MATCH_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="tools-subnav"], [data-tour="ferramentas-subnav"]',
        popover: {
            title: '1. Subabas de Ferramentas',
            description: 'Navegação do kit universitário.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="match-header"], main',
        popover: {
            title: '2. Match Acadêmico',
            description: 'Encontre parceiros de estudo para listas de exercícios e conecte-se a docentes oferecendo Iniciação Científica.',
            side: 'top',
            align: 'center',
        }
    }
];

export const FERRAMENTAS_SOFTWARES_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="tools-subnav"], [data-tour="ferramentas-subnav"]',
        popover: {
            title: '1. Subabas de Ferramentas',
            description: 'Aba de Softwares Acadêmicos & Comunitários.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="softwares-header"], main header, main',
        popover: {
            title: '2. Biblioteca de Softwares da Física',
            description: 'Catálogo de códigos e softwares desenvolvidos pela comunidade do IFUSP (LumiFI, Aurtistic) e ferramentas essenciais (GeoGebra, Wolfram|Alpha, Photomath).',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="softwares-btn-enviar"], button:has-text("Enviar Software"), main button',
        popover: {
            title: '3. Enviar Software Comunitário',
            description: 'Desenvolveu um script, simulação ou ferramenta útil para a física? Submeta para a biblioteca comunitária para que todos possam utilizar!',
            side: 'top',
            align: 'center',
        }
    }
];

export const FERRAMENTAS_ANOTACOES_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="tools-subnav"], [data-tour="ferramentas-subnav"]',
        popover: {
            title: '1. Subabas de Ferramentas',
            description: 'Navegação do kit universitário.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="anotacoes-content"], main',
        popover: {
            title: '2. Caderno Quântico & Anotações',
            description: 'Seu bloco de notas integrado com suporte a markdown, fórmulas e organização por disciplina.',
            side: 'top',
            align: 'center',
        }
    }
];

export const FERRAMENTAS_MAPA_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="tools-subnav"], [data-tour="ferramentas-subnav"]',
        popover: {
            title: '1. Subabas de Ferramentas',
            description: 'Navegação do kit universitário.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="mapa-content"], main',
        popover: {
            title: '2. Mapa de Salas & Serviços do IFUSP',
            description: 'Localize secretarias, laboratórios de ensino, cantinas e auditórios do Instituto de Física.',
            side: 'top',
            align: 'center',
        }
    }
];

// --- EIXO INGRESSO ---
export const INGRESSO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="ingresso-header"]',
        popover: {
            title: '1. Guia de Ingresso no IFUSP',
            description: 'O portal completo para vestibulandos, transferências e interessados em ingressar no Instituto de Física da USP.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="ingresso-portas"]',
        popover: {
            title: '2. Formas de Ingresso',
            description: 'Explore os editais e formas de acesso: <b>Graduação</b> (FUVEST, ENEM-USP, Provão Paulista, Olimpíadas, Transferência), <b>Pós-Graduação</b> (EUF, Mestrado, Doutorado) e <b>Mobilidade/Visitas</b>.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="ingresso-faq"]',
        popover: {
            title: '3. Dúvidas Frequentes (FAQ de Ingresso)',
            description: 'Consulte respostas rápidas sobre visitas aos laboratórios, bolsas de permanência estudantil (PAPFE) e oportunidades de pesquisa.',
            side: 'top',
            align: 'center',
        }
    }
];

// --- EIXO OBSERVATÓRIO ---
export const OBSERVATORIO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="arena-content"], main',
        popover: {
            title: '1. Observatório de Pesquisa',
            description: 'Mapeamento de grupos de pesquisa, laboratórios ativos e linhas de investigação avançada no Instituto de Física.',
            side: 'top',
            align: 'center',
        }
    }
];

// --- LABORATÓRIO PESSOAL ---
export const LAB_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="lab-profile-header"], main',
        popover: {
            title: '1. Seu Laboratório Pessoal',
            description: 'Seu espaço acadêmico individual no HUB! Aqui você gerencia sua identidade científica, avatar, biografia, redes sociais e conexões.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="lab-radiation-badge"]',
        popover: {
            title: '2. Nível de Radiação & XP',
            description: 'Monitore sua pontuação de engajamento! Ganhe radiação/XP ao interagir, publicar resumos, participar do quiz e responder perguntas científicas.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="lab-academic-info"]',
        popover: {
            title: '3. Ecossistema & Foco de Pesquisa',
            description: 'Exiba seu instituto USP, curso, ano de ingresso, currículo Lattes CNPq, linhas de pesquisa e interesses artísticos.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="lab-subnav"]',
        popover: {
            title: '4. Subabas do Laboratório',
            description: 'Alterne entre seus envios no <b>Fluxo</b>, produções de <b>Arte</b>, microartigos em <b>Logs</b>, favoritos salvos na sua <b>Constelação</b> e o painel de <b>Radiação</b>.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="lab-actions"]',
        popover: {
            title: '5. Editar Perfil & Compartilhar',
            description: 'Personalize suas informações públicas e gere um link direto para compartilhar seu portfólio acadêmico com a comunidade.',
            side: 'left',
            align: 'center',
        }
    }
];

// --- CONFIGURAÇÕES ---
export const CONFIG_GERAIS_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="config-subnav"]',
        popover: {
            title: '1. Abas de Configuração',
            description: 'Navegue entre as 3 áreas do painel: <b>Gerais</b> (interface e temas), <b>Armazenamento & Cache</b> e <b>Conta & Privacidade</b>.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="config-interface"]',
        popover: {
            title: '2. Interface & Avisos de Tutorial',
            description: 'Ative ou desative o banner de tutorial do HUB no topo da tela e configure as permissões de <b>Notificações Push</b> para receber avisos em tempo real.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="config-instituto"]',
        popover: {
            title: '3. Identidade Institucional & Temas',
            description: 'Selecione seu instituto de destaque (<b>IFUSP</b>, <b>IME</b>, <b>IAG</b>, <b>IGC</b>, <b>IO</b>). Isso adapta o logotipo da barra superior e as cores do ecossistema!',
            side: 'top',
            align: 'center',
        }
    }
];

export const CONFIG_ARMAZENAMENTO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="config-subnav"]',
        popover: {
            title: '1. Abas de Configuração',
            description: 'Área de gerenciamento de armazenamento local do aplicativo.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="config-cache"], main',
        popover: {
            title: '2. Armazenamento Local & Cache Offline',
            description: 'Monitore o uso de espaço do banco local (IndexedDB) e arquivos em cache. Limpe dados offline caso precise liberar espaço no seu dispositivo.',
            side: 'top',
            align: 'center',
        }
    }
];

export const CONFIG_CONTA_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="config-subnav"]',
        popover: {
            title: '1. Abas de Configuração',
            description: 'Controle de identidade e direitos de privacidade.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="config-takeout"]',
        popover: {
            title: '2. Portabilidade de Dados (Takeout LGPD)',
            description: 'Baixe uma cópia completa de todos os seus dados coletados pela plataforma HUB Lab-Div em formato JSON estruturado.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="config-danger"]',
        popover: {
            title: '3. Zona de Risco & Exclusão',
            description: 'Limpe históricos específicos de navegação ou encerre sua conta definitivamente em conformidade total com a LGPD.',
            side: 'top',
            align: 'center',
        }
    }
];

// Compatibilidade anterior
export const COMUNIDADE_TOUR_STEPS = COMUNIDADE_FLUXO_TOUR_STEPS;
export const CGIF_TOUR_STEPS: TourStepConfig[] = [
    ...CGIF_WIKI_TOUR_STEPS,
    ...CGIF_INSTITUTO_TOUR_STEPS.slice(1),
    ...CGIF_INTERATIVO_TOUR_STEPS.slice(1)
];
export const FERRAMENTAS_TOUR_STEPS = FERRAMENTAS_GRADE_TOUR_STEPS;
export const INTERACOES_TOUR_STEPS = EMARANHAMENTO_TOUR_STEPS;
export const ONBOARDING_STEPS = GLOBAL_TOUR_STEPS;

export type PageTourInfo = TourLevelInfo;

/**
 * Retorna o tutorial de Nível 3 específico da subaba/página ativa,
 * inspecionando pathname, searchParams e o DOM dinâmico.
 */
export function getPageTourInfo(pathname: string, searchParams?: URLSearchParams | null): PageTourInfo {
    const tabParam = searchParams?.get('tab');

    // 1. Central de Interações (/interacao, /emaranhamento, /perguntas):
    if (pathname.startsWith('/perguntas') || (pathname.startsWith('/interacao') && tabParam === 'perguntas')) {
        return { key: 'perguntas', title: 'Tutorial do Pergunte a um Cientista', shortLabel: 'Pergunte', steps: PERGUNTAS_TOUR_STEPS };
    }
    if (pathname.startsWith('/emaranhamento') || (pathname.startsWith('/interacao') && tabParam === 'emaranhamento')) {
        return { key: 'emaranhamento', title: 'Tutorial do Emaranhamento Quântico', shortLabel: 'Emaranhamento', steps: EMARANHAMENTO_TOUR_STEPS };
    }
    if (pathname.startsWith('/interacao')) {
        // Detecção reativa por DOM se tabParam não estiver na URL
        if (typeof document !== 'undefined' && document.querySelector('[data-tour="perguntas-header"]')) {
            return { key: 'perguntas', title: 'Tutorial do Pergunte a um Cientista', shortLabel: 'Pergunte', steps: PERGUNTAS_TOUR_STEPS };
        }
        return { key: 'emaranhamento', title: 'Tutorial do Emaranhamento Quântico', shortLabel: 'Emaranhamento', steps: EMARANHAMENTO_TOUR_STEPS };
    }

    // 2. Feed da Comunidade (/, /comunidade, /fluxo, /drops, /arquivo):
    if (pathname.startsWith('/drops') || tabParam === 'logs') {
        return { key: 'drops', title: 'Tutorial de Logs', shortLabel: 'Logs', steps: COMUNIDADE_DROPS_TOUR_STEPS };
    }
    if (pathname.startsWith('/arquivo') || tabParam === 'arte') {
        return { key: 'arte', title: 'Tutorial de Arte', shortLabel: 'Arte', steps: COMUNIDADE_ARTE_TOUR_STEPS };
    }
    if (pathname === '/' || pathname.startsWith('/fluxo') || pathname.startsWith('/comunidade')) {
        // Detecção reativa por DOM quando a aba é alterada via estado local
        if (typeof document !== 'undefined') {
            if (document.querySelector('[data-tour="logs-header"]')) {
                return { key: 'drops', title: 'Tutorial de Logs', shortLabel: 'Logs', steps: COMUNIDADE_DROPS_TOUR_STEPS };
            }
            if (document.querySelector('[data-tour="arte-header"]')) {
                return { key: 'arte', title: 'Tutorial de Arte', shortLabel: 'Arte', steps: COMUNIDADE_ARTE_TOUR_STEPS };
            }
        }
        return { key: 'fluxo', title: 'Tutorial de Fluxo', shortLabel: 'Fluxo', steps: COMUNIDADE_FLUXO_TOUR_STEPS };
    }

    // 3. Eixo Informativo:
    if (pathname.startsWith('/gcif/instituto')) {
        return { key: 'gcif-instituto', title: 'Tutorial do Instituto', shortLabel: 'Instituto', steps: CGIF_INSTITUTO_TOUR_STEPS };
    }
    if (pathname.startsWith('/gcif/interativo')) {
        return { key: 'gcif-interativo', title: 'Tutorial do Interativo', shortLabel: 'Interativo', steps: CGIF_INTERATIVO_TOUR_STEPS };
    }
    if (pathname.startsWith('/gcif') || pathname.startsWith('/colisor') || pathname.startsWith('/wiki')) {
        return { key: 'gcif-wiki', title: 'Tutorial da Wiki', shortLabel: 'Wiki', steps: CGIF_WIKI_TOUR_STEPS };
    }

    // 4. Eixo Ferramentas:
    if (pathname.startsWith('/ferramentas/softwares')) {
        return { key: 'ferramentas-softwares', title: 'Tutorial de Softwares', shortLabel: 'Softwares', steps: FERRAMENTAS_SOFTWARES_TOUR_STEPS };
    }
    if (pathname.startsWith('/ferramentas/trilhas')) {
        return { key: 'ferramentas-trilhas', title: 'Tutorial de Trilhas', shortLabel: 'Trilhas', steps: FERRAMENTAS_TRILHAS_TOUR_STEPS };
    }
    if (pathname.startsWith('/ferramentas/match')) {
        return { key: 'ferramentas-match', title: 'Tutorial do Match', shortLabel: 'Match', steps: FERRAMENTAS_MATCH_TOUR_STEPS };
    }
    if (pathname.startsWith('/ferramentas/anotacoes')) {
        return { key: 'ferramentas-anotacoes', title: 'Tutorial de Anotações', shortLabel: 'Anotações', steps: FERRAMENTAS_ANOTACOES_TOUR_STEPS };
    }
    if (pathname.startsWith('/ferramentas/mapa')) {
        return { key: 'ferramentas-mapa', title: 'Tutorial do Mapa', shortLabel: 'Mapa', steps: FERRAMENTAS_MAPA_TOUR_STEPS };
    }
    if (pathname.startsWith('/ferramentas') || pathname.startsWith('/grade')) {
        return { key: 'ferramentas-grade', title: 'Tutorial da Grade Horária', shortLabel: 'Grade', steps: FERRAMENTAS_GRADE_TOUR_STEPS };
    }

    // 5. Eixo Adaptativo:
    if (pathname.startsWith('/ingresso')) {
        return { key: 'ingresso', title: 'Tutorial de Ingresso & FAQ', shortLabel: 'Ingresso & FAQ', steps: INGRESSO_TOUR_STEPS };
    }
    if (pathname.startsWith('/arena')) {
        return { key: 'observatorio', title: 'Tutorial do Observatório', shortLabel: 'Observatório', steps: OBSERVATORIO_TOUR_STEPS };
    }

    // 6. Laboratório Pessoal:
    if (pathname.startsWith('/lab')) {
        return { key: 'lab', title: 'Tutorial do Laboratório Pessoal', shortLabel: 'Laboratório', steps: LAB_TOUR_STEPS };
    }

    // 7. Configurações:
    if (pathname.startsWith('/configuracoes')) {
        if (typeof document !== 'undefined') {
            if (document.querySelector('[data-tour="config-cache"]')) {
                return { key: 'config-cache', title: 'Tutorial de Armazenamento & Cache', shortLabel: 'Armazenamento', steps: CONFIG_ARMAZENAMENTO_TOUR_STEPS };
            }
            if (document.querySelector('[data-tour="config-takeout"]') || document.querySelector('[data-tour="config-danger"]')) {
                return { key: 'config-conta', title: 'Tutorial de Conta & Privacidade', shortLabel: 'Conta', steps: CONFIG_CONTA_TOUR_STEPS };
            }
        }
        return { key: 'configuracoes', title: 'Tutorial de Configurações Gerais', shortLabel: 'Configurações', steps: CONFIG_GERAIS_TOUR_STEPS };
    }

    // Fallback:
    return {
        key: 'global',
        title: 'Tutorial Geral',
        shortLabel: 'Geral',
        steps: getGlobalTourSteps()
    };
}
