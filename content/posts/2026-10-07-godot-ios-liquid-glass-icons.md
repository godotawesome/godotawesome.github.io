---
layout: post
title: "Liquid Glass Icons for Godot iOS Games (iOS 26+ App Icon Guide)"
author: allofthecheeses
categories: [ Tutorials ]
tags: [iOS, iOS 26, Liquid Glass, App Icon, Icon Composer, Xcode, Mobile, Godot 4]
image: assets/images/articles/godot-ios-liquid-glass-icons.png
description: "How to add a Liquid Glass app icon to a Godot iOS game for iOS 26: what a .icon file is, making one in Icon Composer, and adding it to the exported Xcode project."
featured: false
hidden: false
---

## Liquid Glass icons and Godot

Godot's iOS export does not support the new Liquid Glass icons from iOS 26 yet - you can only give it images like PNGs. The macOS export got [`.icon` support in Godot 4.6](https://github.com/godotengine/godot/pull/108794), but there is nothing for iOS so far.

This post covers what the new icons do, and how to add one to your game's Xcode project after you export.

While I was researching this I found the icons are a lot more customisable than I thought. Players can switch their home screen to dark, clear or tinted (in any colour they like), and the `.icon` file lets you decide how your icon looks in each of them. So there is a bit more here about the file format than I planned.

