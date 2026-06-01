# LimeSDR Mini USD on RPi

This tutorial requires a [LimeSDR mini USB](https://www.sparkfun.com/products/15029) on a Pantavisor-enabled device. You can easily set up Pantavisor on Raspberry Pi 3 B+ with a pre-compiled image. Download the initial device image and then follow the rest of the instructions from [here](get-started.md).

With the device set up and connected to the network, continue on with the next section. 

## Cloning and resetting the device

Claim the Pantavisor-enabled device, before connecting the LimeSDR micro USB to the board. Then log into [Pantacor Hub](https://hub.pantacor.com) to view the device on the dashboard. 

[Clone](clone-your-system.md) the device URL to your computer. Cloning creates a device representation on your host computer that allows you to modify, [commit](make-a-new-revision.md), and [post](deploy-a-new-revision.md) a new revision to Pantacor Hub. After you've posted the new revision to the hub, the device downloads it and resets.

## Adding Pantavisor apps to test your LimeSDR device
The table below displays a few Pantavisor applications that you can use to test your LimeSDR. Add these to the device with the [app add](pvr-docker-apps-experience.md) command. 

Since these apps take control of the LimeSDR micro, you can only run one at a time on your board. To delete a Pantavisor app and make room for another one, remove the app folder from the device after you've checked it out of the repository. When complete, don't forget to ```add```, ```commit``` and ```post``` your changes to the device repository. See [pvr commands](pvr/README.md) for more information

Note that these apps are developed for the ARM architecture:

| Name | Source | pvr Command |
| ---- | ------ | ----------- |
| limeScan | [link](https://gitlab.com/myriadrf/pantahub/limescan-device) | pvr app add --from registry.gitlab.com/myriadrf/pantahub/limescan-device:ARM32V6 limescan |
| osmocom | [link](https://gitlab.com/myriadrf/pantahub/osmo-gsm-net) | pvr app add --from registry.gitlab.com/myriadrf/pantahub/osmo-gsm-net:ARMHF-master osmocom |
| limeSNA | [link](https://gitlab.com/myriadrf/pantahub/limeSNA) | pvr app add --from registry.gitlab.com/myriadrf/pantahub/limesna:ARM32V6-docker limesna |
| SDRangel | [link](https://gitlab.com/myriadrf/pantahub/sdrangel) | pvr app add --from registry.gitlab.com/myriadrf/pantahub/sdrangel:ARM32V7-ubuntu sdrangel |
