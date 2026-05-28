---
title: Troubleshooting
sidebar_position: 60
description: Troubleshooting guide for Pantavisor Linux. Find solutions to common issues, connectivity problems, and app management questions.
---

Find solutions to common issues with Pantavisor Linux devices, builds, and application management.

## Common Issue Categories

| Category | Symptoms |
|----------|----------|
| **Device not booting** | No serial output, kernel panic, Pantavisor banner never appears |
| **Containers not starting** | `lxc-ls -f` shows STOPPED, auto-recovery cycling |
| **Network not working** | Device has no IP, `pvr device scan` finds nothing |
| **OTA update stuck** | Pantahub shows `INPROGRESS` but never reaches `DONE` |
| **Build failure** | BitBake errors, missing layer, pseudo database corruption |
| **PANTAVISOR_FEATURES missing** | xconnect, pvcontrol, or rngdaemon absent from image |

## Quick Diagnostics

From the serial console debug shell:

```bash
# Check which containers are running
lxc-ls -f

# Check Pantavisor state and auto-recovery counters
pvcontrol ls

# Check Pantavisor runtime log
tail /run/pantavisor/pv/logs/0/pantavisor/pantavisor.log

# Check a specific container's output
tail /run/pantavisor/pv/logs/0/<container>/lxc/console.log

# Check Pantahub connectivity
pvcontrol buildinfo
```

## Key Pitfalls

**`PANTAVISOR_FEATURES` operator**: Never use `+=` in distro includes — it silently drops the defaults set by `pvbase.bbclass`. Use `:append` instead:

```bitbake
# WRONG — drops xconnect, pvcontrol, rngdaemon
PANTAVISOR_FEATURES += "appengine"

# CORRECT
PANTAVISOR_FEATURES:append = " appengine"
```

**SRCREV bumps**: Always verify the commit hash against the actual remote — squash merges rewrite hashes. Update `PKGV` to match the latest tag reachable from the new SRCREV.

**Stale storage volume**: When testing with `pv-appengine`, pvtx.d scripts only run once per storage volume (when `.pvtx-done` is absent). Delete and recreate the volume between test runs:

```bash
docker volume rm storage-test
```

See the [FAQ](./faq/) for more specific questions and answers.