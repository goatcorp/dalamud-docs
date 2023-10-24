# Interacting With The Game

Virtually any plugin will eventually want to interact with the game itself in some capacity, be it to respond to certain
events or to make decisions depending on what's happening in the game. This can take a few different paths, each
depending on a developer's intent and what they want to do.

In general, developers are encouraged to use the following priority for game-based interactions:

1. Where possible, use Dalamud provided APIs to interact with the game. These are generally the safest way to work with
   the game, and provides stable APIs that won't change outside of API bumps. The Dalamud APIs also may wrap or
   abstract away complex or annoying concepts into simpler to use patterns, as well as provide certain protections to
   ensure that invalid data doesn't affect the game as much. These methods tend to be well-documented and are easy to
   work with.
2. If the Dalamud API does not expose the behavior required, developers can consume the Client Structs project. This is
   shipped with Dalamud and effectively allows plugins to use the game as a library. It provides relatively easy access
   to the game's code and structures, although it will often use pointers and other unsafe code, so developers are
   responsible for their own safety.
3. If the Client Structs project does not expose the requisite behavior, Dalamud offers escape hatches in the form of
   the ability to work with raw memory and raw functions, allowing plugins to read information from undocumented
   structures and call or hook methods using their signatures or other references.

Most plugins will stay firmly in the realm of stages 1 and 2, with stage 3 being used for novel concepts that have yet
to be [reverse engineered](reverse-engineering.md) or fully understood. Where possible, plugin developers who do
reverse engineering as part of their plugin development are encouraged to contribute their findings back to the Client
Structs project, so that other developers may use them in the future.

This section won't explain how to use Dalamud-provided APIs to interact with the game, as they're all otherwise
documented and hopefully accessible. Instead, it will focus on the more advanced concepts; that is, where
the Dalamud API doesn't quite reach.
