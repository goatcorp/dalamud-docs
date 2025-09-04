---
sidebar_position: 2
---

# Calling The Game's Code

Sometimes, it is beneficial to ask the game itself to do something, rather than
doing it yourself. In effect, this means using the game code as a library where
any arbitrary function can be called and their results used freely. This allows
plugins to perform calculations in the same way the game does, or otherwise take
actions in the game just as it would if Dalamud weren't even there.

For example, a plugin might want to check if the player is a mentor:

```csharp
public unsafe bool IsPlayerMentor() {
    var playerStatePtr = PlayerState.Instance();
    return playerStatePtr->IsMentor();
}
```

This method will grab the instance of `PlayerState` from Client Structs, and
call the appropriate check.

## Making Your Own Delegates

Sometimes, a method you're interested in might not be in Client Structs. When
this happens, a developer can engage their reverse engineering prowess to
generate a signature, which they can then use to create their own delegate:

```csharp
public class GameFunctions {
    private delegate byte IsQuestCompletedDelegate(ushort questId);

    [Signature("E8 ?? ?? ?? ?? 41 88 84 2C")]
    private readonly IsQuestCompletedDelegate? _isQuestCompleted = null;

    public GameFunctions() {
        Services.GameInteropProvider.InitializeFromAttributes(this);
    }

    public bool IsQuestCompleted(ushort questId) {
        if (this._isQuestCompleted == null)
            throw new InvalidOperationException("IsQuestCompleted signature wasn't found!");

        return this._isQuestCompleted(questId) > 0;
  }
}
```

This is a lot of code, so let's break it down a bit.

First, the developer declares a [delegate][delegate-doc] for the function they
want to call. This informs the compiler and the code of the return type (in this
case, a `byte`), as well as the arguments of the function. This line alone is
purely declaratory, and has no impact other than definition. If a specific
argument is a reference to an undocumented pointer (or the developer simply
doesn't care about accessing any data inside the struct target), the `nint` type
will often be used.

Next, the developer declares a nullable _instance_ of that delegate, with its
default value set to `null`. This instance is then marked with the
`[Signature(string signature)]` attribute. This attribute is provided by
Dalamud's game interop systems and specifies the signature that identifies the
function we're interested in.

Then, the class's constructor has a call to
`IGameInteropProvider#InitializeFromAttributes`. This method will scan the
referenced object (in this case, `this`) and use reflection to find all class
members with the `[Signature()]` tag. It will then automatically resolve the
signature and inject the proper pointer into that variable. If a signature was
unable to be resolved, the delegate instance will be set to `null` for handling
by the developer.

Lastly, the `IsQuestCompleted()` method is defined. This exists in "managed
code" (so, in C#) and provides some ease of use around the raw method. For
example, our method will throw an exception if the delegate is null and will
convert the returned `byte` into a `bool`. These wrapper methods are generally
often kept simple, but will also often hold important safety or sanity checks to
ensure that there's a clean bridge between C# and the game's native code.

[delegate-doc]:
  https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/
[unmanaged-doc]:
  https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/unmanaged-types

### Another Way To Delegate

While looking at some plugins, you may instead notice a pattern that looks
slightly different:

```csharp
[Signature("E8 ?? ?? ?? ?? 41 88 84 2C")]
private readonly delegate* unmanaged<ushort, byte> _isQuestCompletedDelegate;
```

This is a shorter (but arguably slightly more complex) way of addressing the
same concept. Instead of having to declare the delegate and other information
ahead of time, all the information about the delegate's arguments and return
value is included up front in the `unmanaged<>` segment. The
[`unmanaged`][unmanaged-doc] keyword means that this function is not part of the
plugin's C# code, but instead comes from a lower level. The part inside the `<>`
denotes the function's arguments and return type. The return type is always the
_last_ type in the list, and all others are argument types, in the same order as
the arguments. For example, `<uint, string, byte>` is a function like
`MyFunction(uint someNumber, string someString)` that returns a `byte`.
Everything else behaves as it does above, including nullability.

### Delegating With `SigScanner`

Sometimes, developers may not want to use the `[Signature]` attribute for one
reason or another. While it's generally best to use it, it may be too inflexible
or just not appropriate for a specific use case. In these cases, developers may
instead use `SigScanner` service to resolve their signatures directly. This is
normally combined with the above method of defining signatures:

```csharp
public class SomeSigWrapper {
    private readonly delegate* unmanaged<ushort, byte> _isQuestCompletedDelegate;

    public SomeSigWrapper() {
        var fptr = Services.SigScanner.ScanText("E8 ?? ?? ?? ?? 41 88 84 2C");
        this._isQuestCompletedDelegate = (delegate* unmanaged<ushort, byte>) fptr;
    }
}
```

The above code will scan the .text section (the portion of a PE32 binary that
normally contains code) for the specified signature, throwing an exception if it
cannot be found. The alternate `TryScanText` method will return a boolean `true`
or `false` depending on if the signature was resolved. After the signature has
been found and resolved to an address, it is cast to the appropriate function
pointer type, and assigned to the delegate. It may then be called in code
elsewhere, usually through a wrapper method like the one demonstrated above.

Some developers will combine this with something called the "Resolver" pattern,
where a class is dedicated to just resolving these addresses, which are used
elsewhere. This is less of a thing in newer plugins, but is still relevant
enough to worth mentioning here.
