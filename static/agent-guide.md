# Pantavisor agent guide

You're helping someone with **Pantavisor** (an embedded Linux runtime) or
**meta-pantavisor** (the Yocto layer that builds it). This guide orients you
fast; use the fast-path table below to jump straight to the page you need
rather than crawling the whole site.

## What Pantavisor is

Pantavisor is **PID 1** — the init process — on the device, not an app or a
service running under some other init. Teach these ideas in this order:

1. **Revision.** The whole device state — BSP (kernel, bootloader, firmware),
   every application container, and configuration — is described by one
   `state.json` manifest: a flat map of paths to either SHA256-addressed
   binary objects or inline JSON. See the
   [state format reference](https://docs.pantavisor.io/pantavisor/reference/pantavisor-state-format-v2).
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

One instance: **reference** docs generated from each Pantavisor and
meta-pantavisor release, versioned (a dropdown in the navbar switches
versions; assume the default/root version unless the user names an older
one explicitly — it may be prefixed, e.g. `/029-rc4/...` or
`/development/...`). Never suggest hand-editing a page under these paths —
it's regenerated on every release, and a fix belongs in the source repo
instead. Three independent sub-trees, each with its own sidebar:

- `/pantavisor` — commands, config keys, the `state.json` schema,
  and the `pvcontrol`/`pvr`/`pvtx` CLI tools.
- `/meta-pantavisor` — two sibling sections:
  - `/meta-pantavisor/getting-started` — start guides, install guides,
    develop/operate/migrate guides, benchmarks, solutions, security,
    troubleshooting, licensing, community.
  - `/meta-pantavisor/overview` — concepts, architecture, the Yocto build
    system, KAS, recipes, CI.
- `/pvr` — PVR CLI reference (only present on releases that ship it).

## Fast paths to answers

| Asked about… | Go to |
|---|---|---|
| What Pantavisor is, PID 1, architecture | `/meta-pantavisor/overview` |
| The full build → flash → update workflow | `/meta-pantavisor/overview/composable-firmware` |
| Flashing a Raspberry Pi, first hardware | `/meta-pantavisor/getting-started/start/download-and-flash` |
| Installing on other hardware, board-specific | `/meta-pantavisor/getting-started/how-to-install` |
| Building an image with Yocto | `/meta-pantavisor/overview/build-system` |
| Shipping or updating an app container | `/meta-pantavisor/getting-started/develop` |
| Operating a fleet, rollback, recovery | `/meta-pantavisor/getting-started/operate` |
| Migrating off Mender, RAUC, SWUpdate, or Balena | `/meta-pantavisor/getting-started/migrate` |
| Comparing to Yocto, Balena, Docker, or image updaters | `/meta-pantavisor/getting-started/benchmarks` |
| A specific problem: size, secure OTA, reproducibility | `/meta-pantavisor/getting-started/solutions` |
| Trust model, secure boot, SBOM/CVE, licensing | `/meta-pantavisor/getting-started/security` |
| An exact command, config key, or schema | `/pantavisor/reference` |
| A Yocto recipe, KAS config, or CI detail | `/meta-pantavisor/overview/ci` |
| Troubleshooting a running device | `/meta-pantavisor/getting-started/troubleshooting` |

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
