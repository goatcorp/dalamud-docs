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
such that the `FFXIVClientStructs` dependency is pointing to your custom version of the DLL.
Depending on how your project is configured, this may require one of a few
different methods, but will generally involve overriding any `Reference` elements
mentioning `FFXIVClientStructs` by adding the following as part of an `ItemGroup`
***after*** any other references to ClientStructs:

```xml
<ItemGroup>
    <Reference Update="FFXIVClientStructs"> <!-- note the use of "Update" -->
        <HintPath>C:\The\Path\To\Your\FFXIVClientStructs\bin\Debug\FFXIVClientStructs.dll</HintPath>
        <Private>true</Private> <!-- not necessary, but a good reminder -->
    </Reference>
</ItemGroup>
```

It is critical that the `Private` attribute either be set to `true` or unset.
This will force MSBuild to copy the DLL to your plugin's output folder, which is
in turn required to ensure that it's used over Dalamud's provided version.

As long as you are using an SDK-style project with Dalamud as the SDK, this should
be the only change to the project file that is required.

## Building against your Custom ClientStructs

Once you have built your custom ClientStructs DLL and your plugin's `.csproj`
has been updated as described above, you will additionally be responsible for
[manually initializing the ClientStructs resolver](https://github.com/aers/FFXIVClientStructs#signature-resolution).
This is normally done by putting the following code in your plugin's constructor:

```csharp
InteropGenerator.Runtime.Resolver.GetInstance.Setup();
FFXIVClientStructs.Interop.Generated.Addresses.Register();
InteropGenerator.Runtime.Resolver.GetInstance.Resolve();
```

While also not _strictly_ necessary, it is generally a good practice to run
`dotnet clean` on your project when switching to/from a custom ClientStructs
build. This should be your first step in troubleshooting if things don't seem to
be working properly.

To revert these changes, simply undo your `.csproj` changes and remove the
initializer code. It is generally advised to revert to the Dalamud-provided
ClientStructs when your testing is complete so that you don't inadvertently get
stuck running an old forgotten DLL on your local computer.
