const cacheName = 'roadTrip';
const staticAssets = [
  './',
  './index.html',
   './assets/css/main.css',
   './assets/css/font-awesome.min.css',
   './index.js',
  './assets/js/main.js',
  './assets/js/util.js',
  './assets/js/skel.min.js',
  './assets/js/jquery.scrollex.min.js',
  './assets/js/jquery.scrolly.min.js',
  './assets/js/jquery.min.js'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});



self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
