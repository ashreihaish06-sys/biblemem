const CACHE_NAME = 'bible-memo-cache-v1';

// Install event: Cache basic offline fallback or skip for now
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: Clean up old caches if any
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event: Simple network-first strategy, falling back to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful requests dynamically
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Exclude chrome-extension, API requests, etc if needed
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, responseClone);
          }
        });
        return response;
      })
      .catch(() => {
        // If network fails, try to return from cache
        return caches.match(event.request);
      })
  );
});
