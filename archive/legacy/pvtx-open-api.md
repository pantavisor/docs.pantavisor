# Open the pvtx API

:::note
It is important to notice that this operation will open a port for development of a device in your LAN, and thus is insecure and not suited for production devices.
:::

This is necessary if you need to use either [pvtx UI](pvtx-introduction.md) or [locally](local-control.md) manage your device using [pvr](clone-your-system.md#from-the-device-itself). It is only going to be possible if the device has the [pvr-sdk](initial-devices.md#about-pantavisor-initial-devices) container running, which is available in our initial images. The `pvtx` API will serve as an endpoint for communication with the both the `pvtx` UI and `pvr` and then will direct the orders to Pantavisor via [pvcontrol](local-control.md#pvcontrol).

:::note
Bear in mind that opening your device to local `pvr` will not close the door to [remotely](remote-control.md) manage it, the same way a remote device can be locally controlled. After a local [revision](revisions.md) is installed, the device will stop communicating altogether with Pantacor Hub, but this can be reverted by going back to a remotelly installed revision or revision 0.
:::

What we are going to do here is to add a [configuration overlay](containers.md#additional-files) for pvr-sdk. More specifically, we are going to change a configuration file to open the endpoint for hosts in your local network. This can be achieved locally, by using [pantabox](pantabox-introduction.md) or remotely, using [pvr](make-a-new-revision.md) itself. In any of the two cases, we are going to create this configuration file in the new revision:

```
_config/pvr-sdk/etc/pvr-sdk/config.json
```

With this content:

```
{
  "httpd": {
    "listen": "0.0.0.0",
    "port": "12368"
  }
}
```

This will allow you to perform [cloning](clone-your-system.md) and [posting](deploy-a-new-revision.md) revisions to your device IP in your local network using the `12368` port. Also, it will open the `pvtx` UI in that port.
