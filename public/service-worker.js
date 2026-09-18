const CACHE_NAME = "toon-json-converter-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then(
        (response) =>
          response ||
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok)
              cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }),
      ),
    ),
  );
});
