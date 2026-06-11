---
title: Flash with Toradex Easy Installer
sidebar_position: 220
description: Flash Pantavisor to Toradex module eMMC over USB with the Toradex Easy Installer (Tezi) and the pv_teziimg bundle.
---

# Flashing via Toradex Easy Installer (Tezi)

Toradex boards use the **Toradex Easy Installer (Tezi)** to flash images to
the on-module eMMC over USB. Pantavisor produces a custom `pv_teziimg` bundle
that is compatible with the Tezi protocol.

## Machines using this method

| Machine file | Board |
|---|---|
| `kas/machines/colibri-imx6ull.yaml` | Toradex Colibri iMX6ULL |
| `kas/machines/verdin-imx8mm.yaml` | Toradex Verdin iMX8MM (WiFi variant) |

For board-specific hardware setup (boot switches, recovery mode) see:

- [Colibri iMX6ULL](boards/colibri-imx6ull.md)
- [Verdin iMX8MM](boards/verdin-imx8mm.md)

## Prerequisites

- USB Type-A to Micro-USB or USB-C cable (depends on carrier board)
- Host PC to run the Toradex recovery procedure that loads
  [Toradex Easy Installer](https://developer.toradex.com/easy-installer/toradex-easy-installer/)
  into the module's RAM

## Locating the image

After a successful build the Tezi bundle is at:

```
build/tmp-scarthgap/deploy/images/<machine>/pantavisor-starter-<machine>*pv_teziimg.tar.xz
```

## Flashing procedure

### 1. Put the module into recovery mode

Each carrier board has a different way to enter recovery mode. See the
board-specific page linked above.

### 2. Load Toradex Easy Installer into the module's RAM

With the module in recovery mode and connected over USB, run Toradex's
recovery procedure on the host (see the
[Toradex Easy Installer documentation](https://developer.toradex.com/easy-installer/toradex-easy-installer/)).
It downloads Tezi over USB into the module's RAM and starts it.

### 3. Open the Tezi UI

Tezi runs on the module itself. Its UI appears on the module's display, or
remotely via VNC if no display is attached.

### 4. Provide the Pantavisor bundle

Make the `*pv_teziimg.tar.xz` image available to Tezi via a USB stick, an SD
card, or a directory served by a local HTTP server configured as an image
feed.

### 5. Flash

Select the Pantavisor image in the Tezi UI and click **Install**. Tezi writes
the image to eMMC and offers to reboot when done.

## Notes

- The `pv_teziimg` format is a Pantavisor-specific extension of the standard
  Tezi image format. It includes the Pantavisor initramfs and boot files
  in addition to the rootfs.
- The Verdin iMX8MM build uses the WiFi device tree
  (`imx8mm-verdin-wifi-dev.dtb`) by default. Change `UBOOT_DTB_NAME` in
  `kas/machines/verdin-imx8mm.yaml` to target a different carrier board.
- The Colibri iMX6ULL build includes carrier-board-specific settings from
  `conf/machine/include/colibri-imx6ull.inc`.
