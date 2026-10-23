---
layout: post
title: "Godot Jolt Physics: How to Enable Jolt (Godot 4.6+)"
author: godotscribe
categories: [ Quick Code ]
tags: [Jolt, Physics, Godot 4.6, 3D]
image: assets/images/articles/godot-jolt-physics-guide.png
description: "Enable Godot Jolt Physics in under a minute: Project Settings, Physics, 3D, Jolt. Default in new Godot 4.6+ projects. Migration steps, key settings and fixes."
featured: false
hidden: false
updated: 2026-10-23
---

Need **Godot Jolt Physics** set up fast? Here is the short version.

In **Godot 4.6**, Jolt is the **default 3D physics engine for new projects**. It is built into the engine (not a separate plugin for most people). Older projects keep their previous physics until you switch them.

## 30-second answer: enable Jolt

1. Open **Project → Project Settings**
2. Go to **Physics → 3D**
3. Set **Physics Engine** to **Jolt Physics**
4. Click **Save & Restart**

When the editor reloads, 3D physics uses Jolt.

```text
Project Settings
  → Physics
    → 3D
      → Physics Engine = Jolt Physics
        → Save & Restart
```

That is the whole enable step.

## New project vs existing project

| Situation | What happens |
|---|---|
| New Godot 4.6 project | Jolt is already selected by default |
| Project from 4.5 / 4.4 / older | Keeps the old physics setting until you change it |
| You want Godot Physics back | Set Physics Engine to Godot Physics, then Save & Restart |

So if you just created a fresh 4.6 project, you may already be on Jolt. Check the setting once and move on.

## Built-in vs the old godot-jolt addon

Quick clarity, because search results still mix these up:

- **Godot 4.4+:** Jolt ships inside Godot as an official option
- **Godot 4.6:** Jolt is production-ready and default for new 3D projects
- **godot-jolt (GitHub extension):** useful history / older workflows, but you usually do **not** need it on current official builds

If you are on stock Godot 4.6, use Project Settings. Do not install a random third-party Jolt build unless you know why you need it.

For a broader tools list, see <a href="/best-godot-plugins-2026/">Best Godot Plugins 2026</a>.

## Verify Jolt is active

After Save & Restart:

1. Re-open **Project Settings → Physics → 3D**
2. Confirm **Physics Engine** still says **Jolt Physics**
3. Drop a few `RigidBody3D` boxes into a scene and press Play
4. Watch stacking / bouncing. If bodies behave and the editor did not fall back, you are good

You can also print the setting at runtime:

```gdscript
func _ready() -> void:
	var engine_name := str(ProjectSettings.get_setting("physics/3d/physics_engine"))
	print("3D physics engine: ", engine_name)
	# Expect something like "Jolt Physics"
```

## Settings worth knowing

Turn on **Advanced Settings** in Project Settings if Jolt options look missing.

Useful areas under the Jolt / 3D physics settings:

- **Sleep:** lets resting bodies stop simulating (good for performance)
- **Solver iterations:** higher can help stacking / joints, costs CPU
- **Max linear / angular velocity:** clamps extreme speeds
- **Collision margins:** accuracy vs performance tradeoff

Do not crank every slider on day one. Change one value, test, then decide.

## Code that still works the same way

Your normal 3D physics API does not suddenly change names. You still use nodes like:

- `CharacterBody3D`
- `RigidBody3D`
- `StaticBody3D`
- `Area3D`
- collision shapes / layers / masks

Example: a basic pushable crate is still a `RigidBody3D` + `CollisionShape3D`.

```gdscript
extends RigidBody3D

func _ready() -> void:
	# Normal RigidBody3D workflow
	mass = 5.0
	gravity_scale = 1.0
```

Character controllers still move in `_physics_process`:

```gdscript
extends CharacterBody3D

@export var speed := 8.0

func _physics_process(delta: float) -> void:
	var input_dir := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	var direction := (transform.basis * Vector3(input_dir.x, 0.0, input_dir.y)).normalized()

	if direction != Vector3.ZERO:
		velocity.x = direction.x * speed
		velocity.z = direction.z * speed
	else:
		velocity.x = move_toward(velocity.x, 0.0, speed)
		velocity.z = move_toward(velocity.z, 0.0, speed)

	move_and_slide()
```

The backend changed. Your node setup mostly did not.

## When Jolt helps most

Switch to (or keep) Jolt if you care about:

- More stable stacking of rigid bodies
- Fast-moving objects that used to tunnel through walls
- Lots of 3D physics bodies at once
- Vehicles, props, destruction toys, physics puzzles

Keep or switch back to Godot Physics if:

- Your current game already feels tuned and shipping soon
- A specific addon or tutorial assumes Godot Physics behavior
- You hit an edge-case regression and need a temporary fallback

Migrating an almost-finished project mid-polish can change feel. Test jump height, slopes, vehicle grip, and joint setups after switching.

## Migration checklist (existing projects)

1. Back up the project (Git commit is enough)
2. Set **Physics Engine** to **Jolt Physics**
3. **Save & Restart**
4. Play your main scenes
5. Retest: player movement, slopes, moving platforms, rigid props, joints
6. Only then tweak Jolt advanced settings

If something feels off, note the scene and body type before you start random setting changes.

## Common gotchas

**I changed the setting and nothing happened**  
You probably skipped **Save & Restart**.

**New project already says Jolt**  
Expected on Godot 4.6. You are done.

**I installed an old Jolt addon and now things conflict**  
On modern official Godot builds, prefer the built-in engine option. Remove leftover extension folders from `addons/` if you added them by mistake.

**2D physics did not change**  
This is about **3D**. Godot's 2D physics path is separate.

**Numbers feel different after switching**  
Same scene, different solver. Recalibrate masses, damp, and speeds if needed.

## FAQ

### Is Jolt free in Godot?
Yes. It is part of Godot. No paid physics license for the built-in integration.

### Do I need Godot 4.6 for Jolt?
Jolt was available earlier (notably from 4.4 as an option). **4.6** is where it becomes the default for new projects and is treated as production-ready by the official release notes.

### Should every 3D game use Jolt now?
For new 3D work on 4.6: yes, start with Jolt. For live projects: switch when you have time to retest physics critically.

### Where are the official docs?
<a href="https://docs.godotengine.org/en/4.6/tutorials/physics/using_jolt_physics.html" target="_blank">Using Jolt Physics (Godot 4.6 docs)</a>

## Bottom line

- **New 4.6 project:** you are probably already on Jolt
- **Older project:** Project Settings → Physics → 3D → Jolt Physics → Save & Restart
- **Gameplay code:** keep using normal `*Body3D` nodes
- **Ship confidence:** playtest physics after any switch

That is all you need to enable and start using **Godot Jolt Physics**.

**Resources:**
- <a href="https://docs.godotengine.org/en/4.6/tutorials/physics/using_jolt_physics.html" target="_blank">Official: Using Jolt Physics</a>
- <a href="https://godotengine.org/releases/4.6/" target="_blank">Godot 4.6 release notes</a>
- <a href="/best-godot-plugins-2026/">Best Godot Plugins 2026</a>
- <a href="/godot-4-4-complete-guide/">Godot 4.4 feature overview (earlier Jolt intro)</a>
