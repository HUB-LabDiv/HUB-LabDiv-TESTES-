/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

const BUILD_ID = 'self.__BUILD_ID__';
/**
 * Hub de Comunicação Científica - V6.4.1
 * Estratégia de Cache Otimizada: Network-First para Páginas & RSC, Cache-First para Assets
 * Resiliência Total Offline com Fallback Autônomo e Proteção contra Tela Preta
 */

const CACHE_NAME = `labdiv-hub-${BUILD_ID}`;

const ASSET_EXTENSIONS = ['.js', '.css', '.woff', '.woff2', '.ttf', '.otf'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];

const BYPASS_ROUTES = [
    '/admin',
    '/api/admin',
    '/auth',
    '/login'
];

const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
    '/',
    '/offline.html',
    '/icone-HUBLabDiv.svg',
    '/labdiv-logo.png',
    '/manifest.json',
    '/icons/icon-192.webp',
    '/icons/icon-512.webp',
    '/gcif',
    '/gcif/instituto',
    '/gcif/wiki',
    '/gcif/interativo',
    '/ferramentas',
    '/lab'
];

try {
    self.addEventListener('install', (event) => {
        event.waitUntil(
            caches.open(CACHE_NAME).then(async (cache) => {
                // Precache seguro e atômico (uma falha individual não invalida os demais)
                const cachePromises = PRECACHE_ASSETS.map(async (asset) => {
                    try {
                        const response = await fetch(asset, { cache: 'reload' });
                        if (response.ok) {
                            await cache.put(asset, response);
                        }
                    } catch (err) {
                        console.warn(`⚠️ [SW] Falha ao precachear ${asset}:`, err.message);
                    }
                });
                await Promise.all(cachePromises);
            })
        );
        self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
        event.waitUntil(
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
                );
            })
        );
        self.clients.claim();
    });

    self.addEventListener('fetch', (event) => {
        const { request } = event;
        if (request.method !== 'GET') return;

        const url = new URL(request.url);

        // 1. NETWORK-ONLY: Admin, Auth & Rotas de Bypass
        if (BYPASS_ROUTES.some(route => url.pathname.startsWith(route))) {
            if (request.mode === 'navigate') {
                event.respondWith(
                    fetch(request).catch(() => caches.match(OFFLINE_URL))
                );
            }
            return;
        }

        // 2. NETWORK-FIRST: Navegações HTML e Dados Dinâmicos do Next.js (RSC)
        const isNavigate = request.mode === 'navigate';
        const isRscData = url.searchParams.has('_rsc') || url.pathname.startsWith('/_next/data/');
        const isPageFetch = (request.headers.get('accept') || '').includes('text/html') ||
                            ['/gcif', '/ferramentas', '/lab', '/arquivo'].some(p => url.pathname.startsWith(p));

        if (isNavigate || isRscData || isPageFetch) {
            event.respondWith(
                fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.ok) {
                            const cacheCopy = networkResponse.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(request, cacheCopy));
                        }
                        return networkResponse;
                    })
                    .catch(async () => {
                        // 1. Tenta recuperar a URL exata do cache (com e sem query parameters)
                        let cached = await caches.match(request);
                        if (!cached) {
                            cached = await caches.match(request, { ignoreSearch: true });
                        }
                        if (!cached && url.pathname) {
                            cached = await caches.match(url.pathname);
                        }
                        if (cached) return cached;

                        // 2. Se for dados de Server Component (_rsc) e não estiver no cache:
                        // Retornamos status 503 para que o Next.js App Router realize um fallback suave
                        // de navegação via browser (window.location) em vez de crashar a árvore do React
                        if (isRscData) {
                            return new Response('', {
                                status: 503,
                                statusText: 'Service Unavailable'
                            });
                        }

                        // 3. Se for navegação de página (HTML)
                        if (isNavigate || isPageFetch) {
                            // Tenta entregar a App Shell do Next.js (raiz) para manter a navegação nativa offline
                            const homeCached = await caches.match('/');
                            if (homeCached) return homeCached;

                            const offlineStatic = await caches.match(OFFLINE_URL);
                            if (offlineStatic) return offlineStatic;
                        }

                        // Fallback geral
                        const fallbackHome = await caches.match('/');
                        if (fallbackHome) return fallbackHome;
                        
                        const fallbackOffline = await caches.match(OFFLINE_URL);
                        if (fallbackOffline) return fallbackOffline;

                        return new Response('Sem conexão com a internet', { status: 503, statusText: 'Service Unavailable' });
                    })
            );
            return;
        }

        // 3. CACHE-FIRST: Assets Estáticos Imutáveis (_next/static, fontes, scripts com hash)
        const isStaticAsset = url.pathname.startsWith('/_next/static/') || 
                              ASSET_EXTENSIONS.some(ext => url.pathname.endsWith(ext));

        if (isStaticAsset) {
            event.respondWith(
                caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    return fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.ok) {
                                const cacheCopy = networkResponse.clone();
                                caches.open(CACHE_NAME).then(cache => cache.put(request, cacheCopy));
                            }
                            return networkResponse;
                        })
                        .catch(() => {
                            // Resposta vazia segura para evitar Uncaught Promise Rejection em modo offline
                            return new Response('', { status: 408, headers: { 'Content-Type': 'text/plain' } });
                        });
                })
            );
            return;
        }

        // 4. STALE-WHILE-REVALIDATE: Imagens, Logos e Mídias Gerais (Incluindo otimizadas do Next.js)
        const isImage = IMAGE_EXTENSIONS.some(ext => url.pathname.endsWith(ext)) || url.pathname.startsWith('/_next/image');
        if (isImage) {
            event.respondWith(
                caches.open(CACHE_NAME).then(async (cache) => {
                    const cachedResponse = await cache.match(request);
                    const networkFetch = fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.ok) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => null);

                    return cachedResponse || networkFetch || new Response('', { status: 404 });
                }).catch(() => fetch(request).catch(() => new Response('', { status: 404 })))
            );
            return;
        }
    });

} catch (error) {
    console.error('🔴 [SW] Erro na inicialização do Service Worker:', error);
}
