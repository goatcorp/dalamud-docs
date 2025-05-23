# Expanding On Game Events

A plugin may wish to be informed of a certain event happening in the game. If an
event or appropriate callback does not exist within Dalamud, there are a few
strategies that plugins may employ to be informed of that event.

## Polling

Perhaps the simplest (albeit likely not the most _efficient_) way of being
informed of a specific change is to just watch for that change. For example, a
plugin that wants to watch for a change to the player's health can use something
similar to the following snippet:

```csharp
public class HealthWatcher : IDisposable {
    private uint _lastHealth;

    public HealthWatcher() {
        Services.Framework.Update += this.OnFrameworkTick;
    }

    public void Dispose() {
        // Remember to unregister any events you create!
        Services.Framework.Update -= this.OnFrameworkTick;
    }

    private void OnFrameworkTick(IFramework framework) {
        var player = Services.ClientState.LocalPlayer;

        if (player == null) return; // Player is not logged in, nothing we can do.
        var currentHealth = player.CurrentHp;

        if (currentHealth == this._lastHealth) return;  // Nothing happened we care about, return.

        this._lastHealth = currentHealth;
        Services.PluginLog.Information("The player's health has updated to {health}.", currentHealth);
    }
}
```

The above snippet creates an event handler that runs once per framework tick
(once every frame). In each frame, the `OnFrameworkTick()` method will check
that a player exists, and compares their HP to a cached value. If the player's
HP differs from the cached value, it will dispatch a message to the Plugin Log.

:::tip

It is always a good idea to unregister your events when you're done with them!
The above snippet does this through the `Dispose()` method, which is intended to
be called by whatever created this method.

Failing to unregister events when they're no longer necessary means that code
will _still be called_, and may cause unexpected behavior. As a rule of thumb,
for every event you subscribe to with `+=`, you need to have a `-=` somewhere
else.

:::

Of course, the above snippet and concept can be adapted freely. Plugins can
watch for events by checking something every second if that better suits their
requirements, and the check code can be (almost) anything: devs can read from
Client Structs provided APIs, call game methods, or any sort of calculation
that's necessary.

## Hooking Functions

Sometimes, though, it may be undesirable to run code every frame. This may be
because something happens relatively rarely, or there isn't a good way to poll
for a specific thing happening. When this is the case, a plugin can set up a
"hook". When a plugin creates a hook against a method in the game's code, that
hook will be called _instead of_ the game's original function, allowing a plugin
to observe, mutate, or even cancel the execution of that method.

:::warning

It is important to note that hooking is a _highly invasive_ operation! You are
substituting out the game's code for your own, which requires certain levels of
care to be taken. For example, if the code inside your hook throws an exception,
you will most likely crash the game. Be sure you are properly handling/managing
exceptions that your code may raise.

In most cases, hooks are also _blocking_ and will prevent the game from
executing until they return. Ensure that any code inside a hook is reasonably
performant and won't cause unnecessary delays.

:::

Dalamud provides everything necessary for a plugin to create a hook, making the
affair pretty simple. For example, a plugin that wants to be informed when any
macro changes might hook RaptureMacroModule's `SetSavePendingFlag`:

```csharp
// Grab the delegate from ClientStructs rather than declaring it ourselves.
using SetSavePendingDelegate = RaptureMacroModule.Delegates.SetSavePendingFlag;

public unsafe class MyHook : IDisposable {
    private readonly Hook<SetSavePendingDelegate>? _macroUpdateHook;

    public MyHook() {
        this._macroUpdateHook = Services.GameInteropProvider.HookFromAddress<SetSavePendingDelegate>(
            RaptureMacroModule.MemberFunctionPointers.SetSavePendingFlag,
            this.DetourSetSavePending
        );

        this._macroUpdateHook.Enable();
    }

    public void Dispose() {
        // While this *likely* wouldn't be null, it's still good practice to use nullability checks just in case
        // this wasn't initialized somehow.
        this._macroUpdateHook?.Dispose();
    }

    private void DetourSetSavePending(RaptureMacroModule* self, bool needsSave, uint set) {
        Services.PluginLog.Information("A macro save happened!");

        try {
            // your plugin logic goes here.
        } catch (Exception ex) {
            Services.PluginLog.Error(ex, "An error occured when handling a macro save event.");
        }

        // We're intentionally suppressing nullability checks. You can only get to this code if the hook exists.
        // There's no way this can ever be null.
        this._macroUpdateHook!.Original(self, needsSave, set);
    }
}
```

:::tip

Did you notice that the method is called `HookFromAddress`? This method can be
used to grab an address from any source you want. This can be useful if you'd
rather use SigScanner!

:::

This can also be done with a direct signature via `IGameInteropProvider`, if the
function being hooked is not within Client Structs:

```csharp
public unsafe class MySiggedHook : IDisposable {
    // This method isn't in CS (in theory), so we need to declare our own delegate.
    private delegate void SetSavePendingDelegate(RaptureMacroModule* self, bool needsSave, uint set);

    [Signature("45 85 C0 75 04 88 51 3D", DetourName = nameof(DetourSetSavePending))]
    private Hook<SetSavePendingDelegate>? _macroUpdateHook;

    public MySiggedHook() {
        Services.GameInteropProvider.InitializeFromAttributes(this);

        // Nullable because this might not have been initialized from IFA above, e.g. the sig was invalid.
        this._macroUpdateHook?.Enable();
    }

    public void Dispose() {
        this._macroUpdateHook?.Dispose();
    }

    private void DetourSetSavePending(RaptureMacroModule* self, bool needsSave, uint set) {
        Services.PluginLog.Information("A macro save happened!");

        try {
            // your plugin logic goes here.
        } catch (Exception ex) {
            Services.PluginLog.Error(ex, "An error occured when handling a macro save event.");
        }

        this._macroUpdateHook!.Original(self, needsSave, set);
    }
}
```

Both of these examples more or less follow the same pattern, with only a few
semantic differences depending on how the actual hook is created. Pay special
attention to the `delegate` representing the method in question. When
interacting with the ClientStructs-backed method, we use the ClientStructs
declared delegate in order to prevent duplicating code and definitions. For the
signature variant, however, we need to declare our own delegate. In all cases,
the delegate used _must_ have the expected return type and arguments, and the
detour method _must_ match the delegate appropriately.

Like polling, hooks must be properly disposed when they are no longer needed. If
they are not, the detour function will continue to run in place of the hooked
function and may cause problems or confusing behavior. There have been many
cases where confused plugin devs asked for help only to realize that their old
hooks were still in effect!

Because multiple plugins may hook a single method (or one plugin may hook the
same method multiple times!), it's generally best practice to not modify
arguments or interrupt the execution flow. While there are many valid exceptions
to this rule, it is important to be aware that other hooks may be present, and
may run before or after the hook you create. Hook order is determined by inverse
load order, meaning the last plugin to enable a hook will receive control of the
execution flow first.
