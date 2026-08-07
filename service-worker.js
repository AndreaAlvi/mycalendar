const CACHE_NAME = "mycalendar-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/calendar.js",
  "./js/events.js",
  "./js/storage.js",
  "./manifest.json",

  "./favicon.png",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",

  "./assets/icons/freccia_sx.svg",
  "./assets/icons/freccia_dx.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});