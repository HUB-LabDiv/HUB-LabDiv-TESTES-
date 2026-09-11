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

import Image from 'next/image';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#121212]">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-6">
                <Image
                    src="/icone-HUBLabDiv.svg"
                    alt="HUB LabDiv Logo"
                    fill
                    className="object-contain animate-pulse"
                    priority
                />
            </div>
            <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0F4780] via-[#F14343] to-[#FFCC00] w-full animate-shimmer-labdiv" />
            </div>
        </div>
    );
}
