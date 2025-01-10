---
title: Statement on Account IDs and Plugins
authors:
  - maintainers
---

Hi everyone!

We’ve recently been made aware of a custom repository plugin that reads and stores the unique and permanently-assigned Character IDs (otherwise known as Content IDs) and Account IDs from other users. Since this has caused a decent amount of concern from the playerbase, we wanted to explain a few key points that may have been missed in all the chaos.

With the introduction of the new blacklist features in Dawntrail, the game servers now send Content IDs and Account IDs for players in certain conditions. **The Account ID is a large number that lets users tie different characters from the same account to each other. All characters on the same service account share this number.** In regular operation, these IDs are used to allow the game to filter out and hide blacklisted or muted characters from chat, the overworld, search information, the marketboard, and other areas. Since the filter logic is purely client-side, the client needs to know information about which account any given character belongs to in order to properly hide alts of blacklisted characters. We consider this implementation to be flawed and naïvely implemented.

It’s not possible for the Dalamud project to prevent plugins from gaining access to these values. While Dalamud’s own API does not expose them, plugins are permitted to access the game’s raw memory and data structures and can access anything the game knows about (including these Account IDs). Even if Dalamud were able to restrict access to this data, this would be ineffective as these IDs are still sent over the network to the game client. Any tool capable of reading game data (e.g. Cheat Engine) or sniffing network data (e.g. ACT, Wireshark, Teamcraft) is able to grab and extract these values. For similar reasons, anti-cheats would be ineffective at resolving this problem.

Even with all this in mind, there probably are still lingering questions about whether we could do anything to impede or block individual (custom repository) plugins that may seek to use this data. While we [have a significant amount of control](https://dalamud.dev/plugin-development/plugin-submission) over plugins submitted to the official repository and can enforce certain rules about how data is used, [we cannot control plugins from custom repositories as a matter of design](https://dalamud.dev/plugin-development/restrictions/#i-dont-like-plugin-x-can-you-block-it-or-delete-it). While Dalamud does have a mechanism to disable plugins, this system can only be used to revoke broken plugin versions that are causing crashes. It cannot be used to permanently ban a plugin, and if we tried it would be bypassed in a matter of seconds as all of our research and code is public.

This entire situation is a side effect of the blacklist changes introduced in Dawntrail, and a tool to extract and track Account IDs was an inevitable development and was not restricted to the plugin ecosystem. **Any effective fix to this problem would require Square Enix to change how the blacklist system works on some level.** Regardless, the Dalamud team is still researching and evaluating the situation to see what, if anything, can be done. We encourage players to leverage the Blacklist and Report features in game if they have concerns about stalking or harassment.

Thank you.
