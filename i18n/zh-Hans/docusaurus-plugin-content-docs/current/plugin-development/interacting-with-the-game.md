# 与游戏交互

几乎任何插件最终都希望以某种方式与游戏本身进行交互，无论是响应某些事件还是根据游
戏中正在发生的情况做出决策。这可以采取几种不同的路径，每种路径都取决于开发人员的
意图和他们想要做什么。

一般来说，鼓励开发人员按以下优先级使用基于游戏的交互：

1.  在可能的情况下，使用 Dalamud 提供的 API 与游戏进行交互。这通常是与游戏交互的
    最安全方式，并提供了稳定的 API，这些 API 不会在 API 升级之外发生变化
    。Dalamud API 还可以将复杂或烦人的概念包装或抽象成更简单易用的模式，并提供某
    些保护措施，以确保无效数据不会对游戏产生太大影响。这些方法往往有很好的文档，
    并且易于使用。
2.  如果 Dalamud API 没有公开所需的行为，开发人员可以使用 Client Structs 项目。
    这是随 Dalamud 一起提供的，实际上允许插件将游戏用作库。它相对容易地访问游戏
    的代码和结构，尽管它通常会使用指针和其他不安全的代码，因此开发人员需要对自己
    的安全负责。
3.  如果 Client Structs 项目没有公开所需的行为，Dalamud 提供了逃生口，以原始内存
    和原始函数的形式工作，允许插件从未记录的结构中读取信息，并使用它们的签名或其
    他引用调用或挂钩方法。

大多数插件将牢牢地停留在阶段 1 和 2 的领域，阶段 3 则用于尚未
被[逆向工程](reverse-engineering.md)或完全理解的新颖概念。在可能的情况下，鼓励作
为插件开发的一部分进行逆向工程的开发人员将其发现贡献回 Client Structs 项目，以便
其他开发人员在未来可以使用它们。

本文档页面不会解释如何使用 Dalamud 提供的 API 与游戏进行交互，因为它们都有其他文
档并且希望可以访问。相反，本文档将重点放在更高级的概念上；也就是说，Dalamud API
无法完全实现的地方。

## 我想这样做！

有时，请求游戏本身执行某些操作比自己执行操作更有益。实际上，这意味着将游戏代码用
作库，可以随意调用任何任意函数并使用其结果。这使得插件可以以与游戏相同的方式执行
计算，或者以游戏本身的方式执行操作，就好像 Dalamud 甚至不存在一样。

例如，插件可能希望检查玩家是否是导师：

```csharp
public unsafe bool IsPlayerMentor() {
    var playerStatePtr = PlayerState.Instance();
    return playerStatePtr->IsMentor();
}
```

这种方法将从 Client Structs 中获取 `PlayerState` 实例，并调用适当的检查。

### 创建自己的委托

有时，您感兴趣的方法可能不在 Client Structs 中。当这种情况发生时，开发人员可以利
用他们的逆向工程技能生成签名，然后使用它们创建自己的委托：

```csharp
public class GameFunctions {
    private delegate byte IsQuestCompletedDelegate(ushort questId);

    [Signature("E8 ?? ?? ?? ?? 41 88 84 2C")]
    private readonly IsQuestCompletedDelegate? _isQuestCompleted = null;

    public GameFunctions() {
        SignatureHelper.Initialise(this);
    }

    public bool IsQuestCompleted(ushort questId) {
        if (this._isQuestCompleted == null)
            throw new InvalidOperationException("IsQuestCompleted signature wasn't found!");

        return this._isQuestCompleted(questId) > 0;
  }
}
```

这是很多代码，所以让我们将其分解一下。

首先，开发人员声明了一个[委托][delegate-doc]，用于调用他们想要调用的函数。这通知
编译器和代码返回类型（在本例中为 `byte`）以及函数的参数。仅此一行是纯声明性的，
除了定义之外没有任何影响。如果特定参数是对未记录的指针的引用（或者开发人员根本不
关心访问结构目标中的任何数据），则通常会使用 `nint` 类型。

