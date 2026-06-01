# Build Pantavisor

For building, the flow is very similar to the Android build system, except that targets are not setup in advance of operations but rather these are conditional on the target and the flow is managed by scripts/build.sh.

## Build your chosen reference device

Once you have [chosen](choose-reference-device.md) a target, a [reference device](choose-reference-device.md#choose-your-reference-device) and [downloaded](get-source-code.md) the Pantavisor source code, you can now start the building process.

First of all, check you still are in your Pantavisor workspace path. Output of ```ls``` should look similar to:

```
alchemy  bootloader  build.docker.sh  build.sh  ca  config
external  firmware  internal  kernel  prebuilt  run.docker.sh
scripts  test.docker.sh  tests  vendor
```

Now, you can execute the `build.docker.sh` script, optionally using the [PVR_MERGE_SRC](build-options.md) build option if what you want is a fully flashable image:

```
PVR_MERGE_SRC=https://pvr.pantahub.com/pantahub-ci/rpi64_5_10_y_initial_latest ./build.docker.sh rpi64-5.10.y
```

You can directly clone a device and use the local checkout path adding the `.pvr` suffix:

```
pvr clone https://pvr.pantahub.com/pantahub-ci/rpi64_5_10_y_initial_latest my-checkout
PVR_MERGE_SRC=my-checkout/.pvr ./build.docker.sh rpi64-5.10.y
```

:::note
For other advaced building options and configuration, check our [build options](build-options.md), [build components](build-components.md) or [Pantavisor configuration](pantavisor-configuration.md) references.
:::

This will compile all dependencies of the `rpi64-5.10.y` target build tree and produce:

* A flashable image according to the values defined in `config/rpi64-5.10.y/image.config`. You can find the generated image in `out/rpi64-5.10.y/rpi64-5.10.y-pv-1024MiB.img` that you can use to [flash your device](image-setup.md).
* A BSP tarball in ```out/rpi64-5.10.y/rpi64-5.10.y.pvr.tgz``` to [update](pvr-bring-componets.md) your running devices.
