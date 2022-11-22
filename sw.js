
const MAIN_CACHE = 'main';

const cacheFirst = (event) => {

    const referrerOrigin = event.request.referrer && new URL(event.request.referrer).origin
    const requestOrigin = event.request.url && new URL(event.request.url).origin

    if (event.request.method.toLowerCase() != 'get') return
    if (event.request.headers.get('Range') != null) return

    if (referrerOrigin != requestOrigin) return

    event.respondWith((async ()=>{
        const cache = await caches.open(MAIN_CACHE)

        const responsePromise = fetch(event.request).then((response) => {
            cache.put(event.request, response.clone())
            return response
        })

        let cacheResponse = await caches.match(event.request)

        return cacheResponse || await responsePromise
    })())
};

self.addEventListener('fetch', cacheFirst);
