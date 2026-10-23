---
layout: post
title: "Godot Get Window Size & Screen Size (Godot 4 Code)"
author: alihan98ersoy
categories: [ Quick Code ]
tags: [Code, Solution, Godot 4, GDScript, Viewport]
image: assets/images/articles/viewportsize.png
description: "Get window size, viewport size and screen size in Godot 4 with copy-paste GDScript: get_window().size, get_viewport_rect(), DisplayServer and the resize signal."
featured: false
hidden: false
updated: 2026-10-23
---

Need the **window size, viewport size or screen size** in Godot 4? Copy the line that matches what you need.

## 30-second answer

| You want | Code | Type |
|---|---|---|
| Window size in pixels | `get_window().size` | `Vector2i` |
| Game area (viewport) size | `get_viewport().get_visible_rect().size` | `Vector2` |
| Same, inside a Node2D or Control | `get_viewport_rect().size` | `Vector2` |
| Monitor (screen) size | `DisplayServer.screen_get_size()` | `Vector2i` |
| Usable monitor area (without taskbar) | `DisplayServer.screen_get_usable_rect()` | `Rect2i` |

Width and height are `.x` and `.y` on every one of these.

## Get window size in Godot 4

```gdscript
func _ready() -> void:
	var window_size: Vector2i = get_window().size
	print("Window size: ", window_size)
	print("Width: ", window_size.x, " Height: ", window_size.y)
```

`get_window()` returns the window your node lives in, so it also works for extra windows, not only the main one.

## Get viewport size (the area your game draws in)

```gdscript
func _ready() -> void:
	var viewport_size: Vector2 = get_viewport().get_visible_rect().size
	print("Viewport size: ", viewport_size)
```

Inside a `Node2D` or `Control` you can use the shorter `get_viewport_rect()`:

```gdscript
extends Node2D

func _ready() -> void:
	print(get_viewport_rect().size)
```

`get_viewport_rect()` is a `CanvasItem` method. In a plain `Node` use `get_viewport().get_visible_rect()` instead.

### Base size from Project Settings

The base resolution you set in **Project Settings, Display, Window, Size** can be read like this:

```gdscript
var base_width: int = ProjectSettings.get_setting("display/window/size/viewport_width")
var base_height: int = ProjectSettings.get_setting("display/window/size/viewport_height")
print(base_width, "x", base_height)
```

A new Godot 4 project starts at 1152 x 648.

## Get screen (monitor) size

```gdscript
func _ready() -> void:
	var screen_size: Vector2i = DisplayServer.screen_get_size()
	print("Screen size: ", screen_size)
```

`screen_get_size()` without arguments describes the screen the main window is on. To ask about the screen your game window is on, or about a second monitor:

```gdscript
func _ready() -> void:
	var current: int = DisplayServer.window_get_current_screen()
	print("Window is on screen ", current, ": ", DisplayServer.screen_get_size(current))

	for i in DisplayServer.get_screen_count():
		print("Screen ", i, ": ", DisplayServer.screen_get_size(i))
```

Useful extras:

```gdscript
var usable: Rect2i = DisplayServer.screen_get_usable_rect()  # excludes taskbar/dock
var dpi: int = DisplayServer.screen_get_dpi()
var scale: float = DisplayServer.screen_get_scale()
```

## React when the window is resized

```gdscript
func _ready() -> void:
	get_viewport().size_changed.connect(_on_viewport_size_changed)

func _on_viewport_size_changed() -> void:
	print("New viewport size: ", get_viewport().get_visible_rect().size)
```

`size_changed` fires when the viewport size changes, for example when the player resizes the window. Use it to reposition UI or recalculate layouts.

## Which one should I use?

- **Placing things in the game world or UI:** use the viewport size. It follows your stretch settings.
- **Reading the real window in pixels:** use `get_window().size`.
- **Fullscreen or monitor logic:** use `DisplayServer` screen functions.

With stretch modes such as `canvas_items`, the window size and the viewport size can differ. If your numbers do not match, that is usually why. Check **Project Settings, Display, Window, Stretch**.

## Godot 3 equivalents

If you are still on Godot 3:

```gdscript
var window_size = OS.window_size
var screen_size = OS.get_screen_size()
var viewport_size = get_viewport_rect().size
```

## Common mistakes

**`get_window()` or `get_viewport()` fails in `_init()`.**
The node is not in the scene tree yet. Read sizes in `_ready()` or later.

**`get_viewport_rect()` is not found.**
Your script extends `Node`. Use `get_viewport().get_visible_rect()`, or extend a `Node2D` or `Control`.

**Window size and viewport size are different.**
That is expected with stretch modes. Pick the one that matches what you are positioning (see above).

**Type error when assigning.**
`get_window().size` and `DisplayServer.screen_get_size()` return `Vector2i`. The viewport rect returns `Vector2`. Convert with `Vector2(my_vector2i)` when you mix them.

## FAQ

### How do I get the screen width and height in Godot?
Use `DisplayServer.screen_get_size()` and read `.x` for width and `.y` for height.

### How do I get the window width in Godot 4?
Use `get_window().size.x`. For height use `get_window().size.y`.

### What is the difference between viewport size and window size?
The window is the OS window in pixels. The viewport is the area your game renders into, and stretch settings can scale it.

### How do I get the monitor size when I have two monitors?
Loop over `DisplayServer.get_screen_count()` and call `DisplayServer.screen_get_size(i)` for each index.

### Do these work in Godot 4.7?
These are core Godot 4 APIs and the method names are listed in the current DisplayServer and Viewport class references.

## Related

- [Godot Localization Guide](/godot_localization/)
- [Best Godot Plugins & Addons 2026](/best-godot-plugins-2026/)
- [Official DisplayServer docs](https://docs.godotengine.org/en/stable/classes/class_displayserver.html)
