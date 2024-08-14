# Publishing to a Custom Repository

:::warning
The Dalamud Project offers minimal support to custom repository plugins, including assistance in setting up a custom
repository.

Developers wishing to publish their plugins should strongly consider submitting their plugin to the official 
("mainline") repository.
:::

At times, developers may want to control the release cycle of their plugin more strictly than what the mainline
repository can allow. Dalamud allows end users to add custom repository paths to their installation to facilitate this
specific process.

## The Repository URL

A plugin repository, briefly, is a URL pointing to a specifically-formatted JSON file containing an array of store
entries. This URL must be accessible by an HTTP `GET` request, and may support query parameters. It does not support
authentication or authorization.

At its simplest, a plugin repository file is structured as follows:

```json5
[
  {
    "Author": "A Plugin Developer",
    "Name": "A Custom Plugin",
    "Description": "A long description about what this plugin is or does, to show upon expanding its installer entry.",
    "InternalName": "ACustomPlugin",
    "AssemblyVersion": "1.0.0.0",
    "TestingAssemblyVersion": null,
    "RepoUrl": "https://github.com/APluginDeveloper/ACustomPlugin",
    "ApplicableVersion": "any",
    "DalamudApiLevel": 10,
    "Punchline": "A short blurb about what this plugin is.",
    "IsHide": false,
    "IsTestingExclusive": false,
    "DownloadLinkInstall": "https://example.com/path/to/release/output.zip",
    "DownloadLinkTesting": "https://example.com/path/to/testing/output.zip",
    "DownloadLinkUpdate": "https://example.com/path/to/release/output.zip",
    "LastUpdate": "1701231234" 
  }
]
```

Multiple plugins may be returned by a single plugin repository URL.

## Store Entry Keys

Broadly speaking, all keys supported by the plugin manifest are also supported by the Store Entry. Store Entries also
support some additional keys:

* `IsHide` - allows hiding a plugin from clients without removing it from the manifest.
* `DownloadCount` - a count of number of times this plugin has been downloaded.
* `DownloadLinkInstall` - a URL to the artifact zip file for this plugin.
* `DownloadLinkUpdate` - a URL to use specifically when updating this plugin, e.g. for download count tracking.
* `ImageUrls` - an array of URLs to use as marketing/preview images for this plugin.
* `IconUrl` - a URL to use as the icon for this plugin in the installer.

### Testing Keys

Dalamud supports the ability to mark certain plugins as "testing only", or to publish testing builds of plugins to
prospective beta testers who opt in. This can be done using the below testing-exclusive keys. These keys are not
required unless a testing build is desired.

* `IsTestingExclusive` - marks a plugin as only available for people who have opted in to see testing plugins.
* `TestingAssemblyVersion` - the version of the plugin currently available for test.
    * Will only be used if it is greater than the release assembly version.
* `TestingChangelog` - a special changelog to display for the current test version.
* `TestingDalamudApiLevel` - the target API level for the testing release of this plugin.
* `DownloadLinkTesting` - a URL to the artifact ZIP file for the testing release of this plugin.