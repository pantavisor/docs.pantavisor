---
title: Variscite VAR-SOM-MX8M-NANO
sidebar_position: 2
description: Flash Pantavisor to a Variscite VAR-SOM-MX8M-NANO (i.MX8M Nano) via pv-flash-bundle (UUU) to eMMC or via SD card, with Symphony-Board boot-select settings.
---

# Flashing: Variscite VAR-SOM-MX8M-NANO

**Flash methods:** pv-flash-bundle / uuu (eMMC) | SD card — see the
[uuu](/install/uuu) and [SD card](/install/sdcard) guides

**Image artifact:** `pv-flash-bundle-imx8mn-var-som.tar.gz` (eMMC) or
`pantavisor-starter-imx8mn-var-som*.wic` (SD card)

## Hardware overview

The VAR-SOM-MX8M-NANO is based on the NXP i.MX8M Nano SoC. It is typically
used with the **Symphony-Board** carrier board.

## SD card boot

Set the boot-mode switches on the Symphony-Board to select SD boot:

| Switch | SD boot | eMMC boot |
|---|---|---|
| SW4-1 | ON | OFF |
| SW4-2 | ON | OFF |
| SW4-3 | OFF | ON |
| SW4-4 | OFF | OFF |

Insert the flashed SD card and power on. See the [SD card flashing
guide](/install/sdcard) for how to write the `.wic` image.

## uuu (USB download to eMMC)

### 1. Set boot-mode to USB download

| Switch | USB download |
|---|---|
| SW4-1 | OFF |
| SW4-2 | OFF |
| SW4-3 | OFF |
| SW4-4 | OFF |

### 2. Connect USB OTG

Connect a USB cable from the board's **USB OTG** port to your host PC.

### 3. Flash

Using the self-contained bundle (recommended — no `uuu` install needed):

```bash
tar xzf pv-flash-bundle-imx8mn-var-som.tar.gz
cd pv-flash-bundle-imx8mn-var-som
./flash.sh
```

Or manually, with `uuu` already installed on the host:

```bash
sudo uuu -b emmc_all \
    imx-boot-imx8mn-var-som*.bin \
    pantavisor-starter-imx8mn-var-som*.wic
```

See the [uuu flashing guide](/install/uuu) for full details and
troubleshooting. Variscite's production bootloader already self-enters SDP
mode, so no separate recovery build is needed — the bundle is built straight
from the main image.

### 4. Restore boot-mode to eMMC

Set switches back to eMMC boot mode (table above) and power-cycle.

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
