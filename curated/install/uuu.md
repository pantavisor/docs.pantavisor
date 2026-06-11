---
title: Flash with NXP uuu
sidebar_position: 230
description: Flash Pantavisor to i.MX board eMMC over USB with NXP's Universal Update Utility (uuu).
---

# Flashing via NXP uuu (Universal Update Utility)

Some i.MX-based boards support flashing via **uuu** (Universal Update Utility),
NXP's USB-based download tool. This is useful for flashing eMMC without
removing it from the board.

For board-specific hardware setup (boot switches, jumpers) see:

- [Variscite DART-MX8M-MINI](boards/imx8mm-var-dart.md)
- [Variscite VAR-SOM-MX8M-NANO](boards/imx8mn-var-som.md)

## Prerequisites

- USB Type-A to USB-C (or Micro-USB) cable connected to the board's USB OTG / download port
- [uuu](https://github.com/nxp-imx/mfgtools/releases) installed on the host

```bash
# Install uuu on Debian/Ubuntu
sudo apt install uuu

# Or download the binary from GitHub releases
```

## Locating the artifacts

After a successful build, the WIC image and SPL/u-boot binaries are at:

```
build/tmp-scarthgap/deploy/images/<machine>/
  pantavisor-starter-<machine>*.wic
  imx-boot                      # SPL + u-boot FIT image (symlink)
```

## Flashing procedure

### 1. Put the board into USB download (serial download) mode

See the board-specific page for the exact switch/jumper settings.

### 2. Connect USB and verify

```bash
# uuu should detect the board
sudo uuu -lsusb
```

You should see an `SDP:` entry for the i.MX8M device listed.

### 3. Flash with uuu

#### Option A — using the WIC image directly

```bash
sudo uuu -b emmc_all imx-boot pantavisor-starter-<machine>*.wic
```

#### Option B — using a board-vendor uuu script (Variscite)

Variscite BSPs ship a `uuu_imx_android_flash.sh` script. Refer to the
[Variscite wiki](https://variwiki.com) for the board-specific command.

### 4. Boot normally

Remove the download-mode jumper/switch, then power-cycle the board. It will
boot from eMMC.

## Notes

- uuu requires root or udev rules granting access to the USB device.
  Add the NXP vendor udev rule if you get permission errors:
  ```bash
  echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="1fc9", MODE="0666"' \
      | sudo tee /etc/udev/rules.d/70-nxp-uuu.rules
  sudo udevadm control --reload-rules
  ```
- The `emmc` built-in script writes only the bootloader; use `emmc_all` to
  write the full image. There is no built-in rootfs-only script.
