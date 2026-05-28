---
title: Pantahub
sidebar_position: 43
description: Install your first application on Pantavisor Linux using Pantacor Hub. Step-by-step guide to install Home Assistant from the marketplace.
keywords: ["install pantavisor app", "home assistant install", "pantacor hub installation", "first application", "pantacor marketplace", "container install", "app installation guide", "embedded app install", "pantavisor applications", "iot app deployment"]
---

Pantahub is the cloud backend for Pantavisor. Once a device is claimed, you can push application updates to it from anywhere — the device polls Pantahub and applies the new revision automatically.

---

## 1 — Claim Your Device

Before remote management is possible, the device must be registered in your Pantahub account. The device prints a one-time challenge token and its device ID on boot.

Read them from the device console (serial or SSH):

```bash
cat /pv/challenge
# pleasantly-finer-unicorn

cat /pv/device-id
# 5b582638c67920b9de2
```

Log in to [hub.pantacor.com](https://hub.pantacor.com), go to **Claim Device**, and enter the device ID and challenge. Once claimed, the device appears in your device list and its status updates in real time.

---

## 2 — Build the Container Package

On your workstation, build the container you want to install using `pvr`. If you have not done this yet, follow the steps in the [pvtx install guide](../local-pvtx/) to create a `myapp.tar.gz` bundle.

---

## 3 — Deploy via Pantahub

From the device dashboard on hub.pantacor.com:

1. Click the device name to open its detail view.
2. Go to the **Manage** tab.
3. Click **Begin Transaction**.
4. Click **Upload New Part** and select your `myapp.tar.gz` file.
5. Enter a commit message and click **Commit Transaction**.

Pantahub queues the update. The device polls for new revisions periodically and downloads the changed container objects as a diff (only the objects that changed are transferred). It then reboots and applies the new revision.

---

## 4 — Monitor the Update

The device dashboard shows the update progress in real time:

| Status | Meaning |
|--------|---------|
| `WAITING` | Update queued, device has not yet acknowledged |
| `INPROGRESS` | Device is downloading objects |
| `TESTING` | Device rebooted into the new revision, running stability checks |
| `DONE` | Revision committed — update successful |
| `FAILED` | Device rolled back to the previous revision |

If the status reaches `DONE`, the new container is running. If it shows `FAILED`, Pantavisor automatically restored the previous revision — no manual intervention needed.

---

## Next Steps

- [View running applications](../../view/) — check container status and logs on the device
- [Configure applications](../../configure/) — push configuration changes through the same revision workflow