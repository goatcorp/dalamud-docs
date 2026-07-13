---
title: An Update on Account IDs
authors:
  - maintainers
---

Hello everyone. We’ve received a number of comments and concerns about a custom repository plugin that collects and tracks players via their Character IDs and Account IDs. In the past, [we’ve published a statement about a similar tool](https://dalamud.dev/news/2025/01/10/account-ids-and-plugins/) explaining how these identifiers are exposed to the game client and how tools may access them. While certain technical details have changed since that statement was published, the general principle remains true. The fix implemented by the developers of the game is not enough to prevent malicious users (with or without Dalamud plugins) from correlating characters to a single account. 

The XIVLauncher/Dalamud project’s stance has not changed. We do not endorse, approve of, or support this plugin, or any other plugin of a similar nature. We do not believe that tools that correlate characters are necessary, nor are they consistent with our purpose of improving the game through quality of life improvements.

We have received suggestions to either ban the offending tools or restrict access to the game data that enables these tools to exist. [We have no technical ability to prevent or interfere with tools like this](https://dalamud.dev/plugin-publishing/restrictions/#i-dont-like-plugin-x-can-you-block-it-or-delete-it) and we cannot stop plugins from accessing these values. While Dalamud has been used as a platform in the past, any tool with memory or network access to the game’s process or host computer may be used to perform the same functions.

We are sympathetic to the players who have expressed concerns over the existence of these tools and hope that a more permanent resolution comes soon. In the meantime, we can only encourage affected players to leverage the Blacklist and Report features in game if they have concerns about stalking or harassment, or contact local law enforcement if personal life or property is at risk.

