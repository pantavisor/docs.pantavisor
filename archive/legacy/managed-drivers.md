# Load Managed Drivers

Pantavisor offers a declarative framework that allows a Pantavisor BSP to declare which abstract drivers they offer
and how those are mapped to loadable modules and Pantavisor containers to specify which drivers they can or need to
use to be functional.

Pantavisor runtime manages the lifecycle of drivers used through this framework, e.g. it loads and unloads them at
the appropriate time (usually before the container that needs it starts) or through manual operations on REST API
method that it offers to containers with privileges.

The syntax for defining drivers available in a BSP, you can visit the [define managed drivers for BSPs](bsp.md#managed-drivers) section.

The syntax how a container defines the drivers it wants to use can be found [here](containers.md#drivers).

For the rest of this guide we will look at an example on how to declare an abstract `wifi` driver in a BSP and how to map that to
an underlying kernel module. Further we will then show how containers can add their driver requrements to automatically or manually
load drivers through Pantavisor.

## Driver Definition in a BSP

Firstly, we are going to define the list of managed drivers at the BSP level in the [pvr checkout](clone-your-system.md).

For that, we are going to create a new [bsp/drivers.json](pantavisor-state-format-v2.md#bspdriversjson):

```
{
    "#spec": "driver-aliases@1",
    "all": {
        "wifi": [
            "iwlwifi ${user-meta:drivers.iwlwifi.opts}"
        ]
    }
}
```

We have set a new driver named _wifi_, that is composed solely by one Linux module, _iwlwifi_. Additionally, we have added the ability to set arguments for `modprobe` using the [user metadata](storage.md#user-metadata) key _drivers.iwlwifi.opts_.

Then, we need to tell Pantavisor that the _wifi_ driver will be available from the containers. We do so by adding this information to [container/run.json](pantavisor-state-format-v2.md#containerrunjson). In this case, we are setting the drivers on _manual_ mode, as we want to load it at any point from the container, but we could set _required_ or _optional_ of we wanted it to be loaded as soon as the container started:

```
{
	...
	"drivers": {
		"manual": [ "wifi" ],
	}
}
```

You can avoid to manually edit container/run.json, as pvr offers templating support to generate the right run.json.

For that, you have the template "args" keys PV_DRIVERS_REQUIRED, PV_DRIVERS_OPTIONAL and PV_DRIVERS_MANUAL available in src.json.

See the example below:

```
{
	...
	"args": {
		"PV_DRIVERS_MANUAL": ["wifi"]
	}
}
```

Don't forget to re-run `pvr app install APPNAME` after changing src.json to apply the variables to the runtime configs.

## modprobe Arguments

Each abstract driver name is mapped to one-or-many module entries in the json array. Here each line can be the full
argument set of modprobe, so you can define static arguments in a very simple manner like:

```
{
    "#spec": "driver-aliases@1",
    "all": {
        "wifi": [
            "iwlwifi 11n_disable=1"
        ]
    }
}
```

The above will pass 11n_disable=1 to the modprobe.


Further each line has a bit of a template syntax that allows you to add values from user-meta or device-meta entries.

First an example on how to use user-meta:

```
{
    "#spec": "driver-aliases@1",
    "all": {
        "wifi": [
            "iwlwifi power_save=${user-meta:drivers.iwlwifi.powersave} 11n_disable=${user-meta:drivers.iwlwifi.11n_disable}"
        ]
    }
}
```

Here a made up example of using [device metadata](storage.md#device-metadata):

```
{
    "#spec": "driver-aliases@1",
    "all": {
        "wifi": [
            "iwlwifi somethingelse=${device-meta:drivers.iwlwifi.somethingelse}"
        ]
    }
}
```


More info about user metadata can be found in the [state JSON](#state-json). User metadata can be set using the [control socket](local-control.md) in local mode. In remote mode, you would do that through [Pantacor Hub](remote-control.md#pantacor-hub).

From the container and in local mode, you can set user metadata with the following curl command.

```
$ curl -X PUT --unix-socket /pantavisor/pv-ctrl \
	--data="power_save=true 11n_disable=1"  \
	http://localhost/user-meta/drivers.iwlwifi.opts
```

If you prefer, you can also do this with [pvcontrol](local-control.md#pvcontrol).


This will practically result in a module being loaded using the following modprobe command next time the "wifi" driver is loaded:

```
$ modprobe iwlwifi power_save=true 11n_disable=1
```

## Load Driver

Drivers are automatically loaded by Pantavisor if they are either defined as "required:" or "optional:".

For "required:" drivers Pantavisor will fail to start the container and rollback if a required driver
is not offered by BSP.


Drivers can also be of type "manual" in which case the container gets the ability to manage the lifecycle
manually through Pantavisor ctrl socket REST API::

```
$ curl -X PUT --unix-socket /pantavisor/pv-ctrl http://localhost/drivers/wifi/load
```

If this fails, the HTTP call will return a code 500. Containers that cannot operate without
the driver loaded should then do the neede to mark themselve as UNHEALTHY.

