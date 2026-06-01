# Test Pantavisor

To run our tests locally, you have to first build Pantavisor for the x64-appengine target:

```shell
PANTAVISOR_DEBUG=yes ./build.docker.sh x64-appengine
```

Then, to run all tests:

```shell
./test.docker.sh run
```

For more information, take a look at the [Pantavisor Test Framework reference](pv-scripts/test/README.md).
