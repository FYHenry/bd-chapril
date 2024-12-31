#!/usr/bin/bash
declare mini
for file in ../toons/*.png
do
    if [[ ! "$file" =~ ^.+_mini\.png && "$file" =~ ^.+\.png ]]
    then
        mini=$( echo "$file" | sed -E "s/^(.+).png/\1_mini.png/")
        if [ -f "$mini" ]
        then
            continue
        fi
        echo "${file} => ${mini}"
        convert "$file" \
            -background none \
            -gravity center \
            -resize 60x60 \
            -extent 60x60 \
            "$mini"
    fi
done
