#!/usr/bin/perl
use warnings;
use strict;
use constant ROOT_DIR => "../";
use constant DATA_FILES => (
    ROOT_DIR."comicgen.appcache",
    ROOT_DIR."lib/comicgen.js",
    ROOT_DIR."sw.js"
);
use constant LINES => (
    "var miniUrls = [",
    ""
);
use constant DRY_RUN => defined($ARGV[0])
    && (("$ARGV[0]" eq "--dry-run")
);
sub help {
    print("Usage: ${0} (-a|-d) IMAGE\n");
    print("    -a IMAGE  Add new image IMAGE.\n");
    print("    -d IMAGE  Delete current image IMAGE.\n");
    print("    IMAGE     Image file (SVG, PNG, JPG…).\n");
}
if ($#_ != 1){
    print("Need some “--help” ?\n");
    exit(0);
}
my ($option, $image) = @_;

# ($input, $file)=>void
sub check_file{
    my ($stream, $file) = @_;
    my $fp;
    my $isPresent = 0;
    open($stream, "<", $fp) || die "$0 : Can't open ${fp} ! : $!";
    while (my $line = <$stream>){
        if ($_ == $file){
            $isPresent = 1;
        }
    }
    close($stream) || warn "$0 : Can't close ${fp} ! : $!";
}
