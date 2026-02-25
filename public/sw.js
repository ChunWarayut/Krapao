// Krapao Service Worker v1
// Provides offline support and caching for the Krapao app

const CACHE_NAME = 'krapao-v1';
const STATIC_ASSETS = [
    '/',
    '/dashboard',
    '/transactions',
    '/pockets',
    '/goals',
    '/settings',
];

// ============================================================
// Install — pre-cache static routes
// ============================================================
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching static assets');
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                // Non-fatal: skip pages we can't cache during install
                console.warn('[SW] Pre-cache error (non-fatal):', err);
            });
        })
    );
    // Activate immediately without waiting for old SW to retire
    self.skipWaiting();
});

// ============================================================
// Activate — clear old caches
// ============================================================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    })
            )
        )
    );
    // Claim all clients immediately
    self.clients.claim();
});

// ============================================================
// Fetch — Network-first strategy with cache fallback
// ============================================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle same-origin GET requests
    if (request.method !== 'GET' || url.origin !== location.origin) return;

    // Skip Next.js internal requests (HMR, webpack, etc.)
    if (url.pathname.startsWith('/_next/')) return;

    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                // Cache successful HTML responses
                if (networkResponse.ok && request.headers.get('accept')?.includes('text/html')) {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Network failed — try cache
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[SW] Serving from cache:', request.url);
                        return cachedResponse;
                    }
                    // Final fallback: return a simple offline page
                    return new Response(
                        `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>Krapao - Offline</title>
            <style>
              body { font-family: system-ui; display: flex; align-items: center; justify-content: center;
                     min-height: 100vh; margin: 0; background: #0B1120; color: #F1F5F9; text-align: center; }
              h1 { font-size: 2rem; font-weight: 900; color: #10b981; }
              p { color: #94A3B8; margin-top: 0.5rem; }
            </style></head>
            <body><div><h1>Krapao</h1><p>ไม่มีการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อของคุณ</p></div></body></html>`,
                        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                    );
                });
            })
    );
});

// ============================================================
// Message — handle skip-waiting from client
// ============================================================
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
