---
sidebar_position: 10
---

# 版本和渠道

Dalamud 在版本控制方面有两个主要概念：**API 级别**和**渠道/通道**。

## 概述

| 渠道    | 分支     | API 级别 | 稳定性 | 推荐使用者                          |
| ------- | -------- | -------- | ------ | ----------------------------------- |
| Release | `master` | 8        | 最高   | 自动分配给大多数用户                |
| Canary  | `master` | 8        | 非常高 | 自动分配给少量用户                  |
| Staging | `master` | 8        | 中等   | 核心/插件开发人员、倾向于测试的用户 |
| v9      | `v9`     | 9        | 低     | 想要提前了解 v9 的核心/插件开发人员 |

## API 级别

API 级别是一个数字，每当对 Dalamud API 进行破坏性更改时就会递增。这意味着针对旧
API 级别编译的插件将无法与更新版本的 Dalamud 兼容。

### 历史

对于 Dalamud v9 及更高版本，API 级别将始终与主版本号匹配 - 即 Dalamud 9.0.0 将具
有 API 级别 9，Dalamud 10.0.0 将具有 API 级别 10，以此类推。对于当前发布版本的
Dalamud（7.x），当前的 API 级别为 8。

在 Dalamud v9 之前，API 级别与 Dalamud 版本没有直接关系。当对 Dalamud API 进行破
坏性更改或进行主要游戏补丁时，API 级别会递增。

<details>
<summary>历史 API 级别</summary>

有兴趣回顾 Dalamud 的历史吗？以下是历史 API 级别的最佳表格。

:::note

每个 API 级别的第一个提交/日期不一定是 API 升级发布的时间，而是第一个提交增加
API 级别的时间。

:::

| API 级别 | 第一个 Dalamud 版本 | 第一个游戏版本 | .NET 版本  | 第一个提交                                                                                        |
| -------- | ------------------- | -------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| 8        | 7.4.0.0             | Patch 6.3      | .NET 7.0   | [2023-01-10](https://github.com/goatcorp/Dalamud/commit/251359abe92ed805f1163f1a9da28a0aa4f891cb) |
| 7        | 7.0.0.0             | Patch 6.2      | .NET 6.0   | [2022-08-23](https://github.com/goatcorp/Dalamud/commit/6692d560296baab7758a372df10794cdf3717c17) |
| 6        | 6.4.0.0             | Patch 6.1      | .NET 5.0   | [2022-04-13](https://github.com/goatcorp/Dalamud/commit/d9f3800257fe1fa5621b9c13028c06911555889c) |
| 5        | 6.1.0.0             | Patch 6.0      | .NET 5.0   | [2021-12-04](https://github.com/goatcorp/Dalamud/commit/3f4400e67fd7c1a67f0fc86fb283a3ed3fc27304) |
| 4        | 6.0.0.17?           | Patch 5.57hf?  | .NET 5.0   | [2021-07-12](https://github.com/goatcorp/Dalamud/commit/0cb35619d2907d3cb65fce9be7dd08410fe31b7d) |
| 3        | 5.2.3.5?            | Patch 5.45?    | .NET 4.7.2 | [2021-04-01](https://github.com/goatcorp/Dalamud/commit/9751a9fed2e948cb4f114da107a7b55416c287bf) |
| 2        | 5.1.1.2?            | Patch 5.4?     | .NET 4.7.2 | [2020-12-08](https://github.com/goatcorp/Dalamud/commit/04b83f95336ec0ff006febf29b0af0afe2636a65) |
| 1        | 4.9.8.2[^1]         | Patch 5.25?    | .NET 4.7.2 | [2020-06-11](https://github.com/goatcorp/Dalamud/commit/ad93b6324f921b11c7e7dbd4565023697512c0bf) |

[^1]: 这是第一个引入 `DALAMUD_API_LEVEL` 常量的提交。越多了解，就越好！✨

</details>

## 分支和渠道

分支和渠道是两个不同的概念，但它们密切相关。分支是 Dalamud 开发的实际 git 分支，
而渠道控制用户在其客户端上接收的更新。

### 渠道

Dalamud 有几个发布渠道，每个渠道都有自己的更新节奏和稳定性保证。XIVLauncher 将自
动更新到您当前所在的渠道的最新版本，但您可以通过 `/xldev` > `Dalamud` 菜单中的“
分支切换器”选项随时切换渠道。

- **Release**：默认渠道。该渠道会更新最新的 Dalamud 稳定版本。该渠道适用于大多数
  用户。
- **Canary**：新标记的 Dalamud 发布版本会推送到此渠道。Canary 会自动分配给
  Release 渠道的一小部分用户。该渠道应该与 Release 一样稳定，但其存在有助于我们
  在新的稳定 Dalamud 发布版本到达全球所有用户之前捕捉到任何严重问题。
- **Staging (`stg`)**：该渠道会更新到 `master` 的最新提交，而不是标记的发布版本
  。新功能在移动到 Canary/Release 之前在此处提供。
- **v9**：该渠道跟踪 `v9` 分支的最新提交。该分支是 Dalamud v9 的当前开发分支，仅
  建议开发人员使用，因为它具有破坏性更改（包括 API 级别增加）
  。[您可以在此处查看有关 v9 的新内容信息。](v9)

### 分支

渠道并不总是对应于单个分支。例如，Release、Canary 和 Staging 渠道都跟踪 `master`
分支，只是在不同的节奏上。也不是每个分支都有关联的渠道。

当前的主要分支包括：

- `master`：Dalamud 的主要开发分支。该分支用于所有发布，并且是所有拉取请求的默认
  分支。
- `v9`：Dalamud v9 的开发分支。
