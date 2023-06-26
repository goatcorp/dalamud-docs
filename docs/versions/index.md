---
sidebar_position: 10
---

# Versions & Channels

Dalamud has two major concepts in terms of versioning: **API Level** and
**Channel/Track**.

## Summary

| Channel | Branch   | API Level | Stability | Recommended For                                           |
| ------- | -------- | --------- | --------- | --------------------------------------------------------- |
| Release | `master` | 8         | Highest   | Auto-assigned to most users                            |
| Canary  | `master` | 8         | Very High | Auto-assigned to a small number of users                            |
| Staging | `master` | 8         | Medium    | Core/plugin developers, testing-inclined users            |
| v9      | `v9`     | 9         | Low       | Core/plugin developers who want to get a head start on v9 |

## API Level

The API Level is a number that is incremented whenever a breaking change is made
to the Dalamud API. This means that plugins that were compiled against an older
API Level will not work with newer versions of Dalamud.

### History

For Dalamud v9 and higher, the API Level will _always_ match the major version
number - i.e. Dalamud 9.0.0 will have API Level 9, Dalamud 10.0.0 will have API
Level 10, etc. For the current release version of Dalamud (7.x), the current API
level is 8.

Before Dalamud v9, the API level did not have a direct relation to the Dalamud
version. The API level was incremented whenever a breaking change was made to
the Dalamud API, or for major game patches.

<details>
<summary>Historical API Levels</summary>

Interested in taking a trip down Dalamud memory lane? Here's a best-effort table
of historical API levels.

:::note

The first commit/date of each API level is not necessarily when the API bump was
released, but rather when the first commit was made that incremented the API
level.

:::

| API Level | First Dalamud Version | First Game Version | .NET Version | First Commit                                                                                      |
| --------- | --------------------- | ------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| 8         | 7.4.0.0               | Patch 6.3          | .NET 7.0     | [2023-01-10](https://github.com/goatcorp/Dalamud/commit/251359abe92ed805f1163f1a9da28a0aa4f891cb) |
| 7         | 7.0.0.0               | Patch 6.2          | .NET 6.0     | [2022-08-23](https://github.com/goatcorp/Dalamud/commit/6692d560296baab7758a372df10794cdf3717c17) |
| 6         | 6.4.0.0               | Patch 6.1          | .NET 5.0     | [2022-04-13](https://github.com/goatcorp/Dalamud/commit/d9f3800257fe1fa5621b9c13028c06911555889c) |
| 5         | 6.1.0.0               | Patch 6.0          | .NET 5.0     | [2021-12-04](https://github.com/goatcorp/Dalamud/commit/3f4400e67fd7c1a67f0fc86fb283a3ed3fc27304) |
| 4         | 6.0.0.17?             | Patch 5.57hf?      | .NET 5.0     | [2021-07-12](https://github.com/goatcorp/Dalamud/commit/0cb35619d2907d3cb65fce9be7dd08410fe31b7d) |
| 3         | 5.2.3.5?              | Patch 5.45?        | .NET 4.7.2   | [2021-04-01](https://github.com/goatcorp/Dalamud/commit/9751a9fed2e948cb4f114da107a7b55416c287bf) |
| 2         | 5.1.1.2?              | Patch 5.4?         | .NET 4.7.2   | [2020-12-08](https://github.com/goatcorp/Dalamud/commit/04b83f95336ec0ff006febf29b0af0afe2636a65) |
| 1         | 4.9.8.2\[^1]          | Patch 5.25?        | .NET 4.7.2   | [2020-06-11](https://github.com/goatcorp/Dalamud/commit/ad93b6324f921b11c7e7dbd4565023697512c0bf) |

\[^1]: This was the first commit to introduce the `DALAMUD_API_LEVEL` constant.
The more you know! ✨

</details>

## Branches & Channels

Branches are channels are two different concepts, but they are closely related.
Branches are the actual git branches that Dalamud is developed on, while
Channels control the updates that users receive on their clients.

### Channels

Dalamud has several release channels, each with their own update cadence and
stability guarantees. XIVLauncher will automatically update to the latest
version of the channel you are currently on, but you can switch channel at any
time through the "Branch Switcher" option in the `/xldev` > `Dalamud` menu.

- **Release**: The default channel. This channel is updated with the latest
  stable release of Dalamud. This channel is recommended for most users.
- **Canary**: Newly tagged Dalamud releases are pushed to this channel. Canary
  is automatically assigned to a small subset of users from the Release
  channel. This channel should be just as stable as Release, but its existence helps us catch
  any serious issues with a new stable Dalamud release before it reaches all
  users worldwide.
- **Staging (`stg`)**: This channel is updated with the latest commits to
  `master`, before a release version is tagged. New features are made
  available here before being moved to Canary/Release.
- **v9**: This channel tracks the latest commits to the `v9` branch. This branch
  is the current development branch for Dalamud v9, and is recommended only for
  developers to use, as it has breaking changes (including an API level bump).
  [You can view information on what's new in v9 here.](v9)

### Branches

Channels don't always correspond to a single branch. For example, Release,
Canary, and Staging channels all track the `master` branch, just at different
cadences. Not every branch has an associated channel, either.

The current main branches are:

- `master`: The main development branch for Dalamud. This branch is used for all
  releases, and is the default branch for all pull requests.
- `v9`: The development branch for Dalamud v9.
