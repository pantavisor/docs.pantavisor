---
title: Security and compliance
description: Trust model, signed revisions, secure boot, SBOM/CVE, and recertification.
sidebar_position: 10
slug: /security
---

# Security and compliance

Because Pantavisor owns PID 1, it is held to a higher trust bar than a deletable
updater — and the docs back that up with evidence.

## Pages

- **Trust model**
- **[Atomicity and trust evidence](/security/atomicity-and-trust)** — published
  power-fail and rollback test methodology and results.
- **Signed revisions** and artifact verification — one signature transitively
  covers the whole device state.
- **Secure boot chain** — SoC ROM → signed bootloader → signed FIT → dm-verity
  rootfs.
- **dm-verity** and **dm-crypt**
- **Secret handling**
- **SBOM** and the **CVE / update workflow**
- **Recertification model (lead item)** — a frozen, certified base/BSP plus
  app-only container updates preserves the safety case. This is the moat image
  updaters cannot offer: updating an app container does not alter the certified
  base container's hashes.
- **Cyber Resilience Act readiness**
- **IEC 62304 / IEC 62443 positioning**
