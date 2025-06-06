---
title: Statement on Account IDs and Plugins
authors:
  - maintainers
---

We’ve recently been made aware of a custom repository plugin that reads and
stores the unique and permanently-assigned Character IDs (otherwise known as
Content IDs) and Account IDs from other users. Since this has caused a decent
amount of concern from the playerbase, we wanted to put out an official
statement regarding our views and the background of this plugin and how Account
IDs work.

Foremost, the Dalamud project fundamentally does not approve of the plugin in
question, nor do we believe that it was necessary to create in the first place.
Dalamud’s design philosophy is to improve the game and add quality of life
changes, not to support people who wish to harm others’ experiences, intended or
not.

With the introduction of the
[new blacklist features](https://youtu.be/OxVWTktvt_M?t=11495) in Dawntrail, the
game servers now send Content IDs and Account IDs for players in certain
conditions. The Account ID is a large number that lets users tie different
characters from the same account to each other. All characters on the same
service account share this number. In regular operation, these IDs are used to
allow the game to filter out and hide blacklisted or muted characters from chat,
the overworld, search information, the marketboard, and other areas. Since the
filter logic is client-side, the client needs to know information about which
account any given character belongs to in order to properly hide alts of
blacklisted characters.

It’s not possible for the Dalamud project to prevent plugins from gaining access
to these values. While Dalamud’s own API does not expose them, plugins are
permitted to access the game’s raw memory and data structures and can access
anything the game knows about (including these Account IDs). Even if Dalamud
were able to restrict access to this data, this would be ineffective as these
IDs are still sent over the network to the game client. Any tool capable of
reading game data (e.g. Cheat Engine) or sniffing network data (e.g. ACT,
Wireshark) is able to grab and extract these values. For similar reasons,
anti-cheats would be ineffective at resolving this problem. The only practical
solution would be to alter the blacklist system to not send raw IDs to the
client.

Even with all this in mind, there probably are still lingering questions about
whether we could do anything to impede or block individual (custom repository)
plugins that may seek to use this data. While we
[have a significant amount of control](https://dalamud.dev/plugin-development/plugin-submission)
over plugins submitted to the official repository and can enforce certain rules
about how data is used,
[we cannot control plugins from custom repositories as a matter of design](https://dalamud.dev/plugin-development/restrictions/#i-dont-like-plugin-x-can-you-block-it-or-delete-it).
While Dalamud does have a mechanism to prevent a plugin from being loaded, this
system is designed to only be used in cases where a plugin is causing crashes or
taking unexpected actions. This system is not designed to allow us to
permanently ban plugins, and any attempts to use it for that would be bypassed
in a matter of seconds.

This entire situation is a side effect of the blacklist changes introduced in
Dawntrail, and a tool to extract and track Account IDs was an inevitable
development and was not restricted to the plugin ecosystem. We encourage players
to leverage the Blacklist and Report features in game if they have concerns
about stalking or harassment.
