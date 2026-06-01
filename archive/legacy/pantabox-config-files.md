# Add Additional Files to Apps

Pantabox offers the user the possibility to make changes in your [revisions](revisions.md) without going through the cloud. Display the menu with the `pantabox` command, select `edit-config` and then choose a container.

The [configuration](containers.md#additional-files) for that container can be added in this [path](pantavisor-state-format-v2.md#_configcontainer):

```
_config/<container>/
```

To add, commit and apply your changes, execute these commands:

```
pvr add .
pvr commit
exit 0
```
