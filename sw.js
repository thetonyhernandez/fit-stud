// Service worker - network first, no aggressive caching
// This prevents stale cached versions from showing

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Clear ALL old caches on every activation
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always go to network - never serve from cache
  // This ensures the latest code always loads
  if (e.request.url.includes('/api/')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
