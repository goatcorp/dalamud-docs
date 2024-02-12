# 入门指南

插件允许您与游戏进行交互并添加功能、修改功能等等。我们要求您遵守
[我们的指南](restrictions#我在插件中可以做什么)，以确保您的插件被批准进入官方插
件存储库，并最大限度地减少 Square Enix 采取行动的风险。您可以
在[这里](restrictions#为什么您不鼓励某些类型的插件)了解更多信息。

我们建议您从克隆以下模板之一开始，然后根据您的要求进行自定义。虽然
`SamplePlugin` 是最活跃的维护者，但其他模板也会根据需要进行更新：

- [@goatcorp/SamplePlugin](https://github.com/goatcorp/SamplePlugin)
- [@karashiiro/DalamudPluginProjectTemplate](https://github.com/karashiiro/DalamudPluginProjectTemplate)
- [@lmcintyre/PluginTemplate](https://github.com/lmcintyre/PluginTemplate)

要分发插件，它需要正确打包。这可以手动完成，也可以使用
[DalamudPackager](https://github.com/goatcorp/DalamudPackager) 完成。

当您的插件准备好进行测试/发布时，您应该向
[DalamudPluginsD17](https://github.com/goatcorp/DalamudPluginsD17) 存储库发出拉
取请求。**请将测试插件放在`testing/live`文件夹中**。
