'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import { HubLogo } from '@/components/shared/HubLogo';
import { TermsOfUse } from '@/components/auth/TermsOfUse';

export default function ReAcceptTermsPage() {
    const [cpf, setCpf] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [guardianEmail, setGuardianEmail] = useState('');
    const [isMinor, setIsMinor] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showCookiesCard, setShowCookiesCard] = useState(false);
    const [loading, setLoading] = useState(false);
    const todayStr = new Date().toISOString().split('T')[0];


    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Máscara de CPF simples: 000.000.000-00
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

    const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setBirthdate(date);
        
        if (date) {
            const birth = new Date(date);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            setIsMinor(age < 18);
        } else {
            setIsMinor(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!termsAccepted) {
            toast.error('Você deve ler e aceitar os Termos de Uso e a Política de Privacidade (v2.0).');
            return;
        }

        const rawCpf = cpf.replace(/\D/g, '');
        if (rawCpf.length < 11) {
            toast.error('CPF incompleto.');
            return;
        }

        if (!birthdate) {
            toast.error('Data de nascimento é obrigatória.');
            return;
        }

        setLoading(true);

        try {
            // 1. Validate CPF (BrasilAPI + Argon2id)
            const cpfRes = await fetch('/api/auth/verify-cpf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    cpf: rawCpf, 
                    birthdate,
                    guardianEmail: isMinor ? guardianEmail : undefined
                }),
            });


            const cpfData = await cpfRes.json();
            
            if (!cpfRes.ok) {
                toast.error(cpfData.error || 'Falha ao validar CPF.');
                setLoading(false);
                return;
            }

            // 2. Refresh de Sessão para Perfil
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Falha de Sessão');

            if (isMinor) {
                toast.success('Dados enviados! Agora seu responsável deve autorizar o acesso via link enviado ao e-mail dele.');
                router.push('/auth/pending-consent');
            } else {
                toast.success('Regularização concluída! Redirecionando...');
                window.location.href = '/';
            }

        } catch (err) {
            console.error(err);
            toast.error('Ocorreu um erro na atualização do servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen py-10 items-center justify-center p-4 bg-gray-50 dark:bg-[#121212] font-open-sans">
            <div className="w-full max-w-3xl space-y-8 bg-white dark:bg-[#1E1E1E] p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                <div className="flex flex-col items-center text-center space-y-4">
                    <HubLogo size={64} className="mb-2" />

                    <h1 className="text-3xl font-bukra font-bold text-[#0F4780] dark:text-[#0F4780] tracking-tight leading-tight">
                        Termos e Política de Privacidade
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto leading-relaxed font-open-sans">
                        Para garantir total transparência e conformidade com a <strong>LGPD, ECA e Marco Civil da Internet</strong>, 
                        você deve aceitar os novos <strong className="text-gray-900 dark:text-gray-100 italic">Termos de Uso e Política de Privacidade (v2.0)</strong>, 
                        incluindo a licença <strong className="text-gray-900 dark:text-gray-100">(CC BY 4.0)</strong> e realizar nossa verificação demográfica via BrasilAPI.
                    </p>
                </div>

                {/* Termos de Uso */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                      <TermsOfUse 
                        acceptedVersion={termsAccepted ? 'v2.0' : ''}
                        onAccept={() => {
                            setTermsAccepted(true);
                            toast.success('Termos aceitos!');
                        }}
                      />
                </div>

                {/* Botão de Cookies (Entre Cards) */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => setShowCookiesCard(!showCookiesCard)}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-[11px] border-2 border-dashed ${
                            showCookiesCard 
                            ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">{showCookiesCard ? 'visibility_off' : 'cookie'}</span>
                        {showCookiesCard ? 'Fechar Detalhes de Cookies' : 'Rever cookies aceitos'}
                    </button>

                    {showCookiesCard && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/30 p-6 rounded-2xl animate-in zoom-in-95 duration-300">
                             <h5 className="text-[11px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">verified_user</span>
                                O que guardamos no seu navegador?
                            </h5>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/10">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Chave de Acesso (Login)</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Serve para o site te reconhecer e não pedir sua senha toda hora.</p>
                                    </div>
                                    <span className="text-[10px] bg-amber-200/50 dark:bg-amber-900/50 px-2 py-1 rounded-lg font-black text-amber-700 dark:text-amber-400 uppercase">Essencial</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/10">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Suas Preferências</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Lembra se você aceitou os termos e desligou os rastreadores.</p>
                                    </div>
                                    <span className="text-[10px] bg-amber-200/50 dark:bg-amber-900/50 px-2 py-1 rounded-lg font-black text-amber-700 dark:text-amber-400 uppercase">Memória</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/10">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Tranca de Segurança</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Protege sua conta contra invasores e ataques digitais.</p>
                                    </div>
                                    <span className="text-[10px] bg-amber-200/50 dark:bg-amber-900/50 px-2 py-1 rounded-lg font-black text-amber-700 dark:text-amber-400 uppercase">Segurança</span>
                                </div>
                            </div>
                            <p className="mt-4 text-[11px] text-amber-600 dark:text-amber-400 italic text-center font-medium">
                                * Nenhum destes arquivos pode ser desligado, pois o site para de funcionar sem eles.
                            </p>
                        </div>
                    )}
                </div>

                {/* Política de Privacidade e Telemetria (Somente para Maiores) */}
                <div className={`rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
                    !birthdate 
                    ? 'bg-gray-50/50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800 opacity-60 grayscale' 
                    : isMinor 
                        ? 'bg-red-50/5 border-red-100 dark:border-red-900/20' 
                        : privacyAccepted 
                            ? 'bg-brand-blue/5 border-brand-blue shadow-xl shadow-brand-blue/5'
                            : 'bg-white dark:bg-[#1E1E1E] border-brand-blue/40 shadow-lg'
                }`}>
                    {/* Header da Política */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                !birthdate ? 'bg-gray-200 dark:bg-gray-700' : isMinor ? 'bg-red-500 text-white' : 'bg-brand-blue text-white'
                            }`}>
                                <span className="material-symbols-outlined text-xl">
                                    {!birthdate ? 'lock' : isMinor ? 'child_care' : 'verified_user'}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Política de Privacidade</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                    {isMinor ? 'Proteção Especial ECA Ativada' : 'Consentimento de Processamento de Dados'}
                                </p>
                            </div>
                        </div>
                        {isMinor && birthdate && (
                             <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded uppercase">Blindagem Ativa</span>
                        )}
                        {!isMinor && birthdate && privacyAccepted && (
                             <span className="px-2 py-0.5 bg-green-500 text-white text-[9px] font-black rounded uppercase">Validado</span>
                        )}
                    </div>

                    {/* Conteúdo Explicativo (Scrollable like Terms) */}
                    <div className="p-6 max-h-[350px] overflow-y-auto space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed thin-scrollbar">
                        {isMinor ? (
                            <div className="space-y-4">
                                <section className="p-4 bg-red-100/10 border border-red-200/30 rounded-xl">
                                    <h5 className="text-red-500 font-bold mb-2 uppercase text-xs">Proteção de Menores (ECA/LGPD)</h5>
                                    <p>Identificamos que você é menor de idade. Como o HUB Lab-Div prioriza a segurança total da criança e do adolescente, todos os sensores de telemetria comportamental externa (Microsoft Clarity) foram <strong>desativados permanentemente</strong> para o seu acesso.</p>
                                </section>
                                <section>
                                    <h5 className="text-gray-900 dark:text-white font-bold mb-2">O que coletamos?</h5>
                                    <p>Apenas dados estritamente necessários para a autenticação técnica e registro de atividade acadêmica de forma anônima. Não rastreamos seus movimentos fora do que é essencial para o fluxo de ensino.</p>
                                </section>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <section>
                                    <h5 className="text-gray-900 dark:text-white font-bold mb-2 text-base">1. Fluxo de Interação e Telemetria</h5>
                                    <p>Este consentimento autoriza a coleta de dados de navegação para otimizar nossa <strong>UX (Experiência do Usuário)</strong>. Os dados fluem do seu <strong>Frontend</strong> (a interface que você vê) para ferramentas de análise como o <strong>Microsoft Clarity</strong> e nosso banco de dados <strong>Supabase</strong>, permitindo identificar gargalos técnicos e melhorar a acessibilidade.</p>
                                </section>

                                <section className="p-5 bg-zinc-100 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-colors">
                                    <h5 className="text-brand-blue dark:text-blue-400 font-bold mb-4 uppercase text-xs flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">menu_book</span>
                                        Glossário Técnico do HUB
                                    </h5>
                                    <div className="space-y-4 font-medium text-zinc-700 dark:text-zinc-300">
                                        <div className="flex gap-3">
                                            <span className="text-brand-blue dark:text-blue-500 mt-1">•</span>
                                            <p><strong className="text-zinc-900 dark:text-white">Frontend:</strong> É a "capa" do site. Tudo o que você vê, clica e interage no seu navegador ou celular.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-brand-blue dark:text-blue-500 mt-1">•</span>
                                            <p><strong className="text-zinc-900 dark:text-white">UX (User Experience):</strong> É o estudo de como tornar o site fácil e agradável. Exemplos: botões bem posicionados e tempos de carga rápidos.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-brand-blue dark:text-blue-500 mt-1">•</span>
                                            <p><strong className="text-zinc-900 dark:text-white">APIs:</strong> São como "garçons" que levam pedidos do site para os servidores e trazem as respostas (ex: buscar sua foto de perfil).</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-brand-blue dark:text-blue-500 mt-1">•</span>
                                            <p><strong className="text-zinc-900 dark:text-white">Microsoft Clarity:</strong> Ferramenta que gera "mapas de calor", mostrando onde os usuários mais clicam, ajudando a detectar botões que não funcionam.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-brand-blue dark:text-blue-500 mt-1">•</span>
                                            <p><strong className="text-zinc-900 dark:text-white">Supabase:</strong> Nosso "arquivo digital" seguro, onde guardamos suas preferências, posts e configurações de perfil com criptografia.</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h5 className="text-gray-900 dark:text-white font-bold mb-2 text-base">2. Direitos do Titular (LGPD)</h5>
                                    <p>Você tem total controle sobre seus dados. Usamos anonimização para que seu comportamento não seja vinculado à sua identidade real em relatórios de performance, garantindo que o foco permaneça 100% no aprimoramento científico da plataforma.</p>
                                </section>
                            </div>
                        )}
                    </div>

                    {/* Ação de Aceite */}
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#121212]">
                        {!birthdate ? (
                            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase italic py-4">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Preencha sua data de nascimento abaixo para liberar este campo
                            </div>
                        ) : isMinor ? (
                            <div className="p-3 bg-red-100/30 border border-red-200 dark:border-red-900/20 rounded-xl flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-500 text-lg">verified</span>
                                <p className="text-[10px] text-red-600 dark:text-red-400 font-bold leading-tight">
                                    Política de Proteção de Menores aplicada. Você pode prosseguir com a regularização sem sensores de telemetria.
                                </p>
                            </div>
                        ) : (
                             <button
                                type="button"
                                onClick={() => {
                                    setPrivacyAccepted(!privacyAccepted);
                                    if (!privacyAccepted) {
                                        localStorage.setItem('cookie_consent', 'true');
                                        window.dispatchEvent(new Event('cookie_consent_changed'));
                                        toast.success('Política de Privacidade Aceita!');
                                    } else {
                                        localStorage.setItem('cookie_consent', 'false');
                                        window.dispatchEvent(new Event('cookie_consent_changed'));
                                    }
                                }}
                                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all font-bold text-sm ${
                                    privacyAccepted 
                                    ? 'bg-brand-blue border-brand-blue text-white shadow-xl shadow-brand-blue/30 scale-[1.01]' 
                                    : 'bg-white dark:bg-gray-800 border-brand-blue text-brand-blue hover:bg-brand-blue/5 animate-pulse-subtle'
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">{privacyAccepted ? 'check_circle' : 'draw_abstract'}</span>
                                {privacyAccepted ? 'Privacidade e Telemetria Aceita' : 'Li e Aceito a Política de Privacidade'}
                            </button>
                        )}
                    </div>
                </div>


                {/* Gatekeeper Check Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-gray-50 p-6 rounded-xl dark:bg-[#151515] border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-yellow-500 dark:text-[#FFCC00]">
                        <span className="material-symbols-outlined text-xl">security</span>
                        <h3 className="font-bold text-lg">Proteção de Dados: Verificação de Identidade <span className="text-[10px] opacity-70">(a verificação de idade é para cumprir a lei do eca digital)</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                                CPF (Apenas Consulta)
                            </label>
                            <input
                                type="text"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={handleCpfChange} 
                                required
                                className="w-full px-4 py-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-[#0F4780] outline-hidden"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                                Data de Nascimento
                            </label>
                            <input
                                type="date"
                                value={birthdate}
                                onChange={handleBirthdateChange}
                                max={todayStr}
                                required

                                className="w-full px-4 py-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-[#0F4780] outline-hidden"
                                disabled={loading}
                            />
                        </div>
                    </div>

                        {/* Campo condicional para Responsável Legal (ECA/LGPD) */}
                        {isMinor && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#F14343] dark:text-[#F14343]">
                                    E-mail do Responsável Legal (Obrigatório para menores de 18 anos)
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="email@responsavel.com.br"
                                        value={guardianEmail}
                                        onChange={(e) => setGuardianEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border-2 border-[#F14343] rounded-md dark:bg-gray-800 dark:text-white focus:border-[#F14343] animate-pulse-subtle"
                                        disabled={loading}
                                    />
                                </div>
                                <p className="mt-2 text-[10px] text-gray-500 italic">
                                    * Em conformidade com o Estatuto da Criança e do Adolescente (ECA), o acesso para menores requer validação parental.
                                </p>
                            </div>
                        )}


                        <div className="bg-blue-50 dark:bg-[#0F4780]/10 border-l-4 border-[#0F4780] p-4 text-sm text-gray-700 dark:text-gray-300">
                            <p>
                                <strong>Transparência LGPD:</strong> Seu CPF é verificado em tempo real via 
                                base governamental (BrasilAPI) e <strong>descartado de toda memória RAM (tanto do seu dispositivo quanto de nossos servidores na Vercel e Supabase) instantaneamente</strong>. 
                                Não armazenamos números de documentos em bancos de dados, apenas um rastro criptografado irreversível (<strong>Argon2id</strong>).
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-[#0F4780] hover:bg-[#0c3966] text-white py-4 rounded-2xl font-bukra font-bold text-lg transition-all transform hover:shadow-xl hover:shadow-brand-blue/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                            disabled={loading || cpf.replace(/\D/g, '').length < 11 || !birthdate || !termsAccepted || (!isMinor && !privacyAccepted) || (isMinor && !guardianEmail)}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Validando...
                                </span>
                            ) : (
                                'Concluir Regularização'
                            )}
                        </button>
                    </form>

                    {/* Botão de Saída (Logar Depois) */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = '/';
                            }}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors py-2"
                        >
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Continuar como convidado (Logar depois)
                        </button>
                    </div>
                
            </div>
        </main>
    );
}
