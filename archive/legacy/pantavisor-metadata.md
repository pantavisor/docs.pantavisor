# Pantavisor Metadata

This page contains reference information about [Pantavisor metadata](storage.md#metadata).

## Device metadata

This is the device metadata created by Pantavisor that will give you useful information about your device:

| Key | Value | Description |
| --- | ----- | ----------- |
| interfaces | json | network interfaces of the device |
| pantahub.address | IP:port | Pantacor Hub address the client is communicating with |
| pantahub.claimed | 0 or 1 | 1 if claimed in Pantacor Hub |
| pantahub.online | 0 or 1 | 1 of connection to Pantacor Hub was established |
| pantahub.state | init, register, claim, sync, login, wait hub, report, idle, prep download or download | [see Pantacor Hub states](remote-control.md#pantacor-hub-client) |
| pantavisor.arch | string | CPU architecture |
| pantavisor.cpumodel | string | CPU model name |
| pantavisor.mode | local or remote | [see operation modes](pantavisor-architecture.md#communication-with-the-outside-world) |
| pantavisor.revision | string | [revision number](make-a-new-revision.md) |
| pantavisor.status | string | [revision status](containers.md#status) |
| pantavisor.uname | json | [uname](https://man7.org/linux/man-pages/man1/uname.1.html) output |
| pantavisor.version | string | Pantavisor build |
| storage | json | disk usage of the device |
| sysinfo | json | [sysinfo](https://man7.org/linux/man-pages/man2/sysinfo.2.html) |
| time | json | time information |

# User metadata

This is the user metadata that can be set by the user which is parsed and have some actions on Pantavisor:

| Key | Value | Description |
| --- | ----- | ----------- |
| pvr-sdk.authorized_keys | SSH pub key | set [public key](inspect-device.md) to get SSH access |
| pvr-auto-follow.url | URL | device will automatically pull every change in the device associated to that [clone URL](clone-your-system.md) |
| pantahub.log.push | 0 or 1 | disable/enable log pusshing to Pantacor Hub. Enabled by default. Overrides [log.push](pantavisor-configuration.md#summary) |
| config-key | config-value | override some of the [configuration](pantavisor-configuration.md#summary) values |
| container/key | value | send user metadata that can be consumed by one of the containers |
