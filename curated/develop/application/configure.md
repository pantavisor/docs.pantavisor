---
title: Configure Application Settings
sidebar_position: 41
description: Configure application settings on Pantavisor Linux. Learn to edit manifests, set environment variables, and manage app configurations.
---

Each container's root filesystem is a read-only SquashFS image (`root.squashfs`). To change files inside a running container you do not edit the device directly. Instead you make changes in a local `pvr` checkout of the device state, then deploy a new revision. Pantavisor applies the overlay on the next boot.

The `_config/<container-name>/` directory in a pvr checkout acts as a writable overlay tree: files placed there are layered on top of the container's read-only rootfs at startup.

---

## Step 1 — Clone the Device

Clone the device's current state to your workstation. The device must be reachable on the local network.

```bash
pvr clone http://<device-ip>:12368/cgi-bin my-device
cd my-device
```

After cloning, the directory mirrors the device's revision:

```
my-device/
├── bsp/                        ← BSP component (squashfs files, DTBs)
├── network/                    ← network container (root.squashfs, run.json, lxc.container.conf)
├── sensor-app/                 ← application container
├── _config/                    ← per-container file overlays
├── device.json                 ← device-level config (groups, auto-recovery policy)
└── _sigs/                      ← optional container signatures
```

---

## Step 2 — Make Your Changes

### Edit a configuration file (overlay)

Files under `_config/<container-name>/` are overlaid onto that container's rootfs at runtime. Create the path that matches where the file lives inside the container.

Example — add your SSH public key to the `sensor-app` container:

```bash
mkdir -p _config/sensor-app/home/root/.ssh
cat ~/.ssh/id_ed25519.pub >> _config/sensor-app/home/root/.ssh/authorized_keys
```

### Edit a container's run manifest

Each container directory contains a `run.json` (or `args.json`) that controls Pantavisor-level behaviour: restart policy, auto-recovery, environment variables, and pv-xconnect wiring. Edit it directly in the checked-out directory.

Example — set an environment variable in `sensor-app/run.json`:

```json
{
  "Env": ["SENSOR_INTERVAL=10", "LOG_LEVEL=info"],
  "auto_recovery": {
    "policy": "on-failure",
    "max_retries": 5,
    "retry_delay": 5,
    "backoff_factor": 2.0,
    "backoff_policy": "10min"
  }
}
```

### Replace the container image

To update the container rootfs itself, use `pvr app update`:

```bash
pvr app update sensor-app --from registry.example.com/sensor-app:v1.2.0
```

This re-pulls the image and replaces `sensor-app/root.squashfs`.

---

## Step 3 — Stage and Commit

Check what changed:

```bash
pvr status
```

Example output:

```
A _config/sensor-app/home/root/.ssh/authorized_keys
C sensor-app/run.json
```

Stage and commit:

```bash
pvr add .
pvr commit -m "add SSH key and configure auto-recovery for sensor-app"
```

If the container is cryptographically signed, update its signature before committing:

```bash
pvr sig add --part sensor-app
pvr add .
pvr commit -m "add SSH key and configure auto-recovery for sensor-app"
```

---

## Step 4 — Deploy to the Device

Post the new revision to the device's pvr endpoint — the same URL you cloned from:

```bash
pvr post http://<device-ip>:12368
```

Pantavisor downloads the changed objects, writes them to a pending revision, and reboots. If the new revision boots cleanly and all containers reach their health goal, it is committed as the new permanent state. If it fails, the previous revision is restored automatically.

---

## Step 5 — Verify

After the device reboots, confirm the changes are live:

```bash
# Check the container is running
pvcontrol container ls

# Inspect logs
tail -f /run/pantavisor/pv/logs/0/sensor-app/lxc/console.log

# SSH into the device if you added a key
ssh root@<device-ip>
```