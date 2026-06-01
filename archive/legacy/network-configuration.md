# Network Platforms

Inside our default [pantavisor images](initial-images.md) all devices count with a base container, this container is the one managing the network interfaces. There is two possible containers in our stack: [wifi-connect](https://gitlab.com/pantacor/pv-platforms/wifi-connect) and [alpine-conmman](https://gitlab.com/pantacor/pv-platforms/alpine-connman/).

## Configuration

Network platforms can by configured using the Linux Kernel cmdline, which is typically done from the [bootloader menu](bsp.md#bootloader). Using the pvnet_ prefix. The available values are:

* pvnet_ssid: The name of your network
* pvnet_pass: the network password
* pvnet_type: ethernet | wifi
* pvnet_security: type of security
* pvnet_ipv4: off | dhcp | network/netmask/gateway
* pvnet_ipv6: off | auto | network/prefixlength/gateway

All those values are optional, but the combination of them will allow your device to connect to the network, either via the ethernet port or the wifi interface if exists.

In order to configure it the available values for each key will be:

* **pvnet_type**: Mandatory. Other types than ethernet or wifi are not supported.
* **pvnet_security**: The security type of the network. Possible values are "psk" (WPA/WPA2 PSK), "ieee8021x" (WPA EAP), "none" and "wep".
* **pvnet_ipv4**: IPv4 settings for the service. If set to off, IPv4 won't be used. If set to dhcp, dhcp will be used to obtain the network settings. netmask can be specified as length of the mask rather than the mask itself.
* **pvnet_ipv6**: IPv6 settings for the service. If set to off, IPv6 won't be used. If set to auto, settings will be obtained from the network.
