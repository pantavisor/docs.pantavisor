---
title: Migrate to Pantavisor
description: Move from Mender, RAUC, SWUpdate, Balena, or Docker Compose to Pantavisor.
sidebar_position: 8
slug: /migrate
---

# Migrate to Pantavisor

These guides show a practical path **from** an existing tool **to** Pantavisor as
a full replacement. Pantavisor takes over the whole device, including the
base/BSP and kernel — you do not keep the old updater running underneath it.

## Guides

- Mender to Pantavisor
- RAUC to Pantavisor
- SWUpdate to Pantavisor
- Balena to Pantavisor
- Docker Compose to Pantavisor
- When *not* to use Pantavisor

> **⚠️ Warning — No hybrid stacks**
>
> There is no supported configuration where RAUC/Mender/SWUpdate updates the
> kernel/BSP while Pantavisor handles apps. That would reintroduce whole-image
> updates and break the single signed-revision model. Pantavisor replaces them.

For a capability and efficiency comparison, see the [benchmarks and
comparisons](/benchmarks).
