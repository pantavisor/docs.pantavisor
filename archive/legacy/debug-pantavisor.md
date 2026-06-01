# Debug Pantavisor

Sometimes things don't go as planned and you will need some insight on what is going on. For those occasions, we offer some tools to debug Pantavisor.

## Debug coredump using gdb

Pantavisor will generate a Core Dump when a crash occurs. To open this Core Dump, you just have to retrieve it from storage. To do so, you can just SSH cat the file from a device with an already set [public key](inspect-device.md) to your host computer:

```
ssh -p8222 10.42.0.158 -l/ cat /storage/corepv > /tmp/corepv
```

To open it in your machine, we will need to tell gdb where both the init binary with debugging simbols and the sysroot path resulted from the [building process](build-pantavisor.md) are located:

```
$ gdb-multiarch /home/anibal/pantacor/src/pantavisor/out/x64-uefi/staging/init /tmp/corepv
(gdb) set sysroot /home/anibal/pantacor/src/pantavisor/out/x64-uefi/staging/
(gdb) bt
#0  0x00007f262bcc01b0 in write () from /lib/x86_64-linux-gnu/libpthread.so.0
#1  0x0000564ec360b04f in mbedtls_net_send ()
#2  0x0000564ec360d0d3 in mbedtls_ssl_flush_output ()
#3  0x0000564ec360d4e2 in mbedtls_ssl_write_record ()
#4  0x0000564ec361073d in ssl_write_real ()
#5  0x0000564ec36107bc in mbedtls_ssl_write ()
...
```

:::note
Use your own paths.
:::

## Remotely debug using gdbserver and gdb-multiarch

You can also remotely debug Pantavisor while running on your target device from your host computer.

### Install gdbserver in your device

For this guide, we are going to use a Raspberry Pi 3 as the target device. First, we need to make sure gbdsever is installed in your machine. To do so, we need to check the bsp addons in your [device checkout](clone-your-system.md) look like this:

```
$ cd <device-checkout>
$ cat bsp/run.json | python -m json.tool
{
    "addons": [
        "addon-gdbserver.cpio.xz4"
    ],
    "firmware": "firmware.squashfs",
    "initrd": "pantavisor",
    "linux": "kernel.img",
    "modules": "modules.squashfs"
}
$ ls bsp/
firmware.squashfs  addon-gdbserver.cpio.xz4  kernel.img  modules.squashfs  pantavisor  run.json  src.json
```

If the addon is set in bsp/run.json and the cpio.xz4 file is in the bsp path, you can continue to the [next section](#attach-gdbserver-to-the-init-process-in-your-device).

If not installed, you need to get a statically compiled gdbserver with cpio.xz4 compression. We are building this for several targets [here](https://gitlab.com/pantacor/pantavisor-addons/gdbserver.git). In your device checkout:

```
cd bsp
docker run --rm registry.gitlab.com/pantacor/pantavisor-addons/gdbserver:arm32v6-musl | tar x
```

Then, reference the file in [bsp/run.json](pantavisor-state-format-v2.md#bsprunjson) with a [Pantavisor addon](bsp.md#addons) so it looks like the example.

Don't forget to follow this [how-to guide](make-a-new-revision.md) to add, commit and post these changes to your device.

### Attach gdbserver to the init process in your device

Once gdbserver is installed in your system, get access to your device via [ssh](inspect-device.md) and attach gdbserver to the Pantavisor process:

```
$ ssh -p 8222 /@192.168.1.134
$ ps | grep init
    1 0         1064 S    /init noswap fastboot
   78 0         3208 S    {pantavisor} /init noswap fastboot
...
$ gdbserver --attach localhost:2000 78
Attached; pid = 78
Listening on port 2000
Remote debugging from host ::ffff:192.168.1.132, port 46982
```

The election of Pantavisor's PID is important. In this case, we want to debug something in pantahub.c. This is running in a fork created by init (PID 1) in the early stages of Pantavisor, so we chose the second PID with the _init_ keyword, which in this case is PID 78.

### Remotely debug from your host computer with gdb-multiarch

Open a new terminal in your host computer. Make sure you have the gdb-multiarch tool installed in your system. In a Debian-based distro:

```
apt-get update
apt-get install gdb-multiarch
```

We need to tell gdb-multiarch where both the init binary with debugging simbols and the sysroot path resulted from the [building process](build-pantavisor.md) are located:

```
$ gdb-multiarch /home/anibal/pantacor/src/pantavisor/out/rpi3/staging/init
(gdb) set sysroot /home/anibal/pantacor/src/pantavisor/out/rpi3/staging/
```

Now, we just have to connect to device IP and port:

```
(gdb) target remote 192.168.1.134:2000
Remote debugging using 192.168.1.134:2000
Reading symbols from /home/anibal/pantacor/src/pantavisor/out/rpi3/staging/lib/ld-musl-armhf.so.1...done.
Reading symbols from /home/anibal/pantacor/src/pantavisor/out/rpi3/staging/lib/pv_lxc.so...done.
Reading symbols from /home/anibal/pantacor/src/pantavisor/out/rpi3/staging/lib/libgcc_s.so.1...done.
0x00055074 in mbedtls_base64_decode ()
(gdb) b internal/init/pantahub.c:290
Breakpoint 1 at 0x17fa6: file internal/init/pantahub.c, line 290.
(gdb) c
Continuing.

Breakpoint 1, pv_ph_is_available (pv=pv@entry=0x76f18e30) at internal/init/pantahub.c:290
290			pv_log(DEBUG, "PH available at '%s:%d'",
(gdb) bt
#0  pv_ph_is_available (pv=pv@entry=0x76f18e30) at internal/init/pantahub.c:290
#1  0x00014b2e in _pv_wait (pv=0x76f18e30) at internal/init/controller.c:446
#2  0x000156ce in _pv_run_state (pv=0x76f18e30, state=STATE_WAIT) at internal/init/controller.c:748
#3  pv_controller_start (pv=pv@entry=0x76f18e30) at internal/init/controller.c:760
#4  0x000147f2 in _pv_init () at internal/init/pantavisor.c:546
#5  pantavisor_init (do_fork=do_fork@entry=true) at internal/init/pantavisor.c:564
#6  0x0001264c in main (argc=<optimized out>, argv=<optimized out>) at internal/init/init.c:276
```

:::note
Use your own paths and IP.
:::