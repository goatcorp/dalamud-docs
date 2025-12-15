---
sidebar_position: -11
---

# What's New in Dalamud v11

Dalamud v11 was a prior version of Dalamud, and released together with Patch
7.1. This is a high-level overview of changes. You can see a code diff of all of
these changes
[here](https://github.com/goatcorp/Dalamud/compare/10.0.0.15...11.0.0.0).

## Key Information

- **Branch:** `v11`
- **Release Date:** November 20, 2024
- **API Level:** 11
- **.NET Version:** .NET 8.0

## Major Changes

### Upgrade to Lumina 5

Lumina significantly reworked its Excel-related APIs.  
For more information read [Migrating to Lumina 5](lumina.md).

### SeString renderer

A new SeString renderer was added that reproduces in-game string rendering
within ImGui.  
To use it, call `ImGuiHelpers.SeStringWrapped` with a `ReadOnlySeString`, or
`ImGuiHelpers.CompileSeStringWrapped` with a macro string.

### Changes to existing services

#### IChatGui

- Added `Print` and `PrintError` overloads with type `ReadOnlySpan<byte>` as
  message.

#### IClientState

- Added the events `ClassJobChanged` and `LevelChanged`.

#### IGameInventory

- Added `GetInventoryItems` to directly access items of a `GameInventoryType`.

#### ITextureProvider

- Added `ConvertToKernelTexture` to obtain an instance of
  `Client::Graphics::Kernel::Texture` from `IDalamudTextureWrap`.

### Data Widgets

- A new Inventory widget was added.
- A new Addon Inspector (v2) widget was added.
- The Atk Array Data widget was reworked.

## Minor Changes

- The `PlayerPayload` now uses Luminas encoder/decoder.
- Added support for boxed outlined numbers in SeIconChar.

## Contributors

We want to thank ALymphocyte, Blooym, Critical-Impact, Haselnussbomber,
Helios747, Infi, ItsBexy, Kurochi51, MidoriKami, NotNite, Pilzinsel64,
RyouBakura, Sabine Lim, SlashNephy, WorkingRobot, Xpahtalo, attickdoor,
jlkeesey, kizer, nebel, pohky, thesabinelim and wolfcomp for their contributions
during this patch cycle.
