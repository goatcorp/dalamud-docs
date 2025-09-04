---
sidebar_position: 2
---

# Project Layout and Configuration

Dalamud does not strictly require much in the form of project layout, but will
require a few things nevertheless.

As an example, please see the following directory layout:

    MySolution
    |- MyPlugin
    |  |- MyPlugin.csproj
    |  |- MyPlugin.json
    |  |- packages.lock.json
    |  |- Plugin.cs
    |- MySolution.sln

When building your plugin, your primary plugin DLL must also be named
accordingly. This will usually happen by default, so unless you're changing
settings you don't really need to worry about this.

Your project directory can be nested under subdirectories (e.g. `src/`), and you
may have other projects within the same solution. There is no restriction to the
programming language used for any other projects in the same solution.

## The Internal Name

Your plugin's `AssemblyName`, generally auto-set to your `.csproj` file name,
will become what's known as the plugin's **`InternalName`**. Once set this value
**_may not be changed_**, so it's important to choose a name that you will be
happy with.

This internal name will be used for your plugin's config directory, is attached
to all log entries, and is used as the name on your plugin's DLL and D17
submissions.

You may use a different name for the plugin's display name by setting the `Name`
field of your plugin manifest accordingly.

## Manifest File

Your plugin DLL must be distributed alongside a **manifest file**, which
contains certain key information such as your author name, the plugin's
punchline, the internal name declaration, and other miscellaneous data. See our
\[manifest] section for more detailed information as to what needs to be
contained within it. This data is also used to generate our PluginMaster
(repository) files which are delivered to users to populate the installer.

Normally, our `DalamudPackager` helper (included in the Dalamud SDK and
referenced in our `.targets` file) will automatically generate your manifest
using a template file in your project directory. This template file may be of
type `.json` or `.yml`, and must be named following your plugin's Internal Name
(e.g. `MyPlugin.json`). The `DalamudPackager` helper will automatically add
critical fields such as `InternalName`, `AssemblyVersion`, `DalamudApiLevel`,
and others.

At a minimum, your template manifest for `DalamudPackager` must contain the
following keys:

```json
{
  "Name": "My Awesome Plugin",
  "Author": "You!",
  "Punchline": "An awesome plugin that does cool things.",
  "Description": "Did you ever feel like your game could be even more awesome? This plugin is the answer!",
  "RepoUrl": "https://github.com/AwesomePluginDev/MyAwesomePlugin"
}
```

## The Plugin Entrypoint

Dalamud will scan your DLL for a class that extends `IDalamudPlugin`. This class
will then be initialized, injecting any \[services] declared in the class'
constructor. Your plugin may only have _one_ such entrypoint.

As `IDalamudPlugin` inherits from `IDisposable`, your plugin must also specify a
`void Dispose()` method to clean up after itself. Plugin developers are required
to implement a fully-functional dispose cycle and, ideally, not leak any
resources.
