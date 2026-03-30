'use client';

import React from 'react';
import { Flag } from 'lucide-react';
import { useNavigationStore } from '@/store/useNavigationStore';

export function ReportButton({ submissionId }: { submissionId: string }) {
    const { openContentReport } = useNavigationStore();

    return (
        <button
            onClick={() => openContentReport(submissionId)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-xl font-bold text-xs hover:bg-brand-red/20 transition-all group"
            title="Reportar Erro ou Problema"
        >
            <Flag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline uppercase tracking-tight">Reportar</span>
        </button>
    );
}
