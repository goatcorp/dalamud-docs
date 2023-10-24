# Reverse Engineering (For Plugin Devs)

Reverse engineering an application is difficult. Reverse engineering a massive game like Final Fantasy XIV is a lot
more difficult. There are a lot of moving parts, and opening a decompiler for the first time can be daunting to even
seasoned developers. It's very much out of scope of this documentation to teach you _how_ to reverse engineer the game,
but it can at least provide you some guidance to figure things out by yourself.

## A Primer

Fundamentally, Final Fantasy XIV is running on your machine, which means it's constantly running game code locally.
This code is responsible for communicating with the server, rendering the scene, drawing UI elements, determining what
state a player is in, and all sorts of other things. All of this happens within the game's process and memory space,
using instructions (generally, in assembly) found in the `ffxiv_dx11.exe` file located on your computer.

There is, however, a problem here: we don't have Final Fantasy XIV's source code. The final program they ship us is very
stripped down, with very little useful information present in it. To this end, the community has created and maintained
a project known as [FFXIVClientStructs](https://github.com/aers/FFXIVClientStructs), which provides a general source of
information on the game internals and provides set of C# bindings that effectively allow plugins to use the game as a
library. However, this documentation is incomplete and plugin developers will inevitably need to reverse engineer the
game itself to discover new things. Which leads us cleanly to...

## How do I reverse engineer the game?

As alluded to before, a full guide on reverse engineering the game is impossible to write. Reverse engineering is a
very complex discipline and takes many years to master. Developers with prior experience with C/C++ may have a slight
head start, but ultimately it's still a difficult puzzle to solve.

Within reverse engineering there are (at least) two major ways to interact with programs to figure out how they tick:
**Static Analysis** is when a developer reads the game's disassembled or decompiled source code, often using tools
specifically designed for the purpose; and **Dynamic Analysis**, where debuggers and memory editors are used to create
breakpoints and notify on changes to memory. Many developers will make heavy use of both of these mechanisms, as one
will often provide context to the other.

### Static Analysis

Static Analysis is the act of reading through a program's disassembled code, often using an interactive disassembler or
decompiler. There are many tools that help with this process, such as [Hex-Rays IDA][ida], [Ghidra][ghidra],
and [Binary Ninja][binja], though others exist. The vast majority of the Dalamud community will use either
IDA or Ghidra for their work, and most tooling that exists is built for one of these two tools. There's no functional
difference to either tool, so it's really up to the developer to choose which one they like more.

Once you have your disassembler installed and working (you *did* read the manual and find some online tutorials for how
to navigate it, right?), it's time to load up `ffxiv_dx11.exe` and start poking around. At this point, most developers
will load in [a few data files](https://github.com/aers/FFXIVClientStructs/tree/main/ida) and use that to explore the
program in question.

[ida]: https://hex-rays.com/
[ghidra]: https://github.com/NationalSecurityAgency/ghidra
[binja]: https://binary.ninja/

### Dynamic Analysis

Dynamic Analysis, unlike static analysis, is the act of inspecting what the code is doing *live*. This is generally
where tools like [Cheat Engine][cheat-engine], [x64dbg][x64dbg], and [ReClass.NET][reclass-net] shine. Developers will
often use these programs to find interesting memory addresses or place breakpoints on known data structures to see what
game code affects a certain location in memory.

Certain tools, such as [pohky's XivReClassPlugin](https://github.com/pohky/XivReClassPlugin) will additionally tie some
dynamic analysis tools into the ClientStructs database, allowing devs to move faster with access to more information.

[cheat-engine]: https://www.cheatengine.org/
[x64dbg]: https://x64dbg.com/
[reclass-net]: https://github.com/ReClassNET/ReClass.NET

## On Functions, Offsets, and Signatures

As alluded to before, Final Fantasy XIV is, in fact, a program. Programs, among other things, tend to follow an
execution flow starting from an *entrypoint* (the first function called), going to other functions, spanning across
threads, responding to user input, and all sorts of other things that make the game actually playable. The game will
call a certain function on a specific user action, or will use a function to fetch some relevant data or perform some
calculation for display in the UI or similar. All this to say: functions are perhaps one of the most critical concepts
to anyone exploring the game code.

Functions exist in the program's memory space, starting at a specific *offset* from the program's base address. These
function offsets uniquely identify a specific function, and are generally expressed like `ffxiv_dx11.exe+4BC200`[^1] in
decompilers and other tools, though most developers will shorten this to just `4BC200` when talking to each other.
However, function offsets are not fixed. Every individual version of the game will change all function offsets, meaning
they are effectively useless for use in plugins directly. Instead, developers will use a different (and far more
stable) unique identifier: the signature.

A *signature* is a specific series of bytes (expressed as a hexadecimal string) that uniquely identifies either the
start of a function (known as a *direct signature*) or a reference to a specific function (an *indirect signature*).
For example, take the signature `E8 ?? ?? ?? ?? 41 88 84 2C`. This string only exists once in the game's binary, and
uniquely identifies to a function that checks if the player has completed a specific quest. Because a signature refers
to a part of the binary, it is far more stable - a signature will only break if Square Enix changes the code the
signature represents, or adds new code that generates the same signature. It is not uncommon for signatures to last
multiple major patches. Signatures can either be made by hand by skilled developers, or a tool like
[Caraxi's SigMaker-x64](https://github.com/Caraxi/SigMaker-x64) can be used to automatically generate one.

### Using Game Functions

There are two major ways that a developer can use a function: creating a hook to intercept a function, or creating a
delegate to use that function from their plugin.

Developers will use hooks when they want to intercept, modify, cancel, or otherwise act upon a function call. For
example, a plugin that wants to know when the user switches their status might hook an `UpdateStatus` function and take
some action on their own. Meanwhile, a developer that wants to just check if the player has finished a quest would
create a delegate pointing to an `IsQuestCompleted` function so that they could call it at their will.

In both of these cases, the developer needs to know the argument list (and return type) of the function they are
interacting with, though static analysis tools will expose this information to the developer[^2]. In many cases, not
all arguments are known (and will generally be represented as `a3` or similar), or an argument may be a pointer to a
specific (and potentially unknown!) struct.

## On Structures and Data Types

Fundamentally, this game is just like any other C or C++ program. This means that internal to the game, many data
objects are really just classes, which in turn got compiled down to a plain C `struct`. One of the key aspects of the
ClientStructs project is that it leverages C#'s interoperability features to translate these C structs (either in part
or in full) into usable C# structs - which then can make accessing certain aspects of memory far simpler.

For cases where structures do not yet exist (or are not yet known), developers can fall back to using pointer math and
various C# tricks (e.g. the `Marshal` methods) to read information out of the game's memory. Generally, though,
developers are encouraged to just take the extra time to write out the struct to their ability.

Structures are just C structures. We port them into C# sometimes, and we use layouts. Pointer math is also a thing. We
use intptr/nint a lot.

[^1]: Sometimes, you will also see `1404BC200`. This is the `/BASE` of `0x140000000` plus the function's offset, where
the base address is ~~a cool coincidence~~ a property of
[the compiler FFXIV uses](https://learn.microsoft.com/en-us/cpp/build/reference/base-base-address?view=msvc-170).
[^2]: Static analysis tools will use the
[x64 calling conventions](https://learn.microsoft.com/en-us/cpp/build/x64-calling-convention) to figure out what
arguments go where.
