---
title: Legacy devPlugins directory support removed
authors:
  - avaflow
---

Lali-ho! Hope you're staying cozy after the big patch.

Following up on
[goat's previous announcement from June 2022](https://github.com/goatcorp/Dalamud/discussions/892),
we are removing support in Dalamud for loading plugins from the legacy
`devPlugins` directory, which was already deprecated for quite some time. To
load plugins for development, you'll need to add a dev plugin path in your
Dalamud settings.

We understand that this change will probably have impacts on the experience of
ad-hoc user testing, but its removal should significantly reduce support burden
from unintentional use of this legacy directory, especially post-6.4. We're
continuing work on making ad-hoc testing with users easier going forward as
well, and of course are always open to feedback!

Thanks for your hard work on plogons, and see you next time! :horse: :sparkles:
