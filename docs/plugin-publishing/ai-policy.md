# AI Usage Policy

This policy applies to all who are considering submitting a plugin to the
**official Dalamud plugin repository, hosted at
[goatcorp/DalamudPluginsD17](https://github.com/goatcorp/DalamudPluginsD17/).**

It **does not apply to contributions to XIVLauncher/Dalamud codebases.**

_This policy may be revised as AI tooling and community standards evolve.
Significant changes will be communicated ahead of time._

## TL;DR

Use AI if it helps, but you must understand, test, and be able to explain your
code. Disclose your level of AI use. Entirely AI-generated submissions will be
auto-rejected; undisclosed AI use or repeated violations will result in a ban.

## Purpose

This policy establishes guidelines for the acceptable use of AI tools in the
development and distribution of Dalamud plugins. Our goal is to ensure plugin
quality, maintainability, and transparency while acknowledging that AI
assistance tools are a part of some modern development workflows.

**Our intent:** We want contributors who are invested in their plugins and in
being meaningful members of the community. If you have no investment in your
work, we won't have any investment in reviewing it.

_This policy was inspired by
[Zulip's AI use policy](https://zulip.readthedocs.io/en/latest/contributing/contributing.html#ai-use-policy-and-guidelines)._

## Code

**Core Principle:** Code produced with AI assistance is held to the same
standard as code written by hand. How you produce your code is up to you; what
matters is that you can stand behind it.

**Disclosure:** If AI was used at any point beyond basic autocomplete, disclose
the level of AI involvement in your pull request description. We use the
following levels, adapted from [AI-DECLARATION.md](https://ai-declaration.md/):

- **None:** No AI tools were used at any point. _You do not need to disclose
  this level._
- **Hint:** AI autocomplete or inline suggestions only. The human writes all
  code; AI occasionally completes a line or block. _You do not need to disclose
  this level._
- **Assist:** Human-led. AI is used on demand for specific tasks (generating a
  function, explaining code, drafting a test) but does not drive the work.
- **Pair:** Active human-AI collaboration throughout. Contribution is roughly
  equal.
- **Copilot:** AI implements while the human plans and reviews. The human
  defines what to build and validates the output, but the AI does most of the
  writing.
- **Auto:** AI acts autonomously with minimal human direction. The human may
  steer at a high level or approve outcomes, but does not write or closely
  direct the code.

If you did not use AI, or only used basic autocomplete/inline suggestions, you
do not need to disclose anything.

**Requirements:**

- Personally test your plugin before submission
- The answer to "Why did you implement it this way?" should never be "I'm not
  sure, the AI did it"
- Verify AI output - it frequently gets Dalamud and adjacent APIs wrong
- Be respectful and receptive to feedback - we don't judge, but we have a duty
  to our users and want to maintain a level of quality

**Enforcement:**

- **Entirely AI-generated plugins** with no meaningful human involvement will be
  auto-rejected. Doing this twice will result in a ban.
- **Undisclosed AI use** in a demonstrably AI-written submission will result in
  a ban.
- **Fixable issues:** If your submission shows AI-generated mistakes but clear
  human intent, we'll close it with an opportunity to fix and resubmit.

Our review time is limited. Please don't waste it.

## Assets (Icons, Images, Music, Sounds, Textures)

**Core Principle:** AI-generated assets are significantly more visible and
contentious than code - users interact with them directly, and community
sentiment towards AI-generated content is often negative. Be prepared for this.

**For plugin icons specifically,** we want to encourage you to put together a
hand-made icon for the plugin installer and may ask you personally to do so.
When in doubt, we prefer a crude MS Paint icon over an AI-generated icon; the
former is more in line with our community's values. Feel free to reach out on
our Discord, someone will be happy to make one for you!

**Requirements:**

- Disclose any AI-generated assets in your plugin's description - unlike code,
  assets are user-facing, so users should be informed
- AI-generated audio (music, sounds) should be toggle-able or replaceable by
  user selections where possible

**Enforcement:** The same enforcement rules apply as for code. Undisclosed
AI-generated assets in a submission will be treated the same as undisclosed
AI-generated code.

## Translations

AI-assisted translations are acceptable, particularly as placeholders. However,
be aware that AI translations cannot always capture the nuance of the original
text without sufficient context - this is especially true in jargon-laden
contexts like games, where terminology may have specific established meanings.
We encourage developers to:

- Consult with native speakers wherever possible to catch mistranslations or
  awkward phrasing
- Seek community translators for final localization
- Use platforms like Crowdin, which support AI assistance with human review
- Accept corrections from native speakers

## Questions?

Please join our [Discord server](https://discord.gg/holdshift) if you have any
questions before or during development. We have a developer role that provides
access to developer-oriented channels.

Alternatively, feel free to ask through a comment on the PR for your plugin.
