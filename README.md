# geektionnerd-generator

Un ancien générateur de BD qui a bien vieilli.

## Contraintes

Le lecteur doit être averti que cette bifurcation du projet ComicGen est développé dans une distribution de GNU/Linux.
L’environnement de travail nécessite l’installation du paquetage `imagemagick` dont dépend `tools/mkmini.sh`.

## Installation

Une fois le dépôt téléchargé les données doivent être construites avant le déploiement.
Pour se faire toutes les images doivent être placées dans `toons/`.
Chaque image `${IMG}.png` doit être associée à une miniature `${IMG}_mini.png` de 60×60 pixels.

Les miniatures sont générées via cette commande :
```bash
( cd tools/; bash mkmini.sh )
```

Reste la création des fichiers de donnée par cette commande :
```bash
( cd tools/; bash mkdata.sh )
```

Quand on change le contenu de `toons/` ces deux commandes doivent être éxécutées.

## Démonstration

Site : [https://bd.chapril.org/](https://bd.chapril.org/)

## Paternité

Auteurs : Willian Carvalho (willianpc) et [Gee](https://forge.april.org/gee).

Dépôts des projets :
* Comicgen : [https://github.com/willianpc/comicgen](https://github.com/willianpc/comicgen) ;
* Ragaboom : [https://github.com/willianpc/ragaboom](https://github.com/willianpc/ragaboom).

Article : [https://hacks.mozilla.org/2012/12/comic-gen-a-canvas-run-comic-generator/](https://hacks.mozilla.org/2012/12/comic-gen-a-canvas-run-comic-generator/).

## Gestion des caches

Initialement le cache était géré par l’API Application Cache.
Cette API ayant été dépréciée puis obsolète, un *service worker* (`sw.js`) a pris le relai.

Pour les curieux un article sur l’Application Cache : [https://web.dev/articles/appcache-beginner](https://web.dev/articles/appcache-beginner)

## Développement

### Déploiement local

#### Via Lite Server

L’environnement de développement comprend le paquet Node `lite-server`.
Ainsi la partie Node du projet n’est pas nécessaire au déploiement en production.

L’outil est installé comme suit :
```bash
( cd tools/ls/; npm install )
```

Pour essayer localement l’application on passe par cette commande :
```bash
( cd tools/ls/; npm run serve )
```

Un onglet nouveau apparaît alors dans le navigateur Web par défaut.

Le fichier `tools/ls/bs-config.json` se charge de paramétrer le serveur local selon les options de [BrowserSync](https://browsersync.io/docs/options "Site Web").

#### Via Static Web Server

Une solution alternative est [Static Web Server](https://static-web-server.net/ "Site Web"). Ce petit serveur de site statique de 8 Mio peut être installé comme suit.

```bash
cd tools/sws/
cargo install --root ./ static-web-server
mv bin/static-web-server ./
rmdir bin/
cd ../../
```
L’installation de [Rustup](https://rustup.rs/) est recommandée pour compiler des applications en Rust.

Reste à lancer le serveur via `./tools/sws/static-web-server -w tools/sws/config.toml` et à accéder à l’application Web via l’URL `http://localhost:3000/index.html`.

### Déboguer avec [JQuery](https://jquery.com/)

Pour ne pas alourdir le dépôt la forme développée de JQuery est à télécharger pour le déboguage.
Pour ce faire deux fichiers peuvent être téléchargés dans `lib/` :
* Le [code source](https://code.jquery.com/jquery-3.7.1.js) ;
* La [cartographie](https://code.jquery.com/jquery-3.7.1.min.map).
