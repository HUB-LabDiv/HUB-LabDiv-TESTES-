'use client';

import { useState } from 'react';
import { exportUserData } from '@/app/actions/account';
import { DeleteAccountModal } from '@/components/modals/DeleteAccountModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { toast } from 'react-hot-toast';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Share2, User, Download, Trash2, ShieldCheck } from 'lucide-react';

export default function ContaPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

    const handleShare = async () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${origin}/lab?user=${user?.id}`;
        const title = profile?.full_name ? `Laboratório de ${profile.full_name} | HUB Lab-Div` : 'Meu Laboratório | HUB Lab-Div';

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: `Confira o laboratório de ${profile?.full_name || 'pesquisa'} no HUB Lab-Div!`,
                    url
                });
                toast.success('Link compartilhado!');
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success('Link copiado para a área de transferência!');
            } catch (err) {
                console.error('Failed to copy text:', err);
                toast.error('Não foi possível copiar o link.');
            }
        }
    };

    if (loading) {
        return (
            <MainLayoutWrapper userId={user?.id}>
                <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-12 animate-pulse">
                    <div className="h-8 w-64 bg-gray-200 dark:bg-white/5 rounded-lg mb-4" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded-lg mb-12" />
                    <div className="h-40 w-full bg-gray-100 dark:bg-white/5 rounded-2xl" />
                </div>
            </MainLayoutWrapper>
        );
    }

    return (
        <MainLayoutWrapper userId={user?.id}>
            <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <header className="space-y-3">
                    <h1 className="text-3xl font-bukra font-black tracking-tight text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-brand-blue text-4xl">manage_accounts</span>
                        Conta & Privacidade
                    </h1>
                    <p className="text-gray-400 font-medium">
                        Gerencie sua identidade, privacidade e conformidade com a LGPD no HUB.
                    </p>
                </header>

                {/* SEÇÃO 0: PERFIL E COMPARTILHAMENTO */}
                <section className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl overflow-hidden p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
                                <User className="w-8 h-8 text-brand-blue" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-white">Seu Laboratório</h2>
                                <p className="text-sm text-gray-400">
                                    {(profile?.use_nickname && profile?.username) ? profile.username : (profile?.full_name || user?.email)}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest"
                                id="btn-edit-profile"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Editar Perfil
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue-hover shadow-lg shadow-brand-blue/20 transition-all active:scale-95 text-xs uppercase tracking-widest border border-white/10"
                                id="btn-share-profile"
                            >
                                <Share2 size={16} />
                                Compartilhar
                            </button>
                        </div>
                    </div>
                </section>

                {/* SEÇÃO 1: PORTABILIDADE DE DADOS */}
                <section className="bg-[#1E1E1E] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-md">
                            <div className="flex items-center gap-2 text-brand-yellow">
                                <Download size={20} />
                                <h2 className="text-xl font-bold uppercase tracking-tight">Portabilidade (Takeout)</h2>
                            </div>
                            <p className="text-sm text-gray-400">
                                Baixe uma cópia de todos os seus dados coletados pela plataforma HUB Lab-Div em formato JSON estruturado.
                            </p>
                        </div>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all active:scale-95 whitespace-nowrap shadow-xl"
                            id="btn-export-data"
                        >
                            <Download size={20} />
                            {isExporting ? 'Processando...' : 'Baixar Dados'}
                        </button>
                    </div>
                </section>

                {/* SEÇÃO 2: ZONA DE PERIGO */}
                <section className="bg-red-500/5 border border-red-500/10 rounded-2xl overflow-hidden p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-md">
                            <div className="flex items-center gap-2 text-brand-red">
                                <Trash2 size={20} />
                                <h2 className="text-xl font-bold uppercase tracking-tight">Zona de Perigo</h2>
                            </div>
                            <p className="text-sm text-gray-400 italic">
                                Excluir sua conta é definitivo. Dados de identificação serão apagados; contribuições científicas serão anonimizadas.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsDeleting(true)}
                            className="px-6 py-3 border border-red-500/20 text-red-500 font-bold rounded-xl hover:bg-red-500/10 transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-widest"
                            id="btn-delete-account"
                        >
                            <Trash2 size={16} />
                            Excluir Conta
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-red-500/10 flex gap-4 text-xs text-red-400/60 leading-relaxed italic">
                        <ShieldCheck size={16} className="shrink-0" />
                        <p>
                            Nota Legal: Conteúdos sob a licença Creative Commons BY 4.0 não serão removidos, apenas desvinculados de sua identidade pessoal (reatribuição ao perfil anônimo).
                        </p>
                    </div>
                </section>

                <DeleteAccountModal
                    isOpen={isDeleting}
                    onClose={() => setIsDeleting(false)}
                />

                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        window.location.reload();
                    }}
                />
            </div>
        </MainLayoutWrapper>
    );
}
