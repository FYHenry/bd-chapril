#!/usr/bin/bash
declare mini
declare toon
for file in ../toons/*.png
do
    if [[ ! "$file" =~ ^.+_mini\.png && "$file" =~ ^.+\.png ]]
    then
        mini=$( echo "$file" | sed -E "s/^(.+).png/\1_mini.png/")
        if [ -f "$mini" ]
        then
            continue
        fi
        convert "$file" \
            -background none \
            -gravity center \
            -resize 60x60 \
            -extent 60x60 \
            "$mini"
        echo "${file} => ${mini}"
    fi
done
for file in ../toons/*_mini.png
do
    toon=$( echo "$file" | sed -E "s/^(.+)_mini.png/\1.png/")
    if [ ! -f  "$toon" ]
    then
        rm "$file"
        echo "${file} removed."
    fi
done