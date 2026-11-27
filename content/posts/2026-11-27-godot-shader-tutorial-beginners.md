---
layout: post
title: "Godot Shader Tutorial for Beginners: 5 Simple 2D Effects (Godot 4)"
author: alihan98ersoy
categories: [ Tutorials ]
tags: [Shaders, GDScript, Godot 4, 2D]
image: assets/images/articles/godot-shader-tutorial-beginners.png
description: "Godot shader tutorial for beginners: 5 copy-paste 2D canvas_item shaders (grayscale, hit flash, gradient, ring, dissolve) with GDScript for Godot 4."
featured: false
hidden: false
---

**A Godot 2D shader is a small text file that starts with `shader_type canvas_item;` and changes the color (or position) of every pixel a node draws.** You attach it through a ShaderMaterial on any Sprite2D, ColorRect or other CanvasItem. This page gives you five short shaders to copy: grayscale, hit flash, color gradient, circle or ring, and dissolve. It also shows the GDScript you need to drive them.

Written for **Godot 4.7.2 stable**. Godot 4.8 is still in beta (beta 5, 24 November 2026), so nothing here targets 4.8. We wrote this guide from the [official Godot 4.7 shader docs](https://docs.godotengine.org/en/4.7/tutorials/shaders/your_first_shader/your_first_2d_shader.html) and did not run these shaders for this page. Every API name links to its reference.

Last checked: 27 November 2026.

## 30-second answer

| Question | Answer |
|---|---|
| Which shader type is for 2D? | `canvas_item` ([shader types](https://docs.godotengine.org/en/4.7/tutorials/shaders/introduction_to_shaders.html)) |
| Where do I add it? | Inspector > CanvasItem > Material > New ShaderMaterial > Shader > New Shader |
| Which function changes pixel color? | `fragment()`, by writing to `COLOR` |
| Which function moves the shape? | `vertex()`, by changing `VERTEX` |
| How do I change a value from GDScript? | `material.set_shader_parameter("name", value)` |
| Godot 3 tutorial uses `set_shader_param`? | That is the [Godot 3 name](https://docs.godotengine.org/en/3.6/classes/class_shadermaterial.html). In Godot 4 it is [`set_shader_parameter`](https://docs.godotengine.org/en/4.7/classes/class_shadermaterial.html) |

## Setup (do this once)

1. Add a **Sprite2D** and give it a texture. The default `icon.svg` is fine.
2. In the Inspector, open **CanvasItem > Material** and pick **New ShaderMaterial**.
3. Click the new material, then **Shader > New Shader**. Keep the type as CanvasItem.
4. Replace the code with one of the shaders below.

Every CanvasItem has a `material` property, so the same steps work on a ColorRect, a TextureRect or a TileMapLayer ([docs](https://docs.godotengine.org/en/4.7/tutorials/shaders/your_first_shader/your_first_2d_shader.html)).

Each `uniform` you declare shows up in the Inspector under **Shader Parameters**, so you can tweak it without code.

## The 5 built-ins you will use

| Name | Where | What it is |
|---|---|---|
| `COLOR` | `fragment()` | Input: vertex color (includes `modulate`) times the texture color. Also the output color |
| `UV` | both | Texture coordinates from 0.0 to 1.0 |
| `TEXTURE` | both | The node's default texture |
| `TIME` | both | Seconds since the engine started. Repeats every 3,600 seconds |
| `VERTEX` | `vertex()` | Vertex position in local pixel coordinates |

Source: [CanvasItem shader reference](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/canvas_item_shader.html).

Because `COLOR` already holds the texture color in `fragment()`, most effects below just read `COLOR` and change it. That also keeps the node's `modulate` working.

## Effect 1: Grayscale

Turns the sprite gray. `amount` blends between the original color (0.0) and full gray (1.0).

```glsl
shader_type canvas_item;

uniform float amount : hint_range(0.0, 1.0) = 1.0;

void fragment() {
	float gray = dot(COLOR.rgb, vec3(0.299, 0.587, 0.114));
	COLOR.rgb = mix(COLOR.rgb, vec3(gray), amount);
}
```

- `hint_range(min, max)` gives you a slider in the Inspector ([shading language](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/shading_language.html)).
- `dot` with these three weights is a common way to get brightness. Green counts most because our eyes are most sensitive to it.
- `mix(a, b, c)` returns `a * (1 - c) + b * c` ([shader functions](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/shader_functions.html)).

Use it for: a disabled button, a "dead" enemy, a paused scene.

## Effect 2: Hit flash

Flashes the sprite white (or any color) when it takes damage. Transparent pixels stay transparent because only `rgb` changes.

```glsl
shader_type canvas_item;

uniform vec4 flash_color : source_color = vec4(1.0);
uniform float flash_amount : hint_range(0.0, 1.0) = 0.0;

void fragment() {
	COLOR.rgb = mix(COLOR.rgb, flash_color.rgb, flash_amount);
}
```

Drive it from GDScript with a Tween that goes from 1.0 to 0.0:

```gdscript
extends Sprite2D

func flash() -> void:
	var tween := create_tween()
	tween.tween_method(_set_flash, 1.0, 0.0, 0.15)

func _set_flash(value: float) -> void:
	(material as ShaderMaterial).set_shader_parameter("flash_amount", value)
```

- `source_color` marks a uniform as a color, so the Inspector shows a color picker. Godot 3 called this `hint_color` ([upgrade guide](https://docs.godotengine.org/en/4.7/tutorials/migrating/upgrading_to_godot_4.html)).
- `tween_method(method, from, to, duration)` calls your method with each value in between ([Tween](https://docs.godotengine.org/en/4.7/classes/class_tween.html)).
- The parameter name is case-sensitive and must match the uniform name exactly ([ShaderMaterial](https://docs.godotengine.org/en/4.7/classes/class_shadermaterial.html)).

**Every enemy flashes at once?** See "Shared material" in the common problems table below.

## Effect 3: Color gradient

Paints a vertical gradient from `top_color` to `bottom_color`. On a white ColorRect you get a pure gradient background. On a sprite it tints the sprite from top to bottom.

```glsl
shader_type canvas_item;

uniform vec4 top_color : source_color = vec4(1.0, 0.8, 0.2, 1.0);
uniform vec4 bottom_color : source_color = vec4(0.9, 0.2, 0.4, 1.0);

void fragment() {
	vec3 gradient = mix(top_color.rgb, bottom_color.rgb, UV.y);
	COLOR.rgb *= gradient;
}
```

- `UV.y` is 0.0 at the top and 1.0 at the bottom in Godot. GLSL code from other engines often has y flipped ([GLSL conversion](https://docs.godotengine.org/en/4.7/tutorials/shaders/converting_glsl_to_godot_shaders.html)).
- For a horizontal gradient, use `UV.x`. For a diagonal one, use `(UV.x + UV.y) * 0.5`.

## Effect 4: Circle or ring

Draws a soft ring on a **ColorRect**, with no texture needed. Set `thickness` equal to `radius` to get a filled circle.

```glsl
shader_type canvas_item;

uniform vec4 ring_color : source_color = vec4(1.0);
uniform float radius : hint_range(0.0, 0.5) = 0.4;
uniform float thickness : hint_range(0.0, 0.5) = 0.08;
uniform float softness : hint_range(0.001, 0.05) = 0.01;

void fragment() {
	float d = distance(UV, vec2(0.5));
	float outer = 1.0 - smoothstep(radius - softness, radius, d);
	float inner = 1.0 - smoothstep(radius - thickness - softness, radius - thickness, d);
	COLOR = vec4(ring_color.rgb, ring_color.a * (outer - inner));
}
```

- `distance(UV, vec2(0.5))` is how far each pixel is from the center of the rectangle.
- `smoothstep` makes a soft edge instead of a jagged one. `softness` starts at 0.001 so its two edges never become equal.
- Keep the ColorRect **square**. On a wide rectangle the circle stretches into an oval, because `UV` always goes from 0.0 to 1.0 on both axes.

Use it for: a selection ring under a unit, a cooldown marker, a soft spotlight.

## Effect 5: Dissolve

Burns the sprite away using a noise texture, with a glowing edge. `progress` goes from 0.0 (fully visible) to 1.0 (gone).

```glsl
shader_type canvas_item;

uniform sampler2D noise_texture;
uniform float progress : hint_range(0.0, 1.0) = 0.0;
uniform float edge_width : hint_range(0.0, 0.2) = 0.05;
uniform vec4 edge_color : source_color = vec4(1.0, 0.5, 0.0, 1.0);

void fragment() {
	float n = texture(noise_texture, UV).r;
	float visible = step(progress, n);
	float edge = (1.0 - step(progress + edge_width, n)) * visible * step(0.001, progress);
	COLOR.rgb = mix(COLOR.rgb, edge_color.rgb, edge);
	COLOR.a *= visible;
}
```

**Set up the noise:** in Shader Parameters, click **Noise Texture > New NoiseTexture2D**, then open it and set **Noise > New FastNoiseLite** ([NoiseTexture2D](https://docs.godotengine.org/en/4.7/classes/class_noisetexture2d.html), [FastNoiseLite](https://docs.godotengine.org/en/4.7/classes/class_fastnoiselite.html)).

Then dissolve and remove the node from GDScript:

```gdscript
extends Sprite2D

func dissolve_and_free() -> void:
	var tween := create_tween()
	tween.tween_method(_set_dissolve, 0.0, 1.0, 0.6)
	tween.tween_callback(queue_free)

func _set_dissolve(value: float) -> void:
	(material as ShaderMaterial).set_shader_parameter("progress", value)
```

- `step(a, b)` returns 0.0 when `b < a`, otherwise 1.0 ([shader functions](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/shader_functions.html)). Pixels whose noise value is below `progress` disappear first.
- `step(0.001, progress)` hides the edge color while `progress` is still 0.0.
- Tween steps run one after another, so `queue_free` is called after the dissolve ends ([Tween](https://docs.godotengine.org/en/4.7/classes/class_tween.html)).

## Bonus: make the sprite sway (vertex)

Everything above changes color. To move the shape, use `vertex()`. This sways the top of a sprite like grass or a tree while the bottom stays put.

```glsl
shader_type canvas_item;

uniform float amplitude = 4.0;
uniform float speed = 2.0;

void vertex() {
	VERTEX.x += sin(TIME * speed) * amplitude * (1.0 - UV.y);
}
```

`VERTEX` is in local pixel coordinates, so `amplitude` is in pixels ([CanvasItem shader reference](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/canvas_item_shader.html)). A Sprite2D is a single rectangle, so this bends it as a whole (a shear). A wavy, rippling look needs a different technique: offsetting `UV` in `fragment()` instead.

## Common problems

| Problem | Cause | Fix |
|---|---|---|
| `set_shader_param` does not exist | Godot 3 method name | Use `set_shader_parameter` ([ShaderMaterial](https://docs.godotengine.org/en/4.7/classes/class_shadermaterial.html)) |
| `hint_color` gives an error | Renamed in Godot 4 | Use `source_color` ([upgrade guide](https://docs.godotengine.org/en/4.7/tutorials/migrating/upgrading_to_godot_4.html)) |
| Value from code does nothing | Name does not match the uniform | Names are case-sensitive and must match exactly |
| Shared material: every enemy flashes at once | All instances use the same ShaderMaterial resource | Tick **Resource > Local to Scene** on the material ([Resource](https://docs.godotengine.org/en/4.7/classes/class_resource.html)), or run `material = material.duplicate()` in `_ready()` |
| Outline gets cut off at the sprite edge | `fragment()` only runs on pixels the sprite covers | Leave transparent padding around the sprite in your image ([first 2D shader](https://docs.godotengine.org/en/4.7/tutorials/shaders/your_first_shader/your_first_2d_shader.html)) |
| Gradient or dissolve looks wrong on a sprite sheet | With a region enabled, `UV` covers the whole texture, not just your frame | Use `REGION_RECT` to work inside the region ([CanvasItem shader reference](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/canvas_item_shader.html)) |
| Sprite ignores `modulate` | Shader overwrites `COLOR` with `texture(TEXTURE, UV)` | Read and change `COLOR` instead, as in the examples above |
| Ported Shadertoy code fails | Different names | `mainImage` becomes `fragment`, `fragColor` becomes `COLOR`, `iTime` becomes `TIME` ([GLSL conversion](https://docs.godotengine.org/en/4.7/tutorials/shaders/converting_glsl_to_godot_shaders.html)) |

## Coming from GLSL or Shadertoy?

Godot's shading language is close to GLSL ES 3.0, but a few names differ. The official table maps them:

| GLSL / Shadertoy | Godot |
|---|---|
| `main()` | `fragment()` or `vertex()` |
| `gl_FragColor`, `fragColor` | `COLOR` |
| `gl_FragCoord`, `fragCoord` | `FRAGCOORD` |
| `iTime`, `u_time` | `TIME` |
| `iResolution`, `u_resolution` | `1.0 / SCREEN_PIXEL_SIZE` |
| `iChannel0` | `TEXTURE` (Godot has one built-in, add more as `uniform sampler2D`) |
| `iMouse`, `iFrame` | Pass them in yourself as uniforms |

Source: [Converting GLSL to Godot shaders](https://docs.godotengine.org/en/4.7/tutorials/shaders/converting_glsl_to_godot_shaders.html).

## Checklist

- [ ] First line is `shader_type canvas_item;`
- [ ] Shader is inside a ShaderMaterial on the node's **Material** slot
- [ ] Color effects change `COLOR` in `fragment()`, movement changes `VERTEX` in `vertex()`
- [ ] Uniform names in GDScript match the shader exactly
- [ ] Material is Local to Scene (or duplicated) if instances need different values
- [ ] Copied code uses Godot 4 names: `set_shader_parameter`, `source_color`

## Next steps

- Prefer nodes over code? Godot also has a node-based [VisualShader editor](https://docs.godotengine.org/en/4.7/tutorials/shaders/visual_shaders.html) that builds the same shaders.
- Using C#? The call is `((ShaderMaterial)Material).SetShaderParameter("name", value);` ([first 2D shader](https://docs.godotengine.org/en/4.7/tutorials/shaders/your_first_shader/your_first_2d_shader.html)). See [GDScript vs C# in Godot](/gdscript-vs-csharp-godot/) if you are still choosing.
- Want ready-made tools? Check [the best Godot plugins for 2026](/best-godot-plugins-2026/).

## Sources

- [Your first 2D shader (Godot 4.7)](https://docs.godotengine.org/en/4.7/tutorials/shaders/your_first_shader/your_first_2d_shader.html)
- [Introduction to shaders](https://docs.godotengine.org/en/4.7/tutorials/shaders/introduction_to_shaders.html)
- [CanvasItem shaders reference](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/canvas_item_shader.html)
- [Shading language](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/shading_language.html)
- [Built-in shader functions](https://docs.godotengine.org/en/4.7/tutorials/shaders/shader_reference/shader_functions.html)
- [Converting GLSL to Godot shaders](https://docs.godotengine.org/en/4.7/tutorials/shaders/converting_glsl_to_godot_shaders.html)
- [Upgrading from Godot 3 to Godot 4](https://docs.godotengine.org/en/4.7/tutorials/migrating/upgrading_to_godot_4.html)
- [ShaderMaterial (4.7)](https://docs.godotengine.org/en/4.7/classes/class_shadermaterial.html) and [ShaderMaterial (3.6)](https://docs.godotengine.org/en/3.6/classes/class_shadermaterial.html)
- [Tween](https://docs.godotengine.org/en/4.7/classes/class_tween.html), [Resource](https://docs.godotengine.org/en/4.7/classes/class_resource.html), [NoiseTexture2D](https://docs.godotengine.org/en/4.7/classes/class_noisetexture2d.html), [FastNoiseLite](https://docs.godotengine.org/en/4.7/classes/class_fastnoiselite.html)
- [Godot download page (4.7.2 stable)](https://godotengine.org/download/windows/) and [preview builds (4.8 beta 5)](https://godotengine.org/download/preview/)
