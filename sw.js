
const MAIN_CACHE = 'main';

// self.addEventListener('install', event => {
//     console.log("installing service worker");
// });

// self.addEventListener('activate', event => {
//     console.log("activating service worker");
// });

const cacheFirst = (event) => {

    if (event.request.method.toLowerCase() != 'get') return

    const referrerOrigin = event.request.referrer && new URL(event.request.referrer).origin
    const requestOrigin = event.request.url && new URL(event.request.url).origin

    if (referrerOrigin != requestOrigin) return

    event.respondWith((async ()=>{
        const cache = await caches.open(MAIN_CACHE)
        const cachedResponse = await caches.match(event.request)

        fetch(event.request).then((response) => cache.put(event.request, response.clone()))

        return cachedResponse
    })())
};

self.addEventListener('fetch', cacheFirst);
