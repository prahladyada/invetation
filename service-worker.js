/* ==========================================================================
   Priya & Rahul — Wedding Invitation
   service-worker.js — caches the app shell for offline viewing.

   Bump CACHE_NAME whenever core assets change so returning visitors get
   the fresh version instead of a stale cached copy.
   ========================================================================== */

const CACHE_NAME = 'pr-wedding-cache-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/animations.css',
  './css/responsive.css',
  './js/main.js',
  './js/animations.js',
  './js/countdown.js',
  './js/gallery.js',
  './js/rsvp.js',
  './js/share.js',
  './assets/images/bride.jpg',
  './assets/images/groom.jpg',
  './assets/images/gallery-1.jpg',
  './assets/images/gallery-2.jpg',
  './assets/images/gallery-3.jpg',
  './assets/images/gallery-4.jpg',
  './assets/images/gallery-5.jpg',
  './assets/images/gallery-6.jpg',
  './assets/images/gallery-7.jpg',
  './assets/images/gallery-8.jpg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-512-maskable.png',
  './assets/icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Page navigations: try the network first so guests always see the
  // latest RSVP deadline / details when online, falling back to the
  // cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Everything else (CSS/JS/images): cache-first, refreshing the cache
  // in the background when a network copy is available.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok && request.url.startsWith(self.location.origin)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
