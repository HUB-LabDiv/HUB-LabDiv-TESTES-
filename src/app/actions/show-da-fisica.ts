'use server';

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

import { z } from 'zod';
import nodemailer from 'nodemailer';
import { EXPERIMENTS_CATALOG, SHOW_ACTS } from '../iniciativas/show-da-fisica/data/experiments';
import { ShowBookingResult } from '@/types/show-da-fisica';

const bookingSchema = z.object({
    email: z.string().email('E-mail inválido'),
    schoolName: z.string().min(2, 'O nome da escola deve ter pelo menos 2 caracteres'),
    teacherName: z.string().min(2, 'O nome do responsável deve ter pelo menos 2 caracteres'),
    studentCount: z.coerce.number().min(1, 'A quantidade de alunos deve ser no mínimo 1'),
    schoolGrade: z.string().min(1, 'Selecione a faixa escolar / ano'),
    preferredShift: z.enum(['10:00', '14:00', 'outro']),
    preferredDate: z.string().optional(),
    notes: z.string().optional(),
    selectedExperiments: z.object({
        preShow: z.array(z.string()),
        abertura: z.array(z.string()),
        principal: z.array(z.string()),
        encerramento: z.array(z.string()),
    })
});

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const transporter = (GMAIL_USER && GMAIL_APP_PASSWORD)
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
        },
    })
    : null;

function buildEmailHtml(data: z.infer<typeof bookingSchema>, bookingCode: string): string {
    const getExperimentDetails = (ids: string[]) => {
        if (!ids || ids.length === 0) return '<p style="color: #888; font-style: italic; margin: 4px 0;">Nenhum experimento selecionado para este ato.</p>';
        return ids.map(id => {
            const exp = EXPERIMENTS_CATALOG.find(e => e.id === id);
            if (!exp) return `<li>${id}</li>`;
            return `
                <div style="margin-bottom: 12px; padding: 10px 14px; background-color: #1a1a1a; border-left: 3px solid ${exp.themeColor === 'green' ? '#01f300' : exp.themeColor === 'blue' ? '#002ffe' : '#f60011'}; border-radius: 4px;">
                    <strong style="color: #ffffff; font-size: 15px;">${exp.title}</strong>
                    <span style="color: #a0aec0; font-size: 13px; display: block; margin-top: 2px;">${exp.subtitle} (${exp.concept})</span>
                    <p style="color: #cbd5e1; font-size: 13px; margin: 4px 0 0 0; line-height: 1.4;">${exp.description}</p>
                </div>
            `;
        }).join('');
    };

    return `
    <div style="max-width: 650px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0b0b; color: #f1f5f9; border: 1px solid #222; border-radius: 12px; overflow: hidden;">
        
        <!-- Top Bar Neon -->
        <div style="height: 4px; background: linear-gradient(90deg, #f60011 0%, #002ffe 50%, #01f300 100%);"></div>

        <!-- Header -->
        <div style="padding: 32px 24px; text-align: center; background-color: #121212; border-bottom: 1px solid #262626;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
                <span style="color: #f60011;">SHOW</span>
                <span style="color: #002ffe; margin: 0 4px;">DE</span>
                <span style="color: #01f300;">FISICA</span>
            </h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">
                Instituto de Física da USP &bull; Solicitação de Agendamento
            </p>
            <div style="display: inline-block; margin-top: 16px; padding: 6px 14px; background-color: #1f2937; border: 1px solid #374151; border-radius: 9999px; font-size: 12px; color: #38bdf8; font-weight: bold; letter-spacing: 0.5px;">
                Protocolo: #${bookingCode}
            </div>
        </div>

        <!-- Body Content -->
        <div style="padding: 28px 24px;">
            <p style="font-size: 16px; color: #f8fafc; line-height: 1.6; margin-top: 0;">
                Olá, <strong>${data.teacherName}</strong>!
            </p>
            <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">
                Recebemos o seu roteiro personalizado no <strong>Monte seu Show</strong> para a escola <strong>${data.schoolName}</strong>. Nossa equipe técnica e de apresentação já foi notificada para organizar a recepção da sua turma.
            </p>

            <!-- Card Dados da Escola -->
            <div style="background-color: #161616; border: 1px solid #2d2d2d; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 14px; font-size: 16px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">
                    📋 Dados do Agendamento
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                        <td style="padding: 6px 0; color: #94a3b8; width: 40%;"><strong>Escola / Instituição:</strong></td>
                        <td style="padding: 6px 0; color: #ffffff;">${data.schoolName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #94a3b8;"><strong>Responsável:</strong></td>
                        <td style="padding: 6px 0; color: #ffffff;">${data.teacherName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #94a3b8;"><strong>E-mail de Contato:</strong></td>
                        <td style="padding: 6px 0; color: #ffffff;">${data.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #94a3b8;"><strong>Quantidade de Alunos:</strong></td>
                        <td style="padding: 6px 0; color: #ffffff;">${data.studentCount} alunos</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #94a3b8;"><strong>Faixa Escolar:</strong></td>
                        <td style="padding: 6px 0; color: #ffffff;">${data.schoolGrade}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #94a3b8;"><strong>Horário / Turno:</strong></td>
                        <td style="padding: 6px 0; color: #ffffff;">${data.preferredShift === 'outro' ? 'A combinar' : data.preferredShift}</td>
                    </tr>
                    ${data.preferredDate ? `
                    <tr>
                        <td style="padding: 6px 0; color: #94a3b8;"><strong>Data Pretendida:</strong></td>
                        <td style="padding: 6px 0; color: #ffffff;">${data.preferredDate}</td>
                    </tr>` : ''}
                    ${data.notes ? `
                    <tr>
                        <td style="padding: 6px 0; color: #94a3b8; vertical-align: top;"><strong>Observações:</strong></td>
                        <td style="padding: 6px 0; color: #ffffff;">${data.notes}</td>
                    </tr>` : ''}
                </table>
            </div>

            <!-- Roteiro Customizado do Show -->
            <div style="margin: 28px 0;">
                <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 18px; color: #f8fafc; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #333; padding-bottom: 8px;">
                    🎭 Roteiro Customizado do Espetáculo
                </h3>

                <!-- Ato 1: Pré-Show -->
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="color: #01f300; font-weight: bold; font-size: 14px; text-transform: uppercase;">Ato 01 &bull; Pré-Show (Recepção)</span>
                    </div>
                    ${getExperimentDetails(data.selectedExperiments.preShow)}
                </div>

                <!-- Ato 2: Abertura -->
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="color: #002ffe; font-weight: bold; font-size: 14px; text-transform: uppercase;">Ato 02 &bull; Abertura (Cênica e Histórica)</span>
                    </div>
                    ${getExperimentDetails(data.selectedExperiments.abertura)}
                </div>

                <!-- Ato 3: Principal -->
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="color: #002ffe; font-weight: bold; font-size: 14px; text-transform: uppercase;">Ato 03 &bull; Principal (Corpo do Show)</span>
                    </div>
                    ${getExperimentDetails(data.selectedExperiments.principal)}
                </div>

                <!-- Ato 4: Encerramento -->
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="color: #f60011; font-weight: bold; font-size: 14px; text-transform: uppercase;">Ato 04 &bull; Encerramento (Grand Finale)</span>
                    </div>
                    ${getExperimentDetails(data.selectedExperiments.encerramento)}
                </div>
            </div>

            <!-- Orientações do IFUSP -->
            <div style="background-color: #121820; border-left: 4px solid #002ffe; padding: 16px 20px; border-radius: 4px; margin-top: 24px;">
                <h4 style="margin: 0 0 8px 0; color: #93c5fd; font-size: 15px;">📌 Informações Importantes para a Visita</h4>
                <ul style="margin: 0; padding-left: 18px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                    <li><strong>Local:</strong> Auditório do Show de Física — Instituto de Física da USP (Cidade Universitária, SP).</li>
                    <li><strong>Duração:</strong> Aproximadamente 2 horas de espetáculo e interação.</li>
                    <li><strong>Dias de sessão:</strong> Terças, Quartas e Quintas-feiras (Sessões regulares às 10:00 e 14:00).</li>
                    <li>Nossa equipe retornará este e-mail para validar a disponibilidade final na agenda do auditório.</li>
                </ul>
            </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #121212; padding: 20px 24px; text-align: center; border-top: 1px solid #222; font-size: 12px; color: #64748b;">
            <p style="margin: 0 0 4px 0;">Show de Fisica &bull; HUB Lab-Div &bull; Instituto de Física | USP</p>
            <p style="margin: 0;">E-mail automático de agendamento &bull; Se tiver dúvidas, responda a esta mensagem ou contate o HUB.</p>
        </div>

    </div>
    `;
}

