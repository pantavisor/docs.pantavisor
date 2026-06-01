# Build Components

Build components at compile time.

## Build individual components

You can build individual components of the system by calling the module directly as secondary target.

This builds the Pantavisor binary and all its dependencies:

```
./build.docker.sh malta-qemu init
```

This builds the pv_lxc container runtime plugin for Pantavisor:

```
./build.docker.sh malta-qemu pv_lxc
```

This assembles the initrd image '0base.cpio.xz' from all build assets:

```
./build.docker.sh malta-qemu image
```

You can also clean individual components by appending ```-clean``` to the build subtarget:

```
./build.docker.sh malta-qemu init-clean
```

This runs the 'trail' assembly step, which results in the final PV-trail for storage:

```
./build.docker.sh malta-qemu trail
```

## Module management

Modules can be added or removed just by adding a new atom.mk file inside the build tree and modifying the alchemy module configuration for a given target.

To check if the current configuration corresponds to the state of the tree:

```
./build.docker.sh malta-qemu config-check
```

To actually make changes on the target configuration, efectively adding or removing modules:

```
./build.docker.sh malta-qemu config-update
```

## Code check

To run the clang format check on Pantavisor source code, just append the ```-codecheck``` suffix to the init subtarget:

```
./build.docker.sh malta-qemu init-codecheck
```
