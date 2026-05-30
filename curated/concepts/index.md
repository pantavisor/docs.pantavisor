---
title: Concepts
description: How Pantavisor works — PID 1, content-addressed revisions, atomic updates, and rollback.
sidebar_position: 2
slug: /concepts
---

# Concepts

These pages explain how Pantavisor works. They are versionless; for
version-specific behavior and schemas, see the [Reference](/reference).

## Core ideas

- **Pantavisor as PID 1 and whole-device runtime** — Pantavisor is the init
  process. It owns the container lifecycle, device state, and the complete
  update flow in one process. Nothing else manages the device.
- **Device state model** — the whole device is described as content-addressed
  objects and a signed manifest.
- **Revisions and trails** — every device state is a revision; the history of
  revisions is the trail.
- **Atomic updates** — an update is applied as a new revision and switched to
  atomically; a failed update never leaves a half-updated device.
- **Rollback and recovery** — a revision that fails its health checks is rolled
  back to the last known-good revision.
- **Containers** — applications run as isolated containers, versioned
  independently of the base.
- **BSP and root container model** — the base/kernel ships as a container too,
  so **Pantavisor updates the base and kernel itself** — no external A/B updater
  is required.
- **Health checks and boot success** — a revision is only marked good when its
  readiness probes pass, not merely when containers start.

For the exact on-disk formats and schemas behind these concepts, see the
[state format and configuration reference](/reference).
