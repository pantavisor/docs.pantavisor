# Create your Apps

Pantavisor natively runs its containers. If you take a closer look to one of our [initial devices](https://hub.pantacor.com/u/pantahub-ci/devices/5e43ca659411e3000a647871), you will see that each platform contains these elements:

```
$ ls rpi3_initial_stable/awconnect/
lxc.container.conf  root.squashfs  root.squashfs.docker-digest  run.json  src.json
```

As you can see, it's just a bunch of configuration files and the compressed file system. Therefore, to develop your own app, you will only have to basically prepare this file system for your container.

There is a number of ways to achieve this, but we use Docker. Remember that the containers themselves are not going to be run with docker. We use it just to get the file system in an easy way from a Dockerfile. We have a number of [projects](https://gitlab.com/pantacor/pv-platforms) that you can use as examples on we we do this.

After that, we are going to add the resulting image to our project using [pvr app add](pvr-docker-apps-experience.md). If you have already gone through the ```pvr app add``` how-to page, you already know that you can add a Docker image to your device. In the case of our [examples](https://gitlab.com/pantacor/pv-platforms), we are just customizing that image.
