---
title: Start
description: Get Pantavisor running — on your laptop in 30 minutes, or on real hardware.
sidebar_position: 1
slug: /start
---

# Start

The fastest way to understand Pantavisor is to run a real device — including the
full update flow — on your laptop, then move to hardware.

## Paths

- **30-minute local emulator quickstart** — run a full Pantavisor device,
  containers and updates included, with no hardware. *(guide coming as part of
  the first public deliverable)*
- **First hardware quickstart** — flash a supported board and bring it online.
  See [Install on hardware](/install).
- **Install `pvr`** — the client used to inspect and change device state. See
  the [`pvr` reference](/reference).

## Choose your workflow

- **Local** — develop and test against the emulator.
- **Cloud** — manage devices through [Pantahub](https://docs.pantahub.com).
- **Yocto integration** — build a production image with
  [`meta-pantavisor`](/build).

> **📝 Note**
>
> Pantavisor manages the entire device update itself. There is no separate A/B
> image updater to install or configure underneath it.
