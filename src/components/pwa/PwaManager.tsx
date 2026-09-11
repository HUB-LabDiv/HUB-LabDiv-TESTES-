'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { App } from '@capacitor/app';
import { flushOfflineQueueToSupabase } from '@/lib/offlineQueueManager';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';

export function PwaManager() {
    const [isOffline, setIsOffline] = useState(false);
    const router = useRouter();

    // Inicializa os listeners de Push Notifications nativas via Capacitor
    usePushNotifications();

    useEffect(() => {
        // Registra o Service Worker do PWA apenas em produção (em localhost, desregistra para evitar loops de reload)
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const isLocalhost = Boolean(
                window.location.hostname === 'localhost' ||
                window.location.hostname === '[::1]' ||
                window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
            );

            if (process.env.NODE_ENV === 'development') {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (const registration of registrations) {
                        registration.unregister();
                    }
                }).catch(() => {});
                return;
            }

            navigator.serviceWorker.register('/sw.js').then((reg) => {
                console.log('✅ [PWA] Service Worker ativo:', reg.scope);
                // Força verificação imediata de atualizações no deploy
                reg.update().catch(() => {});
            }).catch((err) => {
                console.warn('⚠️ [PWA] Falha ao registrar Service Worker:', err);
            });

            // Recarrega automaticamente de forma suave quando o novo SW assume o controle (novo deploy)
            let refreshing = false;
            const handleControllerChange = () => {
                if (refreshing) return;
                // Não recarrega automaticamente se estiver offline para evitar loops de reload
                if (!navigator.onLine) return;
                refreshing = true;
                toast.success('✨ Nova versão do HUB LabDiv instalada! Atualizando...', {
                    id: 'pwa-update-toast',
                    duration: 3000,
                    icon: '🚀'
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            };

            navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

            // Checa atualizações quando a aba volta ao foco
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    navigator.serviceWorker.getRegistration().then(reg => reg?.update()).catch(() => {});
                }
            };
            document.addEventListener('visibilitychange', handleVisibilityChange);

            return () => {
                navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, []);

    useEffect(() => {
        // Intercepta Deep Links do Widget (ex: hublabdiv://trilhas)
        const listener = App.addListener('appUrlOpen', (event) => {
            const urlString = event.url;
            if (urlString.startsWith('hublabdiv://')) {
                const path = urlString.replace('hublabdiv://', '');
                
                // Mapeia todos os atalhos dos Widgets
                if (path === 'comunidade') window.location.href = '/comunidade';
                else if (path === 'gcif') window.location.href = '/gcif';
                else if (path === 'enviar') window.location.href = '/enviar';
                else if (path === 'ferramentas') window.location.href = '/ferramentas';
                else if (path === 'menu') window.location.href = '/';
                else if (path === 'lab-pessoal') window.location.href = '/lab';
                else if (path === 'trilhas') window.location.href = '/ferramentas/trilhas';
                else window.location.href = `/${path}`;
            }
        });

        // --- INÍCIO: CACHE WARMER (Primeiro uso - Baixa Grade/Trilhas/Rascunho/GCIF) ---
        const warmerTimer = setTimeout(() => {
            if (process.env.NODE_ENV === 'development') return;
            if (typeof window !== 'undefined') {
                // Sincroniza o perfil do usuário para consulta offline imediata
                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (session?.user) {
                        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle().then(({ data }) => {
                            if (data) {
                                try {
                                    const profRecord = data as Record<string, unknown>;
                                    localStorage.setItem('hub_offline_profile', JSON.stringify({
                                        id: data.id,
                                        name: data.full_name || data.username || session.user.email,
                                        full_name: data.full_name,
                                        avatar_url: data.avatar_url,
                                        user_category: data.user_category,
                                        role: data.role,
                                        bio: data.bio,
                                        nusp: (profRecord.nusp as string) || (profRecord.usp_number as string) || '',
                                        institute: data.institute,
                                        course: data.course,
                                        research_line: (profRecord.research_line as string) || '',
                                        interests: data.interests || []
                                    }));
                                } catch {}
                            }
                        });
                    }
                }).catch(() => {});

                if ('caches' in window) {
                    const cacheMode = localStorage.getItem('hub_cache_mode') || 'full';
                    if (cacheMode !== 'full') {
                        console.log(`⚡ [Cache Warmer] Modo de cache [${cacheMode}]: pré-carregamento suspenso.`);
                        return;
                    }

                    const rotasCriticas = [
                        '/gcif',
                        '/gcif/wiki',
                        '/gcif/instituto',
                        '/gcif/interativo',
                        '/wiki/calouro',
                        '/wiki/bolsas',
                        '/wiki/pesquisa',
                        '/wiki/protecao',
                        '/wiki/ifusp',
                        '/wiki/carreira',
                        '/wiki/veteranos',
                        '/wiki/metodologia',
                        '/ferramentas', 
                        '/ferramentas/anotacoes',
                        '/ferramentas/trilhas', 
                        '/lab', 
                        '/arquivo',
                        '/offline'
                    ];
                    const rotasSecundarias = [
                        '/',
                        '/interacao',
                        '/drops',
                        '/perguntas'
                    ];
                    
                    console.log('🔥 [Cache Warmer] Pré-carregando rotas para uso offline...');
                    rotasCriticas.forEach(rota => {
                        // Prefetch via Next.js Router para garantir que o RSC payload seja baixado corretamente
                        router.prefetch(rota);
                    });

                    setTimeout(() => {
                        rotasSecundarias.forEach(rota => {
                            router.prefetch(rota);
                        });
                    }, 10000);
                }
            }
        }, 3000);

        return () => {
            listener.then(l => l.remove());
            clearTimeout(warmerTimer);
        };
    }, []);

    useEffect(() => {
        // Handle native online/offline events
        const handleOffline = () => {
            setIsOffline(true);
            const isNative = Capacitor.isNativePlatform();
            
            toast.error(
                isNative 
                    ? 'Você está offline. O CGIF e a Grade Horária (se sincronizada) estão disponíveis. Alterações serão salvas e enviadas ao reconectar.'
                    : 'Sem internet. Suas alterações serão salvas na fila offline (IndexedDB) e enviadas ao reconectar.', 
                {
                    id: 'offline-status',
                    duration: Infinity,
                    icon: '📵'
                }
            );
        };

        const handleOnline = async () => {
            setIsOffline(false);
            toast.success('Conexão restabelecida! Sincronizando fila offline...', {
                id: 'offline-status',
                duration: 4000,
                icon: '🟢'
            });

            // Processa a fila offline com limite estrito de 57 itens por batch
            try {
                const { processed, errors } = await flushOfflineQueueToSupabase();
                if (processed > 0) {
                    toast.success(`Fila offline sincronizada com o Supabase: ${processed} item(ns) salvos!`);
                }
                if (errors > 0) {
                    toast.error(`Falha ao sincronizar ${errors} item(ns) da fila offline.`);
                }
            } catch (err) {
                console.error('[PWA Manager] Erro ao sincronizar fila offline:', err);
            }
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        // Initial check
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            handleOffline();
        } else if (typeof navigator !== 'undefined' && navigator.onLine) {
            // Tenta processar qualquer item que sobrou da sessão anterior
            flushOfflineQueueToSupabase().catch(() => {});
        }

        // Listen for Service Worker messages
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'OFFLINE_CACHE_USED') {
                toast('Conexão instável. Mostrando versão em cache.', {
                    id: 'cache-used',
                    icon: '⚡',
                    duration: 5000,
                    style: {
                        background: '#334155',
                        color: '#f8fafc',
                    }
                });
            }
        };

        navigator.serviceWorker?.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
            navigator.serviceWorker?.removeEventListener('message', handleMessage);
        };
    }, []);

    return null;
}
