# geektionnerd-generator

Un ancien générateur de BD qui a bien vieilli.

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

### Via Lite Server

L’environnement de développement comprend le paquet Node `lite-server`.
Ainsi la partie Node du projet n’est pas nécessaire au déploiement en production.
Il suffit de lancer `npx serve` pour essayer localement l’application.

Le fichier `bs-config.json` se charge de paramétrer le serveur local selon les options de [BrowserSync](https://browsersync.io/docs/options "Site Web").

### Via Static Web Server

Une solution alternative est [Static Web Server](https://static-web-server.net/ "Site Web"). Ce petit serveur de site statique de 8 Mio peut être installé comme suit.

```bash
cd sws
cargo install --root ./ static-web-server
mv bin/static-web-server ./
rmdir bin/
cd ../
```
L’installation de [Rustup](https://rustup.rs/) est recommandée pour compiler des applications en Rust.

Reste à lancer le serveur via `./sws/static-web-server -w sws/config.toml` et à accéder à l’application Web via l’URL `http://localhost:3000/index.html`.

## Images

Pour mettre à jour les images disponibles placer les images dans `toons/`.
Chaque image `${IMG}.png` doit être associée à une miniature `${IMG}_mini.png` de 60×60 pixels.
Pour se faire exécuter cette commande :
```bash
( cd tools/; bash mkmini.sh )
```

Puis exécuter cette commande :
```bash
( cd tools/; bash mkcode.sh )
```
Ainsi les scripts sont à jour.