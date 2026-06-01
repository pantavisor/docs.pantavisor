# First Boot

If you have already [downloaded](choose-image.md) a Pantavisor image, it is time to use it for the fist time in your device. For that we are generally going to flash the storage medium of the device and set up its connectivity so you can [manage](choose-way.md) it from your host computer. If you want to perform this management using Pantacor Hub, you will need to connect it to an Internet-facing network.

## Target Device Architectures

:::note
These guides do not cover all the boards we support. The more complete list of boards currently supported can be consulted [here](initial-devices.md). 
:::

### RPi3, RPi4, BPI-R64, RPi0w, Rock64 or Nvidia Tegra

To use these images, you need to flash your SD card and then boot the board up. You can see how to do this with more detail in the [get started guide](image-setup-rpi3.md#flash-initial-image), which focuses RPi3 and RPi4, but the process will be similar for all of these devices.

To connect the board to a LAN or directly to your computer, you can follow the [RPi3 and RPi4 instructions](first-boot-rpi3.md#setting-up-the-connection-of-your-board) again. Notice in the case of Rock64, only Ethernet will be a possibility.

We recommend downloading this image through the wizard on https://hub.pantacor.com/download-image which allows you to
markt he image to auto join your account and even configure wifi credentials for systems that have wifi built-in or
in a supported dongle.

### Colibri-iMX6dl or Colibri-iMX6ull (Toradex)

To install our Toradex build, we offer a tarball that you can unpack on an SD Card that you then plug into your Toradex board before booting the Tezi Easy Installer. It will automatically install the image on an SD Card (tested with Tezi Easy Installer 5.7.1 for iMX6 and iMX6ULL).

  * [Colibri-iMX6dl](https://artifacts.toradex.com/artifactory/tezi-oe-prod-frankfurt/dunfell-5.x.y/release/13/colibri-imx6/tezi/tezi-run/oedeploy/Colibri-iMX6_ToradexEasyInstaller_5.7.1+build.13.zip)
  * [Colibri-iMX6ull](https://artifacts.toradex.com/artifactory/tezi-oe-prod-frankfurt/dunfell-5.x.y/release/13/colibri-imx6ull/tezi/tezi-run/oedeploy/Colibri-iMX6ULL_ToradexEasyInstaller_5.7.1+build.13.zip)

Our builds support both gadget networking as well as ethernet if your carrier board has them wired.

Before you install you can also overload the "configargs" variable in uEnv.colibri-imx6dl.txt and uEnv.colibri-imx6ull.txt to inject pvnet_ arguments to configure the default network, for example:

```
$ cat uEnv.colibri-imx6ull.txt
localargs=pvnet_type=gadget pvnet_address=dhcp
```

Some examples are included in the default uEnv files:

```
#localargs=pvnet_type=ethernet pvrsdk_httpd_listen=0.0.0.0
#localargs=pvnet_type=gadget pvrsdk_httpd_listen=0.0.0.0
#localargs=pvnet_type=wifi pvnet_ssid=YOURSSID pvnet_pass=YOURPSK
#localargs=pvrsdk_httpd_listen=0.0.0.0
localargs=pvnet_type=gadget pvrsdk_httpd_listen=0.0.0.0
```

:::note
The defaults will open the [pvtx API](pvtx-open-api.md), which will enable both the [pvtx web UI](pvtx-introduction.md) and [local pvr](clone-your-system.md#from-the-device-itself). Please, remember to remove the pvrsdk_httpd_listen flag for anything running in the wild.
:::

### x64-uefi or x64-ubuntu

These images boot from an external storage device (SD card, USB key..) from BIOS/UEFI. The default image is meant to be directly flashed onto the final storage device where the system will run, while the installer is flashed into a temporary storage device. To see how to flash your storage device, take a look at the [get started guide](image-setup-rpi3.md). Even though this guide is for RPi3 and RPi4, the flashing process will be similar.

Once this is done, insert the storage device into your x64 device and power it up. You might also need to access the BIOS/UEFI menu and boot the target device from the storage device, if that is not the default boot option. In that case, you will need to do this with a keyboard and screen connected to your device.

To connect the board to a LAN or directly to your computer, you can follow the [RPi3 and RPi4 instructions](first-boot-rpi3.md#setting-up-the-connection-of-your-board) again.

#### Default

If you are using the default image, Pantavisor boots from the storage device. Just make sure your BIOS/UEFI is set to run that device by default and you should be good to go.

#### Installer

After booting up, the installer prompts with a menu and automatically flashes the first available permanent storage device found. A reboot is required after this finishes.

For troubleshooting or to simply choose the permanent storage device from a list of flashable devices, select the manual installation option in the menu before it triggers the automatic installation. Instructions will follow on screen that describe how to do this from the console.

### QEMU

Despite Pantavisor is made to be run on embedded devices, you can also try it out by emulating the device with QEMU. Another option that we cover in a different guide is to run Pantavisor as a [deamon](requirements-appengine.md) in any Linux system.

#### x64

Before you can use the image, change its format to QCOW2 using the `qemu-img` tool. Remember to use the default (non-installer) x64 image:

```
qemu-img convert -O qcow2 x64_initial_stable.img x64-uefi-pv-4096MiB.qcow2
```

Besides that, it is necessary to run an [OVMF](https://github.com/tianocore/tianocore.github.io/wiki/How-to-run-OVMF). Once done, execute this command:

```
qemu-system-x86_64 -enable-kvm \
	-bios /usr/share/qemu/OVMF.fd \
	-drive file=x64-uefi-pv-4096MiB.qcow2,format=qcow2 \
	-nographic \
	-m 512m \
	-net nic \
	-net user
```

This should run the image and show a menu to finally execute Pantavisor.

#### Malta

We prepared a Docker container that allows you to run the malta-qemu image. Keep in mind though that the script that runs changes the network configuration on your host:

```
docker run --privileged --net host -v </your/host/path/to/pflash.img>:/tmp/pflash.img -it --rm pantacor/qemu-malta-16m
```

When the initialization script and boot up log ends, press ENTER to see the LEDE console.

## What is next?

Our initial images come with a set of [containers](initial-devices.md#about-pantavisor-initial-devices) that will help you with the development process. If you want to install new containers and other types of device managemtn, you can proceed to [this page](choose-way.md).

## Troubleshooting

Our pre-compiled images are built with the [PANTAVISOR_DEBUG](build-options.md) option. This means you will have [SSH, TTY and other goodies](inspect-device.md) available for debugging your devices. Most of the items explained in our getting started [troubleshooting](board-troubleshooting-rpi3.md) section are applicable here.
