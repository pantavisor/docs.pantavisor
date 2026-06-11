---
title: What is Pantavisor?
sidebar_position: 1
description: "Pantavisor is PID 1 and owns the full device update — base, kernel, app containers, and config — as one signed, content-addressed revision."
---

## What Pantavisor Is

**Pantavisor is PID 1.** It is the init process and the whole-device runtime. It boots from a minimal initramfs — there is no conventional root filesystem — and owns the entire device lifecycle: starting LXC containers in dependency order, delivering the **complete framework/OTA update** atomically, and exposing a local REST API for control. Every piece of user space (applications, OS services, BSP components like kernel modules and firmware) lives in its own LXC container. The host initramfs contains only Pantavisor and the minimal tooling it needs (BusyBox, LXC) — no general-purpose rootfs.

Because Pantavisor owns the base/BSP and kernel as containers, it manages the **full device update by itself** — and **replaces** Mender, RAUC, and SWUpdate rather than layering on top of them. There is no hybrid where an A/B image updater sits underneath for the kernel while Pantavisor handles apps. See [Migrate to Pantavisor](/migrate).

## The Problem It Solves

Traditional embedded Linux development is built around monolithic images: a single firmware artifact contains the kernel, BSP drivers, OS, and all applications. Every change — even a one-line config fix — means rebuilding the whole image, re-flashing the device, and risking a brick if anything goes wrong mid-update. Teams working on the BSP, the OS, and the application layer step on each other because their work ships as one indivisible unit.

Pantavisor breaks that monolith apart:

- Each component is an independent LXC container that can be built, tested, and updated in isolation
- OTA updates target only the changed containers, not the full image
- Failed updates roll back automatically to the last known-good revision
- Container isolation means a crashed application cannot destabilize the BSP or OS layers

## Architecture

```
┌───────────────────────────────────────────────┐
│  Applications (LXC containers)                │ ← your app, Home Assistant, etc.
├───────────────────────────────────────────────┤
│  System services (LXC containers)             │ ← networking, daemons, middleware
├───────────────────────────────────────────────┤
│  BSP (LXC container)                          │ ← kernel modules, firmware squashfs
├───────────────────────────────────────────────┤
│  Pantavisor runtime (single C binary, ~1 MB)  │ ← container orchestrator + OTA agent
├───────────────────────────────────────────────┤
│  Minimal initramfs                            │ ← Pantavisor + minimal tooling (BusyBox, LXC); no general-purpose rootfs
├───────────────────────────────────────────────┤
│  Linux kernel                                 │
├───────────────────────────────────────────────┤
│  Board Support Package (bootloader, DTBs)     │
└───────────────────────────────────────────────┘
```

Pantavisor sits between the kernel and all user space. It replaces the init system and owns everything above it.

## Device State Model

A Pantavisor device maintains a versioned trail of *revisions* in `/trails/`. Each revision is a complete snapshot of the running system:

```
/trails/
└── 0/              ← a revision (0 = factory state)
    ├── bsp/        ← kernel image, modules.squashfs, firmware.squashfs, DTBs
    ├── network/    ← network container rootfs and metadata
    ├── app/        ← application container rootfs and metadata
    ├── device.json ← device-level configuration (groups, auto-recovery policy)
    └── #spec       ← state format version (`pantavisor-service-system@1`)
```

When an OTA update arrives, Pantavisor writes the incoming objects to a *pending* revision, reboots into it (or, if only containers with `restart_policy: container` changed, restarts just those containers without a reboot), and — if the new revision reports healthy — promotes it to current. If not, it rolls back to the previous revision automatically, without operator intervention.

## Key Components

### Pantavisor Runtime

The core daemon runs in the initramfs and is responsible for:

