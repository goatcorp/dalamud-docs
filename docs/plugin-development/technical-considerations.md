---
sidebar_position: 8
---

# Plugin Technical Considerations

There are many potential technical decisions that you should consider when
developing a plugin. Here are a few examples:

- For regular windows, like settings and utility windows, you should use the
  [Dalamud Windowing API](https://dalamud.dev/api/Dalamud.Interface.Windowing/).
  It enhances windows with a few nice features, like integration into the native
  UI closing-order, pinning, and opacity controls. If it looks like a window, it
  should use the windowing API.
- If interacting with game data, we strongly recommend using
  [Lumina](https://github.com/NotAdam/Lumina) over XIVAPI. Lumina uses your
  local game files, which will always be up-to-date and accurate, and is much
  faster than making requests to XIVAPI.

:::info

For information about submitting your plugin and the approval process, see:

- [The Submission Process](../plugin-publishing/submission)
- [The Approval Process](../plugin-publishing/approval-process)
- [Plugin Restrictions](../plugin-publishing/restrictions)

:::

## Are there any performance constraints to be aware of?

You should generally aim to not impact game performance too much as that can
degrade the experience for the player and cause other issues. A good place to
start debugging performance issues is through the Plugin Statistics window,
which can be found through Plugins > Open Plugin Stats in the dev menu
(`/xldev`).

## Can my plugin talk to a backend server I run?

Plugins are permitted to communicate with maintainer-run backend services,
though there are certain considerations and requirements that must be met:

- Plugins should take care to send the minimum amount of data necessary to do
  their job. Whenever feasible, plugins should hash information about the local
  player (such as the player's Content ID or name) on the client side so that a
  server-side data breach does not reveal information.
- Plugins may collect additional non-essential information for telemetry,
  analytics, or statistical purposes, provided the user is given a chance to
  review what data is being collected and for what purpose.
  - Users must explicitly opt in to additional telemetry collection, but this
    may be done as part of a config option or a welcome wizard that forces a
    choice.
  - Additional data collection must be done for the public interest. That is,
    the extra information should go back to improvement of the plugin, provide
    the public with statistics or dashboards, or otherwise improve or augment
    the game and player experience.
  - Plugins must use a pseudo-random identifier (or no identifier) for any
    analytics data. If an identifier is used, it must not contain or be derived
    from any personal information and must be resettable at any time by the user
    purely on the client side. Developers are encouraged to design any analytics
    systems so that a user cannot be deanonymized even with full access to the
    raw datasets.
  - Collected data must be topical to the plugin in question. For example, a
    plugin providing Party Finder features may not record information about
    which face type is the most popular among its users, but _may_ collect
    analytics to find which face type is most likely to create Ultimate clear
    parties.
- Plugins must take care to not expose a list of other plugin users or allow an
  easy way to test whether a specific user is using any plugin. Users may list
  themselves in a public directory if they so choose, but the risks should be
  identified to the user.
- Any maintainer-run server for a plugin must use encrypted communication via
  HTTPS, TLS, or equivalent, and must have certificates issued from a trusted
  certificate authority such as [Let's Encrypt][lets-encrypt].
- Plugins connecting to backend servers must do so via a DNS hostname rather
  than an IP address.

:::warning

These requirements are part of the
[plugin restrictions](../plugin-publishing/restrictions) and must be followed
for your plugin to be approved.

:::

The appropriateness of data (both essential and non-essential) being submitted
to backend servers is ultimately subjective, and will be handled on a
case-by-case basis by the Plugin Approval Committee. Factors such as the
developer's intent with the data, the necessity of the data to collect, the
abuse potential of the data collected, and how things are communicated to users
will all affect what any given plugin would be allowed to collect. Developers
planning to submit user data should expect to receive feedback on feature design
and architecture from both PAC and the community as part of the review process.

Plugin developers running backend servers should also consider the following as
part of their plugin's design. The below bullet points are not rules, but are
instead guidelines and recommendations designed to improve the overall plugin
experience.

- Plugins should offer the ability to connect to a user-defined backend server
  rather than the maintainer-run server. This allows users more control over
  where their data goes, and allows plugins to survive should a developer lose
  interest or stop working on a project.
- Backend servers should be available under an Open Source license, with the
  code available for inspection by interested users. Servers should also be
  relatively simple to deploy, allowing users to run their own servers if they
  want.
- Plugins should support dual-stack communication, and the backend server should
  be aware of IPv6 addresses and be able to handle them properly, including rate
  limits if necessary.
- Plugins using WebSockets or similar should implement connection retry logic to
  gracefully handle connection interruptions.
- Plugins and backend servers should implement version checking logic such that
  outdated clients are properly handled. Plugins and backend servers should also
  consider implementing MOTD or notification systems to inform users of planned
  outages, impending upgrades, deprecation notices, maintenance, and similar
  status updates.

[lets-encrypt]: https://letsencrypt.org/
