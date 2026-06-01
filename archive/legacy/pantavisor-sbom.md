# Pantavisor SBOM

Pantavisor build system can generate a basic SBOM in [SPDX](https://spdx.dev/) JSON format for a specific target:

```shell
./build.docker.sh <TARGET> sbom

```
Using this command, the SBOM for the target <TARGET> will be generated be in `out/TARGET/sbom.json`. If you need to create an SBOM including packages from your containers you can use [PV_MERGE_SBOM](build-options.md) to specify a path where Pantavisor look for SBOM documents, extract its packages and adds them to the Pantavisor's SBOM
