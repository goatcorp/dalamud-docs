# AddonLifecycle

This service provides you very easy access to various states and state changes
for `Addons`.

The primary goal of this service is to make it easy to modify the native ui, or
get data from addons without needing to reverse engineer and subsequently hook
each and every addon that you need to interact with.

Sometimes an addon doesn't implement its own Draw or other functions, which
makes it quite challenging to hook something that will trigger when you need to
trigger your code.

This service allows you to listen for any addons events by name, no addresses
required.

## Provided Interface

```cs
public interface IAddonLifecycle
{
    public delegate void AddonEventDelegate(AddonEvent type, AddonArgs args);

    void RegisterListener(AddonEvent eventType, IEnumerable<string> addonNames, AddonEventDelegate handler);
    void RegisterListener(AddonEvent eventType, string addonName, AddonEventDelegate handler);
    void RegisterListener(AddonEvent eventType, AddonEventDelegate handler);

    void UnregisterListener(AddonEvent eventType, IEnumerable<string> addonNames, [Optional] AddonEventDelegate handler);
    void UnregisterListener(AddonEvent eventType, string addonName, [Optional] AddonEventDelegate handler);
    void UnregisterListener(AddonEvent eventType, [Optional] AddonEventDelegate handler);

    void UnregisterListener(params AddonEventDelegate[] handlers);
}
```

## Registering Events

You register for event by specifying which event you want, and then optionally
specifiying by name which addons you want to listen for.

If no addon names are provided then the service will send you notifications for
**all** addons. It's generally recommended to specify which addons you want.

```cs
AddonLifecycle.RegisterListener(AddonEvent.PreDraw, "FieldMarker", OnPreDraw);
AddonLifecycle.RegisterListener(AddonEvent.PostUpdate, "FieldMarker", OnPostUpdate);
AddonLifecycle.RegisterListener(AddonEvent.PostDraw, new[] { "Character", "FieldMarker", "NamePlate" }, OnPostDraw);
```

## Unregistering Events

You have a couple options for unregistering, you can unregister using the same
syntax as you registered with, or you can unregister the functions directly
without needing to specify which events or addons you want to unregister.

```cs
AddonLifecycle.UnregisterListener(AddonEvent.PostDraw, new[] { "Character", "FieldMarker", "NamePlate" }, OnPostDraw);
AddonLifecycle.UnregisterListener(OnPreDraw, OnPostUpdate);
```

## Available Events

This service provides several events you can listen for, documented in the
[`AddonEvent`][] enum.

[`AddonEvent`]: /api/Dalamud.Game.Addon.Lifecycle/Enums/AddonEvent/

Each of these events are used in a Pre or Post listener, for example if you want
to be notified _right before_ an addon is about to do a refresh, you can
subscribe to **PreRefresh**.

_Note: There is no PostFinalize event provided. That would be after the addon
has been freed from memory. If you have a valid usecase for needing a
PostFinalize event let us know._

## Available Data

When your delegate is called, it is passed an AddonArgs object, this can be cast
to a more specific object to get the argument data used in the original call.

Each of the events have their own specific implementation of AddonArgs with the
argument data available. If you are unsure what type of AddonArgs you have,
there's a `Type` property you can check.

For example:

```cs
private void OnPostSetup(AddonEvent type, AddonArgs args)
{
    if (args is AddonSetupArgs setupArgs)
    {
        var valueCount = setupArgs.AtkValueCount;
        var values = (AtkValue*) setupArgs.AtkValues;
        var valueSpan = setupArgs.AtkValueSpan;
    }
}
```
