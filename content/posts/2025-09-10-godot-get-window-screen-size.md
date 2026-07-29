---
layout: post
title: "Godot Get Window Size & Screen Size: Quick Solution"
author: alihan98ersoy
categories: [ Quick Code ]
tags: [Code, Solution]
image: assets/images/articles/viewportsize.png
description: "Quick solution: How to get window size and screen size in Godot Engine. Copy-paste ready code for viewport dimensions."
featured: false
hidden: false
---

**Need window/screen size in Godot?** Here's the **instant solution**! 🚀

## Get Window Size in Godot

```gdscript
# Get current window/viewport size
var window_size = get_viewport().get_visible_rect().size
print("Window size: ", window_size)
```

## Get Screen Size in Godot

```gdscript
# Get full screen dimensions
var screen_size = DisplayServer.screen_get_size()
print("Screen size: ", screen_size)
```

## Alternative Methods

```gdscript
# Godot 4.x - Viewport size
var viewport_size = get_viewport_rect().size

# Window size (different approach)
var window = get_window()
var size = window.size
```

**That's it!** Copy, paste, done. ✅

**Resources:**
- <a href="https://docs.godotengine.org/en/stable/classes/class_displayserver.html" target="_blank">DisplayServer Docs</a>
- <a href="https://docs.godotengine.org/en/stable/classes/class_viewport.html" target="_blank">Viewport Docs</a>
