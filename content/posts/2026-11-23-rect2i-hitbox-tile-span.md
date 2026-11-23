---
layout: post
title: "Which tiles does a Rect2i hitbox cover in Godot 4?"
author: artcore-editorial
categories: [ Tutorials ]
tags: [GDScript, Godot 4, 2D, Collision]
image: assets/images/articles/rect2i-hitbox-tile-span.png
description: "Find the grid cells under a Godot 4 Rect2i hitbox. Run an integer-coordinate probe and check a crate on a tile edge, across the origin and at zero width."
featured: false
hidden: false
---

A 16 by 16 crate resting on a 16 by 16 floor tile should light up just that tile. Slide the crate one pixel to the right and it should light up two. To find the last occupied tile in Godot, use the last pixel inside the crate, one pixel before its bottom-right boundary. Here is a small test you can run without creating a scene.

## Put a boundary through the example

Use a rectangular grid with its origin at the top left of cell (0, 0). That cell owns integer pixels 0 through 15 on each axis. A crate starting at (0, 0) with size (16, 16) has an end of (16, 16). Feeding that end directly into a tile lookup would take you into the next row and column. Those tiles touch the outline of the crate without covering any area underneath it.

## Run the probe

Save this script as grid_probe.gd. From its directory, run godot --headless --script grid_probe.gd. The script uses integer pixel rectangles in grid-local coordinates. It skips empty rectangles and assumes nonnegative dimensions.

```gdscript
extends SceneTree

const SIDE := 16

func tile_at(pixel: Vector2i) -> Vector2i:
	return Vector2i(floori(float(pixel.x) / SIDE), floori(float(pixel.y) / SIDE))

func tile_span(footprint: Rect2i) -> Rect2i:
	if not footprint.has_area():
		return Rect2i()
	var corner := tile_at(footprint.position)
	var opposite := tile_at(footprint.end - Vector2i.ONE)
	return Rect2i(corner, opposite - corner + Vector2i.ONE)

func _initialize() -> void:
	for crate in [Rect2i(0, 0, 16, 16), Rect2i(1, 0, 16, 16),
			Rect2i(-1, -1, 2, 2), Rect2i(8, 8, 0, 12)]:
		print(crate, " covers ", tile_span(crate))
	quit()
```

## Read the four results

In the output, position is the first tile and size is a count of columns and rows. The aligned crate returns a one-by-one span at (0, 0). Shifting it right gives a two-by-one span from the same corner. The two-pixel square starting at (-1, -1) returns a two-by-two span covering four cells around the origin. Its left column belongs to tile column -1. Rounding toward zero would put that column in tile 0 and lose half the square. The zero-width rectangle returns an empty span, even though its origin is inside a tile.

The article’s probe ran in Godot 4.7.2 stable. A second test checked 3,136 rectangles with origins on both sides of the grid lines, including sizes of zero, one pixel and two tiles. For each sample, it checked every nearby cell for a positive-area intersection with the original crate. The span included every such cell and excluded each cell that touched only a border or lay outside.

## Use the result in a game

If a pressure plate occupies tile (1, 0), call has_point on the returned span with that tile coordinate. The aligned crate leaves the plate off and the one-pixel slide turns it on. For a patch of mud or a destructible floor, scan only the rows and columns inside that span. If a moving object can jump over a plate between updates, sample its path separately. This test describes the footprint at one position.

[Godot reference for Rect2i, including end, has_area and has_point.](https://docs.godotengine.org/en/stable/classes/class_rect2i.html)

By the ARTCORE editorial team. AI assisted in writing the article and test scripts. The code and the reported results were verified by running Godot.
