# Deploy a new System Revision

Once you have done some [changes](make-a-new-revision.md), you can deploy the currently staged state to any device for which you have owner permissions.

For that, use `pvr post` command. This command has an optional argument where you can specify a `pvr` `clone URL` for the device you want the currently staged system state to be posted to. When not explicitly specified, `post` will send the new [revision](revisions.md) to the device whose state was originally [cloned](clone-your-system.md):

```
pvr post
```

Once post has been submitted to a device, the device will eventually wake up and try to [consume](updates.md) the new state.
