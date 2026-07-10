---
title: Toradex Colibri iMX6ULL
sidebar_position: 1
description: Flash Pantavisor to a Toradex Colibri iMX6ULL module via pv-flash-bundle (UUU), including carrier-board recovery-mode setup and NAND layout.
---

# Flashing: Toradex Colibri iMX6ULL

**Flash method:** pv-flash-bundle (UUU) — see the [pv-flash-bundle guide](/install/pv-flash-bundle)

**Image artifact:** `pv-flash-bundle-colibri-imx6ull.tar.gz`

> This board no longer flashes via Toradex Easy Installer (Tezi). If you have
> older instructions or a `pv_teziimg.tar.xz` bundle, they are outdated.

## Supported carrier boards

Standard Toradex carrier boards:

- Colibri Evaluation Board (EVB)
- Aster carrier board
- Viola carrier board

## Entering USB serial download (SDP) mode

The Colibri iMX6ULL ROM enters SDP mode when the `RECOVERY#` pin is held low
during power-on. For the iMX6ULL the ROM directly loads a full U-Boot binary
(no SPL stage).

### Colibri Evaluation Board v3

1. Connect a Micro-USB cable from the board's **USB Client** port to your host PC.
2. Hold the **Recovery** button while applying power (or while pressing Reset).
3. Release after ~1 second. The module enumerates as an NXP SDP device.

Verify detection from inside the extracted bundle:

```bash
sudo ./uuu -lsusb
# Expected: SE Blank ARIK  or  SDP:MX6ULL
```

### Other carrier boards

Refer to the carrier board datasheet for the correct boot-mode configuration.
The general principle is the same: pull `RECOVERY#` low during power-on to
force USB serial download mode.

## Flashing

Follow the [pv-flash-bundle procedure](/install/pv-flash-bundle): extract the
bundle and run `./flash.sh`.

## NAND partition layout

The production NAND layout (from `colibri-imx6ull_defconfig`):

| Partition | Offset | Size | Purpose |
|---|---|---|---|
| `mx6ull-bcb` | `0x000000` | 512 KB | Boot Control Block |
| `u-boot1` _(ro)_ | `0x080000` | 1536 KB | Primary U-Boot |
| `u-boot2` _(ro)_ | `0x200000` | 1536 KB | U-Boot redundant copy |
| `u-boot-env` | `0x380000` | 512 KB | U-Boot environment |
| `ubi` | `0x400000` | remainder | UBI device (`boot` UBIFS volume) |

The pv-flash-bundle UUU script writes U-Boot to `u-boot1` and `u-boot2` using
raw byte offsets (bypassing the `ro` partition flag, which only applies in
Linux userspace). It also erases `u-boot-env` so U-Boot starts from its
built-in default environment — a leftover env from a prior image (e.g. Tezi
or TorizonCore) carries a stale `bootcmd` that fails to boot Pantavisor. The
`ubi` MTD partition is then erased, a `boot` UBI volume created, and the
Pantavisor UBIFS rootfs written into it.

## Notes

- The Colibri iMX6ULL module uses NAND as its primary storage; there is no
  SD card option for this board.
- WiFi firmware is included (`linux-firmware-sd8997`) for **WB** modules.
- eMMC-equipped Colibri iMX6ULL modules (product ID 0062) use a different
  machine configuration (`colibri-imx6ull-emmc`) and are not covered here.
- After flashing, release the recovery button/jumper before the next power
  cycle so the module boots from NAND.

## Console and next steps

The serial console runs at **115200 8N1** — see
[serial port access](/operate/device-access/serial-port) for how to connect.
Once the device boots, [install your first app](/develop/application/install/).
