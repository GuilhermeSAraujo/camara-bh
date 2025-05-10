const CACHE_NAME = 'cmbh-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/images/logo.png',
  // Add other static assets
];

// Helper function to check if request is from our origin and has a valid scheme
const isValidRequest = (request) => {
  try {
    const url = new URL(request.url);
    // Only allow http and https schemes
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.origin === self.location.origin
    );
  } catch (e) {
    return false;
  }
};

// Helper function to check if the request should be cached
const shouldCache = (request) => {
  // Don't cache the main application JavaScript
  if (request.url.includes('/app/') || request.url.includes('/client/')) {
    return false;
  }

  // Only cache static assets
  return request.url.match(/\.(css|png|jpg|jpeg|gif|svg|woff2?)$/);
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and valid requests
  if (event.request.method !== 'GET' || !isValidRequest(event.request)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Check if we received a valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          // Only cache static assets with valid schemes
          if (isValidRequest(event.request) && shouldCache(event.request)) {
            const responseToCache = networkResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => {
                // Double check the request is valid before caching
                if (isValidRequest(event.request)) {
                  cache.put(event.request, responseToCache);
                }
              })
              .catch((error) => {
                console.error('Cache storage failed:', error);
              });
          }

          return networkResponse;
        })
        .catch((error) => {
          console.error('Fetch failed:', error);
          // You could return a custom offline page here
          return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
    })
  );
});
