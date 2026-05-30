# Glossary

An overview of internal names and technical terminology.

## Player-Facing Systems

Terminology for game content and UI elements as seen by the player.

| System                            | Internal Name              |
| --------------------------------- | -------------------------- |
| Accessories                       | Ornament                   |
| Adventurer Plate                  | CharaCard                  |
| Aetherial Reduction               | Purify                     |
| Armoire                           | Cabinet                    |
| Beastmaster                       | XBM                        |
| Blue Mage                         | AOZ                        |
| Bozja                             | MYC                        |
| Chat Bubbles                      | MiniTalk                   |
| Chocobo Companion                 | Buddy                      |
| Chocobo Porter                    | ChocoboTaxi                |
| Chocobo Racing                    | RaceChocobo                |
| Collection                        | McGuffin                   |
| Cosmic Exploration                | WKS / MassivePcContent     |
| Crafting Log                      | RecipeNote                 |
| Crystarium Deliveries             | HugeCraftworksSupply       |
| Custom Deliveries                 | SatisfactionSupply         |
| Doman Enclave Reconstruction      | Reconstruction             |
| Doman Mahjong                     | EMJ                        |
| Dreamfitting                      | FittingShop                |
| Duty Finder                       | ContentsFinder             |
| Duty Recorder                     | ContentsReplay             |
| Duty Support                      | DawnStory                  |
| Exploratory Missions (Old Diadem) | SkyIsland                  |
| Facewear                          | Glasses                    |
| Faux Hollows                      | WeeklyPuzzle               |
| Fellowships                       | Circle                     |
| GATEs                             | GFATE                      |
| Gathering Log                     | GatheringNote              |
| Glamour Dresser                   | MiragePrismBox             |
| Glamour Plate                     | MiragePrismPlate           |
| Hall of the Novice                | BeginnerTraining           |
| Hunt Bills                        | MobHunt                    |
| Hunt Marks                        | NotoriousMonster           |
| Hunting Log                       | MonsterNote                |
| Ishgardian Restoration            | HwdDev                     |
| Island Sanctuary                  | MJI                        |
| Key Items                         | EventItem                  |
| Lord of Verminion                 | Lovm                       |
| Market Board                      | ItemSearch                 |
| Mini Cactpot                      | LotteryDaily               |
| Minion Guide                      | MinionNoteBook             |
| Moogle Delivery Service           | Letter                     |
| Moogle Tresure Trove / Mogpendium | CSBonus / MoogleCollection |
| Mount Guide                       | MountNoteBook              |
| Novice Network                    | BeginnerChat               |
| Occult Crescent                   | MKD                        |
| Ocean Fishing                     | IKD                        |
| Party Finder                      | LookingForGroup            |
| Portraits                         | Banner                     |
| Rival Wings                       | Maneuvers                  |
| Server Info in the HUD            | DTR                        |
| Shared FATE                       | FateProgress               |
| Sightseeing Log                   | AdventureNote              |
| Squadron                          | GcArmy                     |
| Stone, Sky, Sea                   | DpsChallenge               |
| Strategy Board                    | Tofu                       |
| Studium Deliveries                | SharlayanCraftworksSupply  |
| Trust                             | Dawn                       |
| UI theme                          | UIColor                    |
| Unending Codex                    | AkatsukiNote               |
| Variant/Criterion Dungeons        | VVD                        |
| Wachumeqimeqi Deliveries          | BankaCraftworksSupply      |
| Waymarks                          | FieldMarker                |
| Wondrous Tails                    | WeeklyBingo                |

<!--
| Unknown                           | KTG                        |
-->

<!-- TODO: internal names for Relics -->

## Crossovers / Collaborations

| Event             | Internal Name |
| ----------------- | ------------- |
| FINAL FANTASY XVI | SXT           |
| Fall Guys         | FGS           |
| Yo-kai Watch      | YKW           |

<!--
| MONSTER HUNTER WILDS      | ?             |
| MONSTER HUNTER: WORLD     | ?             |
| Neon Genesis Evangelion   | ?             |
| YoRHa: Dark Apocalypse    | ?             |
-->

## Technical Terms

| Term                   | Description                                                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AccountId`            | A unique ID shared by all characters on an account, only valid for the current game session. Used by the blacklist system.                                |
| `Addon`                | A window in the user interface. `Addon` is just another name for an `AtkUnitBase`, most likely based on World of Warcraft's AddOns.                       |
| `Agent`                | A controller that manages `Addon`s, handling events and callbacks.                                                                                        |
| `Atk`                  | The name of the library used for FFXIV's UI. Assumed to be an abbreviation of "Addon Toolkit".                                                            |
| `BNpc` / `BattleNpc`   | NPCs with combat abilities, such as enemies and pets.                                                                                                     |
| `ContentId`            | A unique ID for a player character. Used to locally save character settings, and saved on crafted items and the Eternity Ring.                            |
| `ENpc` / `EventNpc`    | `EventHandler`-controlled NPCs, such as quest givers and vendors.                                                                                         |
| `EObj` / `EventObject` | `EventHandler`-controlled interactable objects, such as destinations, entrances, and aether currents.                                                     |
| `EntityId`             | A unique ID for an entity in the current territory. An empty `EntityId` is `0xE0000000`. Formerly named `ObjectId`.                                       |
| `Gfd`                  | Gaiji Fontdata; stores sizes and positions for the fonticon sprite textures used in the Chat Log.                                                         |
| `Pet`                  | Carbuncle, Eos/Selene, Machinist's Rook Autoturret/Automaton Queen, White Mage's Lilybell (possibly more). Does NOT include Chocobo Companion or Minions. |
| `Rapture`              | The codename for FFXIV.                                                                                                                                   |

## Programs, Libraries and more

### Dalamud

[Dalamud](https://github.com/goatcorp/Dalamud) is a plugin development framework
for Final Fantasy XIV. It allows developers to write custom C# plugins to
interact directly with the game.

### EXDSchema

[EXDSchema](https://github.com/xivdev/EXDSchema) is a community-maintained
repository containing schema definitions for FFXIV's internal, binary Excel
files.

### FFXIVClientStructs

[FFXIVClientStructs](https://github.com/aers/FFXIVClientStructs) is a library
centralizing community research of the game's memory layout and functions and
provides native interoperability with the running process.

### Lumina

[Lumina](https://github.com/NotAdam/Lumina) is a library designed to
conveniently read FFXIV's game data from its proprietary file formats.

### Lumina.Excel

[Lumina.Excel](https://github.com/NotAdam/Lumina.Excel) is a library that uses
EXDSchema to generate C# structs for conveniently reading the game's Excel
sheets.

### XIVLauncher

[XIVLauncher](https://github.com/goatcorp/FFXIVQuickLauncher) is a custom,
modern replacement for FFXIV's launcher, adding various quality-of-life features
like auto-login, faster patching, the ability to verify and repair game files,
and being a bootstrapper responsible for injecting Dalamud into the game process
upon launch.
