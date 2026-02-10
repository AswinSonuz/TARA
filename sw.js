const CACHE_NAME = 'tara-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './captain.png',
  './vice.png',
  './member1.png',
  './member2.png',
  './member3.png',
  './member4.png',
  './member5.png',
  './member6.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});