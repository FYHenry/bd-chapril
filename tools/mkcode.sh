#!/usr/bin/bash
# Code generator
declare -r CG_PATH='../comicgen.js'
declare -r SW_PATH='../sw.js'
declare -r AC_PATH='../chapril.appcache'
declare -r TOONS_DIR='../toons'
declare -a toons=()
declare -a minis=()
declare -a sw_cache=()

# mk_img_list IMG_DIR
function mk_img_list()(
    local -r IMG_DIR="$1"
    for file in "$IMG_DIR"/*.png
    do
        echo "$file"
    done | sort -d -
)

# wacg ${TBL[@]}
function wacg()(
    local -a -r TBL=( "$@" )
    for nb in $( seq -s ' ' 0 $(( ${#TBL[@]} - 2 )) )
    do
        echo -e "    '${TBL[$nb]}',"
    done >>${CG_PATH}
    echo -e "    '${TBL[-1]}'">>${CG_PATH}
)

## Preparing GC Code ##

for file in $( mk_img_list $TOONS_DIR )
do
    if [[ "$file" =~ ^.+_mini(\..+)? ]]
    then
        minis[${#minis[@]}]=$( basename "$file" )
    else
        toons[${#toons[@]}]=$( basename "$file" )
    fi
done

echo  -e "\nToons :"
for file in "${toons[@]}"
do
    echo "$file"
done
echo -e "\nMinis :"
for file in "${minis[@]}"
do
    echo "$file"
done

## Writting GC code ##
while read -r
do
    echo "$REPLY";
done <<EOF >${CG_PATH}
var d = document;
var cg = {};
var w = parseInt(window.innerWidth * 0.8);
var h = parseInt(window.innerHeight * 0.8);
var canvas = \$('#c');
canvas.attr('width',w).attr('height',h);
var c = canvas[0];
var ctx = c.getContext('2d');
var scene = new RB.Scene(c);
var fontFamily = 'Domestic Manners, Arial, helvetica, sans serif';
var pop = new Audio('sounds/pop.ogg');
var currentObj = null;
\$('#newWidth').val(w);
\$('#newHeight').val(h);

scene.add( scene.rect(w, h, 'white') );
scene.update();

var lib = \$('#lib');

var miniUrls = [
EOF

wacg "${minis[@]}"

while read -r
do
    echo "$REPLY";
done <<EOF >>${CG_PATH}
];

var toonUrls = [
EOF

wacg "${toons[@]}"

while read -r
do
    echo "$REPLY";
done <<EOF >>${CG_PATH}
];

cg.clearScreen = function(){
    ctx = c.getContext('2d');
    scene = new RB.Scene(c);
    w = c.width;
    h = c.height;
    fontFamily = 'Domestic Manners, Arial, helvetica, sans serif';
    pop = new Audio('sounds/pop.ogg');
    currentObj = null;

    scene.add( scene.rect(w, h, 'white') );
    scene.update();
}

\$(d).keyup(function(e){

    var key = e.keyCode || e.which;

    if(key == 46 && currentObj){
        scene.remove(currentObj);
        scene.update();
        RB.destroyCanvas( currentObj.getCanvas().id );
        currentObj = null;
    }

    if( currentObj && (key==37 || key==39) ){
        cg.hFlip(currentObj);
    }
});

\$(d).keydown(function(event){

    var key = event.keyCode || event.which;

    if(key == 38 && currentObj){
        cg.zoomIn(currentObj);
    }

    if(key == 40 && currentObj){
        cg.zoomOut(currentObj);
    }
});

d.onmousewheel = function(mw){
    if(currentObj && mw.wheelDelta > 0){
        cg.zoomIn(currentObj);
    } else if (currentObj && mw.wheelDelta < 0){
        cg.zoomOut(currentObj);
    }
};

cg.hoverdiv = function(e,divid){
    var x = e.clientX + 25;
    var y = e.clientY ;
    var left  = x + 'px';
    var top  = y  + 'px';

    
    var div = document.getElementById(divid);
    div.style.left = left;
    div.style.top = top;

    \$('#'+divid).toggle();
    return false;
}
cg.sourceSwap = function (e) {
    var div_mini = \$(this);
    var img_id = parseInt(div_mini.data('src-id'));
    var img_url = toonUrls[img_id];
    \$('#bigImg').attr('src','toons/' + img_url);
    cg.hoverdiv(e,'focusImg')
}
cg.buildMinis = function(){
    var buffer = '';
        var divString = "<div class='himg'  data-src-id='IMG_ID'>";
    var imgString = "<img src='toons/IMG_URL' data-src-id='IMG_ID' class='rc mini' alt='toons'></img>";
    var link = "<a href=\"javascript:cg.createImage('toons/IMG_URL')\">";

    for(var i=0; i < miniUrls.length; i++){
                buffer += divString.replace(/IMG_ID/,i);
        buffer += link.replace(/IMG_URL/, toonUrls[i]);
        buffer += imgString.replace(/IMG_URL/, miniUrls[i]).replace(/IMG_ID/, i) + '</a></div>';
    }

    lib.append(buffer);

    //lib.append( \$('#textTool').clone() );
    \$('#menuContainer').append( \$('#instructs').clone() );
        \$(function () {
          \$('div.himg').hover(cg.sourceSwap, cg.sourceSwap);
        });
}

cg.buildMinis();

cg.createImage = function(url){
    scene.image(url, function(obj){
        obj.draggable = true;
        obj.setXY(30, 30);

        obj.onmousedown = function(e){
            currentObj = obj;
            scene.zIndex(obj, 1);
            scene.update();
        }

        scene.add(obj);
        currentObj = obj;
        scene.update();
        pop.play();
    });
}

cg.createText = function(){
    var txt = prompt("Adicione um texto:");

    if(txt){
        var obj = scene.text(txt, fontFamily, 26, 'black');
        obj.setXY(40, 40);
        obj.draggable = true;

        obj.onmousedown = function(e){
            currentObj = obj;
            scene.zIndex(obj, 1);
            scene.update();
        }
        currentObj = obj;

        scene.add(obj);
        scene.update();
        pop.play();
    }
}

cg.createTextFromInput = function(e){

    var key = e.keyCode || e.which;
    var txt = \$('#newText').val();

    if(key == 13){
        var obj = scene.text(txt, fontFamily, 26, 'black');
        obj.setXY(40, 40);
        obj.draggable = true;

        obj.onmousedown = function(e){
            currentObj = obj;
            scene.zIndex(obj, 1);
            scene.update();
        }
        currentObj = obj;

        scene.add(obj);
        scene.update();
        \$('#newText').val('');
        pop.play();
    }
}
cg.createImageFromInput= function(t){

  var fileList = t.files; /* now you can work with the file list */
    var imageType = /image.*/;
    var nBytes = 0;
  
    for (var i = 0; i < fileList.length; i++)
    {
      
        var file = fileList[i];
        nBytes += file.size;
        if (!file.type.match(imageType))
        {
            continue;
        }
        imgUrl = window.URL.createObjectURL(file);
        cg.createImage(imgUrl);
    }

}
cg.saveImage = function(){
    var data = c.toDataURL('png');
       // \$.ajax({
       //   type: 'POST',
       //   url: 'https://lut.im',
       //   data: data,
       //   success: function(d){console.log(d);},
       //   dataType: 'json'
       // });
    var win = window.open();
    var b = win.document.body;
    var img = new Image();
    img.src = data;
    b.appendChild(img);
}

