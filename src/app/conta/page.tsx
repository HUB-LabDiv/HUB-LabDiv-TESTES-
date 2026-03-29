'use client';

import { useState } from 'react';
import { exportUserData } from '@/app/actions/account';
import { DeleteAccountModal } from '@/components/modals/DeleteAccountModal';
import { toast } from 'react-hot-toast';

export default function ContaPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hub-labdiv-takeout-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Seus dados foram exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar dados. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Configurações de Conta</h1>
        <p className="text-gray-400">
          Gerencie sua privacidade, segurança e conformidade com a LGPD.
        </p>
      </header>

      {/* SEÇÃO 1: PORTABILIDADE DE DADOS */}
      <section className="bg-[#1E1E1E] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-semibold text-white">Portabilidade (Takeout)</h2>
            <p className="text-sm text-gray-400">
              Baixe uma cópia de todos os seus dados coletados pela plataforma HUB Lab-Div em formato JSON estruturado.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all active:scale-95 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            {isExporting ? 'Processando...' : 'Baixar meus dados'}
          </button>
        </div>
      </section>

      {/* SEÇÃO 2: ZONA DE PERIGO */}
      <section className="bg-red-500/5 border border-red-500/10 rounded-2xl overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              <h2 className="text-xl font-bold uppercase tracking-tight">Zona de Perigo</h2>
            </div>
            <p className="text-sm text-gray-400">
              Excluir sua conta é um processo definitivo. Suas informações pessoais serão apagadas e seu conteúdo científico será anonimizado de acordo com nossas <span className="text-white underline cursor-help">regras de retenção</span>.
            </p>
          </div>
          <button
            onClick={() => setIsDeleting(true)}
            className="px-6 py-3 border border-red-500/20 text-red-500 font-bold rounded-xl hover:bg-red-500/10 transition-all active:scale-95"
          >
            Excluir minha conta
          </button>
        </div>

        {/* Informação adicional sobre a licença científica */}
        <div className="mt-8 pt-6 border-t border-red-500/10 flex gap-4 text-xs text-red-400/60 leading-relaxed italic">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <p>
            Nota Legal: Para garantir a integridade da ciência aberta e o histórico de discussões acadêmicas, conteúdos publicados sob a licença Creative Commons BY 4.0 não serão removidos, apenas desvinculados de sua identidade pessoal (anonimização por reatribuição ao perfil anonimo).
          </p>
        </div>
      </section>

      <DeleteAccountModal 
        isOpen={isDeleting} 
        onClose={() => setIsDeleting(false)} 
      />
    </div>
  );
}
