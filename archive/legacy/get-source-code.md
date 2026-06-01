# Get the Source Code

This build system is based on the Alchemy tool, plus modifications specific to the requirements of the Pantavisor build. First, make a new workspace directory:

```
mkdir pantavisor
cd pantavisor
```

To initialize it, use [`repo`](https://source.android.com/source/using-repo). You can download the necessary code using the -g option. Just substitute `rpi64-5.10.y` with the target you [want to build](choose-reference-device.md).

```
repo init -u https://gitlab.com/pantacor/pv-manifest -m release.xml -g runtime,rpi64-5.10.y
```

You may prefer to download the source code for all targets. In that case:

```
repo init -u https://gitlab.com/pantacor/pv-manifest -m release.xml
```

Now, it is time to download the code with the sync command:

```
repo sync -j10 -c --no-clone-bundle
```

Afterwards, you should have contents similar to below in your Pantavisor directory:

```
alchemy  bootloader  build.docker.sh  build.sh  ca  config
external  firmware  internal  kernel  prebuilt  run.docker.sh
scripts  test.docker.sh  tests  vendor
```
