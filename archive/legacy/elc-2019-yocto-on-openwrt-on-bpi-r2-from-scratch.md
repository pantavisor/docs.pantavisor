## Yocto on OpenWrt from scratch

To do this itself from scratch we will first assemble the system stacks in a pvr repository

### Step 1. create a new pvr repository

In some local folder you want to use as the new pvr repository, use pvr init to initialize 
essential meta data for such repostiory:

```
mkdir newrepo
cd newrepo
pvr init
```

### Step 2. add the OpenWRT as a Pantavisor powered container:
 
Build your openwrt with all the packages you want to have included as usual, for example
you can clone the BPI-R2-Openwrt 18.06 repository, configure it through menu config,
remember to enable the option to produce a rootfs tarball and build it:

```
git clone https://github.com/XXXXX
cd XXXXX
make menuconfig
make -j10
```

This will - unless you didn't enable this option in menuconfig - produce a rootfs tarball which
we want to import in a docker container so our tooling can nicely consume the bits.

Hence: as an intermedia step we will import this rootfs in a docker package:
```
docker import /path/to/rootfs.tar.gz openwrt-rootfs:latest
```

With that we can add some meta info that will help pvr tooling to be smarter about how to run such
a container in a dockerfile. We recommend to set at least the CMD or ENTRYPOInt in your dockerfile:

Dockerfile:

```
FROM openwrt-rootfs:latest

CMD [ "/sbin/init" ]
```

With that continer we can then use pvr app add to add the newly made container to the local pvr
clonse:

```
pvr add --from 
```


To get started quickly, you can also just use the config we used for making the ELC north america demo.


