---
layout: post
title: "Slay the Spire 2 on Godot: Millions of Players After the Unity Switch"
author: godotscribe
categories: [ Game Showcase ]
tags: [Slay the Spire 2, Godot, Steam, Success Story, C#, Early Access]
image: assets/images/articles/slay-the-spire-2-godot-success-story.png
description: "Slay the Spire 2 Godot success story: Mega Crit left Unity for Godot, then hit millions of players in Early Access. Sales estimates, reviews, and what developers can learn."
featured: true
hidden: false
---

**Slay the Spire 2** is one of the clearest commercial signals Godot has had in years.

Mega Crit rebuilt the sequel on **Godot** after the Unity runtime-fee mess, shipped into Steam Early Access, and the third-party trackers now put the game in **multi-million player** territory. That is not a hobby project story. That is a franchise sequel running on an open-source engine at Steam scale.

Numbers below are **estimates** from public trackers (mainly Gamalytic and SteamDB snapshots). Treat ranges as ranges.

## Quick facts

| Item | Detail |
|---|---|
| Studio | Mega Crit |
| Engine | Godot (official Godot showcase title) |
| Status | Steam Early Access (launched March 2026) |
| Pitch | Roguelike deckbuilder sequel + co-op climbs |
| Why it matters for Godot | Big IP, C# stack, Unity exit, huge concurrent audience |

Official showcase: <a href="https://godotengine.org/showcase/slay-the-spire-2/" target="_blank">Slay the Spire 2 on godotengine.org</a>

## The numbers (estimated)

### Sales and revenue (Gamalytic)

| Metric | Estimate |
|---|---|
| Copies sold | **~7.0m** (range about **4.5m to 9.5m**) |
| Gross revenue | **~$141.6m** (range about **$90.6m to $192.6m**) |
| Players / owners | **~7.4m** |
| Copies sold (last 7 days) | **~33.5k** |

Other owner models sit in a similar band (PlayTracker / VG Insights / Gamalytic roughly **~6.3m to 7.1m** depending on the tracker). Nobody outside Steam and Mega Crit has the exact ledger. The useful takeaway is still simple: this is **millions of owners**, not tens of thousands.

### Engagement and live charts (snapshot)

| Metric | Figure |
|---|---|
| Reviews (Gamalytic) | **~194.4k** |
| Review score | **~61%** |
| SteamDB review count (snapshot) | **~223.9k** |
| Average playtime | **~87.9 hours** |
| Avg daily concurrent players | **~61.5k** |
| Followers | **~188k** |
| SteamDB chart notes | Top-tier daily active users (#5 in one snapshot), strong top-seller placement |

That playtime number is wild for a deckbuilder sequel still in Early Access. People are not just buying. They are camping in the Spire.

### Where players are

Gamalytic country mix (approx.):

- **China ~39.9%**
- **United States ~20.3%**
- **Canada ~3.6%**
- **Others ~36.2%**

If you ship global, China is not a footnote for this title. Localization and storefront readiness matter.

Sources:

- <a href="https://gamalytic.com/game/2868840" target="_blank">Gamalytic: Slay the Spire 2</a>
- <a href="https://steamdb.info/app/2868840/charts/" target="_blank">SteamDB charts</a>

## Be honest about the review score

~**61%** is not Brotato. It is not "Overwhelmingly Positive" marketing copy.

Early Access sequels to beloved games often eat:

- sky-high expectations
- balance complaints
- multiplayer friction
- "not the STS1 vibe yet" feedback

Commercial scale and review score are different stories. For Godot developers, both matter:

- Scale proves the engine can carry a massive live audience
- Mixed reviews prove polish and communication still decide Steam sentiment

Do not pretend the score is a trophy. Use it as context.

## Why the Unity → Godot switch still matters

Mega Crit did not casually "try Godot for fun." After Unity's 2023 fee drama, the studio publicly drew a hard line, then committed to leaving. Reporting around the announcement and later coverage framed STS2 as a Godot rebuild after years already spent on Unity.

That decision now sits next to:

- millions of estimated owners
- a Godot Foundation showcase listing
- a C#-heavy production architecture

For indie and mid-size teams watching engine risk, STS2 is the case study people will keep citing.

More engine-choice context on this site:

- <a href="/godot-vs-unity-2025/">Godot vs Unity 2025</a>
- <a href="/godot-44-vs-unity-6-2025-comparison/">Godot 4.4 vs Unity 6</a>

## What STS2 says about Godot technically

Public postmortems and tech notes around the project point to a pattern that many serious Godot teams already use:

- **Godot** for rendering, scenes, editor workflow, exports
- **C# / .NET** for core gameplay logic
- Clear separation between visual nodes and game models
- Custom networking for co-op rather than forcing every design through Godot's high-level multiplayer helpers

If you are on that path, these guides pair well:

- <a href="/godot-4-csharp-integration-complete-guide-2025/">Godot 4 C# integration guide</a>
- <a href="/godot-4-multiplayer-networking-guide-2025/">Godot 4 multiplayer networking guide</a>

STS2 is not proof that every team should copy Mega Crit's exact stack. It is proof that **Godot + C#** can support a genre-defining sequel with live multiplayer ambitions.

## Lessons for Godot developers

1. **Engine risk is a product decision.** STS2's migration story started with business trust, not a shader preference.
2. **Godot can handle franchise-scale EA launches.** Concurrent players and owner estimates put that debate to bed for most indie scopes.
3. **Long sessions beat vanity metrics.** ~88h average playtime is a stronger craft signal than a launch-week spike alone.
4. **Global launch planning matters.** A China-heavy audience changes QA, localization, and community coverage.
5. **Expect messy reviews on sequels.** Ship systems, listen, patch. Early Access is a process, not a victory lap.
6. **Architecture still wins.** Separating simulation from presentation is how big games stay shippable on Godot.

## Where this sits among Godot hits

Brotato, Buckshot Roulette, and Pizza Tower already showed Godot can mint Steam hits. STS2 changes the ceiling conversation:

| Game | Rough story |
|---|---|
| Brotato | Original hit, excellent review score |
| Buckshot Roulette | Viral breakout |
| Pizza Tower | Craft and movement feel |
| **Slay the Spire 2** | Established IP + Unity exit + multi-million EA scale |

More commercial context: <a href="/godot-games-table/">Most successful games made with Godot</a>

## Bottom line

**Slay the Spire 2** is the Godot success story people will screenshot into Slack threads for years:

- Unity exit that stuck
- Official Godot showcase placement
- Millions of estimated players
- Huge engagement
- Mixed but very loud review volume

If you needed a single modern answer to "can Godot ship something this big?", this is it.

**Resources:**
- <a href="https://godotengine.org/showcase/slay-the-spire-2/" target="_blank">Godot showcase: Slay the Spire 2</a>
- <a href="https://store.steampowered.com/app/2868840/Slay_the_Spire_2/" target="_blank">Slay the Spire 2 on Steam</a>
- <a href="https://gamalytic.com/game/2868840" target="_blank">Gamalytic stats</a>
- <a href="https://steamdb.info/app/2868840/" target="_blank">SteamDB</a>
- <a href="/godot-games-table/">Godot commercial games table</a>
