# Using Custom ClientStructs

:::warning

The Dalamud project discourages shipping custom versions of ClientStructs to end
users. If you need a CS bump or have found a breakage in a specific version,
please let the Dalamud maintainer team know!

:::

Oftentimes, ClientStructs contributors may want to verify or test their changes
in a familiar codebase. Both Dalamud and ClientStructs provide the capability to
do this, but some extra work needs to be done to get this working.

## Prerequisites

Using custom versions of Dalamud dependencies is not compatible with the
provided `Dalamud.Plugin.targets` file. This will generally be the case if your
plugin was based on [SamplePlugin](https://github.com/goatcorp/SamplePlugin),
but may be there in other cases as well. You can check for this by looking for
the below line in your `.csproj` file:

```xml
    <Import Project="$(DalamudLibPath)/targets/Dalamud.Plugin.targets"/>
```

If this is the case, you will need to delete this line and manually manage your
dependencies. The easiest way to do this is to just copy the declarations from
the [plugin targets file][plugin-targets] into your own `.csproj`. Please note
that by doing this, your plugin will no longer automatically track the
Dalamud-provided dependencies and Dalamud's target framework.

You will also need to have successfully built ClientStructs at least once, and
have the relevant artifacts ready to go. Developers who are actively working on
ClientStructs should normally have this prerequisite met.

[plugin-targets]:
  https://github.com/goatcorp/Dalamud/blob/master/targets/Dalamud.Plugin.targets

## Building Against Custom Client Structs

To use a custom ClientStructs, your plugin's `.csproj` file needs to be updated
such that the `FFXIVClientStructs` dependency is pointing to the resulting DLL.
Depending on how your project is configured, this may take one of a few
different methods, but will generally involve removing any `Reference`s
mentioning `FFXIVClientStructs` and replacing it with something that looks
similar to the one below:

```xml
    <Reference Include="FFXIVClientStructs">
        <HintPath>C:\The\Path\To\Your\FFXIVClientStructs\bin\Debug\FFXIVClientStructs.dll</HintPath>
        <Private>true</Private>  <!-- not necessary, but a good reminder -->
    </Reference>
```

It is critical that the `Private` attribute either be set to `true` or unset.
This will force MSBuild to copy the DLL to your plugin's output folder, which is
in turn required to ensure that it's used over Dalamud's provided version.

Once your `.csproj` is patched, you will additionally be responsible for
[manually initializing the ClientStructs resolver](https://github.com/aers/FFXIVClientStructs#signature-resolution).
This is normally done by putting the following two lines of code in your
plugin's constructor:

```csharp
FFXIVClientStructs.Interop.Resolver.GetInstance.SetupSearchSpace();
FFXIVClientStructs.Interop.Resolver.GetInstance.Resolve();
```

While also not _strictly_ necessary, it is generally good convention to run a
`dotnet clean` on your project when switching to/from a custom ClientStructs
build. This should be your first step in troubleshooting if things don't seem to
be working properly.

To revert these changes, simply undo your `.csproj` changes and remove the
initializer code. It is generally advised to fall back to the Dalamud-provided
ClientStructs when your testing is completed so that you don't inadvertently get
stuck running a old forgotten DLL on your local computer.
