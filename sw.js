// FitStud client service worker — v2
// Network-first, no aggressive caching, and CRITICALLY: it never touches
// login / token-refresh requests. The old version wrapped every request,
// including the cross-origin POST to Supabase auth, and on any hiccup it
// fell back to caches.match() — which returns undefined for a POST. That
// made respondWith() throw, and Safari reported it as "Load failed".

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
  const req = e.request;

  // 1) Never intercept anything that isn't a plain GET.
  //    Logins, sign-ups and token refreshes are POSTs — they must go
  //    straight to the network, untouched.
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  // 2) Never intercept other origins (Supabase, fonts, YouTube, storage).
  if (url.origin !== self.location.origin) return;

  // 3) Leave serverless functions alone.
  if (url.pathname.indexOf('/api/') === 0 || url.pathname.indexOf('/api/') > -1) return;

  // Same-origin GETs only: always try the network first so the newest
  // build always wins. If offline, fall back to cache, and if there's
  // nothing cached, return a real error instead of undefined.
  e.respondWith(
    fetch(req).catch(() =>
      caches.match(req).then(hit => hit || Response.error())
    )
  );
});
