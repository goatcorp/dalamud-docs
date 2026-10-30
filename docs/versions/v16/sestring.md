---
title: Migrating to ReadOnlySeString
description:
  Replacing Dalamud's SeString and Payload classes with the Lumina
  ReadOnlySeString in API 16
---

# Migrating to ReadOnlySeString

API 16 removes Dalamud's mutable `SeString`, `SeStringBuilder` and Payload
classes (`Dalamud.Game.Text.SeStringHandling`). The Lumina `ReadOnlySeString`
API and accompanying builders and helpers are much more mature and accurate to
the game, and we had been having troubles keeping the very old Dalamud API
(actually, one of the first things we ever got in Dalamud) up-to-date with new
knowledge.

Fundamentally, they behave similarly, but the Lumina API is a little lower-level
and most importantly, the Lumina SeString type is immutable, as it can be backed
by game memory. We think these trade-offs are worth the accuracy and
maintainability benefits, and have added helpers and convenience functions to
make working with them easier. As a bonus, the new classes are also a little
faster.

If you are running into problems, or are having trouble representing something
you used to be able to do with the old classes, please reach out! We will either
be able to clarify, or, if it's a common-enough thing to do, add helpers.

Every Dalamud API now takes or returns Lumina types instead:

| Type                                           | Kind              | Use                                                   |
| ---------------------------------------------- | ----------------- | ----------------------------------------------------- |
| `Lumina.Text.ReadOnly.ReadOnlySeString`        | `struct`, owning  | Store, pass around and return                         |
| `Lumina.Text.ReadOnly.ReadOnlySeStringSpan`    | `ref struct` view | Read game memory without copying, but can't be stored |
| `Lumina.Text.ReadOnly.ReadOnlySePayload(Span)` | payload view      | Item of a `foreach` over a string                     |
| `Lumina.Text.SeStringBuilder`                  | builder           | Create or modify strings                              |
| `Dalamud.Utility.RentedSeStringBuilder`        | pooled builder    | Same as above but with less allocations               |

For the binary format, macros and expressions, **we strongly recommend that you
have a look at the [SeString](/plugin-development/sestring) page**. This page
only covers the migration aspects for already existing code.

:::note

All of the Lumina APIs we are talking about here are already available on API 15
right now, and some of the Dalamud APIs also already offer ReadOnlySeString
APIs. Most of the helpers we describe have also been backported, so if you use a
large amount of SeString-based code, you may already try upgrading your plugin
now.

:::

## Key differences