接下来，开发人员声明了一个可空的*实例*，其默认值设置为 `null`。然后，该实例标记
为 `[Signature(string signature)]` 属性。此属性由 Dalamud 的 `SignatureHelper`
类提供，并指定标识我们感兴趣的函数的签名。

然后，类的构造函数调用了 `SignatureHelper#Initialise`。此方法将扫描引用的对象（
在本例中为 `this`），并使用反射查找所有带有 `[Signature()]` 标记的类成员。然后，
它将自动解析签名并将适当的指针注入该变量。如果无法解析签名，则委托实例将设置为
`null`，以供开发人员处理。

最后，定义了 `IsQuestCompleted()` 方法。这存在于“托管代码”中（因此，在 C# 中），
并提供了一些围绕原始方法的使用便利性。例如，如果委托为空，则我们的方法将引发异常
，并将返回的 `byte` 转换为 `bool`。这些包装方法通常保持简单，但通常也会包含重要
的安全或健全性检查，以确保 C# 和游戏的本机代码之间有一个干净的桥梁。

[delegate-doc]:
  https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/
[unmanaged-doc]:
  https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/unmanaged-types

#### 另一种委托方式

在查看某些插件时，您可能会注意到一个略微不同的模式：

```csharp
[Signature("E8 ?? ?? ?? ?? 41 88 84 2C")]
private readonly delegate* unmanaged<ushort, byte> _isQuestCompletedDelegate;
```

这是一种更短（但可能稍微更复杂）的解决方案。不需要预先声明委托和其他信息，所有有
关委托参数和返回值的信息都包含在 `unmanaged<>` 段中。
[`unmanaged`][unmanaged-doc] 关键字表示此函数不是插件的 C# 代码的一部分，而是来
自较低级别。`<>` 中的部分表示函数的参数和返回类型。返回类型始终是列表中的*最后一
个*类型，所有其他类型都是参数类型，按相同顺序排列。例如，`<uint，string，byte>`
是一个函数，例如 `MyFunction(uint someNumber, string someString)`，返回一个
`byte`。其他所有内容都与上面的内容相同，包括可空性。

## 告诉我那时发生了什么！

插件可能希望在游戏中发生某些事件时得到通知。如果 Dalamud 中不存在事件或适当的回
调，则插件可以采用一些策略来获得通知。

### 轮询

也许是获得特定更改通知的最简单（尽管可能不是最有效）方法就是观察该更改。例如，希
望观察玩家健康状况变化的插件可以使用类似于以下代码片段的内容：

```csharp
public class HealthWatcher : IDisposable {
    private int? _lastHealth;

    public HealthWatcher() {
        Services.Framework.Update += this.OnFrameworkTick;
    }

    public void Dispose() {
        // Remember to unregister any events you create!
        Services.Framework.Update -= this.OnFrameworkTick;
    }

    private void OnFrameworkTick() {
        var player = Services.ClientState.LocalPlayer;

        if (player == null) return; // Player is not logged in, nothing we can do.
        if (player.CurrentHp == this._lastHealth) return;

        this._lastHealth = currentHealth;
        PluginLog.Information("The player's health has updated to {health}.", currentHealth);
    }
}
```

上面的代码片段创建了一个事件处理程序，每个框架刻度运行一次（每帧运行一次）。在每
个帧中，`OnFrameworkTick()` 方法将检查玩家是否存在，并将其 HP 与缓存值进行比较。
如果玩家的 HP 与缓存值不同，则会向插件日志发送消息。

:::tip

当您完成事件时，注销事件始终是一个好主意！上面的代码片段通过 `Dispose()` 方法实
现了这一点，该方法旨在由创建此方法的任何内容调用。

当不再需要事件时未注销事件（或者至少在插件卸载时注销事件）意味着代码仍将被调用，
并可能导致意外行为。作为经验法则，对于每个使用 `+=` 订阅的事件，您需要在其他地方
使用 `-=`。

:::

当然，上面的代码片段和概念可以自由适应。如果插件需要，可以通过每秒检查某些内容来
观察事件，检查代码可以是（几乎）任何内容：开发人员可以从 Client Structs 提供的
API 中读取，调用游戏方法或任何必要的计算。

