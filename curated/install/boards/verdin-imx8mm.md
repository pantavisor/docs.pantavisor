---
title: Toradex Verdin iMX8M Mini
sidebar_position: 4
description: Flash Pantavisor to a Toradex Verdin iMX8M Mini via the Toradex Easy Installer (Tezi), including carrier-board device-tree selection.
---

# Flashing: Toradex Verdin iMX8M Mini

**Flash method:** Toradex Easy Installer (Tezi) — see the [Tezi flashing guide](/install/tezi)

**Image artifact:** `pantavisor-starter-verdin-imx8mm*pv_teziimg.tar.xz`

## Supported carrier boards and device trees

The default build targets the **WiFi variant** with the development carrier
board device tree. Change `UBOOT_DTB_NAME` in `kas/machines/verdin-imx8mm.yaml`
to match your carrier board:

| Carrier board | `UBOOT_DTB_NAME` value |
|---|---|
| Development board (default) | `imx8mm-verdin-wifi-dev.dtb` |
| Ivy board | `imx8mm-verdin-wifi-ivy.dtb` |
| Mallow board | `imx8mm-verdin-wifi-mallow.dtb` |
| Yavia board | `imx8mm-verdin-wifi-yavia.dtb` |

## Entering Tezi recovery mode

### Verdin Development Board

1. Connect a USB-C cable from the board's **USB-C (OTG)** port to your host PC.
2. Hold the **Recovery** button (or short the RECOVERY pin) while powering on
   the board.
3. The Verdin enters USB serial download mode. Run Toradex's recovery script
   on the host to load Tezi into the module's RAM — see the
   [Tezi flashing guide](/install/tezi). Tezi then runs on the module itself.

### Other carrier boards

Consult the Toradex developer documentation for your specific carrier board.
The Verdin SOM enters recovery mode when `RECOVERY#` is pulled low during
power-on.

## Flashing

Follow the [Tezi flashing procedure](/install/tezi).

## Notes

- The build enables WiFi (`TORADEX_VARIANT = "wifi"`) and autoloads
  `cfg80211` and `mwifiex_sdio` kernel modules.
- `PV_UBOOT_AUTOFDT` is disabled; the DTB is fixed by `PV_INITIAL_DTB`.
  If you switch carrier boards, update both `UBOOT_DTB_NAME` and
  `PV_INITIAL_DTB` in the machine YAML.
- eMMC is the primary storage; Tezi writes to it directly.

## Console and next steps

The serial console runs at **115200 8N1** — see
[serial port access](/operate/device-access/serial-port) for how to connect.
Once the device boots, [install your first app](/develop/application/install/).
