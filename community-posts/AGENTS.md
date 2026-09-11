# community-posts

Draft announcements for community.pantavisor.io here before posting. One file per
announcement, named `<version>-release-announcement.md` (e.g. `030-release-announcement.md`).

## Sourcing content

For a release announcement, pull from the two per-major CHANGELOG files, `## v<version>`
section only (skip `-rcN` sections — they're superseded by the final tag):

- `https://github.com/pantavisor/meta-pantavisor/blob/master/CHANGELOG/CHANGELOG-0<major>.md`
- `https://github.com/pantavisor/pantavisor/blob/master/CHANGELOG/CHANGELOG-0<major>.md`

Fetch both in full before writing anything — the meta-pantavisor one is long (per-board
download tables), so page through it rather than stopping at the first truncated read.

## What to include

These changelogs are exhaustive and auto-generated (commit-message driven, one bullet per
PR). Do not transcribe them. Instead select what a device owner or integrator would
actually care about:

- New board/machine support
- New features that change runtime behavior (power management, update/download behavior,
  logging, security-relevant fixes)
- Config or API changes that could break an existing deployment on upgrade — call these
  out explicitly as a "heads up" item, not buried in a feature list
- Anything the user has specifically asked to highlight in conversation

Leave out: CI-only changes, docs-only changes, refactors with no behavior change,
`recipes-pv: automated srcrev update` / `AutoPR` bot commits, and internal
testing-framework changes (`pvtest`) unless they're user-facing (e.g. "test against your
own Hub" is worth a line; internal test-harness plumbing is not).

Always link both full CHANGELOG files at the end, under a section like "Everything else",
so readers who want the exhaustive list can get it.

## Downloads

Always point readers to `https://pantavisor.io/downloads/` for ready-to-flash images.
Do not mention where the downloads page itself sources its data from (e.g. `releases.json`)
— that's an implementation detail, not something the reader needs.

## Tone

Direct, technical, no marketing fluff. Written for people who already run Pantavisor in
production or are evaluating it — assume familiarity with terms like Hub, devmeta,
appengine, wakelocks. Short section per topic with a one-line summary and a few bullets
of specifics, not prose paragraphs.

## Before finishing

Confirm the highlight list with the user before treating a draft as final — ask "anything
else relevant?" and offer specific candidate items pulled from the changelogs (with enough
detail to say yes/no on each), rather than dumping the raw changelog and asking them to
pick.
