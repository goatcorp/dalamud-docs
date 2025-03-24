# Migrating to Dalamud.NET.Sdk

Prior to the existance of an the Dalamud SDK, you would typically include the `DalamudPackager` library with your project. The `packages.lock.json` file may have:

```json
{
  "version": 1,
  "dependencies": {
    "net8.0-windows7.0": {
      "DalamudPackager": {
        "type": "Direct",
        "requested": "[11.0.0, )",
        "resolved": "11.0.0",
        "contentHash": "bjT7XUlhIJSmsE/O76b7weUX+evvGQctbQB8aKXt94o+oPWxHpCepxAGMs7Thow3AzCyqWs7cOpp9/2wcgRRQA=="
      },
...
    }

```

The NuGet Package Manager (if using Visual Studio) will also have a DalamudPackager listed. This method is currently deprecated and set to be removed as an option soon.

## Migration Steps

Migration is easy and the number of steps you must take depend on how old your plugin is. Follow the steps below for each method as required.

### DalamudPackager Reference

1. Remove the DalamudPackager reference from your project.
2. Open your `.csproj` file (Right-click -> `Edit Project File` if Visual Studio)
3. Find the line `<Project Sdk="Microsoft.NET.Sdk">` in this file.
4. Replace it with: `<Project Sdk="Dalamud.NET.SDK/12.0.0">` or the current SDK version.
5. Locate the defined references for the various dalamud libraries and remove them as they're already included in the SDK (unless you are specifically overriding one or more for your own use cases). They will usually look like this in your `.csproj`:

```xml
    <Reference Include="Newtonsoft.Json">
      <HintPath>$(DalamudLibPath)Newtonsoft.Json.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="Dalamud">
      <HintPath>$(DalamudLibPath)Dalamud.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="ImGui.NET">
      <HintPath>$(DalamudLibPath)ImGui.NET.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="Lumina">
      <HintPath>$(DalamudLibPath)Lumina.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="Lumina.Excel">
      <HintPath>$(DalamudLibPath)Lumina.Excel.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="FFXIVClientStructs">
      <HintPath>$(DalamudLibPath)FFXIVClientStructs.dll</HintPath>
      <Private>false</Private>
    </Reference>
```
6. Find and remove references to the addon hooks folder, as this is included in the SDK:

```xml
  <PropertyGroup>
    <DalamudLibPath>$(appdata)\XIVLauncher\addon\Hooks\dev\</DalamudLibPath>
  </PropertyGroup>
  ```

You're done! Save the project and it should build successfully. Some stubborn IDEs may need a restart first.

### Targets File Reference

The `.targets` method of building is also deprecated. Migrate by:

1. Removing your `Dalamud.Plugin.Bootstrap.targets` file.
2. Open your `.csproj` (Right-click -> Edit Project File in Visual Studio) and locate the following and delete it:

```xml
<Import Project="Dalamud.Plugin.Bootstrap.targets"/>
```
3. If you haven't already, Find the line `<Project Sdk="Microsoft.NET.Sdk">` in this file and replace it with: `<Project Sdk="Dalamud.NET.SDK/12.0.0">` or the current SDK version.

You're done!