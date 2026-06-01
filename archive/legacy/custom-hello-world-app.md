# Installing simple Hello World App on Pantavisor Device
In this tutorial, we are going to install a simple hello world Application to 
our previously [installed](choose-image.md) and [claimed](claim-device.md) Pantavisor device.

## What you will need

To install Application on your Pantavisor device on Pantacor Hub: 
 
* Any x86_64 based target board (we are using Odroid-H2 in our example)
* Power cable for target board
* Internet-facing Ethernet cable
* Your computer

## Instructions
#### Compile a Hello World C Program
What we are going to do now, is to compile a hello world app that will just
print Hello Pantacor Hub on console continously in a forever loop with some delay.
First, create a directory anywhere you wish, execute the following commands:
```bash
mkdir Hello_World_App
cd Hello_World_App
```
Now open a new file `hello_world.c` in your favourite text editor and copy and 
paste the following code:
```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
int main(void) {
	unsigned long long int i = 0;
	while(1) {
		printf("Hello Pantacor Hub %llu\n", i);
		i++;
		sleep(3);
	}
	exit(0);
}
```
Save the file and quit the text editor. Now compile the C program, make sure to
link the libc library statically, execute the follwing command:  
`$ gcc hello_world.c -o hello_world -static`  
This will produce a binary hello_world, make sure the binary is statically linked
libc libary, to check execute the following command, it should produce output:  
`$	not a dynamic executable`  
```bash
$ ldd hello_world
		not a dynamic executable
```  
#### Create a Dockerfile to build a docker image of your application
A dockerfile is required to build a docker image, create a dockerfile  
`$ vi Dockerfile`  
Copy and paste the following content in your dockerfile:
```
FROM scratch
ADD hello_world /usr/bin/hello_world
ENTRYPOINT [ "/usr/bin/hello_world" ]
```
Save the file and quit the text editor.
To build a docker image of your application, execute the following command:  
`$ docker build -t helloworldbin -f Dockerfile ./`  
`helloworldbin` is the name of the image, you can give any name of your choice
for the image.  
Verify that the image is available under the list of images, run:  
`$ docker images`  
OR  
`$ docker image ls`  
The above command will list all the available docker images on your host
computer.

#### Verify the docker image
Verify that the docker image is working correctly, execute the following
command to run the docker image:  
`$ docker run --rm-t helloworldbin`  
If the above command doesn’t produce any error, it means the image is build
succssfully.  
The above command won’t get terminated with `ctrl+c`, it needs to be stopped
via docker, open a new terminal window or tab and execute the follwing command:  
```bash
docker rm -f $(docker ps -a -q -f "ancestor=helloworldbin")
```
#### Install the Hello World App
To install the Hello world app to your Pantacor Hub device we are going to use the
pvr tool from your host computer, execute the following commands:
```bash
cd ../<clone-checkout> #your cloned device repesentation
fakeroot pvr app add --arg PV_RUN_TMPFS_DISABLE=yes --from helloworldbin hello_binary
pvr add .
pvr commit
pvr post
```
This will automatically commit the new app and post it to the device, which
will then process the update. You can follow this process on Pantacor Hub, checking
out the console of your device. Once the device is in done state, you can view
the logs from console choose hello_binary-console from Filter Logs dropdown.
