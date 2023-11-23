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
  - outside of specification, as in allowing the player to do or submit things to
    the server that would not be possible by normal means
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
