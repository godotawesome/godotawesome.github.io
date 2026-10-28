---
layout: post
title: "Godot 4.7 Features: AreaLight3D, HDR Output and the New Asset Store"
author: godotscribe
categories: [ News and Updates ]
tags: [Godot 4.7, Release, AreaLight3D, HDR, Asset Store]
image: assets/images/articles/godot-4-7-features.png
description: "What Godot 4.7 added: AreaLight3D, HDR output, the new Asset Store, VirtualJoystick, Android XR support and more. Highlights and upgrade notes."
featured: false
hidden: false
updated: 2026-10-28
---

**Godot 4.7** (released 18 June 2026) adds **HDR output**, a new **`AreaLight3D`** node, the **Asset Store** (which replaces the Asset Library), a built-in **`VirtualJoystick`** node and production support for **Android XR** and **Steam Frame**. The latest patch is **4.7.2** (18 August 2026).

This page summarizes the official release notes. For the full list of versions and their support status, see [Godot versions](/godot-versions/).

## 30-second summary

| Area | Headline change |
|---|---|
| Rendering | HDR output, `AreaLight3D`, nearest-neighbor 3D resolution scale |
| Editor | New Asset Store, inline shader previews, `MeshLibrary` editor, 2D Scene Paint |
| UI | `VirtualJoystick`, `Control` offset transforms, searchable `PopupMenu` |
| XR | Day-one production support for Android XR and Steam Frame |
| Scripting | `Tween.tween_await()` |
| Android | Stable on-device build and export tooling (GABE) |

The release notes mark nothing in 4.7 as experimental.

## Rendering

- **HDR output** on Windows, macOS, iOS, visionOS and Linux (Wayland). HDR previews may look different or be unsupported depending on the browser
- **`AreaLight3D`**: a node for real-time rectangular area lights, with softer shadows and more realistic reflections
- **Nearest-neighbor filtering** for the 3D resolution scale, useful for retro looks
- **Per-pass environment uniform buffers** for faster rendering
- **Clearcoat fixes** that bring materials closer to the Disney PBR model
- **Scale and rotation controls** for 3D particles
- **Vulkan subsampled images**, which improve foveated rendering performance

## Editor

- **Asset Store** replaces the Asset Library, with ratings and threaded background tasks
- **Inline text shader previews** while you type
- A dedicated **`MeshLibrary` editor**
- **2D Scene Paint** mode (shortcut B). It is 2D-only for now
- **3D vertex snapping** (B) and a per-axis vector ruler (Shift)
- **Trackball rotation gizmo** (U) and unified 3D camera controls
- An **export template downloader** for individual platforms and architectures
- The Project Manager flags projects that need an upgrade or a downgrade
- Create dialog filters, `PopupMenu` search, Inspector copy and paste, collapsible animation tracks

## 2D and 3D

- **CSG Autosmooth** option based on a smoothing angle
- **`CollisionShape2D.one_way_collision_direction`** for one-way collisions in any direction
- **`GradientTexture2D`** gets `FILL_CONIC` for conic gradients
- **`AtlasTexture`** support in `TextureRect` for tiling
- **`DrawableTexture2D`** for drawing on textures

## UI

- **`VirtualJoystick`**: a built-in node with Fixed, Dynamic and Following modes
- **`Control` offset transform properties** that do not disrupt container layouts
- A **searchable `PopupMenu`**
- Font-size-relative images in `RichTextLabel`
- Landmark navigation for screen readers

## XR

- **Day-one production support for Android XR and Steam Frame**
- Composition layer improvements: layers can be locked to the camera (useful for HUDs) or placed in world space
- A simplified default OpenXR action map with four profiles
- The Mobile renderer is now recommended for new XR projects

## Scripting

- **`Tween.tween_await()`** pauses a tween until a signal fires
- GDScript can implement and override Java interfaces on Android
- GDExtensions are listed in Project Settings

## Android and other platforms

- **Android:** a stable on-device build and publishing tool (GABE), picture-in-picture, a resizable embedded game window, portrait and landscape script editing, splash screen settings in export options and Perfetto tracing
- **Linux (Wayland):** initial touch support. Pan and scale gestures are not implemented yet
- **iOS:** controller support now uses SDL3

## Should you upgrade to 4.7?

The official upgrade guide says it should be relatively safe for most projects made with 4.6. Some behavior changed, especially around Jolt physics, input device IDs, UI and defaults for new projects. Read [our Godot 4.6 to 4.7 migration guide](/godot-4-6-to-4-7-migration/) before you move a real project, and test on a copy first.

Godot 4.7 and 4.6 both have full support. Godot 4.8 is in beta, see [what is new in 4.8](/godot-4-8/).

## FAQ

### When was Godot 4.7 released?
Godot 4.7 was released on 18 June 2026. 4.7.1 followed on 14 July 2026 and 4.7.2 on 18 August 2026.

### Does Godot 4.7 have HDR support?
Yes. HDR output is available on Windows, macOS, iOS, visionOS and Linux (Wayland).

### What replaced the Asset Library?
The Asset Store replaces the Asset Library in 4.7.

### Is there a built-in virtual joystick in Godot 4.7?
Yes. The `VirtualJoystick` node has Fixed, Dynamic and Following modes.

### Is Godot 4.7 still supported?
Yes, it has full support as the latest stable branch. See [Godot versions](/godot-versions/) for the current status.

## Update log

- **28 October 2026:** first version, checked against the official Godot 4.7 release page.

## Sources

- [Godot 4.7 release page (official)](https://godotengine.org/releases/4.7/)
- [Godot download archive](https://godotengine.org/download/archive/)
- [Upgrading from Godot 4.6 to 4.7 (official docs)](https://docs.godotengine.org/en/stable/tutorials/migrating/upgrading_to_godot_4.7.html)
