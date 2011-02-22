#!/bin/sh

JRUBY=jruby-1.6.0.RC2
JRUBY_TGZ=jruby-bin-1.6.0.RC2.tar.gz
JRUBY_URL=http://jruby.org.s3.amazonaws.com/downloads/1.6.0.RC2/$JRUBY_TGZ
VENDOR="vendor"

MY_CERT="cert.pfx"

# STEP 0 - ENSURE ADT 
echo "Checking for ADT tools... \c"
which adt
if [ $? -ne 0 ] ; then
  echo "YOU NEED TO INSTALL ADOBE AIR SDK"
  exit 1
else
  echo "found"
fi

# STEP 1 - INSTALL CERTIFICATE

echo "Checking for certificate... \c"
if [ -f $MY_CERT ] ; then
  echo "exists"
else
  echo "doesn't exist, creating with ./cert.sh"
  ./cert.sh
fi


# STEP 2 - BUNDLE JRUBY

mkdir -p $VENDOR
pushd $VENDOR > /dev/null
echo "Checking for jruby... \c"
if [ -d $JRUBY ] ; then
  echo "exists"
else
  echo "downloading"
  wget $JRUBY_URL
  tar -xzf $JRUBY_TGZ
fi
popd > /dev/null


# STEP 3 - PACKAGE APP
echo "Preparing to package app"
time adt -package -storetype pkcs12 -keystore cert.pfx -target native compassapp.dmg compassapp-app.xml .