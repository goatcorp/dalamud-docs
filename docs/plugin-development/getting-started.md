---
sidebar_position: 1
---

# Getting Started

Plugins allow you to interact with the game and add features, modify
functionality, and do much more. We ask you to be respectful of
[our guidelines](../plugin-publishing/restrictions.md) to ensure that your
plugin is approved into the official plugin repository, and to minimise the risk
of action by Square Enix. You can read more about this
[here](../plugin-publishing/approval-process.md).

:::info

Before you start, please also review:

- The [AI Usage Policy](../plugin-publishing/ai-policy.md), which governs the
  use of AI tooling in plugins submitted to the official repository. Entirely
  AI-generated submissions are not accepted, and undisclosed AI use may result
  in a ban.
- Our [Code of Conduct](../code-of-conduct.md), which applies to all community
  spaces including Discord and our GitHub repositories.

:::

We recommend that you start by clicking "Use this template" on the 
[`SamplePlugin` repository][sample-plugin] and then customizing it to your 
specific requirements. This plugin template contains many common settings as 
well as frequently-used sample code to help bootstrap plugin creation.

To distribute a plugin, it needs to be packaged correctly. This will be handled
by the [Dalamud.NET.Sdk](https://github.com/goatcorp/Dalamud.NET.Sdk)
– see [Setting Plugin Metadata](plugin-metadata) for more details.

When your plugin is ready for testing/release, you should make a pull request to
the [DalamudPluginsD17](https://github.com/goatcorp/DalamudPluginsD17) repo.
**Please place testing plugins in the testing/live folder**.

[sample-plugin]: https://github.com/goatcorp/SamplePlugin
