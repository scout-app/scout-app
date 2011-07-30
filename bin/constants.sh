dir=`dirname $0`
VENDOR="$dir/../build/vendor"

mkdir -p $VENDOR

# base jruby name
JRUBY=jruby

# version of jruby to use
JRUBY_VERSION=1.6.3

# full name of the jruby-complete jar
JRUBY_COMPLETE_JAR=$JRUBY-complete-$JRUBY_VERSION.jar

# download url of the jruby complete jar
JRUBY_COMPLETE_URL=http://jruby.org.s3.amazonaws.com/downloads/$JRUBY_VERSION/$JRUBY_COMPLETE_JAR

# the generic jar name to rename the jruby complete jar to after downloading
JRUBY_JAR=$JRUBY-complete.jar

# location of the jruby complete installation
JRUBY_INSTALLATION=$VENDOR/$JRUBY_JAR

# force bin/ scripts to use the vendorized JRuby gem installation.
GEM_HOME=$VENDOR/gems
GEM_PATH=$VENDOR/gems
