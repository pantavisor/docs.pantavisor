# Install pvr

The `pvr` tool enables you to interact with your Pantavisor-enabled devices both [remotely](remote-control.md) through Pantacor Hub and [locally](local-control.md). With this CLI tool, you can `clone` your device and `post` different [revisions](revisions.md) to your device for testing and seamless onboarding, among other operations.

## Get pvr Stable

You can download it from the following locations:

 * [Linux/AMD64](https://gitlab.com/pantacor/pvr/-/jobs/3801205605/artifacts/raw/pvr-037.linux.amd64.tar.gz?inline=false)
 * [Linux/ARM32V6](https://gitlab.com/pantacor/pvr/-/jobs/3801205605/artifacts/raw/pvr-037.linux.arm.tar.gz?inline=false)
 * [Linux/ARM64V8](https://gitlab.com/pantacor/pvr/-/jobs/3801205605/artifacts/raw/pvr-037.linux.arm64.tar.gz?inline=false)
 * [Darwin/AMD64](https://gitlab.com/pantacor/pvr/-/jobs/3801205605/artifacts/raw/pvr-037.darwin.amd64.tar.gz?inline=false)
 * [Darwin/ARM64](https://gitlab.com/pantacor/pvr/-/jobs/3801205605/artifacts/raw/pvr-037.darwin.arm64.tar.gz?inline=false)
 * [Windows/x32](https://gitlab.com/pantacor/pvr/-/jobs/3801205605/artifacts/raw/pvr-037.windows.x32.zip?inline=false)
 * [Windows/x64](https://gitlab.com/pantacor/pvr/-/jobs/3801205605/artifacts/raw/pvr-037.windows.x64.zip?inline=false)


## Install the pvr Binary

### Linux

To install the Linux version you need to extract and place the binary in your `$PATH`:

```
tar xvzf pvr-033.linux.amd64.tar.gz
mkdir -p ~/bin
cp pvr ~/bin/pvr
chmod +x ~/bin/pvr
export PATH=$PATH:~/bin
```

### Windows

To install the Windows version all you need is unzip the binary and place it in a directory to which your user has access and can run executables from. `C:\Users\YOURUSER` is usually a good location.

## Test pvr

Once you have it installed just calling the `pvr` command from your shell should show you the help menu, where you can get familiarized with the different features that it provides.

## Get Last pvr Version

:::note
If you follow this instructions, you will get a non-stable release of pvr, which could mean that you may encounter some bugs.
:::

If you prefer to use the last `pvr` version instead of using the stable one, you can do the following:

```
pvr global-config DistributionTag=develop
pvr self-upgrade
```

The stored binary will automatically upgrade to the last version.

:::note
If you find any bug or stability issue while using the develop tag release, you can give us feedback using our [community forum](https://community.pantavisor.io/).
:::