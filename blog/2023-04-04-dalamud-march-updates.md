---
title: Dalamud Updates for March 2023
authors:
  - goat
  - name: kal
    link: https://github.com/kalilistic
    image_url: https://github.com/kalilistic.png
    title: Community Contributor
---

Here's a summary of the Dalamud core updates in March. These are non-breaking
changes and we won't be incrementing the API Level. The only rare exception may
be changes in Client Structs. Please let us know if you experience any issues or
have any feedback.

## What's Changed

- Update client structs by various devs
- Improve DataShare window by Ottermandias
- Fail fast on disposing overwritten import hook by Soreepeong
- Improve plugin config writing by goaaats
- Swap FunctionPointerVariableHook to VirtualAlloc instead of HeapAlloc by
  Soreepeong

## What's New

- Add GameConfig service by Caraxi
- Add GameLifeCycle service by goaaats
- Add custom targets file for plugin defaults by goaaats
- Add Uld wrapper by Ottermandias
- Show commit count in dev bar by goaaats

## Bug Fixes

- Fix plugin service dependency order by goaaats
- Fix type confusion when assigning dep getter tasks by goaaats
- Fix installer search and change log bugs by Aireil

Thanks to [kal](https://github.com/kalilistic) for putting this together.

I also want to mention that [Avaflow](https://github.com/avafloww) and
[@KazWolfe](https://github.com/KazWolfe) are now helping me out with maintenance
on Dalamud, be it PR merges, patch updates or CS bumps. You can reach us on
Discord under `@dalamud maintainers`. They've both been around for ages and I
trust them with making the right choices in the right situations. This doesn't
mean anything for my involvement as of now. We're still working on setting up
workflows that will make work on Dalamud with multiple people better and safer,
more on that soon. You can hopefully already expect some of the bottlenecks
we've been seeing with me being more busy to disappear.

Thanks and have a good April!
