---
layout: post
title: "Godot 4.6 to 4.7 Migration Guide: Breaking Changes and Fixes"
author: godotscribe
categories: [ Quick Code ]
tags: [Godot 4.7, Migration, Breaking Changes, Jolt, GDScript]
image: assets/images/articles/godot-4-6-to-4-7-migration.png
description: "Upgrading a project from Godot 4.6 to 4.7? The breaking changes, behavior changes and changed defaults, with a checklist and the fixes you need."
featured: false
hidden: false
updated: 2026-10-28
---

**Upgrading from Godot 4.6 to 4.7 is relatively safe for most projects**, according to the official upgrade guide. A few things changed, though: Jolt physics behavior, input device IDs, typed method overrides in GDScript, line rendering and the defaults for new projects. This guide lists them and what to do.

Checked against the official guide on 28 October 2026. For the feature overview see [Godot 4.7 features](/godot-4-7-features/).

## 5-minute checklist

1. **Back up** the project or commit it to Git
2. Open it in 4.7 and fix errors shown in the Output panel
3. **GDScript:** typed method overrides now need an explicit `return`
4. **Physics:** if you use Jolt, check `WorldBoundaryShape3D` and `SoftBody3D`
5. **Input:** do not compare mouse or keyboard device IDs to `0`
6. **UI:** lines drawn with `CanvasItem` look thinner
7. **C# projects:** check the binary and source compatibility list below
8. Test your main scenes, exports and audio areas

## Breaking changes

These items need code changes in the situations described. Names are as written in the official guide.

| Area | Change | Affects |
|---|---|---|
| Core | `OptimizedTranslation.generate` returns `bool` instead of `void` | C# binary compatibility |
| GUI | `Control.accessibility_live` type changes to `AccessibilityServer.AccessibilityLiveMode` | C# binary and source |
| GUI | `RichTextLabel.ImageUpdateMask.UPDATE_WIDTH_IN_PERCENT` renamed to `UPDATE_WIDTH_UNIT` | GDScript and C# source |
| GUI | `RichTextLabel.add_image` and `update_image`: `width_in_percent` and `height_in_percent` renamed to `width_unit` and `height_unit`, type is now `RichTextLabel.ImageUnit` | C# source |
| Rendering | `RenderingServer.particles_request_process_time`: `time` renamed to `process_time` | C# source |
| Animation | `Animation.length` type metadata changes from `float` to `double` | C# binary and source |
| Physics | `PhysicsServer2DExtension._body_set_shape_as_one_way_collision` gets a required `direction` parameter | Extensions |
| Audio | `AudioEffectSpectrumAnalyzer.tap_back_pos` is removed | GDScript and C# |
| XR | `OpenXRExtensionWrapper._on_register_metadata` gets `interaction_profile_metadata` | Extensions |
| Editor | `EditorVCSInterface._commit` gets `amend` | Editor plugins |
| Editor | `EditorSceneFormatImporter` `IMPORT_*` constants move into the `ImportFlags` enum | C# source |

Most game projects will not touch these. If you write GDExtensions, editor plugins or C# code that calls the APIs above, check them.

## Behavior changes and fixes

### GDScript

**Typed overrides need a return.** Overrides of methods with a typed return must include an explicit return statement. Add `return null` to fix the error:

```gdscript
func _create_thing() -> Node:
	# 4.7 requires an explicit return here
	return null
```

**Packed array elements.** Setting a packed array element no longer calls the setter for the whole packed array property.

### Physics (Jolt)

- **`WorldBoundaryShape3D.plane.d`** now uses the opposite sign convention. Flip the sign to keep 4.6 behavior
- **`SoftBody3D`** mass now defaults to 1 kg for the whole body, not per point, and `linear_stiffness` is applied differently. Retune `linear_stiffness` and `damping_coefficient`
- **`Area3D`** now reports overlaps with `SoftBody3D`. Use collision layers and masks to ignore interactions you do not want

If you are not sure which physics engine your project uses, see [Godot Jolt Physics: how to enable Jolt](/godot-jolt-physics-how-to-enable/).

### Audio

`AudioStreamPlayer.area_mask` now defaults to disabled instead of layer 1. If you use `audio_bus_override` on an `Area2D` or `Area3D` with the default mask, set the mask back to layer 1.

### Input

Mouse and keyboard device IDs changed from `0` to `InputEvent.DEVICE_ID_MOUSE` and `InputEvent.DEVICE_ID_KEYBOARD`. Check by event type, or compare `InputEvent.device` with the constants:

```gdscript
func _input(event: InputEvent) -> void:
	if event is InputEventMouse:
		print("mouse event")
	if event.device == InputEvent.DEVICE_ID_KEYBOARD:
		print("keyboard device")
```

### Rendering and drawing

- The `LinearToSRGB` visual shader node no longer clamps to the range 0.0 to 1.0 on the Mobile and Forward+ renderers
- `CanvasItem` no longer adds an antialiasing feather to lines, so they look thinner. You may need a larger line width

## Changed defaults

| Setting | 4.6 | 4.7 |
|---|---|---|
| New projects: `display/window/stretch/mode` | `disabled` | `canvas_items` |
| New projects: `display/window/stretch/aspect` | `keep` | `expand` |
| `LookAtModifier3D.relative` | `true` | `false` |
| `rendering/reflections/sky_reflections/roughness_layers` | `7` | `8` |
| `ResourceImporterDynamicFont.hinting` | `1` | `3` |

The stretch defaults are listed by the official guide for new projects.

## Related guides

- [Godot 4.7 features](/godot-4-7-features/)
- [Godot versions and support status](/godot-versions/)
- [Godot 4.8 beta: what is new and what breaks](/godot-4-8/)

## FAQ

### Is it safe to upgrade from Godot 4.6 to 4.7?
The official guide says it should be relatively safe for most games and apps made with 4.6. Review the breaking changes, behavior changes and changed defaults, and test on a copy.

### Will my Jolt physics behave differently in 4.7?
Possibly. `WorldBoundaryShape3D` uses the opposite sign for `plane.d`, `SoftBody3D` mass and stiffness behave differently, and `Area3D` now reports `SoftBody3D` overlaps.

### Do I need to change my C# code?
Only if you use the APIs listed in the breaking changes table. The official guide marks binary and source compatibility for each item.

### What if my project used the mouse device ID as 0?
Use the `InputEvent.DEVICE_ID_MOUSE` and `InputEvent.DEVICE_ID_KEYBOARD` constants, or check the event type.

## Update log

- **28 October 2026:** first version, checked against the official "Upgrading from Godot 4.6 to 4.7" guide.

## Sources

- [Upgrading from Godot 4.6 to 4.7 (official docs)](https://docs.godotengine.org/en/stable/tutorials/migrating/upgrading_to_godot_4.7.html)
- [Godot 4.7 release page](https://godotengine.org/releases/4.7/)
