# Yocto Digital Signage on OpenWrt Router

As shown at ELC 2019 in San Diego, using Linux container technology to mix and match best user space stacks that come with otherwise mutually hard to combine userspace isn't all that difficult.

In this case we will show how to make a router powered by OpenWRT also deliver an on-screen device experience.

This type of combined router+onscreen experience is becoming more relevant as digital signage powered by standard computers as well as the need for more pervasive networking becomes more and more ubiquous.


## The Hardware

In order to make a product that combines both router as well as on screen signage in one device one has to pick an ARM SoC based router that comes with the GPU integrated - such as Mali.

Interestingly enough there are not many routers our there that also have graphics output interface, but we believe this will change in the future.

For this tutorial we picked the awesome BananaPi R2 (BPI-R2) platform.

## The software

Putting together a software stack that can provide both, a product grade router vertical as well as a product grade on screen experience feels in first sight more trivial than finding hardware, but when looking closer it turns out there is no single distribution that is good at both.

If one wants to still setttle on using a single distribution for the whole experience one would have to either add a product grade wifi experience to a distro good on screens or add a great screen experience to a distro
optimized for routers.

Both choices would mean quite substantial work and hence we believe there needs to be a third way:

1. We take an awesome router system stack and separately pick an awesome on screen display stack
2. We use containers to deploy them next to each other, so we can avoid big itegration pain

And thats what we did ...


## The solution

To make this tutorial we cobbined the following components into one:
 1. bananapi r2 hardware platform
 2. Pantavisor container lifecycle management
 4. Close-to-upstream Kernel for Bananpi R2 with openwrt patches applied and graphics modules enabled
 5. OpenWRT 18.06 rootfs deployed as a container
 6. Yocto Digital Signage based on yocto-warrior deployed as a container


## Yocto on OpenWrt using prebuilt binaries

* Download our prebuilt BPI-R2 image (includes basic OpenWRT): https://pvzero.s3.amazonaws.com/bpi-r2-pv-2048MiB.img.xz
* Install, boot and claim your device on Pantacor Hub like described in our [Getting Started guide](get-started.md)
* add the yocto based digital signage stack:
```
pvr clone <yournick/yourdevice>
cd yourdevice
pvr app add \
	--arg "LXC_TTY_MAX=0" \
	--arg="LXC_MOUNT_AUTO_PROC=proc:rw" \
	--arg="LXC_MOUNT_AUTO_SYS=sys:rw" \
	--from=asac/signage signage
pvr add
pvr commit
```
* Post your changes back to your device: ```pvr post -n "add signage demo"```

This will trigger the upgrade process and your Bananpi will reboot into the new experience - which would bring up a basic digital signage experience on your HDMI connected screen.


