# Choose your Way

We try to keep management of your devices open and not force a single path. With management, we mean updating the device, getting its logs, sending and receiving other useful metadata, etc. This can be done mainly in two ways:

* [Remote experience](remote-control.md): manage your devices through [Pantacor Hub](remote-control.md#pantacor-hub) or [any other cloud](remote-control.md#other-remote-controllers) of your choice.
* [Local experience](local-control.md): directly manage your devices from your host computer.

If this is your first time, we recommend you to go with the remote experience and [Pantacor Hub](register-user.md), as it is the simplest and most visual way to get started. However, if you prefer the local experience, [Pantabox](inspect-device.md) offers both a ncurses menu UI and a CLI tool, while [pvtx](pvtx-open-api.md) allows basic management from a web UI stored on the device itself.

For both remote and local experiences, we have developed [pvr](install-pvr.md), a CLI tool for management of devices from the host computer.

:::note
[Remote and local modes](pantavisor-architecture.md#communication-with-the-outside-world) can be switched during execution time in a Pantavisor-enabled device, so you are not burning bridges just by starting with one or the other!
:::

Once you have a grasp on our management tools, you will be able to move on to more [advanced stuff](use-secureboot.md) to get the most out of Pantavisor.
