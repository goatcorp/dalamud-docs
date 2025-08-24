---
sidebar_position: 999
---

# Advanced Plugin Publishing

## Disabling a Plugin

On occasion, it may be desirable to disable a specific plugin due to a critical
issue, server-side changes, game crashes, or similar. Dalamud provides a
mechanism called "banning" that prevents a plugin from being installed or run.

To ban a specific plugin, a maintainer of the plugin must open a pull request
against the [`bannedPlugins.json`][banned-plugins] file in the
[`DalamudAssets`][dalamud-assets] repository. This file contains a list of JSON
objects, each containing the following keys:

- `Name` - The internal name of the plugin to ban.
- `AssemblyVersion` - The version of the plugin to ban. All versions up to and
  including this version will be disabled for all users.
- `Reason` - A short reason for the ban, to be displayed to users.

:::warning

While plugins from custom repositories may also be banned through this system,
the defined `Name` must be the SHA256 sum of the plugin's `InternalName`.

:::

A banned plugin can be re-enabled by publishing a new version of the plugin with
a higher `AssemblyVersion` than the banned version. Entries will generally not
be removed from the `bannedPlugins.json` file.

The plugin ban system is **_not_** intended to be used as a moderation tool. As
such, ban requests are validated to ensure they are coming from the plugin's
listed maintainer. In certain extenuating circumstances, a plugin may be banned
by the Dalamud team in response to game-breaking issues or other serious
concerns. The Dalamud team will make a reasonable attempt to contact the
plugin's maintainer in such cases.

[banned-plugins]:
  https://github.com/goatcorp/DalamudAssets/blob/master/UIRes/bannedplugin.json
[dalamud-assets]: https://github.com/goatcorp/DalamudAssets
