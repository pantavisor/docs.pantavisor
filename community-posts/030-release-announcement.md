# Pantavisor 030 is out 🎉

We just shipped **030**, a stable release of both [Pantavisor](https://github.com/pantavisor/pantavisor) and [meta-pantavisor](https://github.com/pantavisor/meta-pantavisor). It lands one of the bigger power-management pushes we've done in a while, plus a batch of reliability fixes for update/download and logging.

## Highlights

### Power management: wakelocks and managed autosleep
Pantavisor now has a full wakelock subsystem:
- Locks and managed autosleep modes so devices can sleep between work instead of staying awake indefinitely.
- A `GET /wakelocks` control endpoint to inspect current locks.
- Wakelocks are held across Hub roundtrips, updates, and debug shell sessions, so those operations won't get cut off by a sleep transition.
- Devices degrade gracefully (locks disabled, managed autosleep fails closed) when the kernel doesn't support wakelocks.
- A first "container run window" (`power.wake.run_window`) phase, and the ability to drain queued revisions back-to-back without sleeping in between.

This is opt-in via `PANTAVISOR_FEATURES` in meta-pantavisor, and we've enabled it on a couple of reference boards (imx8mn-var-som, with SNVS RTC support for managed-mode wake) as a starting point.

### More resilient updates
- Interrupted object downloads now resume via HTTP `Range` instead of restarting from scratch.
- A cumulative resume-attempt counter is reported in update progress, so you can see how flaky a link actually was.
- Updates now honor a Hub-side cancel while still queued or downloading, not just mid-transfer.
- Devmeta is pushed proactively on significant change, with a heartbeat floor, instead of only on the usual polling cadence.

### Logserver protocol upgrades
`logserver` picked up both a key-value and a JSON protocol, alongside fixes for a null-dereference on connection info and for messages getting lost from short-lived processes.

### New boards: Orange Pi 5B and Orange Pi i96
The Rockchip Orange Pi 5B (RK3588S) and the Orange Pi i96 (RDA8810PL) both join the supported machines list. The Orange Pi 5B also gets `rkdeveloptool`-based flashing support in `pv-flash-bundle`.

### pvtest, for testing against a real Hub
The `pvtest` framework grew a native runner (`test.native.sh`) that needs no container runtime, and can now point a whole test run at any Hub via `--hub` / `PVTEST_HUB_URL` — handy if you want to validate a build against your own Pantahub instance rather than the default one.

### Config: heads up on `power.*` aliases
The old dotted `power.*` config aliases have been dropped in favor of a single, frozen key table. If your device configs still reference the legacy dotted keys, update them when you move to 030. On the plus side, boolean config values now also accept symbolic forms (`true`/`false`/`yes`/`no`/`on`/`off`), not just `1`/`0`.

## Everything else

Both repos publish exhaustive, auto-generated changelogs for every tag in this release stream:

- [meta-pantavisor CHANGELOG-030.md](https://github.com/pantavisor/meta-pantavisor/blob/master/CHANGELOG/CHANGELOG-030.md) — machine images, BSPs, and layer-level changes, plus per-board download links and checksums.
- [pantavisor CHANGELOG-030.md](https://github.com/pantavisor/pantavisor/blob/master/CHANGELOG/CHANGELOG-030.md) — core `pantavisor` changes.

## Getting it

Ready-to-flash images for all supported boards are available at [pantavisor.io/downloads](https://pantavisor.io/downloads/). BSPs and pvr exports for each machine are also listed in the meta-pantavisor changelog linked above. If you're building from source, this release corresponds to the `030` tag in both repos.

As always, let us know here if you hit anything running 030 — especially on the wakelock/power-management side, since that's the newest surface in this release.
