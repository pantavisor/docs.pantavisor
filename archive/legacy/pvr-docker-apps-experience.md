# Add Apps from Docker

:::note
An app is a [container](containers.md) that can be run in a Pantavisor device that takes part on the application level functionality.
:::

To add new apps, you would use `pvr app add` in a [cloned](clone-your-system.md) device [revision](revisions.md). To add the `nginx` container with the tag `latest` from Docker Hub:

```
pvr app add --from nginx:latest webserver
```

If you wanted to get the docker image from your host computer, you would use the `--source` option:

```
pvr app add --from custom-nginx --source local webserver
```

In either case, it will generate a `webserver/` folder with a matching `src.json`. You can inspect the produced output and use `pvr` to [commit](make-a-new-revision.md) and [post](deploy-a-new-revision.md) the new revision to your device:

```
# check status of files on disk
$ pvr status
? webserver/lxc.container.conf
? webserver/root.squashfs
? webserver/root.squashfs.docker-digest
? webserver/run.json
? webserver/src.json

# add new files to pvr control
$ pvr add .

# commit new files
$ pvr commit
Adding webserver/lxc.container.conf
Adding webserver/root.squashfs
Adding webserver/root.squashfs.docker-digest
Adding webserver/run.json
Adding webserver/src.json

# post changes to your device
$ pvr post
```

To ensure that revisions are 100% reproducible, we include the docker digest that `pvr` consumed during during the installation in the src.json.
