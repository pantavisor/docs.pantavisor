#!/usr/bin/env python3
"""
Detect new docs versions in the upstream Pantavisor release manifest and
apply them to the local releases.json.

The upstream manifest groups versions under two channels:
  stable           – keys like "024", "025"
  release-candidate – keys like "028-rc10", "028-rc11"

Only versions that contain a "docs" entry are eligible: the build
(sync-reference.mjs) requires a docs tarball URL + sha256 at build time.

Reads:
  /tmp/upstream-releases.json  – downloaded manifest from S3
  releases.json                – local version registry

Writes:
  releases.json  – updated in place (new versions merged, sorted newest-first,
                   current set to the overall latest)

Outputs to GITHUB_OUTPUT (when running in CI):
  new_versions=<comma-separated list of newly added versions>
  current=<the new current version>

Exit codes:
  0  – success (new_versions output is empty when nothing changed)
  1  – error
"""

import json
import math
import os
import re
import sys

VERSION_RE = re.compile(r"^(0\d+)(?:-rc(\d+))?$")


def parse_ver(v: str) -> tuple[int, float]:
    """Return (base, rc) for sorting. Stable releases use math.inf as rc
    so they rank above all RC builds of the same base number."""
    m = VERSION_RE.match(v)
    if not m:
        raise ValueError(f"Unexpected version format: {v!r}")
    base = int(m.group(1))
    rc   = int(m.group(2)) if m.group(2) else math.inf
    return (base, rc)


def main() -> None:
    upstream_path = "/tmp/upstream-releases.json"
    local_path    = "releases.json"

    with open(upstream_path) as f:
        upstream: dict = json.load(f)

    with open(local_path) as f:
        local: dict = json.load(f)

    # Versions live under "stable" and "release-candidate" channels.
    # Only include versions that have a "docs" entry (tarball URL + sha256)
    # since the build will fail without one.
    upstream_versions = [
        ver
        for channel in ("stable", "release-candidate")
        for ver, items in upstream.get(channel, {}).items()
        if VERSION_RE.match(ver) and any("docs" in item for item in items)
    ]
    known             = set(local.get("versions") or [])
    new_versions      = [v for v in upstream_versions if v not in known]

    if not new_versions:
        print("No new versions found.")
        return

    print("New versions:", ", ".join(new_versions))

    all_versions = sorted(known | set(new_versions), key=parse_ver, reverse=True)

    local["versions"] = all_versions
    local["current"]  = all_versions[0]

    with open(local_path, "w") as f:
        json.dump(local, f, indent=2)
        f.write("\n")

    print(f"current  → {local['current']}")
    print(f"versions → {all_versions}")

    gh_output = os.environ.get("GITHUB_OUTPUT", "")
    if gh_output:
        with open(gh_output, "a") as f:
            f.write(f"new_versions={','.join(new_versions)}\n")
            f.write(f"current={local['current']}\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(1)
