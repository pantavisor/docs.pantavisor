---
title: Flash with pv-flash-bundle
sidebar_position: 220
description: Flash Pantavisor to Toradex module NAND/eMMC over USB with the self-contained pv-flash-bundle (UUU-based), no Tezi or separate uuu install required.
---

# Flashing via pv-flash-bundle

Toradex boards flash over USB using **pv-flash-bundle**, a self-contained
archive built around NXP's UUU (Universal Update Utility). It bundles a
portable `uuu` binary, a recovery U-Boot, and a generated flash script into
one `.tar.gz` — no Toradex Easy Installer (Tezi) and no separate `uuu`
install needed on the host.

> Pantavisor no longer uses Tezi for these boards. If you have an older
> `pv_teziimg.tar.xz` bundle or Tezi-based instructions, they are outdated —
> use pv-flash-bundle instead.

## Machines using this method

| Machine file | Board | Storage |
|---|---|---|
| `kas/machines/colibri-imx6ull.yaml` | Toradex Colibri iMX6ULL | NAND |
| `kas/machines/verdin-imx8mm.yaml` | Toradex Verdin iMX8M Mini (WiFi variant) | eMMC |

For board-specific hardware setup (entering USB recovery mode) see:

- [Colibri iMX6ULL](boards/colibri-imx6ull.md)
- [Verdin iMX8M Mini](boards/verdin-imx8mm.md)

## Prerequisites

- USB cable (Micro-USB for most Colibri carrier boards, USB-C for Verdin)
  from the board's **USB OTG** port to your host PC
- An x86-64 Linux host — the bundled `uuu` binary targets x86-64 and needs
  no separate installation

## Locating the bundle

After a successful build the bundle is at:

```
build/tmp-scarthgap/deploy/images/<machine>/pv-flash-bundle-<machine>.tar.gz
```

## Flashing procedure

### 1. Put the module into USB download (SDP) mode

Each carrier board has a different way to enter recovery mode. See the
board-specific page linked above.

### 2. Extract the bundle

```bash
tar xzf pv-flash-bundle-<machine>.tar.gz
cd pv-flash-bundle-<machine>
```

### 3. Flash

```bash
./flash.sh
```

`flash.sh` invokes `sudo ./uuu ./`, which reads the bundled `uuu.auto` script
and runs the full SDP → fastboot → storage flash sequence. You'll be
prompted for your sudo password if needed.

### 4. Boot normally

Power-cycle the board (or release the recovery button/jumper). It boots
Pantavisor from eMMC (Verdin) or NAND (Colibri).

## Notes

- **USB permissions**: if you get a permission error or `LIBUSB_ERROR_IO`,
  add udev rules for both the NXP SDP ROM and the Toradex fastboot U-Boot:
  ```bash
  sudo tee /etc/udev/rules.d/70-nxp-sdp.rules << 'EOF'
  SUBSYSTEM=="usb", ATTRS{idVendor}=="15a2", ATTRS{idProduct}=="0080", ENV{ID_INPUT}="", ENV{LIBINPUT_IGNORE_DEVICE}="1", MODE="0666", TAG+="uaccess"
  EOF
  echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="1b67", MODE="0666"' \
      | sudo tee /etc/udev/rules.d/70-toradex-uuu.rules
  sudo udevadm control --reload-rules && sudo udevadm trigger
  ```
  Disconnect and reconnect the USB cable after applying the rules.
- **Existing installation**: the recovery U-Boot ignores any stored
  environment, so flashing works correctly even on modules that already
  have a Pantavisor installation.
- The Verdin build uses the WiFi device tree (`imx8mm-verdin-wifi-dev.dtb`)
  by default. Change `UBOOT_DTB_NAME` in `kas/machines/verdin-imx8mm.yaml`
  to target a different carrier board — see the
  [Verdin board guide](boards/verdin-imx8mm.md) for the full table.
- The Colibri iMX6ULL bundle writes U-Boot to the `u-boot1`/`u-boot2` NAND
  partitions and the Pantavisor rootfs to a `boot` UBI volume — see the
  [Colibri board guide](boards/colibri-imx6ull.md) for the NAND layout.
