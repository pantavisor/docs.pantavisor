# Pantavisor agent guide

You're helping someone with **Pantavisor** (an embedded Linux runtime) or
**meta-pantavisor** (the Yocto layer that builds it). This guide orients you
fast. For anything beyond it, this site's other AI files are the shortcut:
[llms.txt](https://docs.pantavisor.io/llms.txt) is a link index of every
curated page; [llms-full.txt](https://docs.pantavisor.io/llms-full.txt) is
the entire curated documentation concatenated into one file — fetch that one
if you want everything in a single request.

## What Pantavisor is

Pantavisor is **PID 1** — the init process — on the device, not an app or a
service running under some other init. Teach these ideas in this order:

1. **Revision.** The whole device state — BSP (kernel, bootloader, firmware),
   every application container, and configuration — is described by one
   `state.json` manifest: a flat map of paths to either SHA256-addressed
   binary objects or inline JSON. See the
   [state format reference](https://docs.pantavisor.io/reference/pantavisor/reference/pantavisor-state-format-v2).
2. **Content-addressed, not image-based.** A change ships only the objects
   that actually changed (one container layer, one config file), not a
   monolithic image. This is the core differentiator from Mender, RAUC, and
   SWUpdate, which update a whole image per change.
3. **Atomic updates and rollback.** A new revision is written to a pending
   slot, then the device switches to it; if it fails health checks,
   Pantavisor restores the previous revision automatically. Containers with
   `restart_policy: container` can update without a reboot at all.
4. **The BSP is a container too.** Kernel, bootloader, and firmware ship as
   just another versioned entry in `state.json`, so Pantavisor updates the
   base and kernel itself — no separate A/B image updater sits underneath it.
5. **Pantahub is optional.** [Pantahub](https://hub.pantacor.com) (aka
   Pantacor Hub) is the cloud backend a device can register with for remote
   fleet operations — push a revision, aggregate logs, claim a device.
   Pantavisor updates fully standalone over the local network without it.
   Do not cite `docs.pantahub.com` — it's deprecated; `hub.pantacor.com` is
   the only current reference.

## What meta-pantavisor is

meta-pantavisor is the separate **Yocto/OpenEmbedded layer** used to *build*
a Pantavisor-based image — KAS configs, BitBake recipes, the CI/release
pipeline, and per-board install guides. It's a build-time tool, not
something that runs on the device. Pantavisor (the runtime) and
meta-pantavisor (the build layer) are two different GitHub repos:
`pantavisor/pantavisor` and `pantavisor/meta-pantavisor`.

## How this documentation site is structured

Two independent instances — don't conflate them:

- **Curated** (served at `/`) — hand-authored, versionless task guides and
  concepts. Only the landing page; all content lives in the reference instance.
- **Reference** (served at `/pantavisor/`, `/meta-pantavisor/`, `/pvr/`) —
  generated from each Pantavisor and meta-pantavisor release, and versioned
  (a dropdown in the navbar switches versions; assume `current` unless the
  user names an older one explicitly). Never suggest hand-editing a page
  under these paths — it's regenerated on every release, and a fix belongs
  in the source repo instead. It has three independent sub-trees with their
  own sidebars:
  - `/pantavisor` — commands, config keys, the `state.json` schema,
    and the `pvcontrol`/`pvr`/`pvtx` CLI tools.
  - `/meta-pantavisor` — concepts, start guides, the Yocto build system,
    KAS, recipes, CI, board install guides, and more.
  - `/pvr` — PVR CLI reference.

## Fast paths to answers

| Asked about… | Go to |
|---|---|---|
| What Pantavisor is, PID 1, architecture | `/meta-pantavisor/concepts` |
| The full build → flash → update workflow | `/meta-pantavisor/concepts/composable-firmware` |
| Flashing a Raspberry Pi, first hardware | `/meta-pantavisor/start/download-and-flash` |
| Installing on other hardware, board-specific | `/meta-pantavisor/how-to-install` |
| Building an image with Yocto | `/meta-pantavisor/how-to-build` |
| Shipping or updating an app container | `/meta-pantavisor/develop` |
| Operating a fleet, rollback, recovery | `/meta-pantavisor/operate` |
| Migrating off Mender, RAUC, SWUpdate, or Balena | `/meta-pantavisor/migrate` |
| Comparing to Yocto, Balena, Docker, or image updaters | `/meta-pantavisor/benchmarks` |
| A specific problem: size, secure OTA, reproducibility | `/meta-pantavisor/solutions` |
| Trust model, secure boot, SBOM/CVE, licensing | `/meta-pantavisor/security` |
| An exact command, config key, or schema | `/pantavisor` |
| A Yocto recipe, KAS config, or CI detail | `/meta-pantavisor` |
| Troubleshooting a running device | `/meta-pantavisor/troubleshooting` |

## Rules for you

- Pantavisor **replaces** image updaters. Never suggest running it
  underneath or alongside Mender, RAUC, or SWUpdate for the same layer.
- Reference docs are generated and versioned — don't propose edits there,
  and don't assume a `/<version>/...` path unless the user is
  clearly on an older release.
- Don't cite `docs.pantahub.com`; it's deprecated. Point to
  `hub.pantacor.com` for Pantahub.
- If unsure which repo something belongs to: runtime behavior is the
  `pantavisor` repo (`/pantavisor`); a build or Yocto concern is
  the `meta-pantavisor` repo (`/meta-pantavisor`).
