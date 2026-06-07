// ─── ZenGastos Service Worker ─────────────────────────────────
// Estrategia: Cache-first para assets estáticos, network-first para el resto.

const CACHE_NAME = 'zengastos-v1';
const CACHE_VERSION = 1;

// Assets a cachear en la instalación (shell de la app)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Fuentes de Google (se cachean en runtime si están disponibles)
];

// Assets externos que se cachean en runtime (CDNs)
const RUNTIME_CACHE_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com',
];

// ─── Install ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando ZenGastos SW v' + CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-cacheando assets del shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate ─────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando nueva versión');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Eliminando caché antigua:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch ────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones no-GET y extensiones de browser
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Para assets del shell (misma origin) → Cache first, luego red
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Para CDNs y fuentes externas → Stale while revalidate
  const isExternalCacheable = RUNTIME_CACHE_ORIGINS.some(origin =>
    url.href.startsWith(origin)
  );

  if (isExternalCacheable) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Para todo lo demás → Red primero, caché como fallback
  event.respondWith(networkFirst(request));
});

// ─── Estrategias de caché ─────────────────────────────────────

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Cache-first falló para:', request.url);
    return new Response('<h1>ZenGastos - Sin conexión</h1><p>Por favor, verifica tu conexión a internet.</p>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 503,
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Sin conexión', { status: 503 });
  }
}

// ─── Message handling (para forzar actualización desde la UI) ─
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
