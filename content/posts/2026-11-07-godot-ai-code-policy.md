---
layout: post
title: "Godot AI Code Policy 2026: What It Means for Contributors and Game Developers"
author: godotscribe
categories: [ News and Updates ]
tags: [Godot, AI, Contributing, Policy, Open Source]
image: assets/images/articles/godot-ai-code-policy.png
description: "Godot's 2026 contribution policy bans AI-written engine code and vibe coding. What it covers, what it does not, and why you can still use AI for your own game."
featured: false
hidden: false
updated: 2026-11-07
---

**Godot does not accept AI-written code in its own engine repository, but the rule does not stop you from using AI tools to make your game.** The Godot Foundation announced stricter contribution rules on 30 June 2026. They cover pull requests and communication with maintainers, not games built with Godot.

Last checked: 7 November 2026. Wording of the contributing docs may change, so check the official post linked below before you submit anything.

## 30-second answer

| Question | Answer |
|---|---|
| Can I use Claude, ChatGPT or Copilot to write my **game** in Godot? | Yes. The policy is about contributing to the engine, not about your project |
| Can I send the Godot repo a pull request written by an AI agent? | No, autonomous agents and vibe coding lead to an automatic ban |
| Can I use AI to autocomplete a line in a Godot pull request? | Yes, for menial things, and you must disclose it |
| Can I write issues, PR descriptions or proposals with AI? | No, AI-generated text in human-to-human communication is banned |
| Is the policy final? | The Foundation said the contributing docs would be amended shortly after the post |

## What Godot announced

The Godot Foundation published ["Changes to our Contribution Policies"](https://godotengine.org/article/contribution-policy-2026/) on 30 June 2026. The post gives these reasons:

- Pull request volume has overwhelmed a small group of reviewers, because AI makes a pull request cheap to produce while review effort stays the same.
- AI-generated feedback does not help new people grow into maintainers.
- The goals are to keep humans responsible for their code, add barriers to low-effort submissions and reward reviewing.

## What is banned

| Rule | Details |
|---|---|
| **Autonomous AI agents and vibe coding** | The post says this already leads to an automatic ban from the GitHub repository |
| **AI-generated code in substantial amounts** | All code must be human-authored |
| **AI-generated text between humans** | Issues, pull requests and proposals must be written by people |
| **Big first contributions** | New contributors need explicit maintainer permission for new features or significant refactoring |

## What is allowed

| Allowed | Condition |
|---|---|
| Code completion, regex, find and replace | AI help limited to menial things, with disclosure in the PR discussion |
| Machine translation | The original text must have been written by a human |

A new contributor means someone with three or fewer merged pull requests. The post advises starting with bug fixes and documentation to build trust before larger work. Every pull request still needs approval from a human before it is merged.

## What this means for you

### If you want to contribute to Godot

1. Write the code yourself and be able to explain every line.
2. If an AI tool helped with anything beyond trivial edits, say so in the PR discussion. If you cannot meet the rules, do not submit.
3. Write your own issue text and PR description. Do not paste AI output.
4. Start with a bug fix or a documentation change.

Our [How we work](/how-we-work/) page follows a similar principle: people verify, and we say when AI helped.

### If you only make games with Godot

Nothing changes. The policy concerns the engine's codebase and communication with its maintainers. It does not restrict what you build with Godot, so tools like Claude Code, Cursor or Copilot are still your choice. Read our guides on [connecting Godot to Claude Code with MCP](/godot-mcp-claude-code-setup/) and on [using AI assistants with Godot](/use-ai-claude-chatgpt-grok-godot-mcp/).

A practical tip: AI code can still be wrong about Godot 4 APIs. Check generated code against the [official docs](https://docs.godotengine.org/) and the [Godot version you use](/godot-versions/).

## Why other coverage sounds different

News sites describe the rule as a "ban on AI code," "most AI code" or "substantial AI code." The official post says all code must be human-authored, with AI help allowed only for menial tasks. When wording differs, go with the Foundation's text.

## Common questions

### Does the policy apply to games made with Godot?
No. The post only discusses contributions to the engine and communication with maintainers.

### Can I use GitHub Copilot while contributing?
Only for menial help such as completion, and you must disclose it in the pull request discussion.

### What happens if I break the rules?
The post names an automatic ban from the repository for autonomous agent use and vibe coding. It does not list other penalties.

### Where is the official text?
In the Godot Foundation post linked above, and in the contributing docs at contributing.godotengine.org, which the Foundation said it would update.

## Bottom line

Godot protects its engine code by keeping contributions human-written, and it does not limit how you build your own games. If you contribute, follow the disclosure rules. If you build games, keep using the tools that help you and test what they write.

*Found an error? Use the [correction form](https://github.com/godotawesome/godotawesome.github.io/issues/new/choose).*
