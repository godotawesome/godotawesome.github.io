---
layout: post
title: "Godot 4.4 Features: Jolt, Typed Dictionaries, .NET 8 and Upgrade Notes"
author: godotscribe
categories: [ News and Updates ]
tags: [Godot 4.4, Release, Update, Jolt, Migration]
image: https://godotengine.org/storage/blog/covers/godot-4-4-a-unified-experience.webp
description: "What Godot 4.4 added: experimental Jolt Physics, typed dictionaries, .NET 8, embedded game window, Metal backend and more, plus upgrade notes."
featured: false
hidden: false
updated: 2026-10-23
---

**Godot 4.4** added experimental **Jolt Physics**, **typed dictionaries**, a **.NET 8** minimum for C#, an **embedded game window** in the editor and a new **Metal** backend for Apple platforms. This page summarizes the official release notes and what to check when upgrading.

Godot 4.4 is now an older release. The current stable line is 4.7 (4.7.2 was released on 18 August 2026), and 4.8 is in beta. If you are starting a new project, use a newer version.

## 30-second summary

| Area | Headline change |
|---|---|
| Physics | **Jolt Physics** as a built-in alternative to Godot Physics (experimental), 3D physics interpolation |
| GDScript | **Typed dictionaries**, hover tooltips, expression evaluator at breakpoints |
| C# | **.NET 8.0** minimum, Android .NET support |
| Editor | **Embedded game window**, interactive in-game editing, universal UID support |
| Rendering | Ubershaders, AgX tone mapping, **Metal** backend, driver fallback |
| Animation | `LookAtModifier3D`, `SpringBoneSimulator3D`, animation markers |

## What is new in Godot 4.4

### Physics

- **Jolt Physics** can be enabled in the project settings as an alternative 3D physics engine. The release page labels it **experimental**, so check the docs for supported use cases first. See [Godot Jolt Physics: How to Enable Jolt](/godot-jolt-physics-how-to-enable/) for the current state
- **3D physics interpolation** smooths motion between physics ticks. It is opt-in in the project settings

### GDScript

- **Typed dictionaries** enforce key and value types in the engine, in GDScript and in other languages, with Inspector support
- **Tooltips** show documentation on hover, including your own notes
- An **expression evaluator** tab lets you evaluate expressions against local state at a breakpoint

### C# and .NET

- **.NET 8.0** is the minimum. Projects are upgraded automatically when you open them in 4.4
- **Android .NET support** now covers all Android ABIs and BCL APIs

### Editor

- **Embedded game window** runs the game inside the editor while keeping separate processes. It is available on Linux, Windows and Android, not on macOS
- **Interactive in-game editing**: select scene elements and move the camera while the game runs or is paused
- **Universal UID support** and a UID upgrade tool for 4.3 projects
- Persistent window state, favorite inspector items, `Camera3D` preview, 3D object snapping, autostart profilers and an error-free first import
- Early **OpenXR** support in the Android editor for Meta Quest 3, Quest 3S and Quest Pro

### Rendering

- **Ubershaders** are precompiled fallback shaders that reduce shader stutter. Some shaders may need workarounds from the docs
- **AgX tone mapping** as an alternative to ACES
- Lightmap improvements: bicubic sampling, transparent object baking and `LightmapGI` shadowmasks
- Vertex shading for PSX-style or low-end targets, and a Shadow Caster Mask per `Light3D`
- **Rendering driver fallback** to Compatibility when Vulkan, D3D12 or Metal is not supported
- **Metal backend** for macOS and iOS (replacing MoltenVK). Apple Silicon only, with MetalFX upscaling available

### Animation, 2D and 3D

- `LookAtModifier3D` for procedural aiming, `SpringBoneSimulator3D` for jiggle physics and **animation markers**
- **2D batching** on all renderers and **2D shader instance uniforms**
- **Manifold CSG** replaces the old CSG implementation
- 3D particle emission shape visualization

### Platforms

- Android: export templates can be downloaded on the device, Swappy frame pacing, themed monochrome icons and a native file picker
- Linux: camera support
- macOS and iOS: Metal backend and controller improvements

## Upgrade notes

1. **Back up the project** or commit it to Git, then open it with the official migration guide at hand
2. **Run the UID upgrade tool** on projects coming from 4.3
3. **C# projects** are upgraded to .NET 8 automatically on open. Older releases stay on .NET 6
4. **Check CSG geometry** after upgrading, because CSG now uses Manifold
5. **Test shaders and lightmaps**, since Ubershaders and lightmap changes can affect results
6. **Jolt and physics interpolation are opt-in.** Test Jolt on a copy before switching
7. Keep the `.godot` folder out of version control. The engine regenerates it

## Should you still use Godot 4.4?

For an existing project that works, there is no need to rush. For anything new, start on a current stable release. To see what changed in newer lines, read the official release pages on godotengine.org.

## FAQ

### Is Jolt the default physics engine in Godot 4.4?
No. In 4.4 Jolt is an experimental option you enable in the project settings.

### Does Godot 4.4 need .NET 8?
Yes. The .NET build uses .NET 8.0 as its minimum, and projects upgrade automatically when opened.

### Does the embedded game window work on macOS?
No. According to the release notes it is available on Linux, Windows and Android.

### Is Godot 4.4 still supported?
It is an older release. Newer stable versions exist, so plan to move to a current one for new work.

## Update log

- **23 October 2026:** rewritten against the official Godot 4.4 release notes. Earlier versions of this article included performance figures that are not in the official release notes.

## Sources

- [Godot 4.4 release page (official)](https://godotengine.org/releases/4.4/)
- [Godot download archive](https://godotengine.org/download/archive/)
