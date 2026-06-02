---
title: Remove applications
sidebar_position: 44
description: Remove an application from a Pantavisor device — delete the container from your pvr checkout, commit, and deploy a new revision. Pantavisor stops and discards it on the next boot.
---

Removing an application follows the same revision workflow as adding one: remove the container from your local `pvr` checkout, commit, and deploy. Pantavisor stops the container and removes it from the trail on the next boot.

---

## Step 1 — Clone the Device State

If you do not already have a local checkout, clone the device:

```bash
pvr clone http://<device-ip>:12368/cgi-bin my-device
cd my-device
```

The directory mirrors the device's current revision:

```
my-device/
├── bsp/
├── network/
├── sensor-app/
├── my-old-app/           ← the container you want to remove
├── _config/
├── device.json
└── _sigs/
```

## Step 2 — Remove the Container

Use `pvr app rm` to remove the container from the local state:

```bash
pvr app rm my-old-app
```

This deletes the container's directory from your checkout and stages the removal.

## Step 3 — Commit and Deploy

Stage any remaining changes, commit, and deploy to the device:

```bash
pvr add .
pvr commit -m "remove my-old-app"
pvr post http://<device-ip>:12368
```

## Step 4 — What Happens on the Device

When Pantavisor receives the new revision it:

1. Stops the removed container
2. Writes the new revision to `/trails/`
3. Reboots into the new state

After the reboot, `pvcontrol container ls` and `lxc-ls -f` will no longer show the removed container. The previous revision (with the container) is kept in the trail and can be restored by rolling back if needed.
