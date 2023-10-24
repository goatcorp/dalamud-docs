---
title: Dalamud API9 Release
authors:
  - goat
---

Hey everyone,

I'm happy to announce that we are publishing the final list of new features and breaking changes
for Dalamud API9, scheduled to be released together with Patch 6.5 in early october.

This release features a lot of behind-the-scenes changes that make Dalamud more stable, and
hopefully give us the chance to improve our APIs further in the future.

Please [check the full list of changes here](https://dalamud.dev/versions/v9/).

### Services are now interfaces
One major change that you will encounter is that all of the services you've already been using are now
accessed via interfaces, and not directly via the implementing type.
<br/>
We decided to go this route, as it gives us the opportunity to slowly switch all services over to plugin-specific services - which know what
resources are allocated to what plugin, and allows us to track and dispose of them in case something goes wrong -
and can enhance some Dalamud features, like the command list or logging APIs, with reliable context about what
plugin is using them.

It can also open the door to improving automated testing, and making it easier for us to improve APIs and functionality gradually.

To migrate, you most likely only have to **prefix the names** of all of the services you're using with I. That's it!

### A note about ImGui
I want to encourage everyone to have a look at the wonderful new ImRaii APIs we introduced into the main Dalamud assembly via `Dalamud.Interface.Utility`!
<br/>
They make it a lot easier to prevent crashes your plugin may cause due to e.g. unhandled exceptions, and are just all-around
more convenient to use, in my opinion. You also will never again forget to pop a color, or that children always need to be ended.
<br/>
There also are some other convenience APIs, for example, to interact with tables.

Another thing you might want to look into, if you aren't already, is the Dalamud WindowSystem - if you use it to create your ImGui
windows, they automatically gain a lot of nice UX features, such as integration into the game-native closing order via escape or controller,
and UI sounds. Your users will appreciate it, I'm sure!

### Testing your plugins
We decided to not open up a v9 branch on the plugin repository this time around. In the past, this has led to a lot of confusion and
messy testing periods, as we tended to end up with published versions of plugins on the new API level before the release of the
patch we were targeting, which did not end up being stable on that version of the game.

We, of course, encourage you to already start adjusting your plugin to the new APIs locally and in your development branches, to have
them ready to go when the patch hits! 
To do this, just use the Dalamud branch switcher(`/xlbranch`) to switch to the v9 branch.

### Feedback
If you have any concerns about the changes we've made, or find that something is not working correctly, please reach out to us via
[GitHub issues](https://github.com/goatcorp/Dalamud/issues/new) or the [#dalamud-dev](https://discord.com/channels/581875019861328007/860813266468732938)
channel on our Discord server.

Thanks for sticking around, and have a great autumn!
<br/>
~goat
