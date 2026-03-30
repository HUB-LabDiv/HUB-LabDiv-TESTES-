'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import { argon2id } from 'hash-wasm';
import { Search, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ParentalConsentPage() {
    const { token } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [tokenData, setTokenData] = useState<any>(null);
    const [cpf, setCpf] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [clientIp, setClientIp] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // Captura o IP para conformidade de rastro digital
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setClientIp(data.ip))
            .catch(() => setClientIp('IP-HIDDEN-OR-FAIL'));

        validateToken();
    }, [token]);

    const validateToken = async () => {
        try {
            const { data, error } = await supabase
                .from('parental_consent_tokens')
                .select('*, profiles(full_name, username)')
                .eq('token', token)
                .eq('status', 'pending')
                .single();

            if (error || !data) {
                toast.error('Link de consentimento inválido ou expirado.');
                return;
            }

            if (new Date(data.expires_at) < new Date()) {
                toast.error('Link expirado.');
                return;
            }

            setTokenData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        let masked = value;
        if (value.length > 9) {
            masked = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
        } else if (value.length > 6) {
            masked = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
        } else if (value.length > 3) {
            masked = `${value.slice(0, 3)}.${value.slice(3)}`;
        }
        setCpf(masked);
    };

    const handleConsent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accepted) {
            toast.error('Você precisa aceitar os termos de consentimento.');
            return;
        }

        setSubmitting(true);
        const rawCpf = cpf.replace(/\D/g, '');

        try {
            // 1. Validar Maioridade
            const birth = new Date(birthdate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
                age--;
            }

            if (age < 18) {
                toast.error('O responsável legal deve ser maior de 18 anos.');
                setSubmitting(false);
                return;
            }

            // 2. Validar CPF e Idade no Age Gate
            const cpfRes = await fetch('/api/auth/verify-cpf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf: rawCpf, birthdate }),
            });

            if (!cpfRes.ok) {
                toast.error('CPF do responsável inválido ou divergente.');
                setSubmitting(false);
                return;
            }

            const { cpfHash } = await cpfRes.json();

            // 3. Gerar Rastro de Consentimento (Hash de IP)
            const salt = new Uint8Array(16);
            crypto.getRandomValues(salt);
            const ipHash = await argon2id({
                password: clientIp,
                salt: salt,
                parallelism: 1,
                iterations: 2,
                memorySize: 65536,
                hashLength: 32,
                outputType: 'encoded',
            });

            // 4. Confirmar Consentimento no Backend
            const confirmRes = await fetch('/api/auth/parental-consent/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenId: tokenData.id,
                    childId: tokenData.child_id,
                    ipHash,
                    parentCpfHash: cpfHash
                })
            });

            const confirmData = await confirmRes.json();
            if (!confirmRes.ok) throw new Error(confirmData.error);

            toast.success('Consentimento registrado com sucesso!');
            router.push('/auth/success-consent');
        } catch (err: any) {
            toast.error(err.message || 'Erro ao processar consentimento.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-[#121212] text-[#0F4780]">Carregando portal de segurança...</div>;
    if (!tokenData) return <div className="min-h-screen flex items-center justify-center dark:bg-[#121212] text-red-500 font-bold">Link inválido ou expirado.</div>;

    const isFormValid = cpf.replace(/\D/g, '').length === 11 && birthdate !== '' && accepted;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
                {/* Cabeçalho da Carta */}
                <div className="bg-[#0F4780] p-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                        <ShieldCheck className="w-10 h-10 text-[#FFCC00]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Carta de Parceria Parental</h1>
                    <p className="text-blue-100 text-sm opacity-90">
                        Responsável pelo perfil de: <span className="font-bold text-[#FFCC00]">{tokenData.profiles?.full_name || tokenData.profiles?.username}</span>
                    </p>
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    {/* Mensagem Introdutória */}
                    <section className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p className="text-lg font-medium text-[#0F4780] dark:text-blue-300">
                            Olá! Que bom ter você e seu jovem pesquisador aqui no HUB Lab-Div.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-gray-100 dark:border-gray-800/50 shadow-sm transition-transform hover:scale-105">
                                <Search className="w-10 h-10 text-[#0F4780] mb-4" />
                                <h3 className="font-display font-bold text-base mb-3 text-[#0F4780] dark:text-blue-300 uppercase tracking-tighter">Perfil de Estudo</h3>
                                <p className="font-sans text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">Leitura, pesquisa e organização sem interações sociais.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-gray-100 dark:border-gray-800/50 shadow-sm transition-transform hover:scale-105">
                                <Mail className="w-10 h-10 text-[#0F4780] mb-4" />
                                <h3 className="font-display font-bold text-base mb-3 text-[#0F4780] dark:text-blue-300 uppercase tracking-tighter">Sempre Perto</h3>
                                <p className="font-sans text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">Receba atualizações de uso e dicas de segurança digital.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-gray-100 dark:border-gray-800/50 shadow-sm transition-transform hover:scale-105">
                                <ShieldCheck className="w-10 h-10 text-[#0F4780] mb-4" />
                                <h3 className="font-display font-bold text-base mb-3 text-[#0F4780] dark:text-blue-300 uppercase tracking-tighter">Supervisão</h3>
                                <p className="font-sans text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">Apoio para facilitar o diálogo e segurança digital em casa.</p>
                            </div>
                        </div>


                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#FFCC00] rounded-full"></span>
                                O que é o HUB?
                            </h2>
                            <p className="text-sm">
                                Este é um espaço de comunicação científica do IFUSP, onde abrimos as portas da universidade para o público. Aqui, o jovem terá um <strong>Perfil de Estudo (Read-Only)</strong>: ele poderá ler artigos, ver pesquisas e aprender sobre a organização da faculdade, mas as funções de interação social ficam desativadas para garantir sua total segurança.
                            </p>

                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 pt-2">
                                <span className="w-1.5 h-6 bg-[#0F4780] rounded-full"></span>
                                Nossa Parceria com Você
                            </h2>
                            <p className="text-sm">
                                Ao autorizar o acesso, guardaremos o seu e-mail de responsável. Faremos isso para manter você atualizado sobre como o jovem está explorando a plataforma e para enviar dicas de segurança digital. Aliás, <strong>convidamos você a também criar sua conta!</strong> Saber o que os filhos fazem na internet — aqui e em qualquer rede social — é o primeiro passo para uma navegação saudável.
                            </p>

                            <blockquote className="border-l-4 border-yellow-400 pl-4 py-2 mt-6 bg-yellow-50 dark:bg-yellow-900/10 italic text-sm text-gray-600 dark:text-gray-400">
                                <strong>Lembrete Importante:</strong> O ECA Digital e nossas travas de segurança são ferramentas de apoio, mas nada substitui o seu olhar e orientação. A responsabilidade de supervisionar a jornada digital do jovem ainda é sua.
                            </blockquote>

                            <div className="mt-8">
                                <a 
                                    href="/labdiv?tab=sobre" 
                                    target="_blank" 
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-transparent border-2 border-[#0F4780] text-[#0F4780] dark:text-blue-300 rounded-xl font-bold hover:bg-[#0F4780] hover:text-white transition-all text-sm group"
                                >
                                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Conhecer a plataforma antes de liberar
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Formulário de Validação */}
                    <form onSubmit={handleConsent} className="mt-12 space-y-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                                    Seu CPF <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={handleCpfChange}
                                    placeholder="000.000.000-00"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-xl dark:text-white outline-hidden focus:border-[#0F4780] transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                                    Nascimento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-xl dark:text-white outline-hidden focus:border-[#0F4780] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Checkbox de Aceite */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Declaração de Responsabilidade</p>
                            <label className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${accepted ? 'border-[#0F4780] bg-[#0F4780]/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1A1A]'}`}>
                                <div className="relative flex items-center mt-1">
                                    <input 
                                        type="checkbox" 
                                        checked={accepted}
                                        onChange={(e) => setAccepted(e.target.checked)}
                                        className="sr-only" 
                                    />
                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${accepted ? 'bg-[#0F4780] border-[#0F4780]' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>
                                        {accepted && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Ao clicar em <strong>'Conceder Autorização'</strong>, confirmo ser o responsável legal, entendo que o perfil será de apenas leitura e autorizo o registro do meu e-mail para avisos de segurança.
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid || submitting}
                            className={`w-full py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${isFormValid ? 'bg-[#0F4780] hover:bg-[#0c3966] text-white transform hover:scale-[1.01] active:scale-95' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
                        >
                            {submitting ? 'Validando Parceria...' : 'Conceder Autorização e Liberar Acesso'}
                        </button>
                    </form>
                </div>
                
                {/* Rodapé da Carta */}
                <div className="bg-gray-50 dark:bg-[#1A1A1A] p-6 text-center border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-loose">
                        HUB Lab-Div &bull; IFUSP &bull; Laboratório de Comunicação Científica <br/>
                        Em conformidade com a LGPD (Lei 13.709/18) e o ECA (Lei 8.069/90)
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
