---
sidebar_position: 999
---

# Advanced Plugin Publishing

## Disabling a Plugin

On occasion, it may be desirable to globally disable a specific plugin for all
users. This may be due to a serious bug, game crashes, server-side issues, or
other concerns. Dalamud provides the ability to "ban" a plugin via a built-in
kill switch, preventing it from being loaded or installed by any user until an
updated version is published. It is important to note that the plugin ban system
is built as a safety tool, and can [not be used for plugin
moderation][not-a-mod-tool].

To ban a plugin, the plugin's maintainer must open a pull request against the
[`bannedPlugin.json`][banned-plugins] file in the
[`DalamudAssets`][dalamud-assets] repository and either add or update the entry
for their specific plugin. The Dalamud team will review the request, verify the
maintainer's identity, and merge the request if everything is in order.

The `bannedPlugin.json` file is a JSON array of objects, with each object having
the following keys:

- `Name`: The internal/assembly name of the plugin to ban.
- `AssemblyVersion`: The version of the plugin to ban. All versions up to and
  including this version will be disabled for all users. If unspecified, all
  versions of the plugin will be disabled.
- `Reason`: A short (optional) reason to display to users in the Plugin
  Installer.

:::warning

While plugins from custom repositories may also be banned through this system,
the defined `Name` must be the (uppercase) SHA256 sum of the plugin's internal
name.

The pull request must also be made by someone directly associated with the
custom repository plugin in question, such as the repository owner or a frequent
contributor.

:::

To unban a plugin, the maintainer of the plugin must publish a new version of
the plugin with an `AssemblyVersion` greater than the banned version. Entries
are generally not removed from the `bannedPlugin.json` file, as old versions of
the plugin may still be installed by some users.

Plugins that do not specify an `AssemblyVersion` are considered to be
permanently disabled. This mechanism is intended to be used for plugins that
will no longer receive updates, or in cases where the plugin's maintainer has
requested that the same internal name not be used again by a future developer.
Requests of this nature generally need to include justification - for example,
plugin configurations may contain sensitive information that should not be
disclosed or sent to a fork or new build.

In certain extenuating circumstances, the Dalamud team reserves the right to ban
mainline plugins without the maintainer's consent. This is generally only done
in response to game-breaking issues, critical user safety concerns, or other
serious matters. In this case, the Dalamud team will make a reasonable attempt
to contact the plugin's maintainer and inform them of the situation. The Dalamud
team will not issue bans for custom repository plugins under this policy.

[banned-plugins]:
  https://github.com/goatcorp/DalamudAssets/blob/master/UIRes/bannedplugin.json
[dalamud-assets]: https://github.com/goatcorp/DalamudAssets
[not-a-mod-tool]:
  ./restrictions.md#i-dont-like-plugin-x-can-you-block-it-or-delete-it
