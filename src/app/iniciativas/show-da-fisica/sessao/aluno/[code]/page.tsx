import React from 'react';
import { StudentSessionClient } from './StudentSessionClient';
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { validateShowPin, getSessionData, getMisconceptions } from '@/app/actions/show-da-fisica';

export default async function AlunoSessionPage({ params }: { params: Promise<{ code: string }> }) {
    const resolvedParams = await params;
    const code = resolvedParams.code?.toUpperCase() || '';
    
    // Validar o PIN
    const validation = await validateShowPin(code);
    if (!validation.success || !validation.sessionId) {
        return (
            <MainLayoutWrapper fullWidth={true}>
                <div className="min-h-screen bg-[#070708] text-white pt-32 pb-16 text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Código Inválido</h1>
                    <p>Verifique o código com seu professor e tente novamente.</p>
                </div>
            </MainLayoutWrapper>
        );
    }

    const sessionId = validation.sessionId;
    const sessionRes = await getSessionData(sessionId);
    const sessionData = sessionRes.data;

    let misconceptions: any[] = [];
    if (sessionData && sessionData.selected_experiments) {
        const sel = sessionData.selected_experiments;
        const experimentIds = [
            ...(sel.preShow || []),
            ...(sel.abertura || []),
            ...(sel.principal || []),
            ...(sel.encerramento || [])
        ];
        
        const miscRes = await getMisconceptions(experimentIds);
        if (miscRes.success && miscRes.data) {
            misconceptions = miscRes.data;
        }
    }
    
    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="min-h-screen bg-[#070708] text-white pt-24 pb-16">
                <StudentSessionClient 
                    sessionCode={code} 
                    sessionId={sessionId} 
                    misconceptions={misconceptions} 
                />
            </div>
        </MainLayoutWrapper>
    );
}
