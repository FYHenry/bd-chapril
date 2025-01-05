#!/usr/bin/bash
# Code generator
declare -r CG_PATH='../data/cgdata.js'
declare -r SW_PATH='../data/swcache.json'
declare -r AC_PATH='../data/bdchapril.appcache'
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
        echo -e "        '${TBL[$nb]}',"
    done >>${CG_PATH}
    echo -e "        '${TBL[-1]}'">>${CG_PATH}
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

## Writting GC code ##
while read -r
do
    echo "$REPLY"
done <<EOF >${CG_PATH}
// CG Data
/** Comicgen data */
export const cgd = {
    /** Minitoon URLs */
    miniUrls : [
EOF

wacg "${minis[@]}"

while read -r
do
    echo "$REPLY"
done <<EOF >>${CG_PATH}
    ],
    /** Toon URLs */
    toonUrls : [
EOF

wacg "${toons[@]}"

while read -r
do
    echo "$REPLY"
done <<EOF >>${CG_PATH}
    ]
};
export default cgd;
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
    echo "$REPLY"
done <<EOF >${SW_PATH}
[
    "/",
    "/favicon.ico",
    "/manifest.json",
    "/bdchapril.css",
    "/lib/comicgen.js",
    "/index.html",
    "/lib/jquery-3.7.1.min.js",
    "/sounds/pop.ogg",
    "/lib/ragaboom.min.js",
    "/images/banniere_bdchapril.png",
    "/images/bg-tab.png",
    "/images/delete.svg",
    "/images/mouse-wheel-down.svg",
    "/images/mouse-wheel-up.svg",
    "/images/square-arrow-down.svg",
    "/images/square-arrow-left.svg",
    "/images/square-arrow-right.svg",
    "/images/square-up-right.svg",
EOF

for nb in $( seq -s ' ' 0 $(( ${#sw_cache[@]} - 2 )) )
do
    echo -e "    \"/toons/${sw_cache[$nb]}\","
done >>${SW_PATH}
echo -e "    \"/toons/${sw_cache[-1]}\"">>${SW_PATH}

while read -r
do
    echo "$REPLY"
done <<EOF >>${SW_PATH}
]
EOF

## Writting SW code ##
while read -r
do
    echo "$REPLY"
done <<EOF >${AC_PATH}
CACHE MANIFEST

# v7 - $( date "+%Y%M%d" )
CACHE:
index.html
lib/comicgen.js
bdchapril.css
lib/jquery-3.7.1.min.js
images/banniere_bdchapril.png
images/bg-tab.png
images/delete\svg
images/mouse-wheel-down\svg
images/mouse-wheel-up\svg
images/square-arrow-down\svg
images/square-arrow-left\svg
images/square-arrow-right\svg
images/square-up-right\svg
sounds/pop.mp3
sounds/pop.ogg
lib/ragaboom.min.js
EOF

for nb in $( seq -s ' ' 0 $(( ${#sw_cache[@]} - 2 )) )
do
    echo -e "    'toons/${sw_cache[$nb]}',"
done >>${AC_PATH}
echo -e "    'toons/${sw_cache[-1]}'">>${AC_PATH}

while read -r
do
    echo "$REPLY"
done <<EOF >>${AC_PATH}
NETWORK:

FALLBACK:
/ index.html .
EOF