export async function submitShowBooking(rawData: unknown): Promise<ShowBookingResult> {
    try {
        const parsed = bookingSchema.safeParse(rawData);
        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || 'Dados inválidos no formulário.';
            return {
                success: false,
                message: firstError,
                error: firstError,
            };
        }

        const data = parsed.data;
        const bookingCode = `SHOW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const emailHtml = buildEmailHtml(data, bookingCode);

        // Dispara e-mail com transporter do nodemailer
        if (transporter && GMAIL_USER) {
            const hubEmail = 'hublabdiv@gmail.com';
            
            // O usuário recebe a confirmação e o HUB fica em cópia (CC) para aparecer na caixa de entrada do Gmail
            const mailOptions: nodemailer.SendMailOptions = {
                from: `"Show de Fisica | HUB Lab-Div" <${GMAIL_USER}>`,
                to: data.email,
                cc: GMAIL_USER.toLowerCase() === hubEmail.toLowerCase() ? [GMAIL_USER] : [GMAIL_USER, hubEmail],
                replyTo: GMAIL_USER,
                subject: 'Agendamento - Showdefisica',
                html: emailHtml,
            };

            await transporter.sendMail(mailOptions);
            console.log(`[ShowDeFisica] Agendamento enviado com sucesso para ${data.email} com cópia para o HUB. Protocolo: ${bookingCode}`);
        } else {
            // Se as credenciais de e-mail não estiverem definidas no ambiente local, simulamos com log
            console.warn('[ShowDeFisica] GMAIL_USER ou GMAIL_APP_PASSWORD não definidos. Simulação de envio com sucesso:', {
                to: data.email,
                subject: 'Agendamento - Showdefisica',
                protocol: bookingCode
            });
        }

        return {
            success: true,
            message: 'Agendamento realizado com sucesso! Verifique a sua caixa de entrada.',
            bookingId: bookingCode,
        };
    } catch (err: any) {
        console.error('[ShowDeFisica] Erro ao processar agendamento:', err);
        return {
            success: false,
            message: 'Ocorreu um erro ao enviar o agendamento. Tente novamente mais tarde.',
            error: err?.message || 'Falha de envio',
        };
    }
}
