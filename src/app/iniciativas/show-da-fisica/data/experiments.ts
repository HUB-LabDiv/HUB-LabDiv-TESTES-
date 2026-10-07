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

import { ExperimentOption, ShowActType } from '@/types/show-da-fisica';

export interface ActDefinition {
    id: ShowActType;
    title: string;
    subtitle: string;
    description: string;
    themeColor: 'green' | 'blue' | 'red';
    accentHex: string;
    badgeText: string;
}

export const SHOW_ACTS: ActDefinition[] = [
    {
        id: 'pre-show',
        title: 'Pré-Show',
        subtitle: 'Recepção e Aquecimento',
        description: 'Experimentos dinâmicos e participativos enquanto a plateia se acomoda no auditório.',
        themeColor: 'green',
        accentHex: '#01f300',
        badgeText: 'Ato 01'
    },
    {
        id: 'abertura',
        title: 'Abertura',
        subtitle: 'O Impacto Cênico e Histórico',
        description: 'Personagens lendários da ciência entram em cena para conectar a plateia com a história do pensamento científico.',
        themeColor: 'blue',
        accentHex: '#002ffe',
        badgeText: 'Ato 02'
    },
    {
        id: 'principal',
        title: 'Principal',
        subtitle: 'O Núcleo dos Fenômenos',
        description: 'Os experimentos mais icônicos, visuais e potentes de eletromagnetismo, ondas e termodinâmica.',
        themeColor: 'blue',
        accentHex: '#002ffe',
        badgeText: 'Ato 03'
    },
    {
        id: 'encerramento',
        title: 'Encerramento',
        subtitle: 'O Grand Finale e Clímax',
        description: 'Transições térmicas extremas e momentos espetaculares pensados para marcar a memória e render registros inesquecíveis.',
        themeColor: 'red',
        accentHex: '#f60011',
        badgeText: 'Ato 04'
    }
];

export const EXPERIMENTS_CATALOG: ExperimentOption[] = [
    // 1. PRÉ SHOW (Verde Neon)
    {
        id: 'basket',
        act: 'pre-show',
        title: 'Basket',
        subtitle: 'Cinemática & Física do Esporte',
        concept: 'Mecânica e Lançamento Oblíquo',
        description: 'Um desafio interativo de arremesso que desmistifica parábolas, conservação de momento e gravidade no palco.',
        image: '/show/IMG_8833.JPG',
        themeColor: 'green'
    },
    {
        id: 'galao',
        act: 'pre-show',
        title: 'Galão',
        subtitle: 'Pressão Atmosférica & Vácuo',
        concept: 'Termodinâmica e Pressão dos Gases',
        description: 'O impressionante efeito da pressão atmosférica esmagando instantaneamente um galão resistente sob vácuo.',
        image: '/show/IMG_8869.JPG',
        themeColor: 'green'
    },
    {
        id: 'torque',
        act: 'pre-show',
        title: 'Torque',
        subtitle: 'Giroscópios & Momento Angular',
        concept: 'Rotação e Leis de Conservação',
        description: 'A força invisível da conservação do momento angular com rodas giratórias e bancos giratórios que desafiam a intuição.',
        image: '/show/IMG_8876.JPG',
        themeColor: 'green'
    },

    // 2. ABERTURA (Azul Neon)
    {
        id: 'marie-curie',
        act: 'abertura',
        title: 'Ato da Marie Curie',
        subtitle: 'A Pioneira da Radioatividade',
        concept: 'História da Ciência e Física Nuclear',
        description: 'Uma imersão teatral na vida e nas descobertas da única cientista laureada com dois Prêmios Nobel em áreas distintas.',
        image: '/show/IMG_8891.JPG',
        themeColor: 'blue'
    },
    {
        id: 'albert-einstein',
        act: 'abertura',
        title: 'Ato do Albert Einstein',
        subtitle: 'Relatividade & O Pensamento Curioso',
        concept: 'Física Moderna e Pensamento Científico',
        description: 'Uma abertura instigante baseada nas experiências de pensamento de Einstein sobre a luz, o espaço e a mecânica quântica.',
        image: '/show/IMG_8990.JPG',
        themeColor: 'blue'
    },

    // 3. PRINCIPAL (Azul Neon)
    {
        id: 'wimshurst',
        act: 'principal',
        title: 'Gerador de Wimshurst',
        subtitle: 'Alta Tensão Eletrostática',
        concept: 'Indução Eletrostática e Descargas',
        description: 'Máquina clássica geradora de dezenas de milhares de volts, demonstrando acúmulo de cargas e relâmpagos em miniatura.',
        image: '/show/IMG_00004.JPG',
        themeColor: 'blue'
    },
    {
        id: 'fumaca',
        act: 'principal',
        title: 'Canhão de Fumaça',
        subtitle: 'Vórtices Toroidais & Fluidos',
        concept: 'Aerodinâmica e Dinâmica de Vórtices',
        description: 'Disparo de anéis de fumaça gigantes que viajam pelo auditório mostrando o transporte de momento e energia em fluidos.',
        image: '/show/IMG_00031.JPG',
        themeColor: 'blue'
    },
    {
        id: 'tesla',
        act: 'principal',
        title: 'Bobina de Tesla',
        subtitle: 'Raios & Eletromagnetismo Sem Fio',
        concept: 'Resonância Eletromagnética e Alta Frequência',
        description: 'Centelhas espetaculares no ar e lâmpadas acendendo nas mãos sem qualquer fio conectado, homenageando Nikola Tesla.',
        image: '/show/IMG_00143.JPG',
        themeColor: 'blue'
    },

    // 4. ENCERRAMENTO (Vermelho Neon)
    {
        id: 'nitrogenio',
        act: 'encerramento',
        title: 'Nitrogênio Líquido',
        subtitle: 'Criogenia Extrema (-196°C)',
        concept: 'Termodinâmica e Transição de Fase',
        description: 'O ápice térmico: nuvens colossais de vapor, contração de gases e efeitos fascinantes do frio extremo no palco.',
        image: '/show/IMG_8793.JPG',
        themeColor: 'red'
    },
    {
        id: 'batata-fria',
        act: 'encerramento',
        title: 'Batata Fria',
        subtitle: 'Transição Vítrea Instantânea',
        concept: 'Propriedades dos Materiais em Baixas Temperaturas',
        description: 'Alimentos e materiais orgânicos submetidos a congelamento instantâneo se quebrando como vidro diante do público.',
        image: '/show/IMG_8797.JPG',
        themeColor: 'red'
    },
    {
        id: 'reels',
        act: 'encerramento',
        title: 'Reels',
        subtitle: 'O Momento Visual & Redes Sociais',
        concept: 'Divulgação Científica e Engajamento Visual',
        description: 'Experimentos com iluminação estroboscópica e efeitos cinematográficos desenhados sob medida para os alunos gravarem.',
        image: '/show/IMG_00224.JPG',
        themeColor: 'red'
    }
];
