---
layout: post
title: "Interrupted scene-edit tools in Godot: inspect before retrying"
author: tejesh-vaish
categories: [ Development Tools ]
tags: [Godot 4, GDScript, MCP, Failure Handling]
image: assets/images/articles/interrupted-scene-edit-tools.png
description: "Recover an interrupted Godot scene edit with fresh readback. A tested Godot 4.7.2 lab shows when to retry, skip the write, or return unknown."
featured: false
hidden: false
---

When a scene-edit tool loses its response, inspect the saved scene before retrying. This lab adds one checkpoint, interrupts Godot after the save but before the reply, then starts a fresh Godot process to decide whether to retry, skip, or stop with `unknown`.

The tested engine is **Godot 4.7.2**, reporting `4.7.2.stable.official.ed1daf0bf`, using the official macOS universal binary. The controller ran on Python **3.9.6** with no third-party packages. The editor stayed closed. All results below are headless file experiments; no MCP connection or editor interaction was exercised.

The [Claude Code MCP setup guide](https://godotawesome.com/godot-mcp-claude-code-setup/) shows how to connect a client to Godot tools. Once a tool can edit scenes, it also needs to handle a missing reply. The caller can't infer whether saving finished from that reply alone. The subprocess here stands in for a tool worker. It doesn't implement that server's tools or claim to reproduce a defect in it.

```text
Missing reply -> fresh saved-scene inspection
  Exact untouched baseline, no checkpoint -> retry once
  One checkpoint with expected operation and properties -> skip the write
  Unreadable or conflicting state -> stop with unknown
```

## 1. Set up a tiny project

Use a disposable folder, with the editor closed and no other writer. Download the standard build from the [official 4.7.2 release](https://github.com/godotengine/godot/releases/tag/4.7.2-stable) and use its executable directly. On macOS that's `Godot.app/Contents/MacOS/Godot`. No export templates are needed.

Put these four files in one folder: [project.godot](#project-godot), [main.tscn](#main-tscn), [scene_tool.gd](#scene-tool-gd), and [run_lab.py](#run-lab-py). Then follow the [run instructions](#run-the-lab). The controller makes a separate project for each case, and refuses to reuse a results directory.

<a id="project-godot"></a>

### `project.godot`

```ini
config_version=5

[application]
config/name="Interrupted scene edit lab"
run/main_scene="res://main.tscn"

[rendering]
renderer/rendering_method="gl_compatibility"
```

<a id="main-tscn"></a>

### `main.tscn`

```ini
[gd_scene format=3]

[node name="Main" type="Node2D"]
metadata/lab_revision = "baseline-v1"
```

The desired edit is one `Polygon2D` named `Checkpoint`, at local position `(80, 60)`, with a blue triangle and metadata `operation_id = "checkpoint-001"`. The operation ID stays the same across a retry. The inspector checks that ID along with the node's properties. Finding a node called `Checkpoint` isn't enough.

The inspector needs evidence that an absent checkpoint is safe to add. Here that evidence is the untouched template's hash: zero children plus identical baseline bytes. A blank line changes the hash and yields `unknown`. This is intentionally conservative, so the fixture can't quietly accept a changed starting scene.

## 2. Load, inspect, then save

<a id="scene-tool-gd"></a>

### `scene_tool.gd`

```gdscript
extends SceneTree

const SCENE = "res://main.tscn"
const OP = "checkpoint-001"
var points = PackedVector2Array([Vector2(-12, 12), Vector2(0, -12), Vector2(12, 12)])
const INK = Color(0.25, 0.75, 1.0, 1.0)

func report(value: Dictionary, code: int = 0) -> void:
	print("RESULT " + JSON.stringify(value))
	quit(code)

func checkpoint(stage: String, wanted: String) -> bool:
	if stage != wanted:
		return true
	var file = FileAccess.open("res://gate.pending", FileAccess.WRITE)
	if file == null:
		report({"state": "unknown", "reason": "cannot write test gate"}, 3)
		return false
	file.store_string(stage)
	file.close()
	if DirAccess.rename_absolute("res://gate.pending", "res://gate.txt") != OK:
		report({"state": "unknown", "reason": "cannot publish test gate"}, 3)
		return false
	OS.read_string_from_stdin()
	return true

func valid_marker(node: Node) -> bool:
	if not node is Polygon2D:
		return false
	return node.name == "Checkpoint" and node.get_meta("operation_id", "") == OP \
		and node.position == Vector2(80, 60) \
		and node.polygon == points and node.color == INK and node.visible \
		and node.rotation == 0 and node.scale == Vector2.ONE

func valid_root(root: Node) -> bool:
	if root.get_class() != "Node2D" or root.name != "Main":
		return false
	return root.position == Vector2.ZERO and root.rotation == 0 \
		and root.scale == Vector2.ONE and root.visible

func inspect_scene(root: Node, baseline: String) -> Dictionary:
	if not valid_root(root):
		return {"state": "unknown", "reason": "root conflict"}
	if root.get_meta("lab_revision", "") != "baseline-v1":
		return {"state": "unknown", "reason": "revision conflict"}
	var count = root.get_child_count()
	if count == 0 and FileAccess.get_sha256(SCENE) == baseline:
		return {"state": "not_applied", "count": 0}
	if count == 1 and valid_marker(root.get_child(0)):
		var marker = root.get_child(0)
		return {"state": "applied", "count": 1, "operation_id": OP,
			"position": [marker.position.x, marker.position.y],
			"color": [marker.color.r, marker.color.g, marker.color.b, marker.color.a],
			"polygon": Array(marker.polygon)}
	return {"state": "unknown", "reason": "scene conflict", "count": count}

func save_marker(root: Node) -> Error:
	var marker = Polygon2D.new()
	marker.name = "Checkpoint"
	marker.position = Vector2(80, 60)
	marker.polygon = points
	marker.color = INK
	marker.set_meta("operation_id", OP)
	root.add_child(marker, true)
	marker.owner = root
	var packed = PackedScene.new()
	var error = packed.pack(root)
	if error != OK:
		return error
	return ResourceSaver.save(packed, SCENE)

func _initialize() -> void:
	var args = OS.get_cmdline_user_args()
	if args.size() != 3:
		report({"state": "unknown", "reason": "need mode, gate, baseline hash"}, 2)
		return
	var packed = ResourceLoader.load(SCENE, "PackedScene", ResourceLoader.CACHE_MODE_IGNORE)
	if not packed is PackedScene:
		report({"state": "unknown", "reason": "unreadable scene"}, 2)
		return
	var root = packed.instantiate()
	var state = inspect_scene(root, args[2])
	if args[0] == "inspect":
		root.free()
		report(state)
		return
	if args[0] != "blind" and state.state != "not_applied":
		root.free()
		report({"state": "unknown", "reason": "write precondition failed"}, 2)
		return
	if not checkpoint("before_save", args[1]):
		root.free()
		return
	var error = save_marker(root)
	root.free()
	if error != OK:
		report({"state": "unknown", "reason": "save failed", "error": error}, 2)
		return
	if not checkpoint("after_save", args[1]):
		return
	report({"state": "saved", "operation_id": OP})
```

Check both steps of saving. [`PackedScene.pack()`](https://docs.godotengine.org/en/stable/classes/class_packedscene.html#class-packedscene-method-pack) builds the serializable scene, then [`ResourceSaver.save()`](https://docs.godotengine.org/en/stable/classes/class_resourcesaver.html#class-resourcesaver-method-save) writes it. Both return an error code. The worker emits `saved` only after both return `OK`.

Set `marker.owner = root` after adding the child. Packing a scene preserves the root and the nodes it owns. A child in the in-memory tree can disappear from the saved scene if ownership is missing. The [Node ownership documentation](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-property-owner) describes this requirement.

The inspector uses [`ResourceLoader.load()`](https://docs.godotengine.org/en/stable/classes/class_resourceloader.html#class-resourceloader-method-load) with `CACHE_MODE_IGNORE`. Each inspection also starts a new process, so the worker's in-memory tree can't stand in for saved state. It instantiates the scene, checks the root, revision, child count, operation ID, and expected marker properties, then frees the tree. Metadata uses [`set_meta()` and `get_meta()`](https://docs.godotengine.org/en/stable/classes/class_object.html#class-object-method-set-meta).

To place the interruption precisely, the test uses a gate file. At the chosen stage, the worker writes and closes `gate.pending`, renames it to `gate.txt`, then blocks on [`OS.read_string_from_stdin()`](https://docs.godotengine.org/en/stable/classes/class_os.html#class-os-method-read-string-from-stdin). The controller keeps that pipe open without writing to it.

Publishing the gate after closing the file avoids a kill racing the checkpoint write. This is synchronization for the test, not a receipt used by recovery.

Keep the `return` statements after `report()`. [`SceneTree.quit()`](https://docs.godotengine.org/en/stable/classes/class_scenetree.html#class-scenetree-method-quit) ends the application at the end of the current iteration. It doesn't return from the current function for you.

## 3. Interrupt the worker and reconcile

The controller creates a separate fixture for each case with `fixture()`. `interrupt()` kills its worker at the selected gate; `recover()` starts a fresh Godot inspector and decides whether to retry. `finish()` asserts the final scene state and saves the receipts.

<a id="run-lab-py"></a>

### `run_lab.py`

```python
import hashlib
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
ENGINE = str(Path(sys.argv[1]).resolve())
OUT = Path(sys.argv[2]).resolve()
OUT.mkdir()
BASELINE = hashlib.sha256((HERE / "main.tscn").read_bytes()).hexdigest()


def fixture(name):
    folder = OUT / name
    folder.mkdir()
    for filename in ("project.godot", "main.tscn", "scene_tool.gd"):
        shutil.copyfile(HERE / filename, folder / filename)
    return folder


def command(folder, mode, gate="none"):
    return [ENGINE, "--headless", "--path", str(folder), "--script",
            "scene_tool.gd", "--", mode, gate, BASELINE]


def result(stdout):
    for line in stdout.splitlines():
        if line.startswith("RESULT "):
            return json.loads(line[7:])
    raise RuntimeError("No result from Godot")


def run(folder, mode):
    process = subprocess.Popen(command(folder, mode), stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE, text=True)
    try:
        stdout, stderr = process.communicate(timeout=15)
    except subprocess.TimeoutExpired:
        process.kill()
        process.communicate(timeout=15)
        raise
    receipt = {"command": command(folder, mode), "pid": process.pid,
               "exit": process.returncode, "stdout": stdout, "stderr": stderr}
    with (folder / "processes.jsonl").open("a") as stream:
        stream.write(json.dumps(receipt) + "\n")
    if process.returncode not in (0, 2):
        raise RuntimeError(receipt)
    return result(stdout)


def wait_for_gate(process, folder, stage):
    deadline = time.monotonic() + 15
    gate = folder / "gate.txt"
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError("Worker exited before the test gate")
        if gate.exists() and gate.read_text() == stage:
            return
        time.sleep(0.01)
    raise TimeoutError("Worker did not reach the test gate")


def interrupt(folder, stage):
    process = subprocess.Popen(command(folder, "apply", stage), stdin=subprocess.PIPE,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        wait_for_gate(process, folder, stage)
        (folder / "interrupted.tscn").write_bytes((folder / "main.tscn").read_bytes())
    finally:
        process.kill()
        stdout, stderr = process.communicate(timeout=15)
    receipt = {"command": command(folder, "apply", stage), "pid": process.pid,
               "exit": process.returncode, "stdout": stdout, "stderr": stderr}
    (folder / "interruption.json").write_text(json.dumps(receipt, indent=2) + "\n")
    assert "RESULT " not in stdout, receipt
    assert process.returncode != 0, receipt
    return "missing_response"


def recover(folder, outcome):
    assert outcome == "missing_response"
    state = run(folder, "inspect")
    action = {"not_applied": "retry", "applied": "skip", "unknown": "stop"}[state["state"]]
    if action == "retry":
        assert run(folder, "apply")["state"] == "saved"
    return {"observed": state, "action": action}


def finish(folder, before, expected, details):
    final = run(folder, "inspect")
    assert final["state"] == expected, final
    scene = (folder / "main.tscn").read_bytes()
    (folder / "before.tscn").write_bytes(before)
    (folder / "after.tscn").write_bytes(scene)
    details.update({"final": final, "before_sha256": hashlib.sha256(before).hexdigest(),
                    "after_sha256": hashlib.sha256(scene).hexdigest()})
    (folder / "result.json").write_text(json.dumps(details, indent=2) + "\n")
    print(folder.name + ": " + json.dumps(details, sort_keys=True))


def normal_case():
    folder = fixture("normal")
    before = (folder / "main.tscn").read_bytes()
    reply = run(folder, "apply")
    assert reply["state"] == "saved"
    finish(folder, before, "applied", {"response": reply})


def interrupted_case(stage):
    folder = fixture(stage)
    before = (folder / "main.tscn").read_bytes()
    outcome = interrupt(folder, stage)
    recovery = recover(folder, outcome)
    finish(folder, before, "applied", {"response": outcome, "recovery": recovery})


def blind_case():
    folder = fixture("blind_retry")
    before = (folder / "main.tscn").read_bytes()
    interrupt(folder, "after_save")
    assert run(folder, "blind")["state"] == "saved"
    state = run(folder, "inspect")
    assert state["count"] == 2, state
    finish(folder, before, "unknown", {"response": "missing_response", "blind_count": 2})


def unknown_case(name, content):
    folder = fixture(name)
    (folder / "main.tscn").write_bytes(content)
    recovery = recover(folder, "missing_response")
    assert recovery["action"] == "stop", recovery
    assert (folder / "main.tscn").read_bytes() == content
    finish(folder, content, "unknown", {"recovery": recovery, "no_write": True})


def marker_conflict_case():
    folder = fixture("marker_conflict")
    assert run(folder, "apply")["state"] == "saved"
    scene = folder / "main.tscn"
    content = scene.read_bytes().replace(b"Vector2(80, 60)", b"Vector2(81, 60)")
    scene.write_bytes(content)
    recovery = recover(folder, "missing_response")
    assert recovery["action"] == "stop", recovery
    assert scene.read_bytes() == content
    finish(folder, content, "unknown", {"recovery": recovery, "no_write": True})


normal_case()
interrupted_case("before_save")
interrupted_case("after_save")
blind_case()
unknown_case("conflict", (HERE / "main.tscn").read_bytes().replace(b"baseline-v1", b"baseline-v2"))
unknown_case("unreadable", b"not a Godot scene\n")
unknown_case("changed_baseline", (HERE / "main.tscn").read_bytes() + b"\n")
marker_conflict_case()
```

<a id="run-the-lab"></a>

### Run the lab

From that folder, run this command after replacing the quoted argument with your Godot executable's absolute path. Keep Python assertions enabled; don't add `-O`.

```sh
python3 run_lab.py \
  "/absolute/path/to/Godot" results
```

The 15-second deadlines are watchdogs for a stuck test. The controller doesn't guess how long saving takes. It waits for the exact gate content, captures the scene at that point, kills only the worker it started, and collects its exit and pipes. The 10 ms sleep is a bounded polling interval, not the condition used to decide when to interrupt.

`recover()` gets only `missing_response` and the fixture location. It never opens `gate.txt` or `interrupted.tscn`. It launches an independent inspector and applies this decision table:

<div style="max-width: 100%; overflow-x: auto;" role="region" aria-label="Scene recovery decisions" tabindex="0">

| Observation | Decision |
|---|---|
| No checkpoint and exact baseline bytes | Retry once |
| One checkpoint with the expected operation and properties | Skip the write |
| Unreadable scene or conflicting state | Stop with `unknown` |

</div>

Before a permitted write, the worker checks the precondition again. This guards the retry path in this single-writer lab. It doesn't close the race between checking and saving if another process can edit the file.

## 4. Read the response and scene separately

These are the observed results. The response column comes from the worker's captured pipes; scene state comes from a separate Godot process.

<div style="max-width: 100%; overflow-x: auto;" role="region" aria-label="Scene edit results" tabindex="0">

| Case | Worker outcome | Fresh scene readback | Recovery action |
|---|---|---|---|
| Normal completion | `saved`, exit 0 | One matching checkpoint | None needed |
| Interrupted before save | No result, exit -9 | Exact baseline, zero children | Retry; final count 1 |
| Interrupted after save | No result, exit -9 | One matching checkpoint | Skip; final count 1 |
| Blind retry after save | First result missing; repeated write returns `saved` | Two children | Inspector returns `unknown` |
| Changed revision | Missing-response input | `unknown` | Stop; bytes unchanged |
| Unreadable scene | Missing-response input | `unknown`, inspector exit 2 | Stop; bytes unchanged |
| Changed baseline bytes | Missing-response input | Zero children, `unknown` | Stop; bytes unchanged |
| Moved checkpoint | Missing-response input | One child, `unknown` | Stop; bytes unchanged |

</div>

The last four cases inject an uncertain caller outcome against deliberately changed scene files. They don't pretend that another interrupted worker ran in those cases. The blind control deliberately bypasses the write precondition; it demonstrates what repeating the mutation would do without reconciliation.

For the interrupted-after-save case, this is the actual inspector result line:

```text
RESULT {"color":[0.25,0.75,1.0,1.0],"count":1,"operation_id":"checkpoint-001","polygon":["(-12.0, 12.0)","(0.0, -12.0)","(12.0, 12.0)"],"position":[80.0,60.0],"state":"applied"}
```

And these are the corresponding saved scene bytes from that run. The generated `unique_id` values can differ on your run:

```ini
[gd_scene format=3]

[node name="Main" type="Node2D" unique_id=1661788757]
metadata/lab_revision = "baseline-v1"

[node name="Checkpoint" type="Polygon2D" parent="." unique_id=624961457]
position = Vector2(80, 60)
color = Color(0.25, 0.75, 1, 1)
polygon = PackedVector2Array(-12, 12, 0, -12, 12, 12)
metadata/operation_id = "checkpoint-001"
```

The killed worker printed the engine banner but no `RESULT` line. Fresh inspection still found the saved checkpoint. The before-save case had the same missing response and an untouched scene.

Each fixture keeps `processes.jsonl`, scene snapshots, hashes, and `result.json`. Interrupted cases also keep `interruption.json` and `interrupted.tscn`. For every unknown case, the controller checks full byte equality before and after recovery, then records both SHA-256 hashes. Only inspection commands run during that recovery. This no-write check covers `main.tscn`.

Require both a structured `RESULT` and a fresh inspection of the saved scene before treating an operation as complete.

## Where this recovery rule stops

This inspector knows one operation in one tiny, trusted scene. It checks the fields listed in the code, not every possible node property, resource, or editor state. Don't load untrusted scenes with it, and don't treat metadata as an authenticated operation receipt.

The lab assumes one writer and a closed editor. An open editor could hold unsaved changes; another writer could change the scene between inspection and retry. Resolving those cases needs a coordinated write protocol and preconditions that cover the real edit. A file hash checked before a write isn't a lock.

`ResourceSaver.save() == OK` and a fresh successful load demonstrate this process-interruption case. They don't prove survival across power loss or exactly-once execution. The operation ID identifies the intended edit. The blind control still creates two nodes with that ID, so the ID alone doesn't prevent duplicates.

For a scene tool, keep the intended edit, the saved state, and the returned response separate. When the response is missing, retry only after readback establishes that the edit is absent and its precondition still holds. If readback can't establish that, leave the scene alone and return `unknown`.
