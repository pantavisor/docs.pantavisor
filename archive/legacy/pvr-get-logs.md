# Get the Logs

Logs can be downloaded from [Pantacor Hub](remote-control.md#pantacor-hub-client) using `pvr` too.

For example, if you want to get the Pantavisor logs from device `5df394ec94a09300095bfab7` and revision `291`:

```
pvr device logs --rev 291 --source=/pantavisor.log 5df394ec94a09300095bfab7
```
