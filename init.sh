#!/bin/sh
if [ -z $HOST ]; then
    HOST="localhost";
fi
if [ -z $PORT ]; then
    PORT="8080";
fi
echo "starting the initialisation of sling pipes client on $HOST:$PORT, that suppose you have svn & maven installed..."
HOME=`pwd`
TMP="$HOME/tmp_init"
mkdir "$TMP"
cd "$TMP"
svn co http://svn.apache.org/repos/asf/sling/trunk/contrib/extensions/sling-query sling-query
cd "sling-query"
mvn clean install sling:install -Dsling.url=http://$HOST:$PORT/system/console
cd "$TMP"
svn co http://svn.apache.org/repos/asf/sling/trunk/contrib/extensions/sling-pipes sling-pipes
cd "sling-pipes"
mvn clean install sling:install -Dsling.url=http://$HOST:$PORT/system/console
echo clean up temporary folder
rm -rf "$TMP"
cd "$HOME"
mvn clean install sling:install -Dsling.url=http://$HOST:$PORT/system/console