# Build Options

Build options reference page for [build.docker.sh](build-pantavisor.md).

| Key | Value | Default | Description |
| --- | ----- | ------- | ----------- |
| PVR_MERGE_SRC | [Clone URL](clone-your-system.md#from-pantacor-hub-cloud) or [cloned](clone-your-system.md) device path with _/.pvr_ suffix | empty | Reference device. All containers from that device will be used for the new image |
| PANTAVISOR_DEBUG | _yes_ or _no_ | _no_ | Include [debug tools](inspect-device.md) in Pantavisor binary |
| MAKEFLAGS | build options | empty | Additional build options to get a more verbose build log. For example: "V=s -j1" |
| PV_FACTORY_AUTOTOK | [autotok](https://docs.pantahub.com/pantahub-base/devices/#auto-assign-devices-to-owners) | disabled | Set new image to be automatically [claimed](claim-device.md) |
| PV_BUILD_INTERACIVE | _true_ or _false_ | _true_ | Mean to disable interactive builds for automation |
| PVR_USE_SRC_BSP | _yes_ or _no_ | _no_ | Avoid building the [BSP](bsp.md) and use the one from _PVR_MERGE_SRC_ in the final image |
| PV_PVS_PUB_PEM | path to public key | empty | Copy [public key](storage.md#on-disk-public-key) to the initrd rootfs |
| PV_PVS_CERT_PEM | path to CA certificate | empty | Copy [CA certificate](storage.md#certificate-chain-of-trust) to the initrd rootfs |
| PV_BUILD_PANTAVISOR_BUILDER_PREFIX | [pantavisor-builder](https://gitlab.com/pantacor/ci/pantavisor-builder) prefix | registry.gitlab.com/pantacor/ci | Use a different builder prefix for pantavisor-builder. Used for docker mirrors |
| PV_BUILD_PANTAVISOR_BUILDER_VERSION | [pantavisor-builder](https://gitlab.com/pantacor/ci/pantavisor-builder) version | 001 | Use a different version for pantavisor-builder. Commits, tags and branches can be used |
| PV_BUILD_TLS_USE_HOST_CACERTS | _default_ or path to CA certificate | empty | Mount CA certificate to [pantavisor-builder](https://gitlab.com/pantacor/ci/pantavisor-builder) container. Setting to default will use /etc/ssl/certs/ca-certificates.crt |
| PV_MERGE_SBOM | Path to folder that contains SPDX JSON formated SBOM to merge | empty | Allows extracting packages from several SBOM documents (SPDX in JSON format) and merge it with Pantavisor SBOM |
