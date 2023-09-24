# AddonEventManager

This service provides a manager for adding and removing custom events from the native game ui. 
These events are tracked and managed by Dalamud and automatically removed if your plugin unloads or if the addon they are attached to is unloaded.

When adding events you will be given a handle to that event, you'll need that handle to manually unregister that event.

## Provided Interface
```cs
public interface IAddonEventManager
{
    public delegate void AddonEventHandler(AddonEventType atkEventType, nint atkUnitBase, nint atkResNode);

    IAddonEventHandle? AddEvent(nint atkUnitBase, nint atkResNode, AddonEventType eventType, AddonEventHandler eventHandler);

    void RemoveEvent(IAddonEventHandle eventHandle);

    void SetCursor(AddonCursorType cursor);

    void ResetCursor();
}
```

## Registering Events
When registering events you need to provide the pointer to the addon (AtkUnitBase*),
and a pointer to an node (AtkResNode*), along with what event you want to trigger it, and your delegate.

*You must register a `Node` for events, you can not register a `Component`, attempting to register the address of a `Component` will result in a crash.*

You may need to modify the nodeflags to allow that node to respond to events.

This system pairs very well with the IAddonLifecycle service, to allow you to register events when an addon is setup easily.

```cs
// Register listener for MonsterNote setup
AddonLifecycle.RegisterListener(AddonEvent.PostSetup, "MonsterNote", OnPostSetup);

// PostSetup for MonsterNode provided by AddonLifecycle
private void OnPostSetup(AddonEvent type, AddonArgs args)
{
    var addon = (AtkUnitBase*) args.Addon;

    var targetNode = addon->GetNodeById(22);

    targetNode->NodeFlags |= NodeFlags.EmitsEvents | NodeFlags.RespondToMouse | NodeFlags.HasCollision;

    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOver, TooltipHandler);
    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOut, TooltipHandler);
}

private void TooltipHandler(AddonEventType type, IntPtr addon, IntPtr node)
{
    var addonId = ((AtkUnitBase*) addon)->ID;
    
    switch (type)
    {
        case AddonEventType.MouseOver:
            AtkStage.GetSingleton()->TooltipManager.ShowTooltip(addonId, (AtkResNode*)node, "This is a tooltip.");
            break;

        case AddonEventType.MouseOut:
            AtkStage.GetSingleton()->TooltipManager.HideTooltip(addonId);
            break;
    }
}
```

The result of this example code is the text node containing the class of the current selected hunting log will show a tooltip when moused over.

![image](https://github.com/goatcorp/dalamud-docs/assets/9083275/0b859b62-085c-4879-9316-2136232a3fc5)

## Unregistering Events
For events added to non-persistent addons (addons that setup and finalize when opened and closed) they do not need to be manually removed 
as the system will automatically untrack and remove any registered events when an addon closes.

For any events added to persistent addons (addons that are always present, such as "_BagWidget", "NamePlate"), you need to save the event handle returned from AddEvent and use that to unregister your events.

All registered events are automatically removed from native when your plugin unloads.

Here is an example of saving and removing your event handles.

```cs
// Class members
IAddonEventHandle MouseOver;
IAddonEventHandle MouseOut;

// Register listener for MonsterNote setup
AddonLifecycle.RegisterListener(AddonEvent.PostSetup, "MonsterNote", OnPostSetup);

// PostSetup for MonsterNode provided by AddonLifecycle
private void OnPostSetup(AddonEvent type, AddonArgs args)
{
    var addon = (AtkUnitBase*) args.Addon;

    var targetNode = addon->GetNodeById(22);

    targetNode->NodeFlags |= NodeFlags.EmitsEvents | NodeFlags.RespondToMouse | NodeFlags.HasCollision;

    MouseOver = EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOver, TooltipHandler);
    MouseOut = EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOut, TooltipHandler);
}

private void UnregisterEvents()
{
    EventManager.RemoveEvent(MouseOver);
    EventManager.RemoveEvent(MouseOut);
}
```

## Cursor API
This service also provides access to functions to change the game cursor icon.

This is useful to indicate to your users that an element can be clicked on to trigger an on-click event.

```cs
// Register listener for MonsterNote setup
AddonLifecycle.RegisterListener(AddonEvent.PostSetup, "MonsterNote", OnPostSetup);

// PostSetup for MonsterNode provided by AddonLifecycle
private void OnPostSetup(AddonEvent type, AddonArgs args)
{
    var addon = (AtkUnitBase*) args.Addon;

    var targetNode = addon->GetNodeById(22);

    targetNode->NodeFlags |= NodeFlags.EmitsEvents | NodeFlags.RespondToMouse | NodeFlags.HasCollision;
    
    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOver, OnClickHandler);
    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOut, OnClickHandler);
    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseClick, OnClickHandler);
}

private void OnClickHandler(AddonEventType type, IntPtr addon, IntPtr node)
{
    switch (type)
    {
        case AddonEventType.MouseOver:
            EventManager.SetCursor(AddonCursorType.Clickable);
            break;

        case AddonEventType.MouseOut:
            EventManager.ResetCursor();
            break;
        
        case AddonEventType.MouseClick:
            // Do custom click logic here.
            break;
    }
}
```

The result of this example code is the text node containing the class of the current selecting hunting log will trigger your function when clicked on, and changes the game cursor to indicate it is clickable.

![image](https://github.com/goatcorp/dalamud-docs/assets/9083275/78566abc-1f03-41cf-8973-dc3d3186b717)

## Logging
Whenever events are added or removed they are logged to `AddonEventManager` under the verbose logging channel, this can be very useful to see what is happening to your events

![image](https://github.com/goatcorp/dalamud-docs/assets/9083275/77cb00ed-e5ea-4219-82fa-ce22b92a41ad)
