# Pantavisor BSP

## Update a Pantavisor BSP

To use these devices, you will need an already flashed and ready-to-use Pantavisor device. If you don't have one, go to the guide on [how-to prepare your device](choose-device.md).

These BSPs are stored on Pantahub devices, and can be used from your device checkout with pvr:

```
pvr merge https://pvr.pantahub.com/pantahub-ci/rpi64_5_10_y_bsp_latest
pvr checkout
```

### Stable

:::note
This devices contain both the stable and the release candidate versions. Navigate through the device _History_ tab to switch to the version you want to use.
:::

| Platform | Target | Pantahub devices |
 | --- | --- | --- |
 | **aarch64-appengine** | aarch64-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62eb81e9d8d538000aebf3ff)
 **aarch64-generic** | aarch64-generic | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fb3f2cf1506e2000a9877cf)
**arm-appengine** | arm-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62eb81dd5def3d000ab43c5a)
**arm-generic** | arm-generic | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f6d0eaa73f000a7159ca)
**beaglev** | beaglev | [device](https://hub.pantacor.com/u/pantahub-ci/devices/60a40f19be4c36000a15391e)
**bpi-r2** | arm-bpi-r2 | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f6ddeaa73f000a715a24)
**bpi-r64** | arm-bpi-r64 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fbccd575ded00000a764ff6)
**toradex-colibri-imx6_7** | arm-toradex-colibri-imx6_7 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5f743fed8ce2a5000bb66d6f)
**malta** | malta-qemu | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f83d82f42a000ac1af5c)
**mips-appengine** | mips-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62eb81f79340a8000b2c4569)
**mips-generic** | mips-generic | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f70982f42a000ac1a937)
**nv-tegra-4_9** | nv-tegra-4_9 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/60c7350fb6616e000a030294)
**odroid-c2** | arm-odroid-c2 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fabb4b75ded00000a4b5cf4)
**rock64** | rock64 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/629c9f7aec518b000ae464f8)
**rpi0w-5.10.y** | arm-rpi0w-5.10.y | [device](https://hub.pantacor.com/u/pantahub-ci/devices/63da8d3b98127c000d0b41c0)
**rpi64-5.10.y** | rpi64-5.10.y | [device](https://hub.pantacor.com/u/pantahub-ci/devices/611fc1719f2613000a36e357)
**x64-appengine** | x64-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62eb82060b1d35000a2f66bb)
**x64-generic** | x64-generic | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ecbd1e518f6c6000a904c69)
**x64-ubuntu** | x64-ubuntu | [device](https://hub.pantacor.com/u/pantahub-ci/devices/64cbbdb55190f7000ec2aee2)
**x64-uefi** | x64-uefi | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f73c82f42a000ac1aa33) |

### Latest

| Platform | Target | Pantahub devices |
 | --- | --- | --- |
 | **aarch64-appengine** | aarch64-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62eb81e45def3d000ab43fd6)
**aarch64-generic** | aarch64-generic | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fb3f2cd5a8841000a003c07)
**arm-appengine** | arm-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62eb81d60b1d35000a2f5151)
**arm-generic** | arm-generic | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f6c818f6c6000a6200f1)
**beaglev** | beaglev | [device](https://hub.pantacor.com/u/pantahub-ci/devices/60a40f12f443a0000a40cda5)
**bpi-r2** | arm-bpi-r2 | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f6d8a223e2000a2d30fb)
**bpi-r64** | arm-bpi-r64 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fbccd555a8841000a4aa52b)
**toradex-colibri-imx6_7** | arm-toradex-colibri-imx6_7 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5f743fe26ca916000a9211bb)
**malta** | malta-qemu | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f83782f42a000ac1af44)
**mips-appengine** | mips-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62eb81f05def3d000ab44483)
**mips-generic** | mips-generic | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f70182f42a000ac1a927)
**nv-tegra-4_9** | nv-tegra-4_9 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/60c7350c96a522000a63e696)
**odroid-c2** | arm-odroid-c2 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fabb4ad5a8841000aafd265)
**rock64** | rock64 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/629c9f77eb4989000ae76512)
**rpi0w-5.10.y** | arm-rpi0w-5.10.y | [device](https://hub.pantacor.com/u/pantahub-ci/devices/63da8d34d69f78000d8436e8)
**rpi64-5.10.y** | rpi64-5.10.y | [device](https://hub.pantacor.com/u/pantahub-ci/devices/611fc105879067000afffbd6)
**x64-appengine** | x64-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62eb81fe0b1d35000a2f63e0)
**x64-generic** | x64-generic | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ecbd1e0a223e2000a5b699d)
**x64-ubuntu** | x64-ubuntu | [device](https://hub.pantacor.com/u/pantahub-ci/devices/64cbbdc45190f7000ec2b044)
**x64-uefi** | x64-uefi | [device](https://www.pantahub.com/u/pantahub-ci/devices/5ec4f735a223e2000a2d327e) |

## About Pantavisor BSP

The [BSP CI](https://gitlab.com/pantacor/pv-manifest) builds daily and stable versions of our BSP for several targets so you can use them and focus on your [Pantavisor app development](create-apps.md).

The BSP devices are automatically upgraded with GitLab CI in this [project](https://gitlab.com/pantacor/pv-manifest). Check out the jobs in the [pipeline list](https://gitlab.com/pantacor/pv-manifest/pipelines) and the release notes for each stable version in the [list of tags](https://gitlab.com/pantacor/pv-manifest/-/tags).
