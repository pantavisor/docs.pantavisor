# Pantavisor Configuration

:::warning
This is deprecated but still supported for backwards compatibility reasons. To get to the newly unified configuration key syntax, go [here](pantavisor-configuration.md).
:::

There are four ways to tweak Pantavisor configuration, depending on when it can be modified: at compile time, at boot up time, after an update or during runtime. Bear in mind that each level in this list will overwrite whatever is configured in the previous ones.

## At compile time

You can take a look at the default configuration files we use to build our supported platforms [here](https://gitlab.com/pantacor?utf8=%E2%9C%93&filter=pv-config).

### pantavisor.config

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| policy | string without '/' character | empty | set configuration [policy]() |
| cache.usrmetadir | path | /storage/cache/meta | set persistent user metadata dir |
| cache.devmetadir | path | /storage/cache/devmeta | set persistent device metadata dir |
| system.apparmor.profiles | comma-separated list of profile names | empty | list of [AppArmor profiles](https://ubuntu.com/server/docs/security-apparmor) to be loaded during early init |
| system.init.mode | embedded, standalone or appengine | embedded | Pantavisor init mode |
| system.libdir | path | /lib | set lib path |
| system.etcdir | path | /etc | set etc path |
| system.rundir | path | /pv | set run path |
| system.mediadir | path | /media | set media path |
| system.confdir | path | /configs | set config path |
| system.drivers.load_early.auto | 0 or 1 | 0 | load all modules and firmware during early init |
| system.mount.securityfs | 0 or 1 | 0 | mount /sys/kernel/security during early init |
| debug.shell | 0 or 1 | 1 | enable [debug shell](inspect-device.md#tty) |
| debug.shell.autologin | 0 or 1 | 0 | always prompt [debug shell](inspect-device.md#tty) without having to press any key |
| debug.ssh | 0 or 1 | 1 | enable debug ssh server |
| debug.ssh_authorized_keys | path or "default" | /pv/user-meta/pvr-sdk.authorized_keys | path where to find ssh server keys |
| dropbear.cache.dir | path | /storage/cache/dropbear | set dropbear cache path |
| bootloader.type | uboot, uboot-pvk or grub | uboot | set type of bootloader |
| bootloader.mtd_only | 0 or 1 | 0 | enable MTD |
| bootloader.mtd_env | path | N/A | set MTD path |
| libthttp.certsdir | path | "/certs" | set libthttp certificates path |
| secureboot.mode | disabled, audit, lenient or strict | lenient | set [secureboot](storage.md#integrity) severity level |
| secureboot.truststore | string | ca-certificates | set truststore name to use to validate pvs signatures |
| secureboot.checksum | 0 or 1 | 1 | enable artifacts [checksum validation](storage.md#artifact-checksum) |
| secureboot.handlers | 0 or 1 | 1 | enable the use of [volume handlers](storage.md#artifact-checksum) |
| storage.device | LABEL=XXXX, UUID=XXXX or string | N/A (mandatory) | set Pantavisor storage device using a partition label, UUID or /dev/ name |
| storage.fstype | ext4, ubifs or jffs2 | N/A (mandatory) | journaling file system |
| storage.opts | N/A | N/A | not implemented |
| storage.mntpoint | path | N/A (mandatory) | set pv mount point |
| storage.mnttype | ext4 | disabled | pv mount file system |
| storage.logtempsize | size | disabled | sets the size of memory dedicated for log storage. The size may have a k, m or g suffix or a % suffix for percentage of memory |
| storage.wait | integer | 5 | wait for storage to be available |
| storage.gc.reserved | integer | 5 | [garbage collector](storage.md#garbage-collector) will try to always keep this percentage of disk free |
| storage.gc.keep_factory | 0 or 1 | 0 | avoid deletion of revision 0 objects by the [garbage collector](storage.md#garbage-collector) |
| storage.gc.threshold | integer | 0 | [garbage collector](storage.md#garbage-collector) will be triggered if there is less than this percentage of disk free. 0 means it will just be run when an update needs more space than available |
| storage.gc.threshold.defertime | integer | 600 | time in seconds the [garbage collector threshold](storage.md#threshold) will be deferred after a new object has been put from the [pvctrl objects endpoint](pantavisor-commands.md#objects) |
| disk.voldir | path | /volumes | set volumes path |
| updater.goals.timeout | integer | 120 | time in seconds that Pantavisor will wait for a container to achieve its [status goal](containers.md#status-goal) |
| updater.use_tmp_objects | 0 or 1 | 0 | download objects in an on-disk temporary location. If disabled, objects will be stored in memory while downloading |
| updater.commit.delay | integer | 25 | testing time in seconds after an update |
| revision.retries | integer | 10 | max number of update retries before rollback |
| revision.retries.timeout | integer | 120 | set time in seconds before a failed update is retired |
| wdt.enabled | 0 or 1 | 1 | _DEPRECATED_: use wdt.mode instead |
| wdt.mode | disabled, shutdown, startup or always (experimental) | shutdown | watchdog mode |
| wdt.timeout | integer | 15 | set reset timeout in seconds for kernel watchdog |
| net.brdev | string | lxcbr0 | container bridge name |
| net.braddress4 | ip | 10.0.3.1 | container bridge address |
| net.brmask4 | ip | 255.255.255.0 | container bridge mask address |
| log.dir | path | /storage/logs/ | set [log storage](storage.md#logs) path |
| log.server.outputs | comma-sepated list of the following values: [filetree](storage.md#file-tree), [singlefile](storage.md#single-file), [stdout](storage.md#standard-output), [stdout.pantavisor](storage.md#standard-output-pantavisor), [stdout.containers](storage.md#standard-output-containers), [stdout_direct](storage.md#standard-output-direct) and [nullsink](storage.md#null-sink) | filetree | defines output of [Log Server](storage.md#logs) |
| log.maxsize | integer | 2097152 B (2 MB) | max size of a [stored log](storage.md#logs) file before compressing the logs |
| log.level | 0 (FATAL), 1 (ERROR), 2 (WARN), 3 (INFO), 4 (DEBUG) or 5 (ALL) | 0 | Pantavisor log verbosity level |
| log.buf_nitems | integer | 128 KB | log buffer size in memory |
| log.capture | 0 or 1 | 1 | activate [Log Server](storage.md#logs) |
| log.capture.dmesg | 0 or 1 | 0 | pump dmesg into [Log Server](storage.md#logs) |
| log.loggers | 0 or 1 | 1 | disable [loggers](containers.md#loggers) |
| log.filetree.timestamp.format | golang:[constant](https://pkg.go.dev/time#pkg-constants) or strftime:[format](https://man7.org/linux/man-pages/man3/strftime.3.html) | empty | set the [timestamp format](storage.md#timestamp-format) for the [filetree log output](storage.md#file-tree) |
| log.singlefile.timestamp.format | golang:[constant](https://pkg.go.dev/time#pkg-constants) or strftime:[format](https://man7.org/linux/man-pages/man3/strftime.3.html) | empty | set the [timestamp format](storage.md#timestamp-format) for the [singlefile log output](storage.md#single-file) |
| log.stdout.timestamp.format | golang:[constant](https://pkg.go.dev/time#pkg-constants) or strftime:[format](https://man7.org/linux/man-pages/man3/strftime.3.html) | empty | set the [timestamp format](storage.md#timestamp-format) for the [stdout log output](storage.md#standard-output) |
| log.stdout | 0 or 1 | 0 | _DEPRECATED_: use log.server.outputs instead |
| libthttp.log.level | 0 (FATAL), 1 (ERROR), 2 (WARN), 3 (INFO), 4 (DEBUG) or 5 (ALL) | 3 | libthttp log verbosity level |
| lxc.log.level | integer | 2 | 0 to 8 lxc log verbosity level |
| control.remote | 0 or 1 | 1 | enable all [communication](remote-control.md) with Pantacor Hub |
| control.remote.always | 0 or 1 | 0 | enable all [communication](remote-control.md) with Pantacor Hub even if a [local revision](local-control.md) is installed |
| sysctl.\* | value | empty | configure /proc/sys hierarchy with sysctl.conf format. See sysctl.conf(5) man page | 

Example of pantavisor.config:

```
bootloader.type=normal-uboot
storage.device=LABEL=pvroot
storage.fstype=ext4
storage.opts=
storage.mntpoint=/storage
wdt.enabled=1
wdt.timeout=30
log.level=5
log.buf_nitems=128
sysctl.vm.watermark_boost_level=0
```

### pantahub.config

| Key |  Value | Default | Description |
|-----|--------|---------|-------------|
| creds.type | builtin and ext-\* | builtin | set type of authentication |
| creds.host | ip | 192.168.53.1 | Pantacor Hub IP |
| creds.port | port | 12365 | Pantacor Hub port |
| creds.proxy.host | proxy host | NULL | Proxy Host (if enabled) |
| creds.proxy.port | proxy port | 3128 | Proxy Port |
| creds.proxy.noproxyconnect | int | 0 | Disable Proxyconnect protocol (basic http proxy for TLS) |
| creds.id | string | unset (set after claim) | device id |
| creds.prn | string | unset (set after claim) | device prn |
| creds.secret | string | unset (set after claim) | device secret |
| creds.tpm.key | string | disabled | TMP key |
| creds.tpm.cert | string | disabled | TMP certificate |
| factory.autotok | string | disabled | token for auto claiming |
| updater.interval | integer | 60 | time between Pantacor Hub [update](updates.md) requests |
| updater.network_timeout | integer | 120 | wait time in seconds before rollback if device does not get network connectivity |
| log.push | 0 or 1 | 1 | push [stored logs](storage.md#logs) to cloud |
| metadata.devmeta.interval | integer | 10 | time between Pantacor Hub [devive metadata](storage.md#device-metadata) requests |
| metadata.usrmeta.interval | integer | 5 | time between Pantacor Hub [user metadata](storage.md#user-metadata) requests |

Example of pantahub.config:

```
updater.interval=5
updater.network_timeout=60
updater.commit.delay=40
creds.host=api.pantahub.com
creds.port=443
creds.id=
creds.prn=
creds.secret=
```

## At boot up time

There are two options here: using cmdline and policies. Inside of the boot up time options we also have a hierarchy, making cmdline override policies.

### Using cmdline

The values from the previous sections can be overriden at boot up time, just writing the key=value pair in `/proc/cmdline` with a prefix before the key. This is tipically done from the [bootloader menu](bsp.md#bootloader).

Any key from [pantavisor.config](#pantavisorconfig) can be overriden appending the _pv\__ prefix to the key, while any [pantahub.config](#pantahubconfig) can do the same with the _ph\__ prefix.

Example of cmdline configuration:

```
pv_log.logger=0 ph_log.push=0
```

:::note
When using any of the stdout outputs `pv_log.server.outputs=stdout | stdout.pantavisor | stdout.containers`, you can also pass `ignore_loglevel and printk.devkmsg=on` to kernel through cmdline to make all messages go to console
:::

### Using policies

Policies can be added to the [platform vendor repo](https://gitlab.com/pantacor?utf8=%E2%9C%93&filter=pv-vendor). To set a policy, we use the [policy](#pantavisorconfig) key or the [pv_policy](#using-cmdline) in case cmdline is used.

A policy is just a file with the same format as [pantavisor.config](#pantavisorconfig) that is added as an addiitonal layer during boot up time. All keys are allowed except the following ones:

* policy
* system.init.mode
* cache.usrmetadir
* cache.devmetadir
* system.libdir
* system.etcdir
* system.rundir
* system.mediadir 
* system.confdir


## After an update

Some of the values from the previous sections can be overridden when making a new [revision](revisions.md). To do so, you must create a new file, following the same format we use for [compile time configuration](#at-compile-time) and reference it from [bsp/run.json](pantavisor-state-format-v2.md#bsprunjson).

These are the keys that are accepted at this level of configuration. See the [compile time section](#at-compile-time) for reference:

* creds.proxy.host
* creds.proxy.port
* creds.proxy.noproxyconnect
* storage.gc.reserved
* storage.gc.keep_factory
* storage.gc.threshold
* storage.gc.threshold.defertime
* updater.goals.timeout
* updater.use_tmp_objects
* updater.keep_factory
* updater.interval
* updater.network_timeout
* updater.commit.delay
* revision.retries
* revision.retries.timeout
* log.maxsize
* log.level
* log.buf_nitems
* log.push
* log.capture
* log.loggers
* log.stdout
* log.server.outputs
* log.capture.dmesg
* log.filetree.timestamp.format
* log.singlefile.timestamp.format
* log.stdout.timestamp.format
* libthttp.log.level
* lxc.log.level
* metadata.devmeta.interval
* metadata.usrmeta.interval
* wdt.enabled
* wdt.mode
* wdt.timeout

For example, this is how this file would look like if we wanted to overwrite the log level and the garbage collector threshold:

```
log.level=3
storage.gc.threshold=30
```

## During runtime

### User Metadata

:::note
If the [user metadata volume](pantavisor-state-format-v2.md#devicejson) is assigned to a permanent volume, these changes will persist over device reboots.
:::

[User metadata](storage.md#user-metadata) can be used to override the values from the previous sections.

These are the keys that can be overrriden from user metadata configuration. See the [compile time section](#at-compile-time) for reference on them:

* debug.ssh
* storage.gc.reserved
* storage.gc.keep_factory
* storage.gc.threshold
* storage.gc.threshold.defertime
* updater.interval
* log.level
* log.push
* libthttp.log.level
* metadata.devmeta.interval
* metadata.usrmeta.interval

### Pantavisor Control Socket

:::note
The configuration changes made by this method are volatile and thus will not persist after a device reboot. In that case, the value will fallback to the previously presented highest configuration level.
:::

In this case, there is only one possible value that can be overridden by [Pantavisor Commands](pantavisor-commands.md#commands). See the [compile time section](#at-compile-time) for reference:

* debug.ssh
