---
sidebar_position: -16
---

# What's New in Dalamud v16

:::warning[Not finalized]

This version is not finalized, and all details here are subject to change.

:::

Dalamud v16 is the next major version of Dalamud, currently in development, and
will release with Patch 8.0.  
This is a high-level overview of changes. You can see a code diff of all of
these changes
[here](https://github.com/goatcorp/Dalamud/compare/master...api16).

## Key Information

- **Branch:** `api16`
  ([view on GitHub](https://github.com/goatcorp/Dalamud/tree/api16))
- **Release Date:** TBA
- **API Level:** 16
- **.NET Version:** .NET 10.0.0 (to be upgraded to .NET 11 when it releases)

## Major Changes

### SeString and Payload classes removed

The mutable `SeString` class and its associated Payload classes have been
removed. All Dalamud APIs now use the immutable `ReadOnlySeString` or
`ReadOnlySeStringSpan` structs to improve memory efficiency and to provide a
modern implementation that propertly supports the type.

Because `ReadOnlySeString` is immutable, its contents cannot be modified
directly. To alter an existing string, instantiate a `SeStringBuilder`, iterate
through the payloads of the original string, and append or modify the payloads
as needed to produce a new `ReadOnlySeString`.

To eliminate unnecessary heap allocations please rent a pooled `SeStringBuilder`
instance using
[`RentedSeStringBuilder`](https://github.com/goatcorp/Dalamud/blob/master/Dalamud/Utility/RentedSeStringBuilder.cs),
which automatically returns to the shared `ObjectPool` when disposed.

<details>
<summary><b>Example: Modifying Chat Messages</b></summary>

The following example demonstrates how to intercept a chat message, search for a
target text sequence (`"Dalamud"`), and wrap it in color macros using
`RentedSeStringBuilder`:

```cs
public class ExampleChatHandlerClass : IDisposable
{
    private readonly IChatGui _chatGui;

    public ExampleChatHandlerClass(IChatGui chatGui)
    {
        _chatGui = chatGui;
        _chatGui.ChatMessage += OnChatMessage;
    }

    public void Dispose()
    {
        _chatGui.ChatMessage -= OnChatMessage;
    }

    private void OnChatMessage(IHandleableChatMessage message)
    {
        // Skip processing if the message does not contain the target text
        if (!message.Message.ContainsText("Dalamud"u8))
            return;

        using var rssb = new RentedSeStringBuilder();

        foreach (var payload in message.Message)
        {
            if (payload.Type == ReadOnlySePayloadType.Text && payload.Body.Span.IndexOf("Dalamud"u8) is var pos && pos != -1)
            {
                // Append text before Dalamud
                rssb.Append(payload.Body.Span[..pos]);

                // Append Dalamud wrapped in color macros
                rssb.PushEdgeColorType(701)
                    .PushColorType(539)
                    .Append("Dalamud"u8)
                    .PopColorType()
                    .PopEdgeColorType();

                // Append text after Dalamud
                rssb.Append(payload.Body.Span[(pos + "Dalamud"u8.Length)..]);
            }
            else
            {
                // Append every other payload as-is
                rssb.Append(payload);
            }
        }

        // Set the new message
        message.Message = rssb.ToReadOnlySeString();
    }
}
```

</details>

<details>
<summary><b>Example: Extracting Item Link Details from a Chat Messages</b></summary>

The following example demonstrates how to inspect a chat message to extract an
item ID from an item link:

```cs
public class ExampleChatHandlerClass : IDisposable
{
    private readonly IChatGui _chatGui;
    private readonly IPluginLog _pluginLog;

    public ExampleChatHandlerClass(IChatGui chatGui, IPluginLog pluginLog)
    {
        _chatGui = chatGui;
        _pluginLog = pluginLog;
        _chatGui.ChatMessage += OnChatMessage;
    }

    public void Dispose()
    {
        _chatGui.ChatMessage -= OnChatMessage;
    }

    private void OnChatMessage(IHandleableChatMessage message)
    {
        foreach (var payload in message.Message)
        {
            if (!payload.IsLink(LinkMacroPayloadType.Item))
                continue;

            if (!payload.TryGetExpression(out _, out var eItemId))
                continue;

            // Chat messages do not contain placeholder, parameter or binary expressions,
            // so reading the raw value here is perfectly fine.
            if (!eItemId.TryGetUInt(out var itemId))
                continue;

            var (baseItemId, itemKind) = ItemUtil.GetBaseId(itemId);

            _pluginLog.Debug("Found Item#{itemId} as {itemKind}", baseItemId, itemKind);

            break;
        }
    }
}
```

</details>

<details>
<summary><b>Example: Extracting Item Id from a LogMessage</b></summary>

The following example demonstrates how to inspect a chat message to extract an
item ID from a specific log message.

The goal of this example is to retrieve item information from a looted item.

Specifically, this example looks for `LogMessage#1053`. This ID was found by
logging incoming message IDs during item looting and referencing the payload
structure via [EXDViewer/LogMessage](https://xiviewer.app/sheet/LogMessage).

Note: `LogMessage#1053` specifically represents the popup text message you see
on your screen, if you need to track other looting messages, you must discover
which specific `LogMessage` ID you actually need.

While a `LogMessage`'s text varies depending on the client language, as long as
the payload exists in all languages this provides a consistent and powerful way
to extract data:

- **EN:** `You obtain <kilo(lnum2,\,)> <ennoun(Item,3,lnum1,lnum2,1)>.`
- **JP:** `<sheet(Item,lnum1,0)>`
- **DE:** `<head(<denoun(Item,5,lnum1,1,1,1)>)>`
- **FR:** `<head(<frnoun(Item,1,lnum1,1,1)>)>`

The [`ennoun`](https://dalamud.dev/plugin-development/sestring#macro-ennoun)
macro defines how an item is parsed from the item sheet. By examining its
payload parameter, we can see that the third parameter of `ennoun` corresponds
to the item ID (`itemId`).

To retrieve the item ID from the payload string, we need to parse `lnum1`, which
is the 0th integer parameter of the message. We can extract it as follows:

```cs
public class ExampleChatHandlerClass : IDisposable
{
    private readonly IChatGui _chatGui;
    private readonly IPluginLog _pluginLog;
    private readonly IDataManager _dataManager;

    public ExampleChatHandlerClass(IChatGui chatGui, IPluginLog pluginLog, IDataManager dataManager)
    {
        _chatGui = chatGui;
        _pluginLog = pluginLog;
        _dataManager = dataManager;
        _chatGui.LogMessage += OnLogMessage;
    }

    public void Dispose()
    {
        _chatGui.LogMessage -= OnLogMessage;
    }

    private void OnLogMessage(ILogMessage message)
    {
        if (message.LogMessageId is not 1053)
            return;

        if (!message.TryGetIntParameter(0, out var itemId))
            return;

        if (itemId is 0)
            return;

        var itemInfo = _dataManager.GetExcelSheet<Item>().GetRow((uint) itemId);

        _pluginLog.Debug($"Found Item {itemInfo.Name}");
    }
}
```

</details>

For more information read [Migrating to ReadOnlySeString](sestring.md).

For a deeper dive into SeString structure and macros, please have a look at our
[SeString](/plugin-development/sestring) documentation.

### Dalamud.Excel.Sheets

Instead of providing sheets through the `Lumina.Excel.Sheets` namespace, Dalamud
now provides them through its own namespace `Dalamud.Excel.Sheets`.

**Reason:** The `Lumina.Excel.Sheets` namespace was generated from an EXDSchema
commit pinned at the start of a major game patch. To provide a stable API for
Dalamud and its plugins, sheet definitions were not updated even when a minor
game patch introduced column changes, rendering affected sheets unusable until
the next major API bump.

To prevent this, Dalamud and Lumina.Excel now operate independently:

- `Dalamud.Excel.Sheets` maintains API stability until a major release, while
  allowing us to fix column definitions whenever they are needed.
- `Lumina.Excel` has dropped the `Lumina.Excel.Sheets.Experimental` namespace to
  make it the new default and now publishes NuGet updates more frequently with
  sheets generated from the latest EXDSchema.

This change also allows plugin developers to add the `Lumina.Excel` package as
PackageReference whenever they want full control over sheet updates.

### New Features

### Changes to existing features

## Minor Changes

- The `On` prefix was removed from event names and delegates.
- Events using `EventHandler<T>` were changed to `Action<T>`, dropping the
  `sender` arg.
- Properties and events in `IClientState` now use the appropiate `RowRef<T>`
  type, instead of using the RowId.  
  **Important:** Please make sure to compare the `RowId` property now, not the
  `RowRef<T>` itself.
- `IGameGui.HoveredItem` and its event `HoveredItemChanged` now correctly use
  `uint` instead of `ulong` for the Item Id.
- MinHook was removed during API 15, so the `HookBackend` parameter has now been
  removed from all `IGameInteropProvider` functions.
- FASM support was removed during API 15, so the `string[]` overload of the
  AsmHook constructor has now been removed.
- Map links are built from the new `MapCoordinate` and `WorldCoordinate` structs
  and `MapUtil.GetMapCoordinates(IGameObject, bool)` was removed. `IGameObject`
  gained `GetMapCoordinate()` and `GetWorldCoordinate()` instead.
  `IGameGui.OpenMapWithMapLink` also accepts both structs. See
  [Map links](sestring.md#map-links).

### Namespace Changes

- `Lumina.Excel.Sheets` → `Dalamud.Excel.Sheets`, unless you use the
  Lumina.Excel NuGet package.
- `Dalamud.Game.Network.Structures` →
  `Dalamud.Game.Marketboard.Network.Structures`
- `Dalamud.Game.ClientLanguage` was moved to `Dalamud.Common.ClientLanguage`.
- `IDragDropManager` and `IDalamudAssetManager` have been moved into the
  `Dalamud.Plugin.Services` namespace.

<!--
## SDK & Packages

We have released new packages of the SDK and DalamudPackager for this Dalamud
API version.

- [Dalamud.NET.Sdk v16.0.0](https://www.nuget.org/packages/Dalamud.NET.Sdk/16.0.0)
  - To upgrade, change the header of your plugins' `.csproj` file:
    `<Project Sdk="Dalamud.NET.Sdk/16.0.0">`
- [DalamudPackager v16.0.0](https://www.nuget.org/packages/DalamudPackager/16.0.0)
  - You don't need to reference DalamudPackager manually if you use
    Dalamud.NET.Sdk, it is done for you.

## Known Issues

## Contributors

We want to thank TODO.

## FFXIVClientStructs Changes

FFXIVClientStructs will introduce their own breaking changes for Patch 8.0,
which will be documented
[on their docs page](https://ffxiv.wildwolf.dev/docs/breaking/8.0.html).

We want to thank aers, Caraxi, Haselnussbomber, Pohky, WildWolf and the other
FFXIVClientStructs contributors for their work.
-->
