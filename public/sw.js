/*
 * daily.place service worker (hand-written, no build step).
 *
 * - Hashed build assets, sounds, images and fonts: cache first.
 * - Pages: network first, falling back to the cached copy when offline.
 * - Cross-origin requests (auth, sync, analytics, players) and /api are not handled.
 *
 * It replaces a Workbox-generated worker that was served from this same URL, so
 * activation deletes every cache this version doesn't own (including Workbox's).
 * Bump VERSION to drop all caches on the next deploy.
 */
const VERSION = 'v1';
const STATIC_CACHE = `static-${VERSION}`;
const PAGES_CACHE = `pages-${VERSION}`;
const OWN_CACHES = [STATIC_CACHE, PAGES_CACHE];

// Hashed files of old deploys pile up in the static cache: keep the newest entries only
const MAX_STATIC_ENTRIES = 300;
const MAX_PAGE_ENTRIES = 30;

const STATIC_FILE = /\.(?:js|css|woff2?|ttf|otf|png|jpe?g|gif|svg|webp|ico|mp3|wav|ogg)$/i;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(PAGES_CACHE)
            .then((cache) => cache.add('/'))
            .catch(() => undefined)
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(keys.filter((key) => !OWN_CACHES.includes(key)).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

const trimCache = async (cacheName, maxEntries) => {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)));
};

const putInCache = async (cacheName, request, response, maxEntries) => {
    // Only complete, same-origin responses (no partial audio ranges, no errors)
    if (response.status !== 200 || response.type !== 'basic') return;
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
    await trimCache(cacheName, maxEntries);
};

const cacheFirst = async (event) => {
    const cached = await caches.match(event.request);
    if (cached) return cached;

    const response = await fetch(event.request);
    event.waitUntil(putInCache(STATIC_CACHE, event.request, response.clone(), MAX_STATIC_ENTRIES));
    return response;
};

const networkFirst = async (event) => {
    try {
        const response = await fetch(event.request);
        event.waitUntil(putInCache(PAGES_CACHE, event.request, response.clone(), MAX_PAGE_ENTRIES));
        return response;
    } catch (error) {
        const cached = (await caches.match(event.request)) ?? (await caches.match('/'));
        if (cached) return cached;
        throw error;
    }
};

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) return;
    if (url.pathname.startsWith('/api/') || request.headers.has('range')) return;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(event));
    } else if (url.pathname.startsWith('/_next/static/') || STATIC_FILE.test(url.pathname)) {
        event.respondWith(cacheFirst(event));
    }
});
