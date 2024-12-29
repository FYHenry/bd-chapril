// Cache manager

/** Create legacy cache
 * 
 * @returns It is a success
 */
const checkCacheFunction = () => {
    if ('applicationCache' in window) {
        try {
            var webappCache = window.applicationCache;

            const loaded = () => {
                //var h1El = document.querySelector("h1");
                var connectionStatus = ((navigator.onLine) ? 'online' : 'offline');
                //h1El.textContent = h1El.textContent + " - currently: " + connectionStatus;
                switch(webappCache.status)
                {
                    case 0:
                        console.log("Cache status: Uncached.");
                        break;
                    case 1:
                        console.log("Cache status: Idle.");
                        break;
                    case 2:
                        console.log("Cache status: Checking.");
                        break;
                    case 3:
                        console.log("Cache status: Downloading.");
                        break;
                    case 4:
                        console.log("Cache status: Update ready.");
                        break;
                    case 5:
                        console.log("Cache status: Obsolete.");
                        break;
                }
            };

            const updateCache = () => {
                webappCache.swapCache();
                console.log("Cache has been updated due to a change found in the manifest.");
            };

            const errorCache = () => {
                console.log("You're either offline or something has gone horribly wrong.");
            };

            window.addEventListener("load", loaded, false);
            webappCache.addEventListener("updateready", updateCache, false);
            webappCache.addEventListener("error", errorCache, false);
            return true;
        } catch (error) {
            console.error(`Cache check failed with ${error}.`);
            return false;
        }
    } else {
        console.warn("Application caches are not supported!");
        return false;
    }
};

/**
 * Create service worker's cache
 */
const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                'sw.js',
                {
                    scope: './',
                    type: 'module'
                }
            );
            if (registration.installing) {
                console.log('Service worker installing.');
            } else if (registration.waiting) {
                console.log('Service worker installed.');
            } else if (registration.active) {
                console.log('Service worker active.');
            }
        } catch (error) {
            console.error(`Registration failed with ${error}.`);
        }
    } else {
        console.warn("Service workers are not supported!");
    }
};

const hasOldCache = checkCacheFunction();
if (!hasOldCache) {
    registerServiceWorker();
}