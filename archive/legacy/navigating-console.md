# Navigating the Console

This page shows the most important commands to start navigating through each of the Pantavisor consoles.

## Bootloader Console

The bootloader console can be accessed by interrupting the boot up from either [TTY](inspect-device.md#tty) or using [keyboard and monitor](inspect-device.md#keyboard-and-monitor).

### U-Boot

Among other things, from the U-Boot console, you can configure some Pantavisor parameters with Linux [environment variables](pantavisor-configuration-levels.md#environment-variables).

To do so, you just have to assign a string with one to many _key=value_ pairs, separated by space to the `configargs` variable. In this example, we are setting the log level to WARN and disabling the push of logs to Pantacor Hub:

```
setenv configargs $configargs PV_LOG_LEVEL=2 PV_LOG_PUSH=0
saveenv
reset
```
You can check these and more configurable keys in [our reference](pantavisor-configuration.md#summary).

### Grub

Setting Linux [environment variables](pantavisor-configuration-levels.md#environment-variables) is not supported on the Grub platforms. Contact us if you need support for your board!

## Pantavisor Console

The Pantavisor console can be accessed using the '/' root container via [SSH](inspect-device.md#ssh). Also, getting into the debug shell from either [TTY](inspect-device.md#tty) or [keyboard and monitor](inspect-device.md#keyboard-and-monitor).

### Pantavisor Root

To list all running container names:

```
lxc-ls
```

Here, we have access to the different containers using the `pventer` command. To open a session into the `alpine-nginx` container:

```
pventer -c alpine-nginx
```

### pvr-sdk

From the [pvr-sdk container](pvr-sdk-reference.md) console, you have at your disposal some handy development utilities such as [Pantabox](pvr-sdk/reference/pantabox.md), [pvtx](pvr-sdk/pvtx-app/content/api-readme.md) and [pvcontrol](pvr-sdk/reference/pvcontrol.md).

The rest of this how-to guide focus on the higher level [Pantabox tool](pantabox-introduction.md).
