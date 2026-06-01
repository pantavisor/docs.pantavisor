# Installation

:::warning
The rest of this how to guide will only apply to downloading or building the x64-appengine package in Ubuntu 22.04. Other distros might work but could require further work.
:::

Once you have [built](environment-setup.md) or [downloaded](https://gitlab.com/pantacor/pv-manifest/-/pipelines) the x64-appengine target, you will have, at least, these files in your Ubuntu 22.04 host:

```
docker  scripts  test.docker.sh  tests
```

That is, some packaged Docker containers, testing data and some scripts to run it all.

Firstly, you will need to install App Engine and its dependencies with this command:

``` 
./test.docker.sh install-deps
``` 
