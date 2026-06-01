# Requirements

Pantavisor [App Engine init mode](init-mode.md#app-engine-mode) lets you run Pantavisor in your already set up Linux distro. This is a less intrusive way to try out Pantavisor without having to flash your device storage. Pantavisor App Engine will not get you to the [minimal](specs.md) system we strive for. However, it will be a perfect tool for quick and non-disruptive [prototyping](https://docs.pantahub.com/pv-scripts/appengine/) of our container engine on your devices. It can be also used for container and Pantavisor [development and testing](https://docs.pantahub.com/pv-scripts/test/).

To start using it, you have several options:

* Downloading the self-contained x64-appengine delivery package from our [CI](https://gitlab.com/pantacor/pv-manifest/-/pipelines) (only for Ubuntu 22.04)
* Building the x64-appengine target from [source code](environment-setup.md) (only for Ubuntu 22.04)
* Installing App Engine in your device using the [installer](https://docs.pantahub.com/pv-scripts/appengine/). This option will setup Pantavisor without containers, which you will be able to add after [manually claiming your device](claim-device.md#getting-credentials-from-pantavisor-file-system)
