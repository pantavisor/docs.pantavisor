# Pantavisor Log sockets

The Pantavisor logging system works with 2 sockets `pv-ctrl-log`, for receive logs from any application who needs to send logs to Pantavisor log system, and `pv-fd-log` used by Pantavisor to subscribe file descriptors (fd) to be reading and add to the log system as appropriate.

## pv-ctrl-log
All messages are sent to the `pv-ctrl-log` socket inside a structure called logserver_msg, defined as follows:
```C
struct logserver_msg {
	int version;
	int len;
	char buffer[0];
};
```

The fields in the structure are:

* version: always 0 (no other version exists currently)
* len: length of the buffer
* buffer: log data. This data is organized in a simple way using 0 as separator:

```
level\0platform\0source\0data\0
```

Where:

* level: log level for the message, a numeric value. See below.
* platform: container name
* source: specific place where the log belongs (e.g: function name, module, etc)
* data: message to log

The log levels are defined using an `enum`:
```
enum log_level {
	FATAL, // 0
	ERROR, // 1
	WARN,  // 2
	INFO,  // 3
	DEBUG, // 4
	ALL    // 5
};

```



## pv-fd-log
Pantavisor provides a Unix socket to add and remove a fd. Those fd will be polling and if there are data available it will be added to the system.

### Subscribe
For the subscription mechanism `sendmsg` system call must be used. This function is present on several languages like [C and C++](https://linux.die.net/man/2/sendmsg), [Go](https://pkg.go.dev/golang.org/x/sys/unix#Sendmsg), [Rust](https://docs.rs/nix/0.9.0/nix/sys/socket/fn.sendmsg.html) and [Python](https://docs.python.org/es/3/library/socket.html#socket.socket.sendmsg), among others.

As part of the protocol, the platform (container name) and the source of the fd (e.g. console.log, syslog, etc.) must be specified in the header of the message, using the `iov structure`, where `iov[0]` has the platform and the `iov[1]` contains the source,  each field have a maximum of 50 characters length.

Once added, Pantavisor creates a file using the platform and source files inside the `/pantavisor/logs/current/` directory. For example, if the platform is `Foo` and the source is `var/log/Bar.log` then the directory `/pantavisor/logs/current/Foo/var/log/Bar.log` will be created.

Only one file descriptor can be subscribed using a specific pair platform-source, where platform refers to the container where the logs belong and the src denote where the log is originated (e.g: console.log)

### Unsubscribe
To unsubscribe a fd a new call to `sendmsg` must be done with `fd = -1` using the pair platform-source to identify the fd.