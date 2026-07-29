import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("handles known GodotAwesome categories", () => {
    assert.equal(slugify("Tutorials"), "tutorials");
    assert.equal(slugify("Game Showcase"), "game-showcase");
    assert.equal(slugify("News and Updates"), "news-and-updates");
    assert.equal(slugify("Open Source Projects"), "open-source-projects");
    assert.equal(slugify("Development Tools"), "development-tools");
    assert.equal(slugify("Quick Code"), "quick-code");
    assert.equal(slugify("Trending Topics"), "trending-topics");
    assert.equal(slugify("Plugins"), "plugins");
    assert.equal(slugify("3D Modeling"), "3d-modeling");
  });

  it("normalizes whitespace and underscores", () => {
    assert.equal(slugify("  Hello_World  "), "hello-world");
  });

  it("strips unsafe characters while keeping ascii letters", () => {
    assert.equal(slugify("Godot vs Unity"), "godot-vs-unity");
  });
});
