---
title: Supported Devices
sidebar_position: 200
description: Table of supported devices
---

While Pantavisor can run on virtually any device that supports Linux, we offer official, out-of-the-box support for a wide range of popular hardware through our [meta-pantavisor](https://github.com/pantavisor/meta-pantavisor) Yocto layer. This ensures a smooth and tested experience for developers.

Note that pre-built, downloadable images only exist for the machines built by CI; for the rest you build the image from source with KAS — see [Get started building](/build/get-started).

## Pre-built images

If you want a quickstart, we have a couple of pre-built images ready for testing and exploring Pantavisor. Head to [downloads](https://pantavisor.io/downloads/).

Once you have an image, see the install guides for how to flash it:
[SD card](/install/sdcard), [Toradex Easy Installer](/install/tezi), or
[NXP uuu](/install/uuu).

## Officially supported devices

Below is a list of devices and platforms that are officially supported. These are grouped by manufacturer or platform type for easy reference.

### Raspberry Pi Foundation
- rpi (all Raspberry Pi variants incl. RPi 5, multi-kernel multiconfig)
- raspberrypi-armv8 (e.g., Raspberry Pi 3/4)
- raspberrypi-armv7 (e.g., Raspberry Pi 2)

### NXP
- imx8qxp-b0-mek
- imx8qxp-mek

### Variscite

- imx8mn-var-som — see [VAR-SOM-MX8M-NANO guide](boards/imx8mn-var-som.md)
- imx8mm-var-dart — see [DART-MX8M-MINI guide](boards/imx8mm-var-dart.md)

### Toradex

- colibri-imx6ull — see [Colibri iMX6ULL guide](boards/colibri-imx6ull.md)
- verdin-imx8mm — see [Verdin iMX8M Mini guide](boards/verdin-imx8mm.md)

### Google

- Google Coral Dev Board

### Rockchip

- rockchip rk3328 evb
- rockchip rk3399pro evb
- rockchip rock64
- rockchip-nanopi-m4

### Radxa

- radxa rock5a
- radxa rock5b

### Texas Instruments (TI)

- TI AM62xx EVM
- TI AM62axx EVM
- TI AM65xx EVM
- TI Beaglebone
- TI Beagleplay

### Allwinner / Sunxi

- Banana Pi M2 Berry
- NanoPi R1
- Orange Pi R1
- Orange Pi Zero Plus2 H3
- Orange Pi 3 LTS
- Orange Pi PC Plus
- Orange Pi PC2

### RISC-V

- StarFive VisionFive 2

### Don't See Your Board?

No problem! Pantavisor is designed for portability. If your device can run Linux and has a Board Support Package (BSP), it can be enabled to run Pantavisor. Feel free to reach out to the community or our team for guidance on porting to new hardware.