cg.zoomOut = function(obj){
    var w = obj.w * 0.05;
    var h = obj.h * 0.05;

    if(obj.w - w > 0 && obj.h - h > 0){
        obj.w -= w;
        obj.h -= h;

        obj.x += (w/2);
        obj.y += (h/2);

        scene.update();
    }
}

cg.zoomIn = function(obj){
    var w = obj.w * 0.05;
    var h = obj.h * 0.05;

    obj.w += w;
    obj.h += h;

    obj.x -= (w/2);
    obj.y -= (h/2);

    scene.update();
}

cg.hFlip = function(obj){
    var tmpCanvas = \$(obj.getCanvas()).clone()[0];
    var img = obj.getCanvas();
    var tmpCtx = tmpCanvas.getContext('2d');
    var w = tmpCanvas.width;
    var h = tmpCanvas.height;

    //save current size and position
    var cW = obj.w, cH = obj.h, cX = obj.x, cY = obj.y;

    tmpCtx.translate(w/2, h/2);
    tmpCtx.scale(-1, 1);
    tmpCtx.drawImage(img, (-1*w/2), (-1*h/2));
    tmpCanvas.id = obj.getCanvas().id;
    obj.getCanvas().id = 'killme';

    RB.destroyCanvas('killme');
    d.body.appendChild(tmpCanvas);
    obj.setCanvas(tmpCanvas);
    obj.x=cX; obj.y=cY; obj.h=cH; obj.w=cW;
    scene.update();
}

cg.setScreen = function(w, h){
    if(w && h && !isNaN(w) && !isNaN(h)){
        //var ok = confirm('All your work will be lost. Continue?');
        ok=true;
        if(ok){
            c.width = w;
            c.height = h;
            scene.update();
            //cg.clearScreen();
        }
    }
}
EOF

## Preparing SW Code ##

sw_cache=( "${toons[@]}" "${minis[@]}" )

echo  -e "\nNew cache :"
for file in "${sw_cache[@]}"
do
    echo "$file"
done

## Writting SW code ##
while read -r
do
    echo "$REPLY";
done <<EOF >${SW_PATH}
// Service Worker
const cacheResources = [
    '/',
    '/favicon.ico',
    '/manifest.json',
    '/bdchapril.css',
    '/comicgen.js',
    '/index.html',
    '/jquery-1.5.2.min.js',
    '/sounds/pop.ogg',
    '/ragaboom.min.js',
    '/images/banniere_bdchapril.png',
    '/images/bg-tab.png',
EOF

for nb in $( seq -s ' ' 0 $(( ${#sw_cache[@]} - 2 )) )
do
    echo -e "    '/toons/${sw_cache[$nb]}',"
done >>${SW_PATH}
echo -e "    '/toons/${sw_cache[-1]}'">>${SW_PATH}

while read -r
do
    echo "$REPLY";
done <<EOF >>${SW_PATH}
];

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

self.addEventListener('activate', (event) => {
    event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        addResourcesToCache(cacheResources)
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});
EOF

## Writting SW code ##
while read -r
do
    echo "$REPLY";
done <<EOF >${AC_PATH}
CACHE MANIFEST

# v7 - $( date "+%Y%M%d" )
CACHE:
index.html
comicgen.js
estilo.css
gege.css
jquery-1.5.2.min.js
images/banniere_bdchapril.png
images/bg-tab.png
sounds/pop.mp3
sounds/pop.ogg
ragaboom.min.js
EOF

for nb in $( seq -s ' ' 0 $(( ${#sw_cache[@]} - 2 )) )
do
    echo -e "    'toons/${sw_cache[$nb]}',"
done >>${AC_PATH}
echo -e "    'toons/${sw_cache[-1]}'">>${AC_PATH}

while read -r
do
    echo "$REPLY";
done <<EOF >>${AC_PATH}
NETWORK:

FALLBACK:
/ index.html .
EOF
