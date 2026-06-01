# Communicate with Pantavisor

Your container can communicate with Pantavisor to perform several actions such as setting, removing and listing metadata, reboot, poweroff or even installing your own revisions without going through the cloud.

This communication is done  through our pv-ctrl socket using HTTP protocol. Our [pvr-sdk container](https://gitlab.com/pantacor/pv-platforms/pvr-sdk), which is included in our default initial images, contains the [pvcontrol tool](https://gitlab.com/pantacor/pv-platforms/pvr-sdk/-/blob/master/files/usr/bin/pvcontrol). This pvcontrol script can either be directly used if you want to include it in your container (it requires sh and cURL), or you can use it as an example to implement your own client with the HTTP library of your choice.

Take a look at the different supported queries in the [commands reference](pantavisor-commands.md).
