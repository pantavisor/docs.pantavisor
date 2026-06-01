# First Run

Now that you have [installed](install-appengine.md) Pantavisor App Engine, let us see how to run it.

To list all available tests, you can execute:

```
./test.docker.sh ls
```

If you want to run the most basic test (pvcontrol ls and check mounts in both mgmt and non-mgmt containers):

```
./test.docker.sh run local:0
```

This will execute the test in a one-shot command. To run the test interactively:

```
./test.docker.sh run bshpvctld:0 -i
```

This will open a session inside the App Engine Docker container. Then, make sure to exit so Pantavisor can release its resources:

```
exit
```
