// Service Worker

/**
 * Read JSON Array as string array
 * @param {string} url JSON data URL
 * @returns String array of data
 */
const readJsonArray = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data != ['']) {
            throw new Error('Bad JSON data, string array waited.');
        }
        return data;
    } catch ( error ) {
        console.error(`When fetching JSON array : error of type ${error}`);
        return [];
    }
}

/**
 * Add resource to cache
 * @param {string} cacheDataUrl Data JSON URL
 */
const addResourcesToCache = async (cacheDataUrl) => {
    const data = await readJsonArray(cacheDataUrl);
    const cache = await caches.open('v1');
    await cache.addAll(data);
};

/**
 * Enable navigation preload
 */
const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        // Enable navigation preloads!
        await self.registration.navigationPreload.enable();
    }
};

/**
 * Put in cache
 * @param {RequestInfo} request Request object or URL string
 * @param {Response} response Response object
 */
const putInCache = async (request, response) => {
    const cache = await caches.open('v1');
    await cache.put(request, response);
};

/**
 * Cache before network
 * @param {RequestInfo} request Request object or URL string
 * @returns Response object
 */
const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
};

self.addEventListener('activate', (event) => {
    event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
    event.waitUntil(addResourcesToCache('data/swcache.json'));
});

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});
