# Update your Apps

In order to get the latest bits by docker name (for instance, if the branch tag has been changed or moved forward), you can use `pvr app update`. To update the `webserver` from our [previous](pvr-docker-apps-experience.md) example:

```
# update to latest "nginx:latest"
$ pvr app update webserver
Application updated

# confirm that there are were changes
$ pvr status
C webserver/src.json

# commit and post
$ pvr commit
Committing /tmp/ppp/api2-canary-01/.pvr/objectswebserver/src.json

$ pvr post
```

This will update your app based on the data extracted from [src.json](https://docs.pantahub.com/pvr/#srcjson), which can be modified by the user. If you want to only change the configuration and avoid updating, you can also use the `pvr app install` command, which is the equivalent to `pvr app update` for configuration changes in [src.json](https://docs.pantahub.com/pvr/#srcjson).
