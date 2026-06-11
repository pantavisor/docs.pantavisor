---
title: Boot-time profiling
sidebar_position: 5
description: Enable bootchartd in PANTAVISOR_FEATURES to capture a boot-time profile tarball from the Pantavisor initramfs.
---

# Bootchartd

Pantavisor supports the BusyBox `bootchartd` applet for boot time profiling. When enabled, the boot generates a `/bootlog.tgz` tarball capturing the boot sequence, which can be rendered with [bootchart](https://github.com/mmeeks/bootchart).

## Enable

Add `bootchartd` to `PANTAVISOR_FEATURES` in your distro config or recipe:

```bitbake
PANTAVISOR_FEATURES:append = " bootchartd"
```

This enables the following Busybox options:
- `CONFIG_TAR`
- `CONFIG_FEATURE_TAR_CREATE`
- `CONFIG_BOOTCHARTD`

## Pantavisor-specific patch

Bootchartd normally writes data to `/tmp` and `/var/log`, which are not available in the Pantavisor initramfs. The meta-pantavisor layer includes a patch redirecting all output to the root directory `/` instead: the final tarball becomes `/bootlog.tgz` (instead of `/var/log/bootlog.tgz`), and the temporary logging directory moves out of `/tmp` into the root directory as well.

## Usage

Boot with `rdinit=/sbin/bootchartd` to generate the tarball:

```
# In your bootloader or kernel cmdline:
rdinit=/sbin/bootchartd
```

The resulting `/bootlog.tgz` can be analysed with standard bootchart renderers such as [mmeeks/bootchart](https://github.com/mmeeks/bootchart). Retrieve it from the device via the debug shell, or `scp` it out through the pvr-sdk container's SSH access.
