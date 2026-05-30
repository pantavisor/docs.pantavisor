---
title: Benchmarks and comparisons
description: Reproducible numbers comparing Pantavisor to image updaters — payload size, time, and flash writes.
sidebar_position: 9
slug: /benchmarks
---

# Benchmarks and comparisons

Our "more valid than an image updater" claim is backed by numbers, not slogans.
Every figure here is reproducible from a published methodology.

## Pages

- **Pantavisor vs Mender/RAUC/SWUpdate matrix** — capability comparison.
- **Update efficiency benchmark (headline proof)** — payload size, update time,
  and flash writes for an app-layer update vs a full-image update, on the same
  hardware with the same app change.
- **Reproducing the benchmarks** — so the numbers are defensible and re-runnable.
- **Footprint table** — RAM/flash across reference boards.

## What the numbers show (to be filled with measured data)

| Scenario | Image updater (full image) | Pantavisor (container layer) |
|---|---|---|
| Update payload size | full rootfs (~100s of MB) | changed layer only (~MB) |
| Downtime | reboot | no reboot for app updates |
| Flash writes | whole image | changed objects only |

> **📝 Note**
>
> This page ships with measured, reproducible data as part of the first public
> deliverable. Until then, treat the table above as the shape of the comparison,
> not as published figures.
