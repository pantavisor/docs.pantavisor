# Specs

Pantavisor is written in C, with an emphasis on the embedded Linux ecosystem. It is meant to be a single-binary init system that boots directly from the kernel and becomes the first process to run, which then brings up the rest of the system as a set of well-defined micro-containers.

We aim to bring a full set of containers functionality into the single binary, while keeping its size as small as possible to make sure it can cover the low-spec end of the market. Depending on the functions that are built, the size can vary, but the average size for a fully functional system puts the Pantavisor binary at around 350 Kilobytes (as compressed initial ramdisk).

Pantavisor uses pure Linux container technology, for which we use parts of the LXC suite as a library to wrap around the basic building blocks of containers. Due to the fact that LXC is also a pure C project, we are able to keep the overall footprint of Pantavisor quite small.
