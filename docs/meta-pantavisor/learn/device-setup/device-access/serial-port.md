---
title: Serial Console
sidebar_position: 2
description: Configure WiFi and ethernet network connectivity for Pantavisor Linux devices. Complete guide for getting your device online.
---

The serial console is the most direct access path to a Pantavisor device — it works without any network configuration and shows the full boot sequence from bootloader to Pantavisor startup.

## Hardware Setup

Connect a USB-to-TTY adapter to the device's TX/RX/GND serial pins. Open a terminal emulator on your computer:

```bash
# Linux — adjust device node as needed (ttyUSB0, ttyUSB1, ttyACM0, …)
sudo minicom -D /dev/ttyUSB0

# Alternative
screen /dev/ttyUSB0 115200
```

Refer to your board's hardware manual for the correct UART pins and baud rate. Most Pantavisor images default to **115200 8N1**.

## Boot Sequence and Debug Shell

When the device powers on you will see bootloader output followed by the Linux kernel log, then the Pantavisor banner:

```
_____           _              _
| ___ \         | |            (_)
| |_/ /_ _ _ __ | |_ __ ___   ___ ___  ___  _ __
|  __/ _` | '_ \| __/ _` \ \ / / / __|/ _ \| '__|
| | | (_| | | | | || (_| |\ V /| \__ \ (_) | |
\_|  \__,_|_| |_|\__\__,_| \_/ |_|___/\___/|_|

Pantavisor (TM) — pantavisor.io

To access the debug shell, press <ENTER>.
To exit the shell, type 'exit' or press CTRL+d.
Useful commands:
    * lxc-ls                 list available containers
    * pventer -c <CONTAINER> access a container's shell
```

Press **Enter** to open the debug shell. This is a root shell running in the Pantavisor initramfs — it gives you access to the device before or while containers are starting.

## What You Can Do from the Debug Shell

### List containers

```bash
lxc-ls -f
```

Shows all containers and their LXC state (RUNNING, STOPPED, etc.).

### Enter a container's namespace

```bash
pventer -c sensor-app
```

Drops you into the container's filesystem, process, and network namespaces. Exit with `exit` or `Ctrl-D`.

### Query device status

```bash
pvcontrol ls                  # full device status, auto-recovery counters
pvcontrol container ls        # container list
pvcontrol daemons ls          # daemon containers
pvcontrol graph ls            # pv-xconnect service mesh
pvcontrol buildinfo           # Pantavisor build info and current revision
```

### View logs

```bash
tail -f /run/pantavisor/pv/logs/0/pantavisor/pantavisor.log
tail -f /run/pantavisor/pv/logs/0/<container>/lxc/console.log
```

### Find credentials for Pantahub claiming

```bash
cat /pv/device-id       # unique device ID
cat /pv/challenge       # one-time claim token
```

Use these when claiming the device on [hub.pantacor.com](https://hub.pantacor.com).

## Exiting the Debug Shell

Type `exit` or press `Ctrl-D`. Pantavisor continues starting containers normally after the shell exits. Pressing **Enter** again reopens the shell at any time.
