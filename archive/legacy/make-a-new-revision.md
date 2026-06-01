# Make a New System Revision

Once you have the device [cloned](clone-your-system.md) on disk, you can make changes to the runtime state on your host computer and once happy, use `pvr commit` to stage the current state as a checkpoint. This new [revision](revisions.md) can be then sent as a new [update](updates.md) to be consumed by your device.

## Check the Changes

To see current, non-staged file changes, use the `pvr status` command:

```
pvr status .
```

The output of this command will list after-clone changes following this code:

* A - file is not index, but have been marked as [added](#add-new-chanegs)
* C - file is in index, but disk version has changed
* ? - file is not in index and has not yet been [added](#add-new-chanegs). [Commit](#commit-the-changes) will ignore if not added
* D - file is in index, but disk version does not have this file. [Commit](#commit-the-changes) will remove file from index

To see some JSON diff output of the [JSON state](revisions.md) you can also use `pvr diff`:

```
pvr diff
```

## Add new Files

To add new files so they can be [commited](#commit-the-changes):

```
pvr add .
```

## Commit the Changes

To index the current changes use `pvr commit`:

```
pvr commit
```
