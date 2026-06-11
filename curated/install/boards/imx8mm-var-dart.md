---
title: Variscite DART-MX8M-MINI
sidebar_position: 3
description: Flash Pantavisor to a Variscite DART-MX8M-MINI (i.MX8M Mini) over uuu to eMMC or via SD card, with DT8MCustomBoard boot-select settings.
---

# Flashing: Variscite DART-MX8M-MINI

**Flash methods:** uuu (eMMC) | SD card — see the [uuu](/install/uuu) and [SD card](/install/sdcard) guides

**Image artifact:** `pantavisor-starter-imx8mm-var-dart*.wic`

## Hardware overview

The DART-MX8M-MINI is based on the NXP i.MX8M Mini SoC and is typically used
with the **DT8MCustomBoard** carrier (the Variscite evaluation-kit carrier;
the Symphony-Board serves the VAR-SOM family, not DART-form-factor modules).

## SD card boot

On the DT8MCustomBoard, the boot source is selected with the **SW8 "Boot
select" slide switch** (a two-position switch — there is no boot DIP block):

| SW8 position | Boot source |
|---|---|
| **EXT** | microSD card (slot J31) |
| **INT** | SoM eMMC |

Power off, set SW8 to **EXT**, insert the flashed SD card, and power on. The
boot-select designator can differ between carrier revisions — follow the
"Boot select" silkscreen label on your board. See the [SD card flashing
guide](/install/sdcard) for how to write the `.wic` image.

## uuu (USB download to eMMC)

### 1. Enter USB serial download mode

The i.MX8M Mini falls into serial download mode when it finds no boot source:
set SW8 to **EXT** (SD) with **no SD card inserted**, then power on.

### 2. Connect USB OTG

Connect a USB cable from the board's **USB OTG** port (Micro-USB or USB-C
depending on the carrier board revision) to your host PC.

### 3. Flash

```bash
sudo uuu -b emmc_all \
    imx-boot \
    pantavisor-starter-imx8mm-var-dart*.wic
```

See the [uuu flashing guide](/install/uuu) for full details and troubleshooting.

### 4. Restore boot-mode to eMMC

Set SW8 back to **INT** and power-cycle.

## Notes

- Switch positions per the [Variscite DART-MX8M-MINI Evaluation Kit Quick
  Start Guide](https://www.variscite.com/wp-content/uploads/2019/02/DART-MX8M-MINI-quick-start-guide.pdf).
- The Variscite BSP (meta-variscite-bsp) provides additional uuu scripts.
  Consult the [Variscite wiki](https://variwiki.com/index.php?title=DART-MX8M-MINI)
  for advanced uuu usage.
- CAAM (Cryptographic Accelerator) is enabled in the Variscite BSP and is
  available to Pantavisor for dm-crypt/dm-verity operations.

## Console and next steps

The serial console runs at **115200 8N1** — see
[serial port access](/operate/device-access/serial-port) for how to connect.
Once the device boots, [install your first app](/develop/application/install/).
