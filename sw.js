
const MAIN_CACHE = 'main';

self.addEventListener('install', event => {
    console.log("installing service worker");
});

self.addEventListener('activate', event => {
    console.log("activating service worker");
});

// Attempt the request and store and return successful responses. If it fails
// look into the cache.
const networkFirst = (event) => {
    
    const referrerOrigin = event.request.referrer && new URL(event.request.referrer).origin
    const requestOrigin = event.request.url && new URL(event.request.url).origin

    if (referrerOrigin == requestOrigin) {
        event.respondWith((async () => {
            let cache = await caches.open(MAIN_CACHE)
            try {
                let response = await fetch(event.request)
                cache.put(event.request, response.clone())

                return response
            } catch (error) {
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) return cachedResponse;

                throw error;
            }
        })());
    }
};

self.addEventListener('fetch', networkFirst);