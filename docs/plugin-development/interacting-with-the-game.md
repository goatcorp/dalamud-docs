# Interacting With The Game

Virtually any plugin will eventually want to interact with the game itself in some capacity, be it to respond to certain
events or to make decisions depending on what's happening in the game. This can take a few different paths, each
depending on a developer's intent and what they want to do.

In general, developers are encouraged to use the following priority for game-based interactions:

1. Where possible, use Dalamud provided APIs to interact with the game. These are generally the safest way to work with
   the game, and provides stable APIs that won't change outside of API bumps. The Dalamud APIs also may wrap or 
   abstract away complex or annoying concepts into simpler to use patterns, as well as provide certain protections to
   ensure that invalid data doesn't affect the game as much. These methods tend to be well-documented and are easy to 
   work with.
2. If the Dalamud API does not expose the behavior required, developers can consume the Client Structs project. This is
   shipped with Dalamud and effectively allows plugins to use the game as a library. It provides relatively easy access
   to the game's code and structures, although it will often use pointers and other unsafe code, so developers are 
   responsible for their own safety.
3. If the Client Structs project does not expose the requisite behavior, Dalamud offers escape hatches in the form of
   the ability to work with raw memory and raw functions, allowing plugins to read information from undocumented
   structures and call or hook methods using their signatures or other references.

Most plugins will stay firmly in the realm of stages 1 and 2, with stage 3 being used for novel concepts that have yet
to be [reverse engineered](reverse-engineering.md) or fully understood. Where possible, plugin developers who do
reverse engineering as part of their plugin development are encouraged to contribute their findings back to the Client
Structs project, so that other developers may use them in the future.

This document page won't explain how to use Dalamud-provided APIs to interact with the game, as they're all otherwise
documented and hopefully accessible. Instead, this document will focus on the more advanced concepts; that is, where 
the Dalamud API doesn't quite reach.

## I Want To Do That!

Sometimes, it is beneficial to ask the game itself to do something, rather than doing it yourself. In effect, this 
means using the game code as a library where any arbitrary function can be called and their results used freely. This
allows plugins to perform calculations in the same way the game does, or otherwise take actions in the game just as 
it would if Dalamud weren't even there.

For example, a plugin might want to check if the player is a mentor:

```csharp
public unsafe bool IsPlayerMentor() {
    var playerStatePtr = PlayerState.Instance();
    return playerStatePtr->IsMentor();
}
```

This method will grab the instance of `PlayerState` from Client Structs, and call the appropriate check. 

### Making Your Own Delegates

Sometimes, a method you're interested in might not be in Client Structs. When this happens, a developer can engage
their reverse engineering prowess to generate a signature, which they can then use to create their own delegate:

```c#
public unsafe class GameFunctions {
  [Signature("E8 ?? ?? ?? ?? 41 88 84 2C")]
  private readonly delegate* unmanaged<ushort, byte> _isQuestCompletedDelegate;

  public GameFunctions() {
    SignatureHelper.Initialise(this);
  }
  
  public bool IsQuestCompleted(ushort questId) {
    if (this._isQuestCompletedDelegate == null) 
      throw new InvalidOperationException("IsQuestCompleted signature wasn't found!");
      
    return this._isQuestCompletedDelegate(questId) > 0;
  }
}
```

This is a lot of code, so let's break it down a bit.

First, the developer declares a class member named `_isQuestCompletedDelegate`. This is a `delegate*`, meaning it's a
pointer to a [delegate][delegate-doc]. In effect, this is a variable that can be treated like a method, and called 
later. The developer has also defined this variable to have a strange type signature: `unmanaged<ushort, byte>`. The
[`unmanaged`][unmanaged-doc] keyword means that this function is not part of the plugin's C# code, but instead comes 
from a lower level. The remaining part denotes the function's arguments and return type. The return type is always 
the *last* type in the list, and all others are argument types, in the same order as the arguments. For example, 
`<uint, string, byte>` is a function like `MyFunction(uint someNumber, string someString)` that returns a `byte`.

This delegate is then marked with the `[Signature(string signature)]` attribute. This is provided by Dalamud's
`SignatureHelper` class, and specifies the signature that identifies the function we're interested in.

Then, the class's constructor has a call to `SignatureHelper#Initialise`. This method will scan the referenced object
(in this case, `this`) and use reflection to find all class members with the `[Signature()]` tag. It will then
automatically resolve the signature and inject the proper pointer into that variable.

Lastly, the `IsQuestCompleted()` method is defined. This exists in "managed code" (so, in C#) and provides some ease
of use around the raw method. For example, our method will throw an exception if the delegate is null and will convert
the returned `byte` into a `bool`. These wrapper methods are generally often kept simple, but will also often hold
important safety or sanity checks to ensure that there's a clean bridge between C# and the game's native code.

[delegate-doc]: https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/
[unmanaged-doc]: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/unmanaged-types

## Tell Me When That Happens!

A plugin may wish to be informed of a certain event happening in the game. If an event or appropriate 
callback does not exist within Dalamud, there are a few strategies that plugins may employ to be informed of that
event. 

### Polling

Perhaps the simplest (albeit likely not the most _efficient_) way of being informed of a specific change is to just
watch for that change. For example, a plugin that wants to watch for a change to the player's health can use something
similar to the following snippet:

```csharp
public class HealthWatcher : IDisposable {
    private int? _lastHealth;
    
    public HealthWatcher() {
        Services.Framework.Update += this.OnFrameworkTick;
    }
    
    public void Dispose() {
        // Remember to unregister any events you create!
        Services.Framework.Update -= this.OnFrameworkTick;
    }
    
    private void OnFrameworkTick() {
        var player = Services.ClientState.LocalPlayer;
        
        if (player == null) return; // Player is not logged in, nothing we can do.
        if (player.CurrentHp == this._lastHealth) return;
        
        this._lastHealth = currentHealth;
        PluginLog.Information("The player's health has updated to {health}.", currentHealth);
    }
}
```

The above snippet creates an event handler that runs once per framework tick (once every frame). In each frame, 
the `OnFrameworkTick()` method will check that a player exists, and compares their HP to a cached value. If the 
player's HP differs from the cached value, it will dispatch a message to the Plugin Log. 

:::tip

It is always a good idea to unregister your events when you're done with them! The above snippet does this through the
`Dispose()` method, which is intended to be called by whatever created this method.

Failing to unregister events when they're no longer necessary (or, at the very least, on plugin unload) means that code
will *still be called*, and may cause unexpected behavior. As a rule of thumb, for every event you subscribe to with 
`+=`, you need to have a `-=` somewhere else.

:::

Of course, the above snippet and concept can be adapted freely. Plugins can watch for events by checking something
every second if that better suits their requirements, and the check code can be (almost) anything: devs can read from
Client Structs provided APIs, call game methods, or any sort of calculation that's necessary.

### Hooking Functions

Sometimes, though, it may be undesirable to run code every frame. This may be because something happens relatively 
rarely, or there isn't a good way to poll for a specific thing happening. When this is the case, a plugin can set up a
"hook". When a plugin creates a hook against a method in the game's code, that hook will be called *instead of* the
game's original function, allowing a plugin to observe, mutate, or even cancel the execution of that method.

:::warning

It is important to note that hooking is a *highly invasive* operation! You are substituting out the game's code for 
your own, which requires certain levels of care to be taken. For example, if the code inside you hook throws an 
exception, you may crash the game.

Hooks should be lean and resilient to errors.

:::

Dalamud provides everything necessary for a plugin to create a hook, making the affair pretty simple. For example, a 
plugin that wants to be informed when any macro changes might hook RaptureMacroModule's `SetSavePendingFlag`:

```csharp
public class MyHook : IDisposable {
    private delegate void SetSavePendingDelegate(RaptureMacroModule* self, byte needsSave, uint set);

    private readonly Hook<SetSavePendingDelegate>? _macroUpdateHook;
    
    public MyHook() {
        var macroUpdateFPtr = RaptureMacroModule.Addresses.SetSavePendingFlag.Value;
        this._macroUpdateHook = Hook<MacroUpdate>.FromAddress((nint) macroUpdateFPtr, this.DetourSetSavePending);
        this._macroUpdateHook.Enable();
    }
    
    public void Dispose() {
        this._macroUpdateHook.Dispose();
    }
    
    private nint DetourSetSavePending(RaptureMacroModule* self, byte needsSave, uint set) {
        PluginLog.Information("A macro save happened!");
        
        return this._macroUpdateHook.Original(self, needsSave, set);
    }
}
```

This can also be done with a direct signature via `SignatureHelper`, if the function being hooked is not within Client 
Structs:

```csharp
public class MySiggedHook : IDisposable {
    private delegate nint SetSavePendingDelegate(RaptureMacroModule* self, byte needsSave, uint set);

    [Signature("45 85 C0 75 04 88 51 3D", DetourName = nameof(DetourSetSavePending))]
    private Hook<SetSavePendingDelegate>? _macroUpdateHook;
    
    public MyHook() {
        this._macroUpdateHook?.Enable();
    }
    
    public void Dispose() {
        this._macroUpdateHook?.Dispose();
    }
    
    private nint DetourSetSavePending(RaptureMacroModule* self, byte needsSave, uint set) {
        PluginLog.Information("A macro save happened!");
    
        return this._macroUpdateHook!.Original(self, needsSave, set);
    }
}
```

Both of these examples more or less follow the same pattern, with only a few semantic differences depending on how the
actual hook is created. In all cases, however, the `delegate` representing the method in question must be defined 
properly. This delegate *must* have the expected return type, as well as any expected arguments, and the detour method
*must* match the delegate appropriately. For information about what delegates are and how they work, scroll back up.

Like polling, hooks must be properly disposed when they are no longer needed. If they are not, the detour function will
continue to run in place of the hooked function and may cause problems or confusing behavior. There have been many 
cases where confused plugin devs asked for help only to realize that their old hooks were still in effect!