# Choose a Device

If this is your first time and you want to try Pantavisor, we recommend you to [start](get-started.md) with a `Raspberry Pi 3 b+` or `Raspberry Pi 4`. This is the simplest and quickest way to get yourself started. Maybe you are thinking more about smaller devices with lower specs, and we [support](specs.md) those too, but we chose Raspberry Pi as the prototyping board for our newcomers. If you prefer, you can move on to [other boards](choose-image.md) though, including emulated ones.

:::note
By default, Pantavisor is meant to work on top of the Linux Kernel as the init system, and for this you will have to flash the board storage medium, which leads us to the non embedded option.
:::

The non embedded option is to run Pantavisor as a [daemon](requirements-appengine.md) in your device. This is ideal if you want to run it in your already setup device, using any Linux distro of your choice, which could prove useful for prototyping without having to flash the board storage.
