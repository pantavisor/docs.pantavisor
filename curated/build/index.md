---
title: Build with Yocto
description: Build a Pantavisor production image with meta-pantavisor, KAS, and a CI matrix.
sidebar_position: 6
slug: /build
---

# Build with Yocto

`meta-pantavisor` is the Yocto/OpenEmbedded layer that builds a Pantavisor
image for your board. The generated layer and recipe reference is kept in the
versioned [Reference → meta-pantavisor](/reference) docs; this section is the
task-oriented guide.

## In this section

- [Get started](./get-started.md) — clone `meta-pantavisor` and run your first KAS build
- [Build system overview](./build-system.md) — KAS configuration hierarchy, multiconfigs, and output artifacts
- [CI overview](./ci-overview.md) — the CI build matrix generated from `machines.json`
- [Manifest audit](./manifest-audit.md) — deterministic rootfs manifests that catch drift
- [Boot profiling with bootchartd](./bootchartd.md) — capture a boot-time profile tarball
- [Port a new board](./port/index.md) — platform and machine KAS files, CI registration, and flashing

Guides for bootloader integration (U-Boot, EFI/GRUB, the rollback contract) and
secure boot are planned.

> **💡 Tip — One model for the whole device**
>
> Because the base/BSP and kernel ship as containers in a Pantavisor revision,
> the same build produces an image whose base **and** apps are updated through
> Pantavisor — you do not configure a separate image-update engine.
