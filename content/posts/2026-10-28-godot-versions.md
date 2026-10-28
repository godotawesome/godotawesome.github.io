---
layout: post
title: "Godot Versions: Release Dates, Support Status and What Changed"
author: godotscribe
categories: [ News and Updates ]
tags: [Godot Versions, Release, Godot 4.7, Godot 4.8, Support]
image: assets/images/articles/godot-versions.png
description: "Every Godot 4 release with dates and support status. Latest stable is 4.7.2, 4.8 is in beta. What each version added and which one to use."
featured: false
hidden: false
updated: 2026-10-28
---

**The latest stable Godot version is 4.7.2** (released 18 August 2026). **Godot 4.8 is in beta** (beta 1 on 15 October 2026) and is not out yet. This page lists every Godot 4 release with its date and support status, and we update it with each new release.

Last checked: 28 October 2026.

## 30-second answer

- **New project:** use the latest stable, **Godot 4.7.2**
- **Existing 4.7 or 4.6 project:** both branches have full support. Update to the latest patch of your branch (moving from 4.6 to 4.7? Read the [migration guide](/godot-4-6-to-4-7-migration/))
- **Godot 4.5:** partial support (security and platform issues only)
- **Godot 4.4 and older:** end of life
- **Godot 3:** 3.6 is still supported as the long-term 3.x branch (latest is 3.6.3)
- **Godot 4.8:** in beta, test it on a copy and read [our beta overview](/godot-4-8/)

## Current versions and support status

Support status follows the official [release policy](https://docs.godotengine.org/en/stable/about/release_policy.html).

| Branch | Latest release | Date | Support |
|---|---|---|---|
| **4.8** | 4.8 beta 1 | 15 Oct 2026 | Pre-release, not for production |
| **4.7** | 4.7.2 | 18 Aug 2026 | Full support (latest stable) |
| **4.6** | 4.6.3 | 20 May 2026 | Full support |
| **4.5** | 4.5.2 | 19 Mar 2026 | Partial support (security and platform issues) |
| **4.4** | 4.4.1 | 26 Mar 2025 | End of life |
| **4.3** | 4.3 | 15 Aug 2024 | End of life |
| **4.2** | 4.2.2 | 17 Apr 2024 | End of life |
| **4.1** | 4.1.4 | 17 Apr 2024 | End of life |
| **4.0** | 4.0.4 | 3 Aug 2023 | End of life |
| **3.6** | 3.6.3 | 22 Aug 2026 | Long-term support for Godot 3 |

Only the latest patch release of each branch is supported, so update to it before you report a bug.

## Release history

| Version | First stable release |
|---|---|
| 4.0 | 1 March 2023 |
| 4.1 | 6 July 2023 |
| 4.2 | 30 November 2023 |
| 4.3 | 15 August 2024 |
| 4.4 | 3 March 2025 |
| 4.5 | 15 September 2025 |
| 4.6 | 26 January 2026 |
| 4.7 | 18 June 2026 |
| 4.8 | Not released yet (beta 1 on 15 October 2026) |

The release policy page estimates Godot 4.8 for the last quarter of 2026. There is no stable release date yet.

## What each recent version added

### Godot 4.8 (beta)

New editor docks, a native `Trail3D` effect, rendering upgrades and some breaking changes, including a **.NET 10** requirement for the .NET build. Details: [Godot 4.8 beta: what's new and what breaks](/godot-4-8/).

### Godot 4.7

Details: [Godot 4.7 features](/godot-4-7-features/) and the [4.6 to 4.7 migration guide](/godot-4-6-to-4-7-migration/).

- **Rendering:** HDR output on several platforms, the `AreaLight3D` node, nearest-neighbor filtering for the 3D resolution scale
- **Editor:** the **Asset Store** replaces the Asset Library, inline shader previews, a `MeshLibrary` editor, 2D Scene Paint mode, 3D vertex snapping
- **UI:** a built-in `VirtualJoystick` node, `Control` offset transform properties, searchable `PopupMenu`
- **XR:** day-one production support for Android XR and Steam Frame
- **Scripting:** `Tween.tween_await()`
- **Android:** stable on-device editor build and export tooling (GABE)

### Godot 4.6

- **Jolt Physics** is the default for new 3D projects (existing projects keep their setting). See [Godot Jolt Physics: how to enable Jolt](/godot-jolt-physics-how-to-enable/)
- **Editor:** a modern default theme, bottom panels that act as movable docks, a selection mode without a gizmo
- **Animation:** an IK framework built on `SkeletonModifier3D`
- **Rendering:** a screen space reflections overhaul, glow now blends before tonemapping
- **Windows:** Direct3D 12 is the default for new projects
- **Core:** Unique Node IDs, LibGodot for embedding the engine

### Godot 4.5

- **Accessibility:** experimental screen reader support
- **Rendering:** stencil buffer support, the shader baker, SMAA 1x
- **GDScript:** variadic arguments, abstract classes and methods (`@abstract`), script backtracing
- **Editor:** batch import editing, editor language switching without restart
- **Navigation:** a dedicated 2D navigation server

### Godot 4.4

Experimental Jolt Physics, typed dictionaries, a .NET 8 minimum, the embedded game window and a Metal backend. Details: [Godot 4.4 features and upgrade notes](/godot-4-4-complete-guide/).

## Which version should you use?

| Your situation | Suggested version |
|---|---|
| Starting a new project | Latest stable (4.7.2) |
| Project on 4.7 or 4.6 | Stay on your branch and update to its latest patch |
| Project on 4.5 | Plan a move to 4.6 or 4.7. Support is partial |
| Project on 4.4 or older | Plan an upgrade, support has ended |
| Godot 3 project | 3.6 is supported, but consider the cost of a 4.x port before you decide |
| You want to try new features | Test the 4.8 beta on a copy of your project |

Patch releases are meant to be backward compatible. **Minor releases can include breaking changes**, so test your project before you upgrade and read the official migration guide.

## Upgrade checklist

1. Back up the project or commit everything to Git
2. Read the official migration guide for the target version
3. Open the project in the new version and let it upgrade
4. Test your main scenes, physics, shaders and exports
5. Fix deprecation warnings before you ship

## FAQ

### What is the latest Godot version?
The latest stable release is Godot 4.7.2 (18 August 2026). Godot 4.8 is in beta.

### Is Godot 4.8 out?
Not as stable. Beta 1 was released on 15 October 2026. The release policy estimates a stable release in the last quarter of 2026, with no date announced.

### Is Godot 4.4 still supported?
No. According to the release policy, Godot 4.4 and earlier are end of life.

### Which Godot versions are supported right now?
Godot 4.7 and 4.6 have full support, Godot 4.5 has partial support, and Godot 3.6 is supported as the long-term Godot 3 branch.

### Should I still use Godot 3?
Godot 3.6 is still supported. For new projects use Godot 4.

## Update log

- **28 October 2026:** first version, checked against the official download archive, release policy and release pages.

## Sources

- [Godot download archive](https://godotengine.org/download/archive/)
- [Release policy (official docs)](https://docs.godotengine.org/en/stable/about/release_policy.html)
- [Godot 4.7 release page](https://godotengine.org/releases/4.7/)
- [Godot 4.6 release page](https://godotengine.org/releases/4.6/)
- [Godot 4.5 release page](https://godotengine.org/releases/4.5/)
- [Godot 4.4 release page](https://godotengine.org/releases/4.4/)
- [Dev snapshot: Godot 4.8 beta 1](https://godotengine.org/article/dev-snapshot-godot-4-8-beta-1/)
