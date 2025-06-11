// public/sw.js
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.open("app-cache-v1").then((cache) => {
      // Pre-cache essential assets
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/script.js",
        // include any other assets you want to pre-cache
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});

self.addEventListener("fetch", (event) => {
  // Try to serve from the cache; if not found, fetch from network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
