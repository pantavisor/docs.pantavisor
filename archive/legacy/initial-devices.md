# Pantavisor Initial Devices

## Update a Pantavisor Initial Device

To use these devices, you will need an already flashed and ready-to-use Pantavisor device. If you don't have one, go to the guide on [how-to prepare your device](choose-device.md).

If you want to update the BSP plus the development containers from any of the initial devices, you can upgrade your device checkout using [pvr](install-pvr.md). Just remember to change the pvr clone URL with the one corresponding to your platform:

```
pvr merge https://pvr.pantahub.com/pantahub-ci/rpi64_5_10_y_bsp_latest
pvr checkout
```

### Stable

:::note
This devices contain both the stable and the release candidate versions. Navigate through the device _History_ tab to switch to the version you want to use.
:::

| Platform | Target | Pantacor Hub devices |
| -------- | ------ | -------------------- |
| **aarch64-appengine** | aarch64-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62ecd63d0b1d35000aa1ae73)
**arm-appengine** | arm-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62ecd6269340a8000ba00870)
**bpi-r2** | arm-bpi-r2 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5d64df359061a500090ea599)
**bpi-r64** | arm-bpi-r64 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fbce1215673d4000aec2085)
**toradex-colibri-imx6_7** | arm-toradex-colibri-imx6_7 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5f74779e8ce2a5000bb838fc)
**malta** | malta-qemu | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5d553ba8e8c4940008979089)
**mips-appengine** | mips-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62ecd64f0b1d35000aa1b823)
**nv-tegra-4_9** | nv-tegra-4_9 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/60c88a3a96a522000a8859fc)
**odroid-c2** | arm-odroid-c2 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fabd4505a8841000ab1e538)
**rock64** | rock64 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/629d1d51eb4989000aead1af)
**rpi0w-5.10.y** | rpi0w-5.10.y | [device](https://hub.pantacor.com/u/pantahub-ci/devices/63dba61589de66000e6849f5)
**rpi64-5.10.y** | rpi64-5.10.y | [device](https://hub.pantacor.com/u/pantahub-ci/devices/611fc1b59f2613000a36e61a)
**x64-appengine** | x64-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62ecd62e9340a8000ba00b43)
**x64-ubuntu** | x64-ubuntu | [device](https://hub.pantacor.com/u/pantahub-ci/devices/65676e8ecef8160009ab7f00)
**x64-uefi** | x64-uefi | [device](https://www.pantahub.com/u/pantahub-ci/devices/5df242b508ef8d000946adf2) |

### Latest

| Platform | Target | Pantacor Hub devices |
| -------- | ------ | -------------------- |
| **aarch64-appengine** | aarch64-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62ecd6365def3d000a270af5)
**arm-appengine** | arm-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62ecd62e9340a8000ba00b43)
**bpi-r2** | arm-bpi-r2 | [device](https://www.pantahub.com/u/pantahub-ci/devices/5d64df359061a500090ea599)
**bpi-r64** | arm-bpi-r64 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fbce18e1506e2000ae3633a)
**toradex-colibri-imx6_7** | arm-toradex-colibri-imx6_7 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5f7456396c69e9000a18c2e7)
**malta** | malta-qemu | [device](https://www.pantahub.com/u/pantahub-ci/devices/5d553b5ae8c4940008978a8e)
**mips-appengine** | mips-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62ecd646d8d538000a5f5601)
**nv-tegra-4_9** | nv-tegra-4_9 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/60c88a97b6616e000a278961)
**odroid-c2** | arm-odroid-c2 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/5fabd47b1506e2000a4648a9)
**rock64** | rock64 | [device](https://hub.pantacor.com/u/pantahub-ci/devices/629d1d4dec518b000ae7db48)
**rpi0w-5.10.y** | rpi0w-5.10.y | [device](https://hub.pantacor.com/u/pantahub-ci/devices/63dba58198127c000dd301f9)
**rpi64-5.10.y** | rpi64-5.10.y | [device](https://hub.pantacor.com/u/pantahub-ci/devices/611fc226415a95000a4b9921)
**x64-appengine** | x64-appengine | [device](https://hub.pantacor.com/u/pantahub-ci/devices/62ecd6159340a8000ba001c6)
**x64-ubuntu** | x64-ubuntu | [device](https://hub.pantacor.com/u/pantahub-ci/devices/65676e7bf5b86e0009a75dda)
**x64-uefi** | x64-uefi | [device](https://www.pantahub.com/u/pantahub-ci/devices/5d838a31f99f9c00095b2f21) |

## About Pantavisor Initial Devices

Our [initial devices CI](https://gitlab.com/pantacor/ci/pv-initial-devices) keeps a set of devices of different architectures up to date with both stable and daily [BSP builds](bsp-devices.md) plus some containers that will help you start developing your own Pantavisor apps.

These are the containers included in the initial devices:

 * **awconnect**: automatically brings up basic cabled networking. If this fails, it creates a hotspot with SSID "Wifi Connect" with a captive portal that allows you to manually configure your device for WiFi connection. See more in our [reference](network-configuration.md).
 * **pv-avahi**: uses DNS multicast for device discoverability.
 * **pvr-sdk**: contains the Pantabox utilities to help with your development and debugging. Also, it incorporates an endpoint for pvr local experience. More in our [reference pages](pvr-sdk-reference.md).
 * **container-ready-demo**: mock-up container that sends a [ready signal](https://gitlab.com/pantacor/pv-platforms/container-ready-demo) to Pantavisor for testing and demostration purposes. 

The CI also generates [flashable images](initial-images.md) for the stable versions. Check out the jobs in the [pipeline list](https://gitlab.com/pantacor/ci/pv-initial-devices/pipelines) and the release notes for each stable version in the [list of tags](https://gitlab.com/pantacor/ci/pv-initial-devices/-/tags).
