# sling-pipes-client
web client for sling pipes

## installing sling pipes client
- ensure you have maven & svn on your computer
- ensure you have a running sling instance at <host>:<port>,
- export HOST=<host> & export PORT=<port>  (default being localhost:8080),
- run ./init.sh,
- open <host>:<port>/etc/sling/pipes/viewer.html

important note, on AEM sling instances, you might have to adjust CSRF filter so the application can POST to your instance.