---
title: Porting Pantavisor
sidebar_position: 50
description: Troubleshooting guide for Pantavisor Linux. Find solutions to common issues, connectivity problems, and app management questions.
keywords: ["pantavisor troubleshooting", "pantavisor problems", "embedded linux issues", "connectivity issues", "app problems", "pantavisor faq", "device troubleshooting", "pantavisor support", "embedded troubleshooting", "iot device issues"]
---

This section covers how to add support for a new device or hardware platform to `meta-pantavisor`.

## Build System Overview

`meta-pantavisor` uses **Yocto/OpenEmbedded** as its build system with **KAS** as the configuration and orchestration layer. KAS fetches the required layers, assembles `local.conf`, and launches BitBake — you do not need to manage Yocto layer paths manually.

All builds run through `kas-container`, a Docker-wrapped KAS that guarantees a reproducible build environment:

```bash
./kas-container build <config.yaml>
```

Supported Yocto releases: **scarthgap** (current) and **kirkstone** (LTS).

## Configuration Hierarchy

KAS configuration is composed by layering YAML fragments:

```
kas/bsp-base.yaml           ← base settings for all BSP builds
kas/scarthgap.yaml          ← Yocto release-specific patches
kas/platforms/<family>.yaml ← vendor BSP layers for a device family
kas/machines/<device>.yaml  ← machine-specific settings (includes platform)
```

## Porting Process

Adding a new device involves three steps, each covered in its own page:

1. **[Platform](./platform/)** — Create `kas/platforms/<family>.yaml` to declare the vendor BSP layers for a new hardware family. Skip this step if a suitable platform file already exists (check `kas/platforms/`).

2. **[Machine](./machine/)** — Create `kas/machines/<device>.yaml` to bind the platform to a specific Yocto `MACHINE` name and set any device-specific BitBake variables.

3. **[Building](./kas/)** — Run the build, locate the output artifacts, and flash the image to the board.

## Registering a Machine for CI

After creating a machine file, add an entry to `.github/machines.json` so the machine appears in CI workflows, then regenerate the workflow files:

```bash
# Edit .github/machines.json, then:
.github/scripts/makeworkflows
```

Commit `machines.json` and the generated workflow files together.

## Existing Platforms and Machines

Before starting, check whether your hardware is already supported:

- Platforms: `kas/platforms/` — includes `freescale.yaml`, `toradex.yaml`, `raspberrypi.yaml`, `rockchip.yaml`, `sunxi.yaml`, `ti.yaml`, `variscite.yaml`, and more
- Machines: `kas/machines/` — includes Raspberry Pi, Variscite, Toradex Verdin/Colibri, NXP MEK, Rockchip, RISC-V VisionFive2, and QEMU targets
