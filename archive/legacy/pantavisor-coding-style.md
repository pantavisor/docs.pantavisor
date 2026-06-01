# Pantavisor Coding Style

Pantavisor coding style is based on the [Linux Kernel one](https://www.kernel.org/doc/html/v4.10/process/coding-style.html) with minor modifications. You can check our .clang-format file [here](https://github.com/pantavisor/pantavisor/blob/master/.clang-format).

## Check Your Code Style

Before submitting changes to Pantavisor, it is important to check if your code style honors the one defined in the previously mentioned .clang-format. To do so, you can use our [building tools](build-components.md#code-check):

```
./build.docker.sh rpi64-5.10.y init-codecheck
```

If there is some code mismatch, a detailed error message will appear, like:

```
init: Checking 'c' files...
--- /dev/fd/63  2022-07-19 10:16:04.152675578 +0000
+++ /dev/fd/62  2022-07-19 10:16:04.152675578 +0000
@@ -1453,8 +1453,8 @@
                &config_list, "secureboot.mode", SB_LENIENT);
        config->secureboot.certdir = config_get_value_string(
                &config_list, "secureboot.certdir", "/certs");
-       config->secureboot.checksum =
-               config_get_value_bool(&config_list, "secureboot.checksum", true);
+       config->secureboot.checksum = config_get_value_bool(
+               &config_list, "secureboot.checksum", true);
 
        config_clear_items(&config_list);
 
@@ -18196,8 +18196,7 @@
        struct pv_object *o;
        struct pv_json *j;
 
-       if (getenv("pv_quickboot") ||
-               !pv_config_get_secureboot_checksum()) {
+       if (getenv("pv_quickboot") || !pv_config_get_secureboot_checksum()) {
                pv_log(DEBUG, "state objects and JSONs checksum disabled");
                return true;
        }
make: *** [/home/anibal/pantacor/src/bsp/alchemy/classes/codecheck-rules.mk:60: init-codecheck-c] Error 1

MAKE ERROR DETECTED
```

It is important to fix these errors before pushing them upstream, as the CI will run this same code check command.

## Fix Your Code Style

To automatically format your files, you can just use clang-format-13:

```
clang-format-13 -i ctrl.c
```

After this, run the code check command again:

```
./build.docker.sh rpi64-5.10.y init-codecheck
```

This will happily result in success:

```
init: Checking 'c' files...
+ restore_kernel_logo
+ '[' -f /home/anibal/pantacor/src/bsp/kernel/linux-stable/drivers/video/logo/logo_linux_clut224.ppm.backup ']'
+ mv /home/anibal/pantacor/src/bsp/kernel/linux-stable/drivers/video/logo/logo_linux_clut224.ppm.backup /home/anibal/pantacor/src/bsp/kernel/linux-stable/drivers/video/logo/logo_linux_clut224.ppm -f
```
