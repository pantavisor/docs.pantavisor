---
title: Develop applications
description: Build, configure, and ship app containers on Pantavisor.
sidebar_position: 5
slug: /develop
---

# Develop applications

## Tasks

- Create a container
- Add an app with `pvr`
- Add an app with `pvtx`
- Add an app through Pantahub
- Local emulator workflow
- Container configuration: environment variables, volumes, networking
- Logs and debugging

Apps are versioned and updated independently of the base. A CVE fix in your app
ships as a small container layer — not a full-image flash — and never touches
the certified base. See the [benchmarks](/benchmarks) for the size and time
difference.

CLI details live in the [Reference](/reference): `pvr`, `pvtx`, `pvcontrol`.
