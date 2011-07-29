dir=`dirname $0`
DOWNLOADS="$dir/../tmp"
VENDOR="$dir/../site/vendor"

mkdir -p $VENDOR

JRUBY=jruby
JRUBY_VERSION=1.6.3
JRUBY_TGZ=jruby-bin-$JRUBY_VERSION.tar.gz
JRUBY_URL=http://jruby.org.s3.amazonaws.com/downloads/$JRUBY_VERSION/$JRUBY_TGZ
JRUBY_DIR=$VENDOR/$JRUBY-$JRUBY_VERSION

GEM_HOME=$VENDOR/gems
GEM_PATH=$VENDOR/gems
