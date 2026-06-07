// ─── ZenGastos Service Worker v2 ─────────────────────────────
const CACHE_NAME = 'zengastos-v2';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
];

const CDN_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com',
];

// ── Install: precache shell ───────────────────────────────────
self.addEventListener('install', e => {
  console.log('[SW] ZenGastos v2 — instalando');
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ────────────────────────────────
self.addEventListener('activate', e => {
  console.log('[SW] ZenGastos v2 — activando');
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Eliminando caché antigua:', k);
          return caches.delete(k);
        })
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: routing strategies ─────────────────────────────────
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.protocol === 'blob:') return;

  // Same origin → Cache-first (offline-capable)
  if (url.origin === self.location.origin) {
    e.respondWith(cacheFirst(request));
    return;
  }

  // CDN assets → Stale-while-revalidate
  if (CDN_ORIGINS.some(o => url.href.startsWith(o))) {
    e.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Everything else → Network-first
  e.respondWith(networkFirst(request));
});

// ── Strategies ────────────────────────────────────────────────

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(CACHE_NAME)).put(req, res.clone());
    return res;
  } catch {
    return new Response(`
      <!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
      <title>ZenGastos — Sin conexión</title>
      <style>body{background:#09090d;color:#e8e8f0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;}
      h1{font-size:1.4rem;margin-bottom:8px;}p{color:#8888a0;font-size:.9rem;}</style></head>
      <body><div><h1>ZenGastos</h1><p>Sin conexión. Tus datos siguen guardados localmente.</p></div></body></html>
    `, { headers: { 'Content-Type': 'text/html;charset=utf-8' }, status: 503 });
  }
}

async function staleWhileRevalidate(req) {
  const cache  = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  const fresh  = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
  return cached || fresh;
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(CACHE_NAME)).put(req, res.clone());
    return res;
  } catch {
    return await caches.match(req) || new Response('Sin conexión', { status: 503 });
  }
}

// ── Message: force update ─────────────────────────────────────
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
