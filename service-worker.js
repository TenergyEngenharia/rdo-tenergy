const CACHE_NAME = 'tenergy-rdo-v2';

const ASSETS = [
  'index.html',
  'manifest.json',
  'logo_tenergy.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Força ativação imediata sem esperar abas serem fechadas
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Remove caches antigos (ex: tenergy-rdo-v1)
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