- Mounting the storage partition and reading device state from `/trails/`
- Starting and supervising LXC containers in declared dependency order
- Polling [Pantahub](https://hub.pantacor.com) for OTA updates and delivering logs
- Exposing the local control socket (`pvcontrol`)

### pvr — Device State CLI

`pvr` is the developer-facing tool for Pantavisor state. It is modelled on Git: you `clone` a device, `add` containers (from Docker Hub images or local pvrexport bundles), `commit` changes, and `post` them to the device (directly or via Pantahub) to deliver an OTA update. The pvr workflow works from a developer workstation and integrates naturally into CI/CD pipelines.

```bash
pvr clone http://192.168.1.122:12368/cgi-bin my-device
cd my-device
pvr app add webserver --from nginx:stable-alpine
pvr add . && pvr commit -m "add nginx"
pvr post http://192.168.1.122:12368
```

### pvcontrol — Local REST API

Pantavisor exposes a REST API on the local `pv-ctrl` socket for querying and controlling the running device state without cloud connectivity; `pvcontrol` is the CLI client for it:

```bash
pvcontrol container ls   # list containers
pvcontrol daemons ls     # list Pantavisor internal daemons
pvcontrol graph ls       # inspect the xconnect service mesh
pvcontrol ls             # full device status including auto-recovery counters
```

### pv-xconnect — Container Service Mesh

`pv-xconnect` mediates communication between containers without requiring a shared network namespace. It injects sockets, device nodes, and service endpoints directly into each container's namespace:

| Type | What it connects |
|------|-----------------|
| `unix` | Raw Unix domain socket proxy |
| `rest` | HTTP-over-UDS with caller-identity headers (`X-PV-Client`, `X-PV-Role`) |
| `dbus` | Policy-aware D-Bus proxy with interface filtering |
| `drm` | DRM device node injection (`card0`, `renderD128`) |
| `wayland` | Wayland compositor access for isolated UI containers |

### Pantahub — Cloud Backend

[Pantahub](https://hub.pantacor.com) is the cloud service that devices register with. It stores device state, delivers OTA updates as object diffs, and aggregates logs. The `pvr` CLI authenticates to Pantahub so developers can manage a fleet of devices remotely from their workstation.

Pantahub is **optional**. `pvr` can clone, update, and deploy to a device directly over the local network, so Pantavisor runs fully standalone — Pantahub adds remote fleet operations on top, it is not required for the device to update itself.

## OTA Updates

Updates are delivered as diffs, not full images. Only the objects (container rootfs, modules squashfs, config files) that changed are transferred. The update flow is:

1. Developer commits and pushes new state with `pvr`
2. Device polls Pantahub and downloads the diff
3. Pantavisor writes the new objects to a pending revision
4. Pantavisor reboots into the pending revision — or, if only containers with `restart_policy: container` changed, restarts just those containers without a reboot
5. If the revision boots cleanly and all containers reach their health goal, it is committed as the new current state
6. If any step fails, Pantavisor restores the previous revision and reboots

## Auto-Recovery

Each container (or container group) can declare a recovery policy in `device.json` or `run.json`.

**Policy values** (`policy`):

| Value | Behaviour |
|-------|-----------|
| `no` (default) | Do not restart automatically |
| `always` | Restart on any exit |
| `on-failure` | Restart on failure |
| `unless-stopped` | Restart unless the container was explicitly stopped |

> **Note**: the current implementation does not distinguish exit codes, so `on-failure` behaves like `always`.

**Tuning keys**:

| Key | Purpose |
|-----|---------|
| `max_retries` | Maximum restart attempts before the backoff policy applies |
| `retry_delay` | Initial delay between restart attempts |
| `backoff_factor` | Multiplier applied to the delay after each retry |
| `reset_window` | Clean-run time after which the retry counter resets |
| `stable_timeout` | Time a container must run cleanly before the update is committed |
| `backoff_policy` | What happens after max retries: `"reboot"` the device, a duration such as `"10min"` (wait, reset the counter, retry), or `"never"` (leave the container stopped) |

Containers with a `stable_timeout` hold the OTA commit until they have run cleanly for the configured window, preventing a bad update from being permanently committed.

## Security Features

| Feature | Description |
|---------|-------------|
| dm-crypt | Full storage encryption for the trails partition |
| dm-verity | Per-container rootfs integrity verification at mount time |
| Signed state | PVR state signing with X.509 keys (`pvr sig`) |
| Secure boot | U-Boot verified boot / FIT image signing (platform-dependent) |

## Comparison with Traditional Embedded Linux

| Aspect | Traditional | Pantavisor |
|--------|-------------|------------|
| **Update unit** | Full image (typically 100–500 MB) | Changed containers only (typically 1–50 MB) |
| **Update time** | Typically 5–30 minutes | Typically 30 seconds – 5 minutes |
| **Rollback** | Complete reflash | Automatic on next boot |
| **Component isolation** | Monolithic process tree | Separate LXC namespace per container |
| **Failed-update recovery** | Manual intervention | Automatic rollback to previous revision |
| **Build model** | Single monolithic build | Independent container builds |

The size and time figures are illustrative ballparks; see the
[benchmarks](/benchmarks) for measured numbers.

## Real-World Example

A connected sensor device running Pantavisor:

```
/trails/0/
├── bsp/
│   ├── kernel.img
│   ├── modules_6.1.77.squashfs   ← kernel modules
│   └── firmware.squashfs         ← WiFi/BT firmware blobs
├── network/                      ← NetworkManager container (~8 MB)
├── sensor-app/                   ← sensor logic container (~12 MB)
└── web-ui/                       ← dashboard container (~15 MB)
```

Updating the dashboard means transferring only the changed `web-ui` objects. The BSP, network stack, and sensor app keep running through the update — no full reflash, no downtime for unrelated components.

## Next Steps

- **Get Started**: Follow the [Quick Start Guide](/start/download-and-flash) to flash your first Pantavisor image.
- **pvr CLI**: See the [pvr CLI reference](/develop/cli-tools/pvr-cli) for the full command set.
- **Deep dive**: [Build with Yocto](/build) for BSP integration, [Develop applications](/develop) for container authoring, and [docs.pantahub.com](https://docs.pantahub.com/) for the cloud API.