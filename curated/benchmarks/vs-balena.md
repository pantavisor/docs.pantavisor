---
title: Pantavisor vs Balena
sidebar_position: 2
description: Pantavisor and Balena both deliver containerized embedded Linux plus OTA, but the architectures diverge — LXC vs Docker, kernel-as-container vs app-only, 100% open vs open-core.
---

# Pantavisor vs Balena — lightweight LXC vs Docker for embedded

## The short answer

**Balena and Pantavisor solve overlapping problems with different
architectures.** Balena wraps Docker for app delivery on top of balenaOS.
Pantavisor uses **LXC system containers** to package the **entire stack — kernel
included** — and ships atomic, signed state revisions through Pantahub.

If you want a polished Docker-app workflow on supported boards and accept a
Docker-sized footprint plus open-core cloud, Balena fits. If you want a fully
open, lightweight runtime that treats the kernel and BSP as composable
containers, choose Pantavisor.

## At a glance

| Aspect | Balena | Pantavisor |
|---|---|---|
| Container runtime | balenaEngine (Docker fork) | LXC (~1 MB core) |
| Container model | App containers on top of balenaOS | System containers (incl. BSP/kernel) |
| Kernel updates | Full-OS update (host OS) | Just another container in the state |
| Update unit | Docker image layers | Content-addressed state objects |
| OTA rollback | Built-in (per release) | Built-in, atomic, signed, automatic |
| Footprint | Tens of MB (Docker stack) | ~1 MB Pantavisor + LXC |
| Cloud | balenaCloud (open-core, paid) | Pantahub (100% open source) |
| Self-hosting | openBalena (limited features) | Self-hosted Pantahub, full feature set |
| License | Open-core | 100% open source |
| Signed states | ❌ | ✅ PVS (signatures over state JSON) |

## Architectural differences

### Balena: Docker on a host OS

Balena keeps the classic split: a **balenaOS host** (built with Yocto) plus a
**balenaEngine** daemon running app containers. Updates flow through two channels:

- **Host OS updates** — flash a whole new balenaOS image (with rollback partition).
- **App updates** — pull new Docker image layers via balenaCloud.

Kernel + BSP are part of the host OS, not the app composition. Updating the
kernel means a host-OS release.

### Pantavisor: everything is a container

Pantavisor flips the model. After the tiny init takes over from the bootloader,
**every part of the system runs as an LXC container** — including the BSP
container that owns the kernel, modules, and firmware. The whole composition is
described by a single state JSON in Pantahub.

```
state.json (one revision)
├── bsp/        ← kernel + initramfs + modules (a container)
├── os/         ← Alpine + ConnMan, etc. (a container)
├── pvr-sdk/    ← management/dev tools (a container)
└── your-app/   ← your application (a container)
```

Updating the kernel, swapping the network stack, or shipping a new app are all
**the same operation**: produce a new state revision and `pvr post` it.

## Footprint and resource use

balenaEngine trims Docker but still pulls in containerd-style assumptions,
overlayfs, image caches, and a long-running daemon. Practical balenaOS images sit
in the 80–200 MB range and consume non-trivial RAM at idle.

Pantavisor itself is a **single ~1 MB binary** running as PID 1, plus
per-container LXC processes. There is no container daemon, no image cache, and no
overlayfs requirement (volumes can be plain block devices, dm-verity, squashfs,
etc.). This matters on devices with 64–256 MB of RAM, no swap, and limited eMMC.

## Updates and rollback

| Behavior | Balena | Pantavisor |
|---|---|---|
| Atomic per-release update | ✅ | ✅ |
| Updates kernel without re-flash | ⚠️ Host OS update | ✅ Container in state |
| Automatic boot rollback | ✅ Host OS | ✅ Whole state, every revision |
| Signed update payload | Image trust | ✅ PVS signatures over state JSON |
| Differential transfer | Docker layer dedup | Content-addressed object dedup |
| Offline / air-gapped flow | ⚠️ Limited | ✅ Local clone, USB push, mirrored Pantahub |

Both roll back automatically on boot failure. Pantavisor additionally rolls back
when **containers fail their declared `status_goal`** at runtime, not just on
boot panics.

## Cloud and lock-in

- **Balena**: balenaCloud is the production control plane. openBalena is a
  stripped-down self-hosted variant; several fleet features and the dashboard
  remain proprietary.
- **Pantavisor**: Pantahub is 100% open source and self-hostable with full
  functionality. You can run Pantahub on your own infra, mirror it, or air-gap it
  without losing features.

## When Balena fits

- You target one of Balena's supported boards and want the polished `balena push`
  developer experience out of the box.
- Your team is already deep in Docker tooling and image registries.
- App-only updates are enough — kernel and BSP rarely change.
- You're OK with balenaCloud's pricing model and open-core posture.

## When Pantavisor fits

- You need a **smaller footprint** (1 MB core, no Docker daemon).
- The **kernel/BSP itself must be updateable** as part of a normal release
  (industrial, automotive, certified devices).
- You want **signed, content-addressed state revisions** with PVS.
- You require **fully open source** and self-hostable cloud (Pantahub).
- You're building on **custom hardware** with Yocto and want first-class
  integration via [meta-pantavisor](/build).
- You want **system containers** (init + services + filesystem) rather than
  single-process app containers.

## Key takeaway

> **Balena = Docker apps on a host OS.**
> **Pantavisor = the host OS, kernel included, *is* the composition.**

If your firmware is mostly stable and you want a Docker-native dev loop, Balena is
reasonable. If your firmware itself needs to be composable, signed, lightweight,
and fully open, Pantavisor is the better fit.

## Next steps

- [Migrating from Balena](/migrate/balena) — the practical path
- [Pantavisor vs Docker](/benchmarks/vs-docker) — why Docker alone falls short for firmware
- [Build with Yocto](/build) — meta-pantavisor for custom hardware
