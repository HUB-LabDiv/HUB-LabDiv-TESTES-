'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleDeepCleanup } from '@/utils/deepCleanup';
import { toast } from 'react-hot-toast';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmText !== 'EXCLUIR') {
      toast.error('Por favor, digite EXCLUIR para confirmar.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Chamar API Route segura (uses service_role via backend)
      const res = await fetch('/api/account/delete', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Falha ao processar exclusão no servidor.');
      }

      // 2. Deep Cleanup (Navegador local) - Lado do Cliente
      await handleDeepCleanup();

      toast.success('Sua conta foi excluída permanentemente. Adeus, pesquisador(a).');
      
      // 3. Redirecionar para home e recarregar
      router.push('/');
      setTimeout(() => window.location.reload(), 500);
      
    } catch (error: any) {
      console.error(error);
      toast.error('Um erro crítico ocorreu. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#1E1E1E] border border-red-500/30 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10">
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <h2 className="text-xl font-bold tracking-tight">ZONA DE PERIGO</h2>
          </div>

          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              Você está prestes a <span className="text-white font-semibold">excluir permanentemente</span> sua conta no HUB Lab-Div.
            </p>
            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl space-y-2">
              <p className="flex gap-2">
                <span className="text-red-400">•</span> 
                Sua identidade será removida e dados sensíveis apagados.
              </p>
              <p className="flex gap-2">
                <span className="text-red-400">•</span> 
                <span>Suas contribuições no acervo científico (Artigos e Drops) serão <span className="text-white">anonimizadas</span> mas mantidas sob licença <span className="text-white">CC BY 4.0</span>.</span>
              </p>
              <p className="flex gap-2">
                <span className="text-red-400">•</span> 
                Esta ação é irreversível. Não poderemos recuperar seus dados.
              </p>
            </div>

            <div className="pt-2">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Digite "EXCLUIR" no campo abaixo para prosseguir:
              </label>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="EXCLUIR"
                className="w-full bg-black/40 border border-[#333] rounded-xl px-4 py-3 outline-none focus:border-red-500/50 transition-colors text-white placeholder:text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="flex border-t border-[#333]">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 text-sm font-medium hover:bg-white/5 transition-colors border-r border-[#333]"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleDelete}
            disabled={confirmText !== 'EXCLUIR' || isLoading}
            className="flex-1 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            {isLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
}
