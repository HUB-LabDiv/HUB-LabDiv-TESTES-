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

export type ShowActType = 'pre-show' | 'abertura' | 'principal' | 'encerramento';

export interface ExperimentOption {
    id: string;
    act: ShowActType;
    title: string;
    subtitle: string;
    description: string;
    concept: string;
    image: string;
    themeColor: 'green' | 'blue' | 'red';
}

export interface ShowSelectedExperiments {
    preShow: string[];
    abertura: string[];
    principal: string[];
    encerramento: string[];
}

export interface ShowBookingPayload {
    email: string;
    schoolName: string;
    teacherName: string;
    studentCount: number;
    schoolGrade: string;
    preferredShift: '10:00' | '14:00' | 'outro';
    preferredDate?: string;
    notes?: string;
    selectedExperiments: ShowSelectedExperiments;
}

export interface ShowBookingResult {
    success: boolean;
    message: string;
    bookingId?: string;
    error?: string;
}