### 钩子函数

有时，每帧运行代码可能是不可取的。这可能是因为某些事情相对较少发生，或者没有很好
的方法来轮询特定事件。在这种情况下，插件可以设置一个“钩子”。当插件针对游戏代码中
的某个方法创建钩子时，该钩子将被调用，*而不是*游戏的原始函数，从而允许插件观察、
改变甚至取消该方法的执行。

:::warning

重要的是要注意，钩子是一种*高度侵入性*的操作！您正在用自己的代码替换游戏的代码，
这需要采取一定程度的注意。例如，如果您的钩子内部的代码引发异常，您很可能会使游戏
崩溃。确保您正确处理/管理您的代码可能引发的异常。

在大多数情况下，钩子也是*阻塞的*，并且会阻止游戏执行，直到它们返回。确保钩子内部
的任何代码都是合理的性能，并且不会导致不必要的延迟。

:::

Dalamud 提供了一切必要的插件来创建钩子，使这个过程非常简单。例如，一个想要在任何
宏更改时得到通知的插件可以钩住 RaptureMacroModule 的 `SetSavePendingFlag`：

```csharp
public class MyHook : IDisposable {
    private delegate void SetSavePendingDelegate(RaptureMacroModule* self, byte needsSave, uint set);

    private readonly Hook<SetSavePendingDelegate>? _macroUpdateHook;

    public MyHook() {
        var macroUpdateFPtr = RaptureMacroModule.Addresses.SetSavePendingFlag.Value;
        this._macroUpdateHook = Hook<MacroUpdate>.FromAddress((nint) macroUpdateFPtr, this.DetourSetSavePending);
        this._macroUpdateHook.Enable();
    }

    public void Dispose() {
        this._macroUpdateHook.Dispose();
    }

    private nint DetourSetSavePending(RaptureMacroModule* self, byte needsSave, uint set) {
        PluginLog.Information("A macro save happened!");

        try {
            // your plugin logic goes here.
        } catch (Exception ex) {
            PluginLog.Error(ex, "An error occured when handling a macro save event.");
        }

        return this._macroUpdateHook.Original(self, needsSave, set);
    }
}
```

如果要挂钩的函数不在 Client Structs 中，则还可以通过 `SignatureHelper` 进行直接
签名：

```csharp
public class MySiggedHook : IDisposable {
    private delegate nint SetSavePendingDelegate(RaptureMacroModule* self, byte needsSave, uint set);

    [Signature("45 85 C0 75 04 88 51 3D", DetourName = nameof(DetourSetSavePending))]
    private Hook<SetSavePendingDelegate>? _macroUpdateHook;

    public MyHook() {
        this._macroUpdateHook?.Enable();
    }

    public void Dispose() {
        this._macroUpdateHook?.Dispose();
    }

    private nint DetourSetSavePending(RaptureMacroModule* self, byte needsSave, uint set) {
        PluginLog.Information("A macro save happened!");

        try {
            // your plugin logic goes here.
        } catch (Exception ex) {
            PluginLog.Error(ex, "An error occured when handling a macro save event.");
        }

        return this._macroUpdateHook!.Original(self, needsSave, set);
    }
}
```

这两个示例或多或少遵循相同的模式，只有在实际挂钩创建方式上有一些语义差异。但是，
在所有情况下，表示所讨论方法的 `delegate` 必须正确定义。此委托*必须*具有预期的返
回类型，以及任何预期的参数，而且挂钩方法*必须*适当匹配委托。有关委托是什么以及它
们如何工作的信息，请向上滚动。

与轮询一样，当不再需要时，必须正确处理挂钩。如果不这样做，挂钩函数将继续在挂钩函
数的位置运行，并可能导致问题或混乱的行为。有许多情况，插件开发人员请求帮助，只是
意识到他们的旧挂钩仍在生效！

因为多个插件可能挂钩单个方法（或一个插件可能多次挂钩同一方法！），通常最好的做法
是不修改参数或中断执行流程。虽然有许多有效的例外情况，但重要的是要意识到其他挂钩
可能存在，并且可能在您创建的挂钩之前或之后运行。
