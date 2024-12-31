#!/usr/bin/bash
declare mini
for file in ../toons/*.png
do
    if [[ ! "$file" =~ ^.+_mini\.png && "$file" =~ ^.+\.png ]]
    then
        mini=$( echo $file | sed -E "s/^(.+).png/\1_mini.png/")
        echo "${file} => ${mini}"
        #convert grisbouille0$i.png \
        #    -background none \
        #    -gravity center \
        #    -resize 60x60 \
        #    -extent 60x60 \
        #    grisbouille0$i_mini.png
    fi
done
