# Add Apps from Docker

:::note
An app is a [container](containers.md) that can be run in a Pantavisor device that takes part on the application level functionality.
:::

Pantabox offers the possibility to add apps generated from an image from Docker Hub. First, execute the `pantabox` command to get its menu:

![](images/pantabox-menu.png)

Select the `install` option of the menu and you will get this:

![](images/pantabox-install.png)

On the install menu, choose `add from docker` and enter the docker name and tag. For example to install the Nginx image from Docker Hub:

```
nginx:latest
```

The `pantabox` and select `view` option should show the new Nginx app.

If you now run `pantabox` and select `view`, you will see see the new [revision](revisions.md) components:

![](images/pantabox-view.png)

To add, commit and apply your changes, execute these commands:

```
pvr add .
pvr commit
exit 0
```
