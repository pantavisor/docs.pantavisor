---
title: Operate devices
description: Update, roll back, recover, and observe Pantavisor devices and fleets.
sidebar_position: 6
slug: /operate
---

# Operate devices

Update *transport* is table stakes; fleet *operations* is where Pantavisor pulls
ahead.

## Tasks

- Update an application
- **Update the BSP/base system** — Pantavisor updates the base and kernel
  itself, as a revision; no external A/B updater is involved
- Roll back a failed update
- Recover a broken revision
- Inspect device state (running revision hash vs intended → drift detection)
- Remote logs
- Health checks and watchdog integration
- Phased/canary rollout through Pantahub (health-gated promotion)
- Offline and air-gapped workflows