*Disclosure: I work on [ShipThis](https://shipth.is/?utm_source=godotawesome&utm_medium=blog&utm_campaign=writer-outreach&utm_content=liquid-glass-disclosure). Step 3 shows the manual way in Xcode and the ShipThis way.*

## 30-second answer

1. Make a `.icon` in Apple's [Icon Composer](https://developer.apple.com/icon-composer/) - this part needs a Mac
2. Export your game from Godot for iOS as normal
3. Add the `.icon` to the Xcode project and set it as the app icon - by hand in Xcode, or with `npx shipthis util glass`
4. Build with Xcode 26

## What is in a .icon

A `.icon` is a folder. It has your artwork as separate layers (SVG or PNG) and an `icon.json` which says how each layer should look - colour, opacity, the glass effect and so on.

iOS draws the glass itself: the highlights, the blur, the see-through parts and the shadows between layers. So the same file can look quite different depending on where it is shown.

This is one icon - [`Godot.icon` by mntkat](https://github.com/mntkat/GodotAppleIcon) - rendered by Icon Composer in all of the appearances:

![One Godot.icon file rendered in Default, Dark, Clear and Tinted appearances](/assets/images/articles/godot-ios-liquid-glass-icons/icon-styles.webp)

## The player picks the look

On iOS 26 the player long-presses the home screen, taps **Edit** then **Customize**, and picks a style:

![The iOS 26 Customize sheet with Default, Dark, Clear and Tinted](/assets/images/articles/godot-ios-liquid-glass-icons/customise-sheet.png)

| Style | What happens to the icon |
|---|---|
| Default | Full colour |
| Dark | Your dark colours, on a dark background |
| Clear | See-through glass - in a light or dark version |
| Tinted | One colour, which the player chooses - also light or dark |

So that is six looks in total. You do not draw six icons though - in Icon Composer you set up Default, Dark and Mono (Mono is what Clear and Tinted are made from).

This is an iOS 26.1 home screen with the icon installed (the game is "Glass Act"):

![The Godot game icon on an iOS 26 home screen in Default, Dark, Clear and Tinted styles](/assets/images/articles/godot-ios-liquid-glass-icons/home-styles.webp)

## 1. Make the .icon

[Icon Composer](https://developer.apple.com/icon-composer/) is free from Apple and only runs on macOS - the current version needs macOS 26.4 or later. It also comes with Xcode (**Xcode → Open Developer Tool**).

- Export your icon artwork as separate layers - e.g. background, character, details
- Drag them into Icon Composer
- Change the fill, opacity and glass for each layer
- Switch the preview between Default, Dark and Mono and fix anything that looks off
- Save it, e.g. `MyIcon.icon`

Some tips from [Apple's guide](https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer):

- Take the blur, shadows and background out of your artwork - Icon Composer adds those
- Convert any text to outlines, SVG layers do not keep fonts
- You can have up to 4 groups of layers, and the depth comes from the groups - so if everything is merged into one it looks flat
- In Clear and Tinted the colour is gone and only the shape is left

> **Tip:** if you just want to try the steps first, `Godot.icon` from [mntkat/GodotAppleIcon](https://github.com/mntkat/GodotAppleIcon) works.

## 2. Export from Godot

Use your normal iOS export preset and **Export Project**. You get a folder with an `.xcodeproj` in it.

If you are on a Mac, Godot will also try to build the project with Xcode after the export. You can tick **Export Project Only** in the preset to skip that, as you will be building it yourself after adding the icon.

## 3. Add the .icon to the Xcode project

### By hand in Xcode

1. Open the `.xcodeproj` and drag `MyIcon.icon` from Finder into the project navigator. In the dialog, leave **Action** on **Copy files to destination**, check your game's target is ticked and click **Finish**

![The Xcode dialog for adding the .icon, with Copy files to destination and the target ticked](/assets/images/articles/godot-ios-liquid-glass-icons/xcode-add-files.png)

2. Select the target, open the **General** tab, and under **App Icons and Launch Screen** change **App Icon** from `AppIcon` to `MyIcon` - the file name without `.icon`, and it is case-sensitive

![The Xcode General tab with App Icon set to Godot](/assets/images/articles/godot-ios-liquid-glass-icons/xcode-app-icon.png)

That second step changes the `ASSETCATALOG_COMPILER_APPICON_NAME` build setting. `AppIcon` is the PNG icons from Godot - they are still in the project, but they are not used any more.

> **Note:** Godot writes a new Xcode project every time you export, so the icon is gone again after the next export and you have to redo these steps.

### With the ShipThis CLI

`shipthis util glass` makes the same changes to the `project.pbxproj` file, from the command line:

```bash
npx shipthis util glass ios/output.xcodeproj MyIcon.icon
```

This is why I would use it over doing it by hand:

- It is headless - no Xcode window, no clicking
- It does not need a Mac or a ShipThis account, so it runs on Linux too - anywhere Node runs
- You can put it in your build script or CI straight after the Godot export, so the icon is applied on every export and you never have to remember

On my test project the output was (trimmed a bit):

```text
Applying Liquid Glass icon from: ../Godot.icon
Derived app icon name: Godot
Copying .icon folder into project root: Godot.icon
Adding folder reference to Copy Bundle Resources: Godot.icon
Updating build settings for app icon: Godot
Liquid Glass icon successfully applied.
```

### With ShipThis cloud builds

If you build with ShipThis, you do not need to touch Xcode at all. Put the `.icon` next to `project.godot` and run this once:

```bash
shipthis game details --liquidGlassIconPath ./MyIcon.icon
```

Every [`shipthis game ship`](https://shipth.is/docs/reference/game/ship?utm_source=godotawesome&utm_medium=blog&utm_campaign=writer-outreach&utm_content=liquid-glass-ship) after that exports the game, adds the icon and builds it on a cloud Mac. The ShipThis docs on [Liquid Glass icons for Godot](https://shipth.is/docs/guides/liquid-glass?utm_source=godotawesome&utm_medium=blog&utm_campaign=writer-outreach&utm_content=liquid-glass-liquid-glass) have the details.

## 4. Build and check it

Build with **Xcode 26** - its asset compiler turns the `.icon` into the app icon.

Then put it on an iPhone running iOS 26 (or send it to TestFlight) and try each style from **Edit → Customize** on the home screen.

## FAQ

### What about players on iOS 18 and older?
Xcode makes flat images from the `.icon` for older iOS versions when it builds. So players on iOS 18 see a flat version of your Liquid Glass icon - not the PNGs from Godot.

### Do I need a Mac?
For Icon Composer, yes. Adding the icon to the Xcode project can be done anywhere with the CLI, but building for iOS still needs Xcode on a Mac, or a cloud build.

### Can my game choose which style is shown?
No, that is the player's home screen setting.

### What is ShipThis?
ShipThis is an open-source (MIT) command line tool for [building and publishing Godot games to iOS and Android](https://shipth.is/?utm_source=godotawesome&utm_medium=blog&utm_campaign=writer-outreach&utm_content=liquid-glass-faq). The builds run in the cloud, so you can ship to the App Store and Google Play from Windows, Linux or a Mac. It is free while it is in open beta, and will always be free for most solo devs. The `util glass` command in this post works without an account. The code is on GitHub: [github.com/shipth-is/cli](https://github.com/shipth-is/cli).

*Icon: [mntkat/GodotAppleIcon](https://github.com/mntkat/GodotAppleIcon). Godot logo by Andrea Calabró, CC BY 4.0.*

**Resources:**
- <a href="https://developer.apple.com/icon-composer/" target="_blank">Apple: Icon Composer</a>
- <a href="https://developer.apple.com/design/human-interface-guidelines/app-icons" target="_blank">Apple: App icon guidelines</a>
- <a href="https://github.com/godotengine/godot/pull/108794" target="_blank">Godot: Liquid Glass icons for macOS exports (4.6)</a>
- <a href="https://shipth.is/docs/guides/liquid-glass?utm_source=godotawesome&utm_medium=blog&utm_campaign=writer-outreach&utm_content=liquid-glass-liquid-glass" target="_blank">ShipThis: Liquid Glass icons for Godot iOS games</a>
- <a href="/godot-mobile-game-optimization-android-ios-2025/">Godot Mobile Game Optimization for Android & iOS</a>
