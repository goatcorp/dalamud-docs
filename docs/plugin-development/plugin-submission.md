# Plugin Submission & Approval

This article describes the process that decides which plugins are merged into
the official repository, and how we make sure that what goes in is safe for you
and safe for us. It's important to know that none of what is described in this
post applies to custom repositories - we can only do this for developers that
officially submit their plugin.

## The technical details

To begin with, we need to explain how our submission process for plugins in the
official repository works. This is a little simplified, but it's the foundation
upon which the approval process is built on.

- All plugins in the official repository are open-source, and no closed-source
  plugins are accepted. This means that their code can be inspected by anyone,
  should they wish to do so.
- Plugin developers submit their plugin by submitting a "commit hash", which is
  a cryptographical hash that points to a **specific version of their source
  code**. Changing their code after submission will result in a new hash, which
  will require them to re-submit and have their changes reviewed again. [^1]
- A cloud build system then downloads that source code, builds the plugin, and
  outputs a "diff", which is a **list of all changes that were made** to the
  plugin. The build system has no direct internet access, so plugin developers
  can't download additional code while the plugin is being built.
- This diff is then inspected by members of the
  [plugin approval team](#the-plugin-approval-team).

All of this, combined, allows us to ensure that the code that runs on users' PCs
is the code that we approved, and that no code is run on users' hardware before
we approve it. This system was built to be convenient for both developers and
reviewers, and should impose very little burden - developers just have to use a
few specific variables in their project configuration.

## The Plugin Approval Team

The plugin approval team is a subjectively chosen group of 6 volunteers that are
technical, security conscious, are themselves plugin developers, and share
consensus on how the Dalamud plugin ecosystem should work and what plugins
should and shouldn't do.

They approve new plugin submissions, and review proposed changes to existing
plugins.

## New submissions

When a plugin is newly submitted, the team checks that it conforms to a set of
[guidelines](restrictions#what-am-i-allowed-to-do-in-my-plugin) and
[technical criteria](https://github.com/goatcorp/DalamudPluginsD17#approval-criteria).
The team then votes on each newly submitted plugin - if a plugin clears 4 yes
votes, it is approved and will appear in the repo. Every team member can veto a
plugin, blocking it from being merged until the concern is resolved. This hasn't
happened yet.

These [guidelines](restrictions#what-am-i-allowed-to-do-in-my-plugin) exist
because we want to improve the experience Square Enix provides - not harm it or
any other player playing the game. We think that they allow for a lot of freedom
for plugin developers, while encouraging them to stay true to that intent.

Technical criteria include a thorough code review, that the plugin works and
that it does not upload any personal data. All of this can take a while, which
is why it's not uncommon for a new plugin to sit in the queue for more than a
week - all of the team members are doing this in their free time, so they might
not get to it before then.

We also require all new plugins to go through the plugin testing track
beforehand, which distributes the plugin to testing users before it goes out to
everyone using Dalamud. This helps tracking down potential issues and bugs.

## Updates to plugins

Updates to plugins only need to be approved by a single team member, which helps
keep the queue size small. The changed code is reviewed carefully, and the
updated plugin is then built and distributed.

![What a plugin approval team member sees when they are being called in to review a change to a plugin.](https://user-images.githubusercontent.com/16760685/217103831-de5c1af3-7244-438e-8e8e-7408d2545814.png)

## Caveat emptor

While this is all fine - and it has been working pretty well for us, without any
incidents - all of this work is done by volunteers, and they might miss or
overlook things. We can't and don't want to give you a 100% guarantee that
things will always be fine, but we believe that we can give you a pretty good
assurance that they will be.

It's up to you to decide who you trust!

## In closing

We hope that this helps clarify how plugins land in the official Dalamud plugin
listing. If you have any questions or think that something here could be
clarified, feel free to reach out.

[^1]:
    Technically, this is still possible, but you would need NSA-grade
    datacenters and a lot of time (at the moment, probably hundreds of years) to
    break the hash algorithm Git uses.
