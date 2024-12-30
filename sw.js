// Service Worker
import { cacheResources } from 'resources.js';

const addResourcesToCache = async (cacheResources) => {
    const cache = await caches.open('v1');
    await cache.addAll(cacheResources);
};

const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        // Enable navigation preloads!
        await self.registration.navigationPreload.enable();
    }
};

self.addEventListener('activate', (event) => {
    event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        addResourcesToCache(cacheResources)
    );
});

const putInCache = async (request, response) => {
    const cache = await caches.open('v1');
    await cache.put(request, response);
};

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
};

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});
