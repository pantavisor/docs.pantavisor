# Environment Setup

The following dependencies are required for building Pantavisor and installing containers. These are for any apt-based system such as Ubuntu, but you can also adapt them for your favorite distro.

## Installing Build Dependencies

Every package (with the exception of `repo` in old distros) is available from apt and can be installed with:

```
sudo apt update
sudo apt install curl squashfs-tools git repo docker.io clang-format-11
```

To install Docker, follow the instructions for your particular Linux Distribution here: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

We use the [repo](https://source.android.com/source/using-repo) tool developed by Android project to maintain the Pantavisor source distribution.

## Setting Up Build Dependencies

Some dependencies require further setup.

### git setup

Before you can use git, remember to configure your name and email globally:

```
git config --global user.name "Your Name"
git config --global user.email "your@email.tld"
```

### Docker setup

After installing Docker, you'll need to grant rights to your non-root user, so that you
can run all of docker's commands without `sudo`.
To do so, you can execute the following commands.
Make sure to log out and log back in to activate the new group rules.

```
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

Now check that you can use Docker echo container as a normal user:

```
docker run hello-world
```

Expected output of that command should be similar to:

```
docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete 
Digest: sha256:41a65640635299bab090f783209c1e3a3f11934cf7756b09cb2f1e02147c6ed8
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

### repo setup

It is possible that repo cannot find python3. In that case:

```
sudo apt install python-is-python3
```

## Installing Test Dependencies

These dependencies have to be installed if you want to run Pantavisor Tests in a x64 host:

```
sudo apt install binfmt-support docker.io git jq
```

Then, to run ARM binaries on your x64 host that enables wireless network simulated capabilities, it is necessary to install netlink generic compatible qemu binaries from our CI:

```
sudo apt remove qemu-user-static
mkdir ~/bin
wget https://pantavisor-ci.s3.amazonaws.com/qemu/1303841432/qemu-arm -O ~/bin/qemu-arm
wget https://pantavisor-ci.s3.amazonaws.com/qemu/1303841432/qemu-aarch64 -O ~/bin/qemu-aarch64
chmod +x ~/bin/qemu-arm
chmod +x ~/bin/qemu-aarch64
sudo update-binfmts --install qemu-arm ~/bin/qemu-arm --offset 0 --magic "\x7f\x45\x4c\x46\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x28\x00" --mask "\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff\xff" --fix-binary yes
sudo update-binfmts --install qemu-aarch64 ~/bin/qemu-aarch64 --offset 0 --magic "\x7f\x45\x4c\x46\x02\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\xb7\x00" --mask "\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff\xff" --fix-binary yes
```
