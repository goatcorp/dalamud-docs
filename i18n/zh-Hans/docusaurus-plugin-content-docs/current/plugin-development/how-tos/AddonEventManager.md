# AddonEventManager

此服务提供了一个管理器，用于向本机游戏 UI 添加和删除自定义事件。这些事件由
Dalamud 跟踪和管理，并在您的插件卸载或附加到的插件卸载时自动删除。

添加事件时，您将获得该事件的句柄，您需要该句柄才能手动注销该事件。

## 提供的接口

```cs
public interface IAddonEventManager
{
    public delegate void AddonEventHandler(AddonEventType atkEventType, nint atkUnitBase, nint atkResNode);

    IAddonEventHandle? AddEvent(nint atkUnitBase, nint atkResNode, AddonEventType eventType, AddonEventHandler eventHandler);

    void RemoveEvent(IAddonEventHandle eventHandle);

    void SetCursor(AddonCursorType cursor);

    void ResetCursor();
}
```

## Node 和 Components

_您必须为事件注册一个 `Node`，不能注册 `Component`，尝试注册 `Component` 的地址
将导致崩溃。_

有效的 Node 类型将以 `Node` 结尾。

在下面的图片中，如果您有一个 `AtkComponentButton*`，您可能需要访问 `OwnerNode`
属性并使用该节点进行注册。

![image](https://github.com/MidoriKami/dalamud-docs/assets/9083275/e4c00a43-67e4-4164-8338-6862e4e12182)

## 注册事件

在注册事件时，您需要提供插件的指针（AtkUnitBase\*）、节点的指针（AtkResNode\*）
、要触发它的事件以及您的委托。

您可能需要修改节点标志以允许该节点响应事件。

此系统非常适用于 IAddonLifecycle 服务，以便您可以轻松地在插件设置时注册事件。

```cs
// Register listener for MonsterNote setup
AddonLifecycle.RegisterListener(AddonEvent.PostSetup, "MonsterNote", OnPostSetup);

// PostSetup for MonsterNode provided by AddonLifecycle
private void OnPostSetup(AddonEvent type, AddonArgs args)
{
    var addon = (AtkUnitBase*) args.Addon;

    var targetNode = addon->GetNodeById(22);

    targetNode->NodeFlags |= NodeFlags.EmitsEvents | NodeFlags.RespondToMouse | NodeFlags.HasCollision;

    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOver, TooltipHandler);
    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOut, TooltipHandler);
}

private void TooltipHandler(AddonEventType type, IntPtr addon, IntPtr node)
{
    var addonId = ((AtkUnitBase*) addon)->ID;

    switch (type)
    {
        case AddonEventType.MouseOver:
            AtkStage.GetSingleton()->TooltipManager.ShowTooltip(addonId, (AtkResNode*)node, "This is a tooltip.");
            break;

        case AddonEventType.MouseOut:
            AtkStage.GetSingleton()->TooltipManager.HideTooltip(addonId);
            break;
    }
}
```

此示例代码的结果是，包含当前选择的狩猎日志类的文本节点将在鼠标悬停时显示工具提示
。

![image](https://github.com/goatcorp/dalamud-docs/assets/9083275/0b859b62-085c-4879-9316-2136232a3fc5)

## 注销事件

对于添加到非持久性插件（在打开和关闭时设置和完成的插件）的事件，它们不需要手动删
除，因为系统将在插件关闭时自动取消跟踪和删除任何已注册的事件。

对于添加到持久性插件（始终存在的插件，例如“\_BagWidget”、“NamePlate”）的任何事件
，您需要保存从 AddEvent 返回的事件句柄，并使用它来注销您的事件。

所有已注册的事件在您的插件卸载时都会自动从本机中删除。

以下是保存和删除事件句柄的示例。

```cs
// Class members
IAddonEventHandle MouseOver;
IAddonEventHandle MouseOut;

// Register listener for MonsterNote setup
AddonLifecycle.RegisterListener(AddonEvent.PostSetup, "MonsterNote", OnPostSetup);

// PostSetup for MonsterNode provided by AddonLifecycle
private void OnPostSetup(AddonEvent type, AddonArgs args)
{
    var addon = (AtkUnitBase*) args.Addon;

    var targetNode = addon->GetNodeById(22);

    targetNode->NodeFlags |= NodeFlags.EmitsEvents | NodeFlags.RespondToMouse | NodeFlags.HasCollision;

    MouseOver = EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOver, TooltipHandler);
    MouseOut = EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOut, TooltipHandler);
}

private void UnregisterEvents()
{
    EventManager.RemoveEvent(MouseOver);
    EventManager.RemoveEvent(MouseOut);
}
```

## 光标 API

此服务还提供了访问更改游戏光标图标的函数的功能。

这对于向用户指示可以单击的元素以触发单击事件非常有用。

```cs
// Register listener for MonsterNote setup
AddonLifecycle.RegisterListener(AddonEvent.PostSetup, "MonsterNote", OnPostSetup);

// PostSetup for MonsterNode provided by AddonLifecycle
private void OnPostSetup(AddonEvent type, AddonArgs args)
{
    var addon = (AtkUnitBase*) args.Addon;

    var targetNode = addon->GetNodeById(22);

    targetNode->NodeFlags |= NodeFlags.EmitsEvents | NodeFlags.RespondToMouse | NodeFlags.HasCollision;

    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOver, OnClickHandler);
    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseOut, OnClickHandler);
    EventManager.AddEvent((nint) addon, (nint) targetNode, AddonEventType.MouseClick, OnClickHandler);
}

private void OnClickHandler(AddonEventType type, IntPtr addon, IntPtr node)
{
    switch (type)
    {
        case AddonEventType.MouseOver:
            EventManager.SetCursor(AddonCursorType.Clickable);
            break;

        case AddonEventType.MouseOut:
            EventManager.ResetCursor();
            break;

        case AddonEventType.MouseClick:
            // Do custom click logic here.
            break;
    }
}
```

此示例代码的结果是，包含当前选择的狩猎日志类的文本节点将在单击时触发您的函数，并
更改游戏光标以指示它是可单击的。

![image](https://github.com/goatcorp/dalamud-docs/assets/9083275/78566abc-1f03-41cf-8973-dc3d3186b717)

## 日志记录

每当添加或删除事件时，它们都会记录在 `AddonEventManager` 的详细日志通道下，这对
于查看事件的情况非常有用。

![image](https://github.com/goatcorp/dalamud-docs/assets/9083275/77cb00ed-e5ea-4219-82fa-ce22b92a41ad)
