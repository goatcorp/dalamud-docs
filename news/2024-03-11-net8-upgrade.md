---
title: Dalamud .NET 8 Upgrade (15th of March)
authors:
  - goat
---

Hey everyone,

I'm happy to announce that we are planning to upgrade Dalamud to the latest version of the .NET Runtime, .NET 8, for the patch on the 19th of March.
This should be mostly transparent to plugin devs. There are some minor breaking changes that might be of interest to you, which we will list below.

If they affect you, you should be able to fix these already on .NET 7, and submit an update to your plugin now - which will mean that there is no disruption
to your users.

If you find any further issues that affected you, feel free to reach out on Discord (#plugin-dev) and we will add them here.

### Potential breaking changes

#### Plugin assembly location no longer available through reflection
It's no longer possible to obtain the location of your plugin's assembly through `Assembly.Location`, for example, via `Assembly.GetExecutingAssembly()` or `typeof`s.
This had been deprecated since our initial .NET 5 move, and the hack/hook we used to make it work(more or less reliably, but there were occasions where it fails)
had caused issues on .NET 8, which is why we finally decided to remove it.

You should use [`DalamudPluginInterface.AssemblyLocation`](https://dalamud.dev/api/Dalamud.Plugin/Classes/DalamudPluginInterface/#assemblylocation) instead.

#### IntPtr no longer used for function pointer types
.NET 8 no longer uses the IntPtr type for function pointers. If your code assumes that a function pointer is an IntPtr when reflecting members, it will no longer function.
You should use `type.IsFunctionPointer || type.IsUnmanagedFunctionPointer` instead.

Learn more about this change on the [Microsoft docs page](https://learn.microsoft.com/en-us/dotnet/core/compatibility/reflection/8.0/function-pointer-reflection).
