// Custom Service Worker para optimizaciones adicionales
const CACHE_NAME = 'ruach-v1';
const STATIC_CACHE = 'ruach-static-v1';
const DYNAMIC_CACHE = 'ruach-dynamic-v1';

// Recursos críticos para cachear inmediatamente
const CRITICAL_RESOURCES = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
];

// Cache de imágenes con estrategia específica
const IMAGE_CACHE = 'ruach-images-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(CRITICAL_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de cache inteligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // HTML - Network First con fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Imágenes - Cache First con compresión
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) return response;
        
        return fetch(request).then(response => {
          // Solo cachear imágenes exitosas
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(IMAGE_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // CSS/JS - Stale While Revalidate
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then(response => {
        const fetchPromise = fetch(request).then(networkResponse => {
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        });
        
        return response || fetchPromise;
      })
    );
    return;
  }

  // API calls - Network First
  if (request.url.includes('/api/') || request.url.includes('googleapis.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
});

// Limpiar caches antiguos periódicamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    caches.open(IMAGE_CACHE).then(cache => {
      cache.keys().then(requests => {
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
        
        requests.forEach(request => {
          cache.match(request).then(response => {
            if (response) {
              const cachedTime = response.headers.get('date');
              if (cachedTime && (now - new Date(cachedTime).getTime()) > maxAge) {
                cache.delete(request);
              }
            }
          });
        });
      });
    });
  }
});
