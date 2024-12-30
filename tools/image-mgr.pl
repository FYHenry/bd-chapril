#!/usr/bin/perl
use warnings;
use strict;
use constant ROOT_DIR => "../";
use constant DATA_FILES => (
    ROOT_DIR."comicgen.appcache",
    ROOT_DIR."comicgen.js",
    ROOT_DIR."sw.js"
);
use constant DRY_RUN => defined($ARGV[0])
    && (("$ARGV[0]" eq "--dry-run")
);
sub help {
    print("Usage: image-mgr.pl (-a|-d) IMAGE\n");
    print("    -a IMAGE  Add new image IMAGE.");
    print("    -d IMAGE  Delete current image IMAGE.");
    print("    IMAGE     Image file (SVG, PNG, JPG…).");
}