- **They are immutable** and there is no `Payloads` list to edit. To change a
  string, you have to build a new one (see
  [Modifying a string](#modifying-a-string)).
- **There are no payload "classes".** A payload is either text
  (`ReadOnlySePayloadType.Text`) or a macro identified by `MacroCode`, and data
  is read from its expressions.
- **Spans can point into game memory** and properties such as
  `IGameObject.Name`, `IPartyMember.Name`, `IFate.Name` and
  `INamePlateInfoView.*` return `ReadOnlySeStringSpan` now to avoid copies. You
  will need to copy them before storing or using them after the current frame:
  ```cs
  ReadOnlySeString name = new(gameObject.Name); // owning copy
  string plain = gameObject.Name.ToString();    // plain text
  ```
- **Macros such as links and colors need a terminator.** For example, Lumina's
  `PushLink*` methods open a link, which must be closed with `PopLink()`.
  Dalamud `PushItemLink`, `PushMapLink` and `PushPartyFinderLink`
  extensions/helpers are the exception and don't need it, since they append a
  complete and already-terminated link.

## Quick reference

### SeString

| API 15                               | API 16                                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `SeString.TextValue`, `ToString()`   | `ToString()` optionally with formatting parameters                                                  |
| `SeString.Empty`, `new SeString()`   | `default` and check with `IsEmpty` property                                                         |
| `seString.Payloads`                  | `foreach (var payload in str)`, `PayloadCount`                                                      |
| `SeString.Parse(bytes)`              | `new ReadOnlySeString(bytes)`                                                                       |
| `SeString.Parse(byte* ptr)`          | `new ReadOnlySeStringSpan(ptr)`                                                                     |
| `utf8String.AsDalamudSeString()`     | `utf8String.AsReadOnlySeString()` / `AsReadOnlySeStringSpan()`                                      |
| `MemoryHelper.ReadSeString(...)`     | `new ReadOnlySeStringSpan(ptr)` or the `Utf8String`/`CStringPointer` extensions                     |
| `MemoryHelper.WriteSeString(...)`    | Write `str.Data` followed by a `0` byte or use `Utf8String.SetString(str)` (WIP, may be simplified) |
| `seString.Encode()`                  | `str.Data` (implicitly converts to `ReadOnlySpan<byte>`)                                            |
| `a.Append(b)`                        | `a + b` or a builder                                                                                |
| `ToJson()` / `FromJson()`            | Store `ToMacroString()` and restore with `ReadOnlySeString.FromMacroString()`                       |
| `rosString.ToDalamudString()`        | Not needed anymore since Dalamud strings are gone                                                   |
| `SeString.CreateItemLink(...)`, etc. | Same name in `Dalamud.Game.Text.SeString` and returns `ReadOnlySeString`                            |

### SeStringBuilder

| API 15 (`Dalamud…SeStringBuilder`)     | API 16 (`Lumina.Text.SeStringBuilder`)                     |
| -------------------------------------- | ---------------------------------------------------------- |
| `AddText(text)`                        | `Append(text)`                                             |
| `AddUiForeground(key)` / `…Off()`      | `PushColorType(key)` / `PopColorType()`                    |
| `AddUiGlow(key)` / `…Off()`            | `PushEdgeColorType(key)` / `PopEdgeColorType()`            |
| `AddIcon(BitmapFontIcon.X)`            | `AppendIcon((uint)BitmapFontIcon.X)`                       |
| `AddItalics(text)`                     | `AppendItalicized(text)`                                   |
| `AddItalicsOn()` / `AddItalicsOff()`   | `AppendSetItalic(true)` / `AppendSetItalic(false)`         |
| `AddItemLink(id, isHq)`                | `PushItemLink(id, ItemKind.Hq)` (`Dalamud.Utility`)        |
| `AddItemLinkRaw(rawId)`                | `PushItemLink(rawId)`                                      |
| `AddMapLink(...)`                      | `PushMapLink(MapCoordinate)` (see [Map links](#map-links)) |
| `AddQuestLink(id)`                     | `PushLinkQuest(id)` … `PopLink()`                          |
| `AddStatusLink(id)`                    | `PushLinkStatus(id)` … `PopLink()`                         |
| `AddPartyFinderLink(id, …)`            | `PushPartyFinderLink(id, recruiterName, isCrossWorld)`     |
| `AddPartyFinderSearchConditionsLink()` | `PushPartyFinderSearchConditionsLink(message)`             |
| `Add(RawPayload.LinkTerminator)`       | `PopLink()`                                                |
| `Build()`                              | `ToReadOnlySeString()`                                     |

### Payloads

::warning

This table is designed to be a **short overview** of possible macro types and
what payloads they used to map to. What is represented in the data column is
only intended to be an example and is not thorough. We stronly suggest that you
**have a look at the [SeString](/plugin-development/sestring) page** for
complete explanations of every macro type.

::

| API 15 payload          | API 16 check                                       | Data                                                                               |
| ----------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `TextPayload`           | `payload.Type == ReadOnlySePayloadType.Text`       | `payload.Body` (UTF-8)                                                             |
| `PlayerPayload`         | `payload.IsLink(LinkMacroPayloadType.Character)`   | expr 2: world ID, expr 4: name                                                     |
| `ItemPayload`           | `payload.IsLink(LinkMacroPayloadType.Item)`        | expr 1: raw item ID → `ItemUtil.GetBaseId()`                                       |
| `MapLinkPayload`        | `payload.IsLink(LinkMacroPayloadType.MapPosition)` | expr 1: `territoryId << 16 \| mapId`, expr 2/3: raw X/Y                            |
| `QuestPayload`          | `payload.IsLink(LinkMacroPayloadType.Quest)`       | expr 1: quest ID                                                                   |
| `StatusPayload`         | `payload.IsLink(LinkMacroPayloadType.Status)`      | expr 1: status ID                                                                  |
| `PartyFinderPayload`    | `payload.IsLink(LinkMacroPayloadType.PartyFinder)` | expr 1: listing ID                                                                 |
| `DalamudLinkPayload`    | `payload.TryReadDalamudLink(out var link)`         | `link.CommandId`, `link.PluginName`, `Extra*`                                      |
| `UIForegroundPayload`   | `payload.IsMacro(MacroCode.ColorType)`             | expr 0: `UIColor` row ID (0 = pop)                                                 |
| `UIGlowPayload`         | `payload.IsMacro(MacroCode.EdgeColorType)`         | expr 0: `UIColor` row ID (0 = pop)                                                 |
| `IconPayload`           | `payload.IsMacro(MacroCode.Icon)`                  | expr 0: `BitmapFontIcon`                                                           |
| `EmphasisItalicPayload` | `payload.IsMacro(MacroCode.Italic)`                | expr 0: 1 = on, 0 = off                                                            |
| `NewLinePayload`        | `payload.IsMacro(MacroCode.NewLine)`               | —                                                                                  |
| `SeHyphenPayload`       | `payload.IsMacro(MacroCode.Hyphen)`                | —                                                                                  |
| `AutoTranslatePayload`  | `payload.IsMacro(MacroCode.Fixed)`                 | Text via [`ISeStringEvaluator`](/plugin-development/sestring#evaluating-sestrings) |
| `RawPayload`            | any other `MacroCode`                              | `TryGetExpression(...)`                                                            |
| link terminator         | `payload.IsLinkTerminator()`                       | —                                                                                  |

expr 0 for `MacroCode.Link` is always the link type, but we recommend using
`TryReadLink(out var type, out var e1, out var e2, out var e3, out var e4)` for
link parsing, since it can read the entire link at once.

### Services and game objects

| API 15                                                   | API 16                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| `IChatGui.Print(XivChatEntry)`                           | `IChatGui.Print(new PrintableChatMessage { ... })`         |
| `XivChatEntry.Type` / `Name`                             | `PrintableChatMessage.LogKind` / `Sender`                  |
| `XivChatType` in `Dalamud.Game.Text`                     | `XivChatType` in `Dalamud.Game.Chat`                       |
| `BitmapFontIcon` in `Dalamud.Game.Text.SeStringHandling` | `BitmapFontIcon` in `Dalamud.Game.Text`                    |
| `AddChatLinkHandler(id, Action<uint, SeString>)`         | `AddChatLinkHandler(id, Action<DalamudLinkPayload>)`       |
| `IGameGui.OpenMapWithMapLink(MapLinkPayload)`            | `OpenMapWithMapLink(MapCoordinate)` or `(WorldCoordinate)` |
| `ICharacter.CompanyTag` (`SeString`)                     | `string`                                                   |
| `SeStringDrawResult.InteractedPayload` (`Payload?`)      | `ReadOnlySePayload?`                                       |

Chat, toast, fly text, DTR bar, context menu, name plate and party finder APIs
were refactored to use `ReadOnlySeString` (writable) or `ReadOnlySeStringSpan`
(read-only views) but are otherwise identical.

## Common operations

### Building a string

```cs
using var rssb = new RentedSeStringBuilder();

var text = rssb
    .Append("Hello ")
    .PushColorType(500)
        .Append("World")
    .PopColorType()
    .ToReadOnlySeString();
```

`ToReadOnlySeString()` copies the string, so you don't need to worry about
disposing the `RentedSeStringBuilder`. Prefer `RentedSeStringBuilder` over
`new SeStringBuilder()` in hot paths since allocating a large amount of builders
can be expensive.

Short strings can use macro strings or interpolation instead.

```cs
var a = ReadOnlySeString.FromMacroString("Hello <colortype(500)>World<colortype(0)>");
var b = ReadOnlySeString.Format($"Hello {playerName}!");
```

### Reading text

```cs
string plain = str.ToString();          // drops macros except new lines, nbsp and hyphens,
                                        // which will be converted to their UTF-8 counterpart
bool isPlain = str.IsTextOnly();        // no macros at all
bool hit = str.ContainsText("Dalamud"); // searches text payloads only
```

### Modifying a string

Iterate the payloads and copy them into a builder, and change what you need:

```cs
private void OnChatMessage(IHandleableChatMessage message)
{
    if (!message.Message.ContainsText("Dalamud"u8))
    {
        return;
    }

    message.Message = message.Message.ReplaceText("Dalamud"u8, "Dalamud!"u8);
}
```

For anything beyond text replacement, see the
[v16 chat example](/versions/v16#sestring-and-payload-classes-removed).

### Reading a link

```cs
foreach (var payload in message.Message)
{
    if (!payload.TryReadLink(out var type, out var e1, out var e2, out _, out var e4))
    {
        continue;
    }

    if (type == LinkMacroPayloadType.Character
        && e2.TryGetUInt(out var worldId)
        && e4.TryGetString(out var name))
    {
        Log.Info($"{name.ToString()} @ {worldId}");
    }
}
```

### Plugin chat links

```cs
var link = chatGui.AddChatLinkHandler(0, payload => OpenMainUi());

using var rssb = new RentedSeStringBuilder();
chatGui.Print(rssb
    .PushDalamudLink(link)
        .Append("Click me")
    .PopLink()
    .ToReadOnlySeString());
```

The handler receives the clicked `DalamudLinkPayload`and includes `Extra1`,
`Extra2` and `ExtraString`.

### Map links

Map link helpers take a position struct from `Dalamud.Utility` instead of loose
IDs and floats:

| Type              | Space                          | X         | Y           | Z                                                 |
| ----------------- | ------------------------------ | --------- | ----------- | ------------------------------------------------- |
| `MapCoordinate`   | map, as shown in game (`19.5`) | east-west | north-south | height as shown in game, can be left null to hide |
| `WorldCoordinate` | world, like a game `Vector3`   | east-west | height      | north-south                                       |

Both also have the territory, map and instance IDs needed to show in the link.
If you don't set a map id, the default map of the territory is looked up before
formatting the string. `MapCoordinate.Z` is `null` in territories that show no
height, such as cities, which is also respected by the world coordinate when
passed.

:::note

The two types order their axes differently, since XIV uses a Y-up coordinate
system. `MapCoordinate.Y` is `WorldCoordinate.Z`, and height is
`MapCoordinate.Z` but `WorldCoordinate.Y`.

:::

| API 15                                                                    | API 16                                                                        |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `CreateMapLink(territoryId, mapId, xCoord, yCoord)`                       | `CreateMapLink(new MapCoordinate(territoryId, mapId, xCoord, yCoord))`        |
| `CreateMapLinkWithInstance(territoryId, mapId, instance, xCoord, yCoord)` | `new MapCoordinate(territoryId, mapId, xCoord, yCoord, instanceId: instance)` |
| `CreateMapLink(territoryId, mapId, rawX, rawY)`                           | Lumina `PushLinkMapPosition(territoryId, mapId, rawX, rawY)` … `PopLink()`    |
| `CreateMapLink(placeName, xCoord, yCoord)`                                | Removed and needs to be done via territory and map IDs                        |
| `gameObject.GetMapCoordinates()` (`MapUtil`)                              | `gameObject.GetMapCoordinate()` or `GetWorldCoordinate()`                     |

`SeString.CreateMapLink` and `PushMapLink` accept `IGameObject`, `MapCoordinate`
or `WorldCoordinate`. `CreateMapLink` also accepts a `Level` row to make linking
things easier. Both coordinate types have `ToMapLink()`. A `MapCoordinate`
without `Z` creates a link without height component. To open the map at a
position instead, pass either coordinate type to`IGameGui.OpenMapWithMapLink`.

```cs
// Map coordinates as shown in game
chatGui.Print(new MapCoordinate(territoryId, mapId, 19.5f, 22.1f).ToMapLink());

// Current position of an object
chatGui.Print(SeString.CreateMapLink(gameObject));

// Position from the Level sheet
chatGui.Print(SeString.CreateMapLink(levelRow));
```

### Rendering in ImGui

Pass the string to `ImGuiHelpers.SeStringWrapped()`. Please see
[Rendering SeStrings in ImGui](/plugin-development/sestring#rendering-sestrings-in-imgui).
