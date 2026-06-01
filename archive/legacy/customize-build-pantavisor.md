# Customize your Build

Once you have [synced](get-source-code.md) the manifest, you have at your disposal all the source code that you need to build Pantavisor:

```
alchemy  bootloader  build.docker.sh  build.sh  ca  config
external  firmware  internal  kernel  prebuilt  run.docker.sh
scripts  test.docker.sh  tests  vendor
```

There are some recurrent locations you might need to play with in order to customize Pantavisor to fit your needs. If you want to create your own customized build, forking these repositories will be something you might need at some point:

* [ca](#ca)
* [config](#config)
* [vendor](#vendor)

## ca/

In this directory, we store the [secureboot](storage.md#integrity) certificates and keys. Some of files are:

* `ca/pvs/pvs.defaultkeys.tar.gz`: contains the [default root certificate](storage.md#certificate-chain-of-trust). 
* `ca/pvs/pvs.oemkeys.tar.gz`: contains the [OEM root certificate](storage.md#certificate-chain-of-trust).

You can check our `ca/` [repository](https://gitlab.com/pantacor/pv-developer-ca) for our public devices.

## config/

This directory is meant for various platform specific configuration files.

* `config/<platform>/pantavisor.config`: [config file](pantavisor-configuration-levels.md#pantavisorconfig) for the `PV_` keys.
* `config/<platform>/pantahub.config`: [config file](pantavisor-configuration-levels.md#pantahubconfig) for the `PH_` keys.

You can check our `config/` [repository](https://gitlab.com/pantace/cust009/pv-smm-m2/pv-config) for our public devices.

## vendor/

This directory is meant for various platform specific vendor files.

* `vendor/<platform>/skel/`: this directory contains files that will be added to the Pantavisor rootfs.
* `vendor/<platform>/stepskel/`: this directory contains files that will be added to [revision](revisions.md) 0.

You can check our `vendor/` [repository](https://gitlab.com/pantace/cust009/pv-smm-m2/pv-vendor) for our public devices.
