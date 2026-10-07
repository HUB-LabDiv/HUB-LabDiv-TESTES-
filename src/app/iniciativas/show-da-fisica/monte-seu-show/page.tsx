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

import React from 'react';
import { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import { MonteSeuShowClient } from './MonteSeuShowClient';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '600', '700', '900'] });

export const metadata: Metadata = {
    title: 'Monte seu Show | Show de Fisica IFUSP',
    description: 'Monte o roteiro personalizado de experimentos do Show de Física e envie a solicitação de agendamento da sua escola.',
};

export default function MonteSeuShowPage() {
    return (
        <div className="w-full min-h-screen bg-[#070708]">
            <MonteSeuShowClient orbitronClassName={orbitron.className} />
        </div>
    );
}
