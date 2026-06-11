---
title: Variscite VAR-SOM-MX8M-NANO
sidebar_position: 2
description: Flash Pantavisor to a Variscite VAR-SOM-MX8M-NANO (i.MX8M Nano) over uuu to eMMC or via SD card, with Symphony-Board boot-select settings.
---

# Flashing: Variscite VAR-SOM-MX8M-NANO

**Flash methods:** uuu (eMMC) | SD card — see the [uuu](/install/uuu) and [SD card](/install/sdcard) guides

**Image artifact:** `pantavisor-starter-imx8mn-var-som*.wic`

## Hardware overview

The VAR-SOM-MX8M-NANO is based on the NXP i.MX8M Nano SoC. It is typically
used with the **Symphony-Board** carrier board.

## SD card boot

On the Symphony-Board, the boot source is selected with the **SW3 "Boot
select" slide switch** (a two-position switch — there is no boot DIP block):

| SW3 position | Boot source |
|---|---|
| **SD** | microSD card (slot J28) |
| **Internal** | SoM eMMC |

Power off, set SW3 to **SD**, insert the flashed SD card into J28, and power
on. See the [SD card flashing guide](/install/sdcard) for how to write the
`.wic` image.

## uuu (USB download to eMMC)

### 1. Enter USB serial download mode

The i.MX8M Nano falls into serial download mode when it finds no boot source:
set SW3 to **SD** with **no SD card inserted**, then power on.

### 2. Connect USB OTG

Connect a USB cable from the board's **USB OTG** port to your host PC.

### 3. Flash

```bash
sudo uuu -b emmc_all \
    imx-boot \
    pantavisor-starter-imx8mn-var-som*.wic
```

See the [uuu flashing guide](/install/uuu) for full details and troubleshooting.

### 4. Restore boot-mode to eMMC

Set SW3 back to **Internal** and power-cycle.

## Notes

- Switch positions per the [Variscite VAR-SOM-MX8M-NANO Evaluation Kit Quick
  Start Guide](https://variscite.com/wp-content/uploads/2020/02/VAR-SOM-MX8M-NANO-quick-start-guide.pdf).
- The Variscite BSP (meta-variscite-bsp) provides additional uuu scripts.
  Consult the [Variscite wiki](https://variwiki.com/index.php?title=VAR-SOM-MX8M-NANO)
  for advanced uuu usage.
- CAAM (Cryptographic Accelerator) is enabled and available for
  dm-crypt/dm-verity operations.

## Console and next steps

The serial console runs at **115200 8N1** — see
[serial port access](/operate/device-access/serial-port) for how to connect.
Once the device boots, [install your first app](/develop/application/install/).
