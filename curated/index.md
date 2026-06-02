---
title: Pantavisor Documentation
description: Pantavisor is PID 1 and owns the full device update — base, kernel, app containers, and config — as one signed, content-addressed revision.
sidebar_position: 0
slug: /
---

# Pantavisor

**Pantavisor is PID 1.** It is the init process and the whole-device runtime: it
owns init, the container lifecycle, content-addressed device state, and the
**complete framework and OTA update flow** end to end.

Pantavisor already manages the **full update** of the device — base/BSP,
kernel-carrying containers, application containers, and configuration — as one
signed, content-addressed, atomically-rollback-able **revision**. You do not
bolt an updater onto an OS. Pantavisor *is* the runtime, and the update is
intrinsic to it.

> **💡 Tip — Pantavisor replaces image updaters — it does not layer on them**
>
> Pantavisor is a replacement for Mender, RAUC, and SWUpdate, not something you
> run on top of them. There is no hybrid model where an A/B image updater sits
> underneath for the kernel/BSP while Pantavisor handles apps. Pantavisor owns the
> whole device, including the base and kernel. The image updaters appear in these
> docs only as [comparisons and migration sources](/migrate).

## Why Pantavisor over an image updater

Image updaters (Mender, RAUC, SWUpdate) update **the image**: every change —
even a one-line app fix — is a full-image event. Pantavisor versions the device
as content-addressed objects, so a change ships only what actually changed.

- **Lifecycle decoupling.** Patch a small container layer, not a 200&nbsp;MB
  rootfs. Update an app without touching the certified base; swap the BSP
  without rebuilding apps. See the [benchmarks](/benchmarks) for the numbers.
- **Trust at PID 1.** Because Pantavisor owns init, its atomicity and rollback
  guarantees are held to a higher bar than a deletable updater — and we prove it
  with published [power-fail and atomicity evidence](/security/atomicity-and-trust).
- **Git-like device state.** The whole device — kernel, every container, and
  config — is one signed, inspectable, diffable revision.
- **Recertification moat.** Freeze and certify the base once; iterate apps in
  containers without re-touching the certified image. See
  [security and compliance](/security).

## Start here

| I want to… | Go to |
|---|---|
| Understand what Pantavisor is | [Concepts](/concepts) |
| See the full build → flash → update workflow | [Composable firmware](/concepts/composable-firmware) |
| Try it on my laptop in 30 minutes | [Local emulator quickstart](/start) |
| Run it on real hardware | [Install on hardware](/install) |
| Build an image with Yocto | [Build with Yocto](/build) |
| Ship and update my app | [Develop applications](/develop) |
| Operate a fleet | [Operate devices](/operate) |
| Move off Mender/RAUC/SWUpdate | [Migrate to Pantavisor](/migrate) |
| Compare Pantavisor to Yocto/Balena/Docker/image updaters | [Benchmarks and comparisons](/benchmarks) |
| Solve a specific problem (size, secure OTA, reproducibility) | [Solutions](/solutions) |
| Look up a command or schema | [Reference](/reference) |

## Pantavisor vs Pantahub

**Pantavisor** is the on-device runtime (this documentation). **Pantahub** is the
optional cloud backend for fleet management, hosted at
[docs.pantahub.com](https://docs.pantahub.com). Pantavisor works fully
standalone; Pantahub adds remote fleet operations on top.
