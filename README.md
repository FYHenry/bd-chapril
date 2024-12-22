# geektionnerd-generator

Un ancien générateur de BD qui bien vieilli.

## Démonstration

Site : [https://bd.chapril.org/](https://bd.chapril.org/)

## Paternité

Auteurs : Willian Carvalho (willianpc) et Gee Ptilouk.

Dépôts des projets :
* Comicgen : [https://github.com/willianpc/comicgen](https://github.com/willianpc/comicgen) ;
* Ragaboom : [https://github.com/willianpc/ragaboom](https://github.com/willianpc/ragaboom).

Article : [https://hacks.mozilla.org/2012/12/comic-gen-a-canvas-run-comic-generator/](https://hacks.mozilla.org/2012/12/comic-gen-a-canvas-run-comic-generator/).

## Obsolète

*Application Cache* est supprimée de l’ECMAScript.
Trace de l’API Web : [https://web.dev/articles/appcache-beginner](https://web.dev/articles/appcache-beginner)

## Nouveau cache

Un *Service Worker* `sw.js` gère les caches.

## Développement

L’environement de développement comprend le paquet Node `lite-server`.
Ainsi la partie Node du projet n’est pas nécessaire au déploiement en production.
Il suffit de lancer `npx serve` pour essayer localement l’application.

Le fichier `bs-config.json` se charge de paramétrer le serveur local selon les options de [BrowserSync](https://browsersync.io/docs/options "Site Web").