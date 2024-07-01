# Restrictions

## What am I allowed to do in my plugin?

Dalamud plugin development, by its nature, interferes with the game's
functioning and changes the experience as intended by Square Enix. This makes it
very important to ensure that your plugin does not do anything that a human
player could not do; Dalamud plugins should enhance the experience, not
radically alter it.

Please make sure that, as much as possible:

- your plugin does not interact with the game servers in a way that is:
  - automatic, as in polling data or making requests without direct interaction
    from the user
  - outside of specification, as in allowing the player to do or submit things
    to the server that would not be possible by normal means
- your plugin does not augment, alter, or interfere with combat, unless it only
  provides information about your own party or alliance members that is
  otherwise available, but represents said information differently.
  - Note that there are plugins on the repository that do not abide by this
    rule, but they have been grandfathered and similar plugins will not be
    allowed.
- your plugin does not interfere with Square Enix's monetary interests (i.e.
  granting access to Mog Station items)
- your plugin does not provide parsing, raid logging, DPS meters, or similar
  (i.e. information beyond what is traditionally available to players)
- your plugin does not have a hard dependency on any plugin that violates the
  Plugin Guidelines

If you are not sure about whether or not your plugin will be allowed, _please_
contact us before you start work on it. We don't want to have to turn you down
after you've already done the work!

Plugins that violate these rules will not be accepted into the Dalamud plugin
repository, and you will not receive support from the Dalamud community.

## Are there any technical decisions I should consider making?

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

## Why do you discourage certain types of plugins?

> Dalamud and XIVLauncher were made by me with the goal to do cool stuff with a
> game I love, and give others the chance to do so while making the game itself
> more accessible. I don't want to cause harm to the game, its community or
> Square Enix. Plugins that fall outside of the definition of "acceptable" that
> we set as a collective create a divide and debate that we don't want to be a
> part of.
>
> This stance of mine has narrowed down as XIVLauncher has gained popularity, as
> you may notice by going through some of the first plugins to be added.
>
> Obviously, this comes from a moral point of view, which may differ from
> yours - and the rules and decisions I make may sometimes seem unjustified -
> but I want to minimize the risk of Square Enix taking action and taking away
> the things we built, while degrading the general user experience of their
> game.
>
> I can't and don't want to control anyone that makes free software based on my
> work, but I would like to ask you to consider and empathize with my opinion
> when creating software that depends on Dalamud.

- [goat](https://github.com/goaaats), the lead developer of XIVLauncher/Dalamud

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
  - Users must opt in to additional telemetry collection, but this may be done
    as part of a "welcome to this plugin" experience forcing an explicit choice,
    or via a global Dalamud setting.
  - Additional data collection must be done for the public interest. That is,
    the extra information should go back to improvement of the plugin, provide
    the public with statistics or dashboards, facilitate the creation of curios,
    or otherwise just improve the game and player experience.
  - Plugins must use a pseudo-random identifier (or no identifier) for any
    analytics data. If an identifier is used, it must not contain or be derived
    from any personal information and must be resettable at any time by the user
    purely on the client side. Developers are encouraged to design any analytics
    systems so that a user cannot be deanonymized even with full access to the
    raw datasets.
- Plugins must take care to not expose a list of other plugin users or allow an
  easy way to test whether a specific user is using any plugin. Users may list
  themselves in a public directory if they so choose, but this risk should be
  identified to the user.
- Any maintainer-run server for a plugin must use encrypted communication via
  HTTPS (or an equivalent), and must have certificates issued from a trusted
  certificate authority such as [Let's Encrypt][lets-encrypt]. Plugins must
  connect to servers via DNS name to prevent data from going to stray IP
  addresses.

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

## How are plugins reviewed and approved?

[This page documents our plugin submission process](plugin-submission), and the
stringent review that is applied to each new submission. Feel free to join the
Discord and ask for more details if required.

## I don't like plugin X, can you block it or delete it?

While there are various plugins from custom repositories that do violate our
rules, there is very little we can do as a project to prevent this.

- If we were to introduce blocks or bans, they would be trivial to circumvent.
  It would be minutes of effort to do so. Dalamud is open source software -
  everything we do is public, there is no secret code or private tools and
  everything can be reproduced. This has obvious drawbacks, but it allows anyone
  to inspect what code runs on their machine, and this openness has ultimately
  led to the ecosystem of amazing plugins and extensions we have today.
- In our official channels, we try to avoid helping anyone that tries to make
  plugins that may violate our rules or ethics. This is not always possible, as
  we are not immune to deception or politics.
- Most ready-to-use APIs offered by Dalamud itself are read-only and don't allow
  changing the actual state of the game. Plugins run on your PC like any other
  program and are not "sandboxed", so they have free reign to interact with the
  game in any way they please with their own code.
- Limiting what plugins can do is a very difficult technical problem, and might
  lead to a lot of very popular plugins not being able to do what they do
  anymore for the limitations to be worthwhile. We don't want to introduce
  artificial limitations that break existing plugins that have become essential
  to the community that uses Dalamud.

If you have a problem with a plugin on the official repository, we recommend
reading [our plugin submission guidelines](plugin-submission) to get some
background on how we decide if a plugin should be on the official repo. If you
still think that the plugin should not be there, feel free to reach out to a
member of our team via Discord.

## I like custom repo plugin X, why is it not on the official repo?

There are various reasons for why a plugin might not be on the official repo.

- It doesn't conform to our [rules and guidelines](plugin-submission).
- It only works in conjunction with another custom repo plugin. This doesn't
  necessarily mean that the plugin in question, or the plugin it depends on,
  violate our rules and guidelines.
- The developer decided not to submit it to the official repo. We don't just
  "take" plugins and put them there, plugin developers need to go out of their
  way to submit their work to our repository. Some may prefer to run their own
  infrastructure, for various reasons - a main one being that updates on the
  official repo may take a while to be processed, as they are code-reviewed by
  the plugin approval team.
