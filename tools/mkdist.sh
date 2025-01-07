#!/usr/bin/bash
declare -r DIST='../dist'
if [ ! -d  "$DIST" ]
then
    mkdir "$DIST"
fi
for subdir in images sounds toons
do
    if [ ! -d  "${DIST}/${subdir}" ]
    then
        mkdir "${DIST}/${subdir}"
    fi
done
cp -u ../images/*.{png,svg} "${DIST}/images/"
cp -u ../sounds/pop.ogg "${DIST}/sounds/"
cp -u ../toons/*.png "${DIST}/toons/"
cp -u ../favicon.ico \
        ../index.html \
        ../manifest.json \
        "${DIST}/"