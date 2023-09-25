# AddonLifecycle

此服务为您提供了访问 `Addons` 的各种状态和状态更改的非常简单的方式。

该服务的主要目标是使修改本机 UI 或从插件中获取数据变得容易，而无需逆向工程并随后
挂钩每个需要交互的插件。

有时，插件不会实现自己的 Draw 或其他函数，这使得挂钩触发您需要触发代码的东西变得
非常具有挑战性。

此服务允许您按名称监听任何插件事件，无需地址。

### 提供的接口

```cs
public interface IAddonLifecycle
{
    public delegate void AddonEventDelegate(AddonEvent type, AddonArgs args);

    void RegisterListener(AddonEvent eventType, IEnumerable<string> addonNames, AddonEventDelegate handler);
    void RegisterListener(AddonEvent eventType, string addonName, AddonEventDelegate handler);
    void RegisterListener(AddonEvent eventType, AddonEventDelegate handler);

    void UnregisterListener(AddonEvent eventType, IEnumerable<string> addonNames, [Optional] AddonEventDelegate handler);
    void UnregisterListener(AddonEvent eventType, string addonName, [Optional] AddonEventDelegate handler);
    void UnregisterListener(AddonEvent eventType, [Optional] AddonEventDelegate handler);

    void UnregisterListener(params AddonEventDelegate[] handlers);
}
```

### 注册事件

您可以通过指定要监听的事件，然后选择性地指定要监听的插件名称来注册事件。

如果未提供插件名称，则服务将向您发送有关**所有**插件的通知。通常建议指定要监听的
插件。

以下是注册事件的示例代码：

```cs
AddonLifecycle.RegisterListener(AddonEvent.PreDraw, "FieldMarker", OnPreDraw);
AddonLifecycle.RegisterListener(AddonEvent.PostUpdate, "FieldMarker", OnPostUpdate);
AddonLifecycle.RegisterListener(AddonEvent.PostDraw, new[] { "Character", "FieldMarker", "NamePlate" }, OnPostDraw);
```

### 注销事件

您有几种注销事件的选项，可以使用与注册相同的语法进行注销，也可以直接注销函数，而
无需指定要注销哪些事件或插件。以下是注销事件的示例代码：

```cs
AddonLifecycle.UnregisterListener(AddonEvent.PostDraw, new[] { "Character", "FieldMarker", "NamePlate" }, OnPostDraw);
AddonLifecycle.UnregisterListener(OnPreDraw, OnPostUpdate);
```

### 可用事件

此服务提供了几个可以监听的事件：

Setup、Update、Draw、RequestedUpdate、Refresh、Finalize

每个事件都在 Pre 或 Post 监听器中使用，例如，如果您想在插件即将刷新时得到通知，
可以订阅 PreRefresh。

_注意：没有提供 PostFinalize 事件。那将是在插件已从内存中释放之后。如果您有需要
PostFinalize 事件的有效用例，请告诉我们。_

### 可用数据

当调用您的委托时，它会传递一个 AddonArgs 对象，您可以将其转换为更具体的对象以获
取原始调用中使用的参数数据。

每个事件都有自己特定的 AddonArgs 实现，其中包含可用的参数数据。如果您不确定自己
拥有哪种类型的 AddonArgs，则可以检查 `Type` 属性。

例如：

```cs
private void OnPostSetup(AddonEvent type, AddonArgs args)
{
    if (args is AddonSetupArgs setupArgs)
    {
        var valueCount = setupArgs.AtkValueCount;
        var values = (AtkValue*) setupArgs.AtkValues;
        var valueSpan = setupArgs.AtkValueSpan;
    }
}
```
