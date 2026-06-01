# Pantavisor Configuration

:::note
This reference page presents the newly unified configuration key syntax. To get to the deprecated but still supported previous format, you will have to go [here](pantavisor-configuration-legacy.md).
:::

## Summary

:::note
The key syntax is the same for all [configuration levels](#levels).
:::

:::note
All keys are case insensitive.
:::

:::note
Syntax and behavior of keys tagged with (experimental) might change and break backwards compatibility.
:::

This table contains the currently supported list of configuration keys.

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| `PH_CREDS_HOST` | IP or hostname | `192.168.53.1` | set [Pantacor Hub](remote-control.md#pantacor-hub) address |
| `PH_CREDS_ID` | string | empty | set [Pantacor Hub](remote-control.md#pantacor-hub) device ID |
| `PH_CREDS_PORT` | port | `12365` | set port for communication with [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_CREDS_PROXY_HOST` | IP or hostname | empty | set [Pantacor Hub](remote-control.md#pantacor-hub) proxy address |
| `PH_CREDS_PROXY_NOPROXYCONNECT` | `0` or `1` | `0` | disable proxy communication with [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_CREDS_PROXY_PORT` | port | `3218` | set port for proxy communication with [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_CREDS_PRN` | string | empty | set [Pantacor Hub](remote-control.md#pantacor-hub) device PRN |
| `PH_CREDS_SECRET` | string | empty | set [Pantacor Hub](remote-control.md#pantacor-hub) credentials secret |
| `PH_CREDS_TYPE` | `builtin` | `builtin` | set [Pantacor Hub](remote-control.md#pantacor-hub) credentials type |
| `PH_FACTORY_AUTOTOK` | token | empty | set [factory auto token](https://docs.pantahub.com/pantahub-base/devices/#auto-assign-devices-to-owners) for communication with [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_LIBEVENT_HTTP_TIMEOUT` | time (in seconds) | `60` | set HTTP request timeout for communication with [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_LIBEVENT_HTTP_RETRIES` | number of retries | `1` | set HTTP request number of retries for communication with [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_METADATA_DEVMETA_INTERVAL` | time (in seconds) | `10` | set push interval for [device metadata](storage.md#device-metadata) to [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_METADATA_USRMETA_INTERVAL` | time (in seconds) | `10` | set refresh interval for [user metadata](storage.md#user-metadata) from [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_ONLINE_REQUEST_THRESHOLD` | number of failures | `0` | number of failed requests to [Pantacor Hub](remote-control.md#pantacor-hub) allowed to still consider device online |
| `PH_UPDATER_INTERVAL` | time (in seconds) | `60` | set time between [Pantacor Hub](remote-control.md#pantacor-hub) [update](updates.md) requests |
| `PH_UPDATER_NETWORK_TIMEOUT` | time (in seconds) | `120` | set time before [rollback](updates.md#error) if device cannot communicate with [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PH_UPDATER_TRANSFER_MAX_COUNT` | number of transfers | `5` | set maximum number of object transfers to and from [Pantacor Hub](remote-control.md#pantacor-hub) during [updates](updates.md) |
| `PV_BOOTLOADER_FITCONFIG` | string | empty | set FIT configuration name |
| `PV_BOOTLOADER_MTD_ENV` | string | empty | set MTD name for bootloader env |
| `PV_BOOTLOADER_MTD_ONLY` | `0` or `1` | `0` | enable MTD for bootloader env |
| `PV_BOOTLOADER_TYPE` | `uboot`, `uboot-ab`, `uboot-pvk`, `rpiab` or `grub` | `uboot` | set [bootloader](bsp.md#bootloader) type |
| `PV_BOOTLOADER_UBOOTAB_A_NAME` | string | fitA | name of the partition to use as "A" in uboot-ab mode |
| `PV_BOOTLOADER_UBOOTAB_A_NAME` | string | fitB | name of the partition to use as "B" in uboot-ab mode |
| `PV_BOOTLOADER_UBOOTAB_ENV_NAME` | string | empty | name  of the partition where the uboot environment is stored |
| `PV_BOOTLOADER_UBOOTAB_ENV_BAK_NAME` | string | empty | name of the partition where the uboot environment is backed up |
| `PV_BOOTLOADER_UBOOTAB_ENV_OFFSET` | offset in bytes | 0 | environment offset from the beginning of the partition |
| `PV_BOOTLOADER_UBOOTAB_ENV_SIZE` | size in bytes | 0 | size of the uboot environment |
| `PV_CACHE_DEVMETADIR` | path | `/storage/cache/devmeta` | set persistent [device metadata](pantavisor-metadata.md#device-metadata) dir |
| `PV_CACHE_USRMETADIR` | path | `/storage/cache/meta` | set persistent [user metadata](pantavisor-metadata.md#user-metadata) dir |
| `PV_CONTROL_REMOTE` | `0` or `1` | `1` | enable [communication with Pantacor Hub](remote-control.md#pantacor-hub) |
| `PV_CONTROL_REMOTE_ALWAYS` | `0` or `1` | `0` | keep [communication with Pantacor Hub](remote-control.md#pantacor-hub) even when a [local revision](local-control.md) is running |
| `PV_DEBUG_SHELL` | `0` or `1` | `1` | enable [debug shell console](inspect-device.md#tty) |
| `PV_DEBUG_SHELL_AUTOLOGIN` | `0` or `1` | `0` | always prompt [debug shell console](inspect-device.md#tty) without having to press any key |
| `PV_DEBUG_SHELL_TIMEOUT` | time (in seconds) | `60` | time that Pantavisor waits before rebooting if [debug shell console](inspect-device.md#tty) is opened |
| `PV_DEBUG_SSH` | `0` or `1` | `1` | enable [debug ssh server](inspect-device.md#ssh) |
| `PV_DEBUG_SSH_AUTHORIZED_KEYS` | string | empty | set name of the [debug ssh server]((inspect-device.md#ssh) public key file |
| `PV_DISK_EXPORTSDIR` | path | `/exports` | set exports directory |
| `PV_DISK_VOLDIR` | path | `/volumes` | set volumes directory |
| `PV_DISK_WRITABLEDIR` | path | `/writable` | set writable directory |
| `PV_DROPBEAR_CACHE_DIR` | path | `/storage/cache/dropbear` | set [debug ssh server](inspect-device.md#ssh) cache directory |
| `PV_LIBEVENT_DEBUG_MODE` | `0` or `1` | `0` | enable event loop debug logs |
| `PV_LIBTHTTP_CERTSDIR` | path | `/certs` | set certificates directory for libthttp |
| `PV_LIBTHTTP_LOG_LEVEL` | `0` (FATAL), `1` (ERROR), `2` (WARN), `3` (INFO), `4` (DEBUG) or `5` (ALL) | `3` | set libthttp log verbosity level |
| `PV_LOG_CAPTURE` | `0` or `1` | `1` | activate [Log Server](storage.md#logs) |
| `PV_LOG_CAPTURE_DMESG` | `0` or `1` | `1` | pump dmesg into [Log Server](storage.md#logs) |
| `PV_LOG_BUF_NITEMS` | size (in KB) | `128` | set in-memory [logs](storage.md#logs) buffer size |
| `PV_LOG_DIR` | path | `/storage/logs/` | set [logs](storage.md#logs) directory |
| `PV_LOG_FILETREE_TIMESTAMP_FORMAT` | `golang:`[constant](https://pkg.go.dev/time#pkg-constants) or `strftime:`[format](https://man7.org/linux/man-pages/man3/strftime.3.html) | empty | set [timestamp format](storage.md#timestamp-format) for [filetree Log Server output](storage.md#file-tree) |
| `PV_LOG_LEVEL` | `0` (FATAL), `1` (ERROR), `2` (WARN), `3` (INFO), `4` (DEBUG) or `5` (ALL) | `0` | set [Log Server](storage.md#logs) verbosity level |
| `PV_LOG_LOGGERS` | `0` or `1` | `1` | enable [container loggers](containers.md#loggers) |
| `PV_LOG_MAXSIZE` | size (in B) | `2097152` (2 MB) | set max size of a [Log Server](storage.md#logs) stored log file before compression |
| `PV_LOG_PUSH` | `0` or `1` | `1` | enable pushing [stored logs](storage.md#logs) into [Pantacor Hub](remote-control.md#pantacor-hub) |
| `PV_LOG_SERVER_OUTPUTS` | comma-separated list of: `filetree`, `nullsink`, `singlefile`, `stdout`, `stdout_direct`, `stdout.containers` and/or `stdout.pantavisor` | `filetree` | set output format of [Log Server](storage.md#logs); NOTE: [for stdout output you need to tweak kernel cmdline](storage.md/#standard-output) |
| `PV_LOG_SINGLEFILE_TIMESTAMP_FORMAT` | `golang:`[constant](https://pkg.go.dev/time#pkg-constants) or `strftime:`[format](https://man7.org/linux/man-pages/man3/strftime.3.html) | empty | set [timestamp format](storage.md#timestamp-format) for [singlefile Log Server output](storage.md#single-file) |
| `PV_LOG_STDOUT_TIMESTAMP_FORMAT` | `golang:`[constant](https://pkg.go.dev/time#pkg-constants) or `strftime:`[format](https://man7.org/linux/man-pages/man3/strftime.3.html) | empty | set [timestamp format](storage.md#timestamp-format) for [stdout Log Server output](storage.md#standard-output) |
| `PV_LXC_LOG_LEVEL` | `0` (TRACE), `1` (DEBUG), `2` (INFO), `3` (NOTICE), `4` (WARN), `5` (ERROR), `6` (CRITICAL), `7` (ALERT) or `8` (FATAL) | `2` | set lxc library log verbosity level |
| `PV_NET_BRADDRESS4` | IP or hostname | `10.0.3.1` | set [container](containers.md) network bridge address |
| `PV_NET_BRDEV` | string | `lxcbr0` | set [container](containers.md) network bridge name |
| `PV_NET_BRMASK4` | IP or hostname | `255.255.255.0` | set [container](containers.md) bridge mask address |
| `PV_OEM_NAME` | string | empty | set [OEM configuration](pantavisor-configuration-levels.md#oem) file path and the expected subject CN name for the [OEM root certificate validation](storage.md#certificate-chain-of-trust) |
| `PV_POLICY` | string without `/` character | empty | set configuration [policy](pantavisor-configuration-levels.md#policies) and [OEM file name](pantavisor-configuration-levels.md#oem) |
| `PV_REMOUNT_POLICY` | string | "default" | set [remount policy](containers.md#remount-policies) |
| `PV_REVISION_RETRIES` | number of retries | `10` | set number of [updates](updates.md) retries before rollback |
| `PV_SECUREBOOT_CHECKSUM` | `0` or `1` | `1` | enable artifact [checksum validation](storage.md#artifact-checksum) |
| `PV_SECUREBOOT_HANDLERS` | `0` or `1` | `1` | enable the use of script handlers for [checksum validation](storage.md#artifact-checksum) |
| `PV_SECUREBOOT_MODE` | `disabled`, `audit`, `lenient` or `strict` | `lenient` | set [secureboot](storage.md#integrity) severity level |
| `PV_SECUREBOOT_OEM_TRUSTSTORE` | string | `ca-oem-certificates` | set OEM trustore name to be used by [secureboot](storage.md#certificate-chain-of-trust) |
| `PV_SECUREBOOT_TRUSTSTORE` | string | `ca-certificates` | set default truststore name to used by [secureboot](storage.md#certificate-chain-of-trust) |
| `PV_STORAGE_DEVICE` | `LABEL=`XXXX, `UUID=`XXXX or string | N/A (mandatory) | set [storage](storage.md) device with a partition label, UUID or /dev name |
| `PV_STORAGE_FSTYPE` | `ext4`, `ubifs` or `jffs2` | N/A (mandatory) | set [storage](storage.md) file system type |
| `PV_STORAGE_GC_KEEP_FACTORY` | `0` or `1` | `0` | avoid deletion of [revision](revisions.md) 0 artifacts by the [garbage collector](storage.md#garbage-collector) |
| `PV_STORAGE_GC_RESERVED` | percentage | `5` | the [garbage collector](storage.md#garbage-collector) will try to always keep this percentage of disk free |
| `PV_STORAGE_GC_THRESHOLD_DEFERTIME` | time (in seconds) | `600` | time the [garbage collector threshold](storage.md#threshold) will be deferred after a new object has been put from the [control socket objects endpoint](pantavisor-commands.md#objects) |
| `PV_STORAGE_GC_THRESHOLD` | percentage | `0` | the [garbage collector](storage.md#garbage-collector) will be triggered if there is less than this percentage of disk free |
| `PV_STORAGE_LOGTEMPSIZE` | size (with k, m g or % suffix) | empty | set [logs](storage.md#logs) to be stored on memory |
| `PV_STORAGE_MNTPOINT` | path | N/A (mandatory) | set [storage](storage.md) mount point |
| `PV_STORAGE_MNTTYPE` | `ext4` | empty | set [storage](storage.md) mount point file system |
| `PV_STORAGE_PHCONFIG_VOL` | `0` or `1` | `0` | use [Pantacor Hub credentials volume](storage.md#volumes) |
| `PV_STORAGE_WAIT` | time (in seconds) | `5` | set wait time for [storage](storage.md) device to be available |
| `PV_SYSCTL_KERNEL_CORE_PATTERN` | [core pattern](https://man7.org/linux/man-pages/man5/core.5.html) | `string|/lib/pv/pvcrash --skip` | set sysctl kernel core_pattern |
| `PV_SYSCTL_`\* | [sysctl.conf format](https://man7.org/linux/man-pages/man5/sysctl.conf.5.html) | N/A (mandatory) | set sysctl /proc/sys hierarchy |
| `PV_SYSTEM_APPARMOR_PROFILES` | comma-separated list of [AppArmor](https://ubuntu.com/server/docs/security-apparmor) profile names | empty | list of AppArmor profiles to be loaded during device initialisation |
| `PV_SYSTEM_CONFDIR` | path | `/configs` | set config directory |
| `PV_SYSTEM_DRIVERS_LOAD_EARLY_AUTO` | `0` or `1` | `0` | load all [drivers](bsp.md#managed-drivers) automatically during device initialisation |
| `PV_SYSTEM_ETCDIR` | path | `/etc` | set etc directory |
| `PV_SYSTEM_INIT_MODE` | `embedded`, `standalone` or `appengine` | `embedded` | set [init mode](init-mode.md) |
| `PV_SYSTEM_LIBDIR` | path | `/lib` | set lib directory |
| `PV_SYSTEM_MEDIADIR` | path | `/media` | set media directory |
| `PV_SYSTEM_MOUNT_SECURITYFS` | `0` or `1` | `0` | mount /sys/kernel/security during device initialisation |
| `PV_SYSTEM_RUNDIR` | path | `/pv` | set run directory |
| `PV_SYSTEM_USRDIR` | path | `/usr` | set urs directory |
| `PV_UPDATER_COMMIT_DELAY` | time (in seconds) | `25` | set testing time after an [update](updates.md) |
| `PV_UPDATER_GOALS_TIMEOUT` | time (in seconds) | `120` | set time to wait for a container to reach its [status goal](containers.md#status-goal) |
| `PV_UPDATER_USE_TMP_OBJECTS` | `0` or `1` | `0` | download objects in an [on-disk](storage.md) temporary location. If disabled, objects will be stored in memory while [downloading](updates.md#downloading) |
| `PV_VOLMOUNT_DM_EXTRA_ARGS` | [veritysetup options](https://man7.org/linux/man-pages/man8/veritysetup.8.html) | empty | add extra options to be used for [dm verity mounting](storage.md#artifact-checksum) |
| `PV_WDT_MODE` | `disabled`, `shutdown`, `startup` or `always` | `shutdown` | set [watchdog mode](watchdog.md#mode) |
| `PV_WDT_TIMEOUT` | time (in seconds) | `15` | set [watchdog](watchdog.md) timeout |

## Levels

This table shows the [configuration levels](pantavisor-configuration-levels.md) that are allowed for each [configuration key](#summary).

| Key | [pv.conf](pantavisor-configuration-levels.md#pantavisorconfig) | [ph.conf](pantavisor-configuration-levels.md#pantahubconfig) | [env,bootargs](pantavisor-configuration-levels.md#environment-variables) | [Policy](pantavisor-configuration-levels.md#policies) | [OEM](pantavisor-configuration-levels.md#oem) | [User meta](pantavisor-configuration-levels.md#user-metadata) | [Command](pantavisor-configuration-levels.md#commands) |
|-----|------------------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------------|-----------------------------------------------|---------------------------------------------------------------|--------------------------------------------------------|
| `PH_CREDS_HOST`                      | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_CREDS_ID`                        | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_CREDS_PORT`                      | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_CREDS_PROXY_HOST`                | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_CREDS_PROXY_NOPROXYCONNECT`      | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_CREDS_PROXY_PORT`                | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_CREDS_PRN`                       | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_CREDS_SECRET`                    | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_CREDS_TYPE`                      | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_FACTORY_AUTOTOK`                 | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PH_LIBEVENT_HTTP_TIMEOUT`           | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PH_LIBEVENT_HTTP_RETRIES`           | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PH_METADATA_DEVMETA_INTERVAL`       | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PH_METADATA_USRMETA_INTERVAL`       | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PH_ONLINE_REQUEST_THRESHOLD`        | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PH_UPDATER_INTERVAL`                | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PH_UPDATER_NETWORK_TIMEOUT`         | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PH_UPDATER_TRANSFER_MAX_COUNT`      | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_BOOTLOADER_FITCONFIG`            | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_MTD_ENV`              | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_MTD_ONLY`             | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_TYPE`                 | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_UBOOTAB_A_NAME`       | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_UBOOTAB_A_NAME`       | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_UBOOTAB_ENV_NAME`     | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_UBOOTAB_ENV_BAK_NAME` | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_UBOOTAB_ENV_OFFSET`   | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_BOOTLOADER_UBOOTAB_ENV_SIZE`     | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_CACHE_DEVMETADIR`                | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_CACHE_USRMETADIR`                | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_CONTROL_REMOTE`                  | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_CONTROL_REMOTE_ALWAYS`           | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_DEBUG_SHELL`                     | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_DEBUG_SHELL_AUTOLOGIN`           | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_DEBUG_SHELL_TIMEOUT`             | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_DEBUG_SSH`                       | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-check: |
| `PV_DEBUG_SSH_AUTHORIZED_KEYS`       | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_DISK_EXPORTSDIR`                 | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_DISK_VOLDIR`                     | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_DISK_WRITABLEDIR`                | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_DROPBEAR_CACHE_DIR`              | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_LIBEVENT_DEBUG_MODE`             | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LIBTHTTP_CERTSDIR`               | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_LIBTHTTP_LOG_LEVEL`              | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LOG_CAPTURE`                     | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_LOG_CAPTURE_DMESG`               | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_LOG_BUF_NITEMS`                  | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_LOG_DIR`                         | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_LOG_FILETREE_TIMESTAMP_FORMAT`   | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LOG_LEVEL`                       | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LOG_LOGGERS`                     | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_LOG_MAXSIZE`                     | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LOG_PUSH`                        | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LOG_SERVER_OUTPUTS`              | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LOG_SINGLEFILE_TIMESTAMP_FORMAT` | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LOG_STDOUT_TIMESTAMP_FORMAT`     | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_LXC_LOG_LEVEL`                   | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_NET_BRADDRESS4`                  | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_NET_BRDEV`                       | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_NET_BRMASK4`                     | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_OEM_NAME`                        | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_POLICY`                          | :material-check: | :material-close: | :material-check: | :material-close: | :material-close: | :material-close: | :material-close: |
| `PV_REMOUNT_POLICY`                   | :material-close: | :material-close: | :material-check: | :material-close: | :material-close: | :material-close: | :material-close: |
| `PV_REVISION_RETRIES`                | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_SECUREBOOT_CHECKSUM`             | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SECUREBOOT_HANDLERS`             | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SECUREBOOT_MODE`                 | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SECUREBOOT_OEM_TRUSTSTORE`       | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SECUREBOOT_TRUSTSTORE`           | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_STORAGE_DEVICE`                  | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_STORAGE_FSTYPE`                  | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_STORAGE_GC_KEEP_FACTORY`         | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_STORAGE_GC_RESERVED`             | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_STORAGE_GC_THRESHOLD_DEFERTIME`  | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_STORAGE_GC_THRESHOLD`            | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_STORAGE_LOGTEMPSIZE`             | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_STORAGE_MNTPOINT`                | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_STORAGE_MNTTYPE`                 | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_STORAGE_WAIT`                    | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_APPARMOR_PROFILES`        | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_CONFDIR`                  | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_DRIVERS_LOAD_EARLY_AUTO`  | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_ETCDIR`                   | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_INIT_MODE`                | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_LIBDIR`                   | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_MEDIADIR`                 | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_MOUNT_SECURITYFS`         | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_RUNDIR`                   | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_SYSTEM_USRDIR`                   | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_UPDATER_COMMIT_DELAY`            | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_UPDATER_GOALS_TIMEOUT`           | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_UPDATER_USE_TMP_OBJECTS`         | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-check: | :material-close: |
| `PV_VOLMOUNT_DM_EXTRA_ARGS`          | :material-check: | :material-close: | :material-check: | :material-check: | :material-check: | :material-close: | :material-close: |
| `PV_WDT_MODE`                        | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
| `PV_WDT_TIMEOUT`                     | :material-check: | :material-close: | :material-check: | :material-check: | :material-close: | :material-close: | :material-close: |
