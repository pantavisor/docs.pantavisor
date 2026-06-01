# Push App Logs to Pantahub

By default, [some logs](containers.md#loggers) are directed to the [log server](storage.md#logs). These logs are stored on-disk and pushed to [Pantacor Hub](remote-control.md#pantaocr-hub-client). This behavior can be partially or totally disabled using [pantavisor configuration](pantavisor-configuration.md#summary), but can also be expanded at revision level in the [state JSON](pantavisor-state-format-v2.md#logger).

In this tutorial, we are going to see how to add more log files to the list of logs that Pantavisor is already storing on the device and sending to the cloud.

Logs are classified in two types:

* LXC (App startup) logs and console logs.
* Logs from within a container. For example: syslogd or messages.

## An example on how to push additional log files to Pantahub

For this example, we have an app named alpine-nginx comprised of an Alpine rootfs with a nginx server installed in it. We want to enable syslog and ngingx log. We will also override the configuration for lxc log to increase its stored size to 4 MiB. 

As we were saying in the introduction, it is going to be necessary to modify the [state JSON](pantavisor-state-format-v2.md#logger). Let us first check how alpine-nginx/run.json looks by default in the checkout of our cloned device:

```
{
    "#spec": "service-manifest-run@1",
    "config": "lxc.container.conf",
    "name":"alpine-hotspot",
    "storage":{
        "lxc-overlay" : {
            "persistence": "boot"
        }
    },
    "type":"lxc",
    "root-volume": "root.squashfs",
    "volumes":[]
}
```

To make the changes described above, we would have to add this ```logs``` object:

```
{
    "#spec": "service-manifest-run@1",
    "config": "lxc.container.conf",
    "name":"alpine-hotspot",
    "storage":{
        "lxc-overlay" : {
            "persistence": "boot"
        }
    },
    "type":"lxc",
    "root-volume": "root.squashfs",
    "volumes":[],
    "logs": [
        {"file":"/var/log/syslog","maxsize":102485760,"truncate":true,"name":"alpine-logger"},
        {"file":"/www/log/wwwlog","maxsize":102485760,"truncate":true,"name":"nginx-logger"},
		{"lxc":"enable","maxsize":409943040,"truncate":true,"name":"alpine-lxc"}
    ]
}
```
