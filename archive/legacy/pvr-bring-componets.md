# Bring Components from Other Devices

Both Apps and the the [BSP](bsp.md) can be brought from other devices using the `pvr merge` command. For example, to merge the full `x64_initial_latest` device into your checkout:

```
pvr merge https://pvr.pantahub.com/pantahub-ci/x64_initial_latest
```

`pvr` will notify you to use `pvr checkout` to make the changes affective in your workspace. After that, you can either keep making changes or `post` to your device:

```
pvr checkout
pvr post
```

You can also filter the component that is going to be merged by using the `#` prefix. To get only the `pvr-sdk` contianer elements from the device:

```
pvr merge https://pvr.pantahub.com/pantahub-ci/x64_initial_latest#pvr-sdk
pvr checkout
pvr post
```

Bear in mind that merge will keep the elements that were present in your checkout while overwriting the new ones. If you want to completely ignore the old ones and just overwrite everything, use `pvr get`, with the same syntax as `merge`:

```
pvr get https://pvr.pantahub.com/pantahub-ci/x64_initial_latest#pvr-sdk
pvr checkout
pvr post
```

Furthermore, tarballs can be created from a device to enable a local `merge`, `get` or `import`:

```
pvr export /tmp/pvr-export.tgz
```

These can then be imported, merged or get the same way as we did with the `Clone URL`:

```
pvr import /tmp/pvr-export.tgz
pvr checkout
pvr post
```

Finally, you can also `merge` or `get` the `BSP` produced by a [Pantavisor build](build-pantavisor.md).

```
pvr get out/rpi64-5.10.y/rpi64-5.10.y.pvr.tgz#bsp/,_sigs/bsp.json,device.json
pvr checkout
pvr post
```
