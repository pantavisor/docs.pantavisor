# Pantavisor State Format

Pantavisor state format describes the json format to configure the Pantavisor run-time state. In this page, we are going to go through the System State Format v2, which is the version we currently use.

:::note
This reference is for advanced users. Before manually editing these values in your device, check if what you intend to do can be achieved with the help of [pvr](pvr/README.md).
:::

## Spec Format

A complete system is made up of one BSP as well as one to many containers. The state allows this following this format:

```
{
    "#spec": "pantavisor-service-system@1",
  
    "README.md": "xxx",

    "bsp/run.json": {..},
    "bsp/file1....": {..},

    "<container1>/run.json": {..},
    "<container1>/file1...": "xxx",

	"disks.json": {..},

	"_sigs/<container1>.json": {..},

	"_config/<container1>/file1...": "xxx"
}
```

This table defines all possible keys for the state format:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| #spec | _pantavisor-service-system@1_ | **mandatory** | version of the state format |
| README.md | string | empty | readme file in markdown format |
| bsp/run.json | [bsp/run.json](#bsprunjson) | **mandatory** | bsp run-time configuration file |
| bsp/drivers.json | [bsp/drivers.json](#bspdriversjson) | empty | managed drivers |
| <container\>/run.json | [container/run.json](#containerrunjson) | **mandatory** | container run-time configuration file |
| disks.json | [disks.json](#disksjson) | empty | definition of physical store medium |
| groups.json | [groups.json](#groupsjson) | empty | definition of container groups |
| device.json | [device.json](#devicejson) | empty | definition of disks and groups |
| \_sigs/container.json | [\_sigs/container.json](#_sigscontainerjson) | empty | signature file |
| \_config/<container\>/<path\> | [\_config/container/](#_configcontainer) | empty | configuration files |

### bsp/run.json

This file allows to configure the [BSP](bsp.md). The JSON follows this format:

```
{
	"addons": [
		"addon-plymouth.cpio.xz4"
	],
	"firmware": "firmware.squashfs",
	"initrd": "pantavisor",
	"linux": "kernel.img",
	"modules": "modules.squashfs"
}
```

This table defines all possible keys for the BSP run.json:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| addons | list of paths | **mandatory** | list of relative paths to the [initrd rootfs addons](bsp.md#addons) |
| firmware | path |  **mandatory** | relative path to Linux firmware file |
| initrd | path |  **mandatory** | relative path to Pantavisor binary file |
| linux | path |  **mandatory** | relative path to Linux kernel file |
| modules | path |  **mandatory** | relative path to Linux modules file |

### bsp/drivers.json

This JSON file can be used to set a list of [managed drivers](bsp.md#managed-drivers), following this format:

```
{
    "#spec": "driver-aliases@1",
    "all": {
        "bluetooth": [
            "hci_uart",
            "btintel"
        ],
        "wifi": [
            "iwlwifi ${user-meta:drivers.iwlwifi.opts}"
        ]
    },
    "dtb:broadcom/bcm2711-rpi-4-b.dtb": {
        "wifi": [
            "cfg80211 ${user-meta:drivers.cfg80211.opts}",
            "brcmfmac ${user-meta:drivers.brcmfmac.opts}"
        ]
    }
}
```

This table defines all supported keys for the BSP drivers.json:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| #spec | _driver-aliases@1_ | **mandatory** | version of the drivers JSON |
| all | list of [managed drivers](#managed-driver) | **mandatory** | list of managed driver JSONs |
| dtb:<dtb-name> | list of [managed drivers](#managed-driver) specific to dtb info provided by bootloader through pv_bootloader.dtb= cmdline paramaneter | **optional** | list of managed driver JSONs |
| ovl:<ovl-name> | list of [managed drivers](#managed-driver) specific to overlay info provided by bootloader through pv_bootloader.ovl= cmdline paramaneter | **experimental** | list of managed driver JSONs (experimental - semantic change or go away) |

#### managed driver

Each driver JSON is composed by a list of Kernel modules. It follows this format:

```
"bluetooth": [
    "hci_uart",
    "btintel ${user-meta:drivers.btintel.opts}"
]
```

This table defines all supported keys for the BSP driver JSON:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| name | string | **mandatory** | name of the driver |
| modules | list of strings | empty | module names with optional user or device metadata key where the load arguments are stored |

#### multi board BSP drivers

To facilitate an ecosystem where a single BSP can support multiple boards effectively we are offering
a mechanism to map abstract drivers to different modules or properties based on the dtb and overlay information
provided by the bootloader to the kernel.


The initial example from above shows how to overload the definition of the abstract `wifi` driver
for a given dtb info provided by the bootloader to the kernel:

```
    "dtb:broadcom/bcm2711-rpi-4-b.dtb": {
        "wifi": [
            "cfg80211 ${user-meta:drivers.cfg80211.opts}",
            "brcmfmac ${user-meta:drivers.brcmfmac.opts}"
        ]
    }
```

This will ensure that a kernel booted with the dtb `broadcom/bcm2711-rpi-4-b.dtb` will
use the brcmfmac driver and not the iwlwifi driver from the `all` section.

### OEM configuration

This file allows to [overrride some configuration keys](pantavisor-configuration-levels.md). It will only be processed if `PV_OEM_NAME` is [configured](pantavisor-configuration.md), with the following behavior:

* If `PV_POLICY` is set too, the file is loaded from the revision at `<PV_OEM_NAME>/<PV_POLICY>.config`.
* If `PV_POLICY` is not set, the file is is loaded from `<PV_OEM_NAME>/default.config`.
* If the file is not found in the revision, we continue normally with a warning on [logs](storage.md#logs).

### container/run.json

This file allows to individually configure each [container](containers.md). This JSON follows this format:

```
{
	"#spec": "service-manifest-run@1",
	"config": "lxc.container.conf",
	"name": "awconnect",
	"root-volume": "root.squashfs",
	"status_goal": "STARTED",
	"storage": {
		"docker--etc-NetworkManager-system-connections": {
			"persistence": "permanent"
		},
		"lxc-overlay": {
			"persistence": "boot"
		}
	},
	"type": "lxc",
	"volumes": [],
	"drivers": {
		"required": [ "ethernet" ]
	}
}
```

This table defines all possible keys for the container run.json:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| #spec | _service-manifest-run@1_ | **mandatory** | version of the run JSON |
| config | path | **mandatory** | relative path to the container configuration file |
| name | string | **mandatory** | name of the container |
| root-volume | path | **mandatory** | relative path to the container rootfs [volume](#volume) file |
| storage | [storage](#storage) | **mandatory** | container storage configuration |
| type | _lxc_ | **mandatory** | type of container |
| volumes | list of paths | **mandatory** | relative paths to the additional container [volumes](#volume) |
| logs | list of [loggers](#logger) | empty | list of log configuration JSONS |
| group | string | empty | name of [group](containers.md#groups) |
| runlevel | _data_, _root_, _platform_ or _app_ | _root_ or _platform | _DEPRECATED: use group instead |
| roles | _mgmt_ or _nobody_ | empty | list of roles for the container |
| status_goal | _MOUNTED_, _STARTED_ or _READY_ | _MOUNTED_ or _STARTED_ | [status goal](containers.md#status-goal) |
| restart_policy | _system_ or _container_ | _system_ or _container_ | [restart policy](containers.md#restart-policy) |
| drivers | list of [container drivers](#container-driver) | empty | list of referenced [managed drivers](#managed-driver) for the container |
| exports | list of paths | empty | list of paths to be [mounted](containers.md#exports) to the host |

#### volume

This string can define [container volumes](containers.md#storage). It follows this format:

```
[_handler_:]path
```

The path is the relative path for the volume file in the [state JSON](#spec-format). The optional _handler_ allows to mount/umnount volumes using the referenced [handler script](storage.md#artifact-checksum).

For example, to set a root file system for a container that will be validated using [dm-verity](https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html):

```
"root-volume": "dm:rootfs.squashfs"
```

#### storage

This JSON allows to configure the [storage of a container](containers.md#storage) or to define [additional Pantavisor volumes](storage.md#volumes). It is important to notice that you can configure the overlay or any of the container rootfs paths:

```
{
	"lxc-overlay":{
        "persistence":"boot"
    },
	"etc/example/": {
        "persistence": "permanent"
    },
	"docker--etc-modules-load.d": {
		"disk": "built-in",
		"persistence": "permanent"
	},
	"docker--var-pv": {
		"disk": "dm-versatile",
		"persistence": "permanent"
	},
	...
}
```

This table defines all possible keys for the container storage JSON:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| persistence | _permanent_, _revision_ or _boot_ | **mandatory** | 
| disk | string | empty | name of disk defined in [disks.json] |

#### logger

This allows to configure a [logger inside of a container](containers.md#logger). It looks like this:

```
{
	"file":"/var/log/syslog",
	"maxsize":102485760,
	"truncate":true,
	"name":"alpine-logger"
}
```

This table defines all possible keys for the container logger JSON:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| _file_, _lxc_ or _console_ | string | **mandatory** | path of a file in the rootfs in case of _file_ key. _enable_ in case of _lxc_ or _console_ key |
| maxsize | integer | **mandatory** | max file size in bytes before truncating |
| truncate | _true_ or _false_ | **mandatory** | truncate the file when reaching maxsize |
| name | string | **mandatory** | logger daemon name |

### container driver

This JSON allows to configure a [container driver](containers.md#drivers). An example would look like:

```
"optional": [ "usbnet", "wifi" ]
```

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| loading | _required_, _optional_ or _manual_ | **mandatory** | how and when to load the driver |
| drivers | list of [managed driver names](#managed-driver) | empty | the managed drivers to be loaded |

### disks.json

This JSON allows to add new [disks](storage.md#disks). An example of this JSON shows it is just a list of JSONs with the following format:

```
[
    {
        "default": "yes",
        "name": "built-in",
        "path": "/storage/disks/",
        "type": "directory"
    },
    {
        "name": "dm-versatile",
        "options": "....",
        "path": "/storage/dm-crypt-file/disk1/versatile.img,8,versatile_key",
        "type": "dm-crypt-versatile"
    },
    {
        "name": "dm-caam",
        "options": "....",
        "path": "/storage/dm-crypt-file/disk1/caam.img,8,caam_key",
        "type": "dm-crypt-caam"
    },
    {
        "name": "dm-dcp",
        "options": "....",
        "path": "/storage/dm-crypt-file/disk1/dcp.img,8,dcp_key",
        "type": "dm-crypt-dcp"
    }
]
```

This table defines the keys for each disk:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| default | _yes_ or _no_ | _no_ | all volumes without specific [disk name](#storage) will use this disk |
| name | string | **mandatory** | unique name of the disk to be used in [container storage](#storage) |
| path | path | **mandatory** | destination mount path in case of directory. For crypt disk, please refer below |
| type | _directory_, _dm-crypt-versatile_, _dm-crypt-caam_ or _dm-crypt-dcp_ | **mandatory** | type of disk |
| options | string | empty | options to be passed for mount command -o |

Device mapper crypt disk follows a special pattern in path:

```
image,size,key
```

image: disk path which will be encrypted (created during first boot if not present)
size: size in MB used to create the disk file
key: name of the key file which needs to be created using respective tools (e.g. caam-keygen for i.Mx CAAM)

For example:

```
"path": "/storage/dm-crypt-file/disk1/file.img,8,key"
```

### disks_v2.json
The new JSON supports all the previous disk and adds two new types:
```
[
    {
        "name": "zram-swap",
        "type": "swap-disk",
        "format": "swap",
	     "format_options": "",
        "provision": "zram",
        "provision_options": "...",
	     "mount_options": "..."
    },
    {
        "name": "zram-volume",
        "type": "volume-disk",
        "format": "ext4",
	     "format_options": "",
        "provision": "zram",
        "provision_options": "...",
        "mount_target": "...",
	     "mount_options": "..."
    }
]
```
The first one is a swap disk based on zram, while the second is a volume disk, which could be used to mount volumes for containers or for Pantavasor itself.

To define this new types, the following keys are available:

|key|value|default|description|
|---|-----|-------|-----------|
|name|string|**mandatory**|unique name of the disk to be used in [container storage](#storage)|
|type|string|**mandatory**|type of disk to create: `volume-disk` or `swap-disk`|
|format|string|**mandatory**|new disk format, possible values are: ext3, ext4 or swap|
|format_options|string|empty|format options for the mkfs command (see [the man page](https://linux.die.net/man/8/mke2fs))|
|provision|string|**mandatory**|define the underlying resource to create the disk. At the moment only `zram` is available|
|provision_options|string|empty|comma separate key=value pairs to set options for the current provision|
|mount_target|string (path)|empty|mount point for the current disk. Only necessary for `volume-disk`|
|mount_options|string|empty|comma separated flags for mount syscall. See[`mountflags`in the manual](https://man7.org/linux/man-pages/man2/mount.2.html) for more information|

### groups.json

This JSON can be used to overload the default [groups](storage.md#groups). This is the default JSON that will be used by Pantavisor if groups.json is not present in the state, but can be used to illustrate how any groups.json would be formed:

```
[
    {
        "name":"data",
        "description":"Containers which volumes we want to mount but not to be started",
        "restart_policy": "system",
        "timeout": 30,
        "status_goal": "MOUNTED"
    },
    {
        "name":"root",
        "description":"Container or containers that are in charge of setting network connectivity up for the board",
        "restart_policy": "system",
        "timeout": 30,
        "status_goal": "STARTED"
    },
    {
        "name":"platform",
        "description": "Middleware and utility containers",
        "restart_policy": "system",
        "timeout": 30,
        "status_goal": "STARTED"
    },
    {
        "name":"app",
        "description": "Application level containers",
        "restart_policy": "container",
        "timeout": 30,
        "status_goal": "STARTED"
    }
]
```

This table defines the keys for each group:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| name | string | **mandatory** | unique name of the group to be used from [container](#containerrunjson) |
| description | string | empty | human readable description |
| restart_policy | _system_ or _container_ | _container_ | default [restart policy](containers.md#restart-policy) |
| status_goal | _MOUNTED_, _STARTED_ or _READY_ | _STARTED_ | default [status goal](containers.md#status-goal) |
| timeout | integer | [PV_UPDATER_GOALS_TIMEOUT](pantavisor-configuration.md#summary) | default [timeout](containers.md#timeout) for the group |

### device.json

This JSON substitutes both [disks.json](#disksjson) and [groups.json](#groupsjson). Using it along any of the two will result in an invalid state JSON, as it encompasses their contents.

```
{
    "disks": [
        {   
            "name": "dm-internal-secrets",
            "path": "/storage/dm-crypt-files/dm-internal-secrets/versatile.img,2,versatile_key-internal_secrets",
            "type": "dm-crypt-versatile"
        }
    ],  
    "groups": [
        {
            "description": "Containers which volumes we want to mount but not to be started",
            "name": "data",
            "restart_policy": "system",
            "status_goal": "MOUNTED",
            "timeout": 30
        },
        {
            "description": "Container or containers that are in charge of setting network connectivity up for the board",
            "name": "root",
            "restart_policy": "system",
            "status_goal": "STARTED",
            "timeout": 30
        },
        {
            "description": "Middleware and utility containers",
            "name": "platform",
            "restart_policy": "system",
            "status_goal": "STARTED",
            "timeout": 30
        },
        {
            "description": "Application level containers",
            "name": "app",
            "restart_policy": "container",
            "status_goal": "STARTED",
            "timeout": 30
        }
    ],  
    "volumes": {
        "pv--devmeta": {
            "disk": "dm-internal-secrets",
            "persistence": "permanent"
        },
        "pv--usrmeta": {
            "disk": "dm-internal-secrets",
            "persistence": "permanent"
        },
        "pv--phconfig": {
            "disk": "dm-internal-secrets",
            "persistence": "permanent"
		}
    }   
}
```

This table defines the keys for each group:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| disks | [list of disks](#disksjson) | empty | definition of physical store medium |
| groups | [list of groups](#groupsjson) | empty | definition of container groups |
| volumes | [storage](#storage) | empty | definition of [additional volumes](storage.md#volumes) |

### \_sigs/container.json

This JSON allows to [sign](storage.md#integrity) a group of artifacts from the state. It must follow the standard [JWS format](https://datatracker.ietf.org/doc/html/rfc7515):

```
{
	"#spec": "pvs@2",
	"protected": "XXXX",
	"signature": "XXXX"
}
```

This table defines the keys for the signature JSON:

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| #spec | _pvs@2_ | **mandatory** | version of the signature JSON |
| protected | base64 encoded [protected](#protected) | **mandatory** | information about how the signature was created |
| signature | base64 encoded hash | **mandatory** | the signature itself |

#### protected

This JSON allows to reproduce the signature hash from [\_sigs/container.json](#sigscontainerjson). It must follow the standard [JWS format](https://datatracker.ietf.org/doc/html/rfc7515):

```
{
	"alg":"RS256",
	"typ":"PVS",
	"pvs": {
		"include":["pv-avahi/**","_config/pv-avahi/**"],
		"exclude":["pv-avahi/src.json"]
	},
	"x5c": [
		"XXXX",
		"XXXX"
	]
}
```

| Key | Value | Default | Description |
|-----|-------|---------|-------------|
| alg | _RS256_, _ES256_, _ES384_ or _ES512_ | **mandatory** | cryptography algorithm to generate the signature |
| typ | _PVS_ | **mandatory** | type of signature |
| pvs | lists of _included_ and _excluded_ paths | **mandatory** | relative paths to the files that were used to generate the signature |
| x5c | list of certificate strings | empty | certificate that contains the public key plus more certificates from the chain of trust |

### \_config/container/

This directory can be used to attach [additional files](containers.md#additional-files) to the
container rootfs.

For example, if we wanted to add or overwrite the main pvr-sdk configuration file, we would do it
by adding the desired file to the \_config directory in the JSON state:
```
_config/pvr-sdk/etc/pvr-sdk/config.json
```

Which would set that file in the pvr-sdk container rootfs like this:

```
/etc/pvr-sdk/config.json
```

Those files will be attached using the default owner and permissions:

 * Owner: 0:0 (global root:root)
 * Mod: 0644 (u+rw,g+r,o+r)

## Format Exceptions

The files in this section are meant to be used for tooling (like [pvr](install-pvr.md)) and thus ignored by Pantavisor.

### bsp/src.json

```
{
  "#spec": "bsp-manifest-src@1",
  "pvr": "https://pvr.pantahub.com/pantahub-ci/arm_rpi64_bsp_latest#bsp"
}
```

### bsp/build.json

```
{
  "altrepogroups": "",
  "branch": "master",
  "commit": "e2a4911eb35de2032e85f74c8f239de81c6f622b",
  "gitdescribe": "014-rc14-18-ge2a4911",
  "pipeline": "436189414",
  "platform": "rpi64",
  "project": "pantacor/pv-manifest",
  "pvrversion": "pvr version 026-52-gbf3bd5d6",
  "target": "arm-rpi64",
  "time": "2021-12-24 01:25:27 +0000"
}
```

### container/src.json

```
{
  "#spec": "service-manifest-src@1",
  "docker_config": {
    "AttachStderr": false,
    "AttachStdin": false,
    "AttachStdout": false,
    "Cmd": [
      "/sbin/init"
    ],
    "Domainname": "",
    "Env": [
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
    ],
    "Hostname": "",
    "Image": "sha256:701f4bbc1d5b707fc7daabf637cb2fa12532d05ceea6be24f8bb15a55805843b",
    "OpenStdin": false,
    "StdinOnce": false,
    "Tty": false,
    "User": "",
    "WorkingDir": ""
  },
  "docker_digest": "registry.gitlab.com/pantacor/pv-platforms/pv-avahi@sha256:895b2af2b5d407235f2b8c7c568532108a44946898694282340ef0315e2afb28",
  "docker_name": "registry.gitlab.com/pantacor/pv-platforms/pv-avahi",
  "docker_source": "remote,local",
  "docker_tag": "arm32v6",
  "persistence": {},
  "template": "builtin-lxc-docker"
}
```

