<!--lint disable maximum-heading-length-->

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
