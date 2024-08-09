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

## Are there any performance constraints to be aware of?

You should generally aim to not impact game performance too much as that can
degrade the experience for the player and cause other issues. A good place to
start debugging performance issues is through the Plugin Statistics window,
which can be found through Plugins > Open Plugin Stats in the dev menu
(`/xldev`).
