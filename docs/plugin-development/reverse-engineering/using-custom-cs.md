---
sidebar_position: 1
---

# Using Custom ClientStructs

:::warning

The Dalamud project discourages shipping custom versions of ClientStructs to end
users. If you need a CS bump or have found a breakage in a specific version,
please let the Dalamud maintainer team know!

:::

Oftentimes, ClientStructs contributors may want to verify or test their changes
in a familiar codebase. Both Dalamud and ClientStructs provide the capability to
do this, but some extra work needs to be done to get this working.

## Referencing a Custom ClientStructs

To use a custom ClientStructs, your plugin's `.csproj` file needs to be updated
such that the `FFXIVClientStructs` and `InteropGenerator.Runtime` dependencies are
pointing to your custom versions of the DLLs.  Depending on how your project is
configured, this may require one of a few different methods, but if you are using
the Dalamud SDK as recommended, it should be as simple as adding the following to
your project file (with the paths set as appropriate for your folder structure):

```xml
<PropertyGroup>
    <Use_Dalamud_FFXIVClientStructs>false</Use_Dalamud_FFXIVClientStructs>
</PropertyGroup>

<ItemGroup>
    <ProjectReference Include="..\FFXIVClientStructs\FFXIVClientStructs\FFXIVClientStructs.csproj" Private="True" />
    <ProjectReference Include="..\FFXIVClientStructs\InteropGenerator.Runtime\InteropGenerator.Runtime.csproj" Private="True" />
</ItemGroup>
```

It is critical that the `Private` attribute either be set to `true` or unset.
This will force MSBuild to copy the DLL to your plugin's output folder, which is
in turn required to ensure that it's used over Dalamud's provided version.

## Building against your Custom ClientStructs

Once you have built your custom ClientStructs DLLs and your plugin's `.csproj`
has been updated as described above, you will additionally be responsible for
[manually initializing the ClientStructs resolver](https://github.com/aers/FFXIVClientStructs#signature-resolution).
This is normally done by putting the following code in your plugin's constructor:

```csharp
InteropGenerator.Runtime.Resolver.GetInstance.Setup(
	SigScanner.SearchBase,
	DataManager.GameData.Repositories["ffxiv"].Version,
	new FileInfo( Path.Join( pluginInterface.ConfigDirectory.FullName, "SigCache.json" ) ) );
FFXIVClientStructs.Interop.Generated.Addresses.Register();
InteropGenerator.Runtime.Resolver.GetInstance.Resolve();
```

Where `SigScanner` and `DataManager` are properties or fields with the `[PluginService]`
attribute into which Dalamud has injected.  These may be in your plugin class,
or may be part of a separate "service"-type class depending upon how your project
is structured.

While also not _strictly_ necessary, it is generally a good practice to run
`dotnet clean` on your project when switching to/from a custom ClientStructs
build. This should be your first step in troubleshooting if things don't seem to
be working properly.

To revert these changes, simply undo your `.csproj` changes and remove the
initializer code. It is generally advised to revert to the Dalamud-provided
ClientStructs when your testing is complete so that you don't inadvertently get
stuck running an old forgotten DLL on your local computer.
