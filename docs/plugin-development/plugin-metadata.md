# Setting Plugin Metadata

Writing a plugin is all well and good, but you're also going to want some way to
configure how it appears in the plugin installer: its name, description, icon,
update changelogs, and so on. You do this by writing a _plugin manifest_, which
is a JSON or YAML file named after your plugin's internal name (for example:
`SamplePlugin.yaml`).

:::info

When using a YAML manifest, you should replace CamelCase keys with snake_case
(for example, where a JSON manifest would contain `RepoUrl`, a YAML manifest
would contain `repo_url`).

:::

## Example

A very basic YAML manifest might look something like this:

```yaml
name: Test Plugin
author: You
punchline: Does nothing! # short summary that fits on one line
description: |- # long description, shown when your plugin is clicked on
  This is a test plugin - this first line is a summary.

  Down here is a more detailed explanation of what the plugin
  does, manually wrapped to make sure it stays visible in the
  installer.
repo_url: https://example.com # where can users find your plugin's source code?
```

## Available manifest keys

These keys are required:

- Name
- Author
- Description
- Punchline

Optional keys include:

- ApplicableVersion
- RepoUrl
- Tags
- CategoryTags
- LoadRequiredState
- LoadSync
- CanUnloadAsync
- LoadPriority
- ImageUrls
- IconUrl
- Changelog (see [Changelogs](#changelogs) below for alternatives)
- AcceptsFeedback
- FeedbackMessage

See [the definition of `IPluginManifest`][] for further information. NB: some
fields mentioned there, like `Dip17Channel`, are set automatically by the
various plumbing that gets your plugins from GitHub to people's computers, and
you should not include them in your manifest explicitly. (For a list of the keys
you're allowed to set, see [the relevant part of DalamudPackager][].)

Note that the following keys are also required for Dalamud to load a plugin, but
if you're using [DalamudPackager][], it will automatically fill them in for you,
so **you can and should ignore these**:

- AssemblyVersion
- InternalName
- DalamudApiLevel

## Changelogs

You can set a plugin changelog in three separate ways:

1. Include a `changelog` field in your `manifest.toml`, in the
   [DalamudPlugins17][] repository
2. Write text in your Pull Request description
3. Include the `Changelog` key in your plugin manifest

These will be checked in order, and the first available changelog will be used.

:::warning

If you'd like your changelog to be visible in the plugin installer, you must
include it in `manifest.toml` or your plugin manifest, not the PR description.

:::

### Discord webhook

Plugin updates are usually automatically posted in the XIVLauncher & Dalamud
Discord server. If you'd rather write an announcement message yourself, you can
prevent the automatic post by starting your Pull Request description with the
word `nofranz`. Note that any changelog you write in `manifest.toml` or the
plugin manifest will still be visible to users via the plugin installer.

[DalamudPackager]: https://github.com/goatcorp/DalamudPackager
[the relevant part of DalamudPackager]:
  https://github.com/goatcorp/DalamudPackager/blob/084f66e6af7edbf8a45820590ca71765376b901c/DalamudPackager/DalamudPackager.cs#L303
[the definition of `IPluginManifest`]:
  https://github.com/goatcorp/Dalamud/blob/532781308d6291a2c0117e0e73a8252358e2d91a/Dalamud/Plugin/Internal/Types/Manifest/IPluginManifest.cs#L9
[DalamudPlugins17]: https://github.com/goatcorp/DalamudPluginsD17
