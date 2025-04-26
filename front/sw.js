self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open('smart-todo-cache').then((cache) => {
          return cache.addAll([
              '/',
              '/index.html',
              '/style.css',
              '/app.js',
              '/manifest.json'
          ]);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
          return response || fetch(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title);
});
