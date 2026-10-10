import React from 'react';
import { TeacherSessionClient } from './TeacherSessionClient';
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { validateShowPin, getSessionData } from '@/app/actions/show-da-fisica';

export default async function ProfessorSessionPage({ params }: { params: Promise<{ code: string }> }) {
    const resolvedParams = await params;
    const code = resolvedParams.code?.toUpperCase() || '';
    
    const validation = await validateShowPin(code);
    if (!validation.success || !validation.sessionId) {
        return (
            <MainLayoutWrapper fullWidth={true}>
                <div className="min-h-screen bg-[#070708] text-white pt-32 pb-16 text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Código Inválido</h1>
                    <p>Sessão de professor não encontrada.</p>
                </div>
            </MainLayoutWrapper>
        );
    }
    
    const sessionRes = await getSessionData(validation.sessionId);
    const sessionData = sessionRes.data;

    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="min-h-screen bg-[#070708] text-white pt-24 pb-16">
                <TeacherSessionClient sessionCode={code} sessionId={validation.sessionId} sessionData={sessionData} />
            </div>
        </MainLayoutWrapper>
    );
}
