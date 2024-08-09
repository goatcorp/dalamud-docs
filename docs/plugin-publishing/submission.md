# The Submission Process

Once you're happy with the state your plugin is in, it's time to submit it! This is a relatively involved process
where a plugin developer will build *yet another* manifest file and submit it to [our GitHub Repository][d17] for
inclusion in the official ("mainline") plugin repository.

## The D17 Workflow

Dalamud's plugin workflow is managed by a system called [Plogon][plogon], which is a powerful CI/code management
solution designed specifically for us. Plogon and D17 allows us to attest that the final binary running on an end user's
computer is generated from an exact commit hash in a publicly-available Git repository. This process ensures that both
Dalamud and its plugins remain completely open source and auditable by anyone interested.

The D17 workflow allows plugins to be submitted to two separate "tracks":

* `stable`, which is intended for builds of a given plugin intended for the public. These should be relatively
  bug-free and be properly supported. This track is controlled by the `stable/` directory in D17.
* `testing`, which is intended for experimental or new versions of a plugin. The `testing` track may sometimes be
  subdivided into child tracks, though the main testing track is called `live`. This track is controlled by the
  `testing/live/` directory in D17.
  * Other testing tracks may sometimes be created, e.g. `testing/net8`. These will be documented in the D17 readme as
    well as in the news section of this site. 

## Submitting a Plugin

In order to submit a plugin for initial inclusion into the mainline repository, you must open a pull request against
the [DalamudPluginsD17][d17] repository. This pull request must be formatted in a specific way, and follow certain
system requirements.

Please ensure you're only modifying *one* plugin per submission and pull request! This helps us work through the process
more efficiently, and allows plugins to get through review faster. Each submission must also be in its own branch to 
better protect against merge conflicts.

Every plugin submitted to D17 must follow the below directory structure, located in the appropriate track:

```
MyPluginName/
 |- manifest.toml
 |- images/
     |- icon.png
     |- image1.png [OPTIONAL]
     |- image2.png [OPTIONAL]
     |- image3.png [OPTIONAL]

```

Note that new plugins *must* be submitted to the `testing` track; that is, their directory must be placed in the
`testing/live/` directory of the repository.

The `manifest.toml` file is a special type of manifest intended for D17 consumption. A sample is provided below:

```toml
[plugin]
repository = "https://github.com/goatcorp/SamplePlugin.git"
commit = "765d9bb434ac99a27e9a3f2ba0a555b55fe6269d"
owners = ["goaaats"]
project_path = "SamplePlugin"
changelog = "Added Herobrine"
```

The `icon.png` image must have a 1:1 aspect ratio, and must be between 64x64 and 512x512 in size.

Plugin developers may optionally upload up to five marketing/preview images, named `image1.png` through `image5.png`.

### Submitting Plugin Updates

To update a plugin, submit a new pull request (from a new branch) modifying at least the `commit` field of the plugin's
`manifest.toml` file. This commit must be publicly accessible at the specified repository, though it does not need to
be on any specific branch.

You may optionally provide a `changelog` field in the `manifest.toml`, which will be displayed in the plugin installer.
If this changelog field is omitted, a changelog will be pulled from the JSON manifest or the pull request body, in that
order.

### Changing Release Tracks

To change a release track, simply copy (or move) the plugin's manifest directory to the new track's directory. Version 
bumps and commit hash changes are not required to move a plugin between tracks.

When a plugin exists in multiple tracks that can be targeted by any specific Dalamud install, the newest version (as
determined by the `AssemblyVersion` of the plugin's JSON manifest) will be installed. As such, plugin developers will
often leave older versions in tracks so that they can re-enable that track quickly.


[d17]: https://github.com/goatcorp/DalamudPluginsD17
[plogon]: https://github.com/goatcorp/Plogon