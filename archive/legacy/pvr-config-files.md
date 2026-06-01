# Add Additional Files to Apps

We have seen how apps can be [added](pvr-docker-apps-experience.md) and [updated](pvr-update-apps.md). Now, we are going to add or modify files inside of the app file system without having to change modify the app artifacts. To do so, you can take advantage of our [additional files](containers.md#additional-files) feature.

Let us see how to do it for the container from our [previous](pvr-docker-apps-experience.md) example. We are going to add a new [\_config](pantavisor-state-format-v2.md#_configcontainer) directory to the [revision](revisions.md) with the name of the app and the path inside of its file system:

```
mkdir -p _config/webserver/etc
echo "hello world!" > _config/webserver/etc/test
```

To [commit](make-a-new-revision.md) and [push](deploy-a-new-revision.md) the update:

```
pvr add .
pvr commit
pvr push
```

Now, if you [inspect](https://docs.pantahub.com/inspect-device) the `webserver` app, you will find the new file:

```
# cat /etc/test  
hello world!
```
