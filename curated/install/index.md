---
title: Install on hardware
description: Flash and install Pantavisor on supported boards.
sidebar_position: 3
slug: /install
---

# Install on hardware

Pantavisor builds produce a flashable image per machine. Pick the install
method that matches your board, then follow the board guide for any
hardware-specific steps such as boot-mode switches or recovery jumpers.

## Choose your method

| Method | Use when | Guide |
|---|---|---|
| SD card (WIC image) | The board boots from SD — Raspberry Pi, Variscite, Rockchip, TI, Allwinner, and most others | [Flash an SD card](/install/sdcard) |
| Toradex Easy Installer (Tezi) | Toradex modules with eMMC (Colibri, Verdin) | [Flash with Tezi](/install/tezi) |
| NXP uuu | i.MX boards with eMMC and a USB download port (Variscite) | [Flash with uuu](/install/uuu) |
| Docker / AppEngine | No hardware — run Pantavisor inside your existing Linux distro | [Run with AppEngine](/install/docker) |

## Board guides

- [Raspberry Pi](boards/raspberry-pi.md)
- [Toradex Colibri iMX6ULL](boards/colibri-imx6ull.md)
- [Variscite VAR-SOM-MX8M-NANO](boards/imx8mn-var-som.md)
- [Variscite DART-MX8M-MINI](boards/imx8mm-var-dart.md)
- [Toradex Verdin iMX8M Mini](boards/verdin-imx8mm.md)

## All supported machines

See the [supported devices](/install/supported-devices) list for every machine
in the meta-pantavisor layer and which ones have pre-built images.

Board-specific generated material is in the
[Reference → meta-pantavisor install guides](/reference).
