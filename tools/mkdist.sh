#!/usr/bin/bash
declare -r DIST='../dist'
if [ ! -d  "$DIST" ]
then
    mkdir "$DIST"
fi
cp -ur '../data' '../font' "${DIST}/"
for subdir in images lib sounds toons
do
    if [ ! -d  "${DIST}/${subdir}" ]
    then
        mkdir "${DIST}/${subdir}"
    fi
done
cp -u ../images/*.{png,svg} "${DIST}/images/"
cp -u ../lib/{comicgen,jquery-3.7.1.min,ragaboom.min}.js "${DIST}/lib/"
cp -u ../sounds/pop.ogg "${DIST}/sounds/"
cp -u ../toons/*.png "${DIST}/toons/"
cp -u ../bdchapril.css \
        ../bdchapril.js \
        ../favicon.ico \
        ../index.html \
        ../manifest.json \
        ../sw.js \
        "${DIST}/"