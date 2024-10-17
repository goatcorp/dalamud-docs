# Migrating to Lumina 5

Lumina 5 brings numerous changes to its Excel interface. While these breaking changes may seem superfluous or daunting, this document can be used as a guide to help with the required migration that comes with API 11.

## Excel rows are now value types

In Lumina 4, rows used to be reference types (classes) and were dynamically created and cached on access. Every row had to be manually constructed, parsed from the underlying data source, and cached into a `ConcurrentDictionary`. Unfortunately, this caused a significant slowdown in initialization times. With the change to value types, rows are now readonly structs and are created on demand when requested. The footprint of these rows are puny compared to their class counterparts (only 24 to 32 bytes per row) and do not incur any GC pressure, so feel free to copy them around at will.

## All columns are now accessed on demand

You may be wondering how these row types hold such a small memory footprint. The short answer is that they're only holding a pointer to the underlying data. When you access a column, the data is fetched from the underlying data source and returned to you. At first glance, this may seem like a substantial performance loss, but in practice, every step of the process is optimized away by the JIT compiler. The end result is the same performance as before, save for a byteswap.

In addition, all array types in generated sheets are now `Collection<T>`s. These can be treated as lightweight arrays that are evaluated ad-hoc on access. Similar to the row types, these `Collection<T>`s are also puny and can be copied around without performance penalties.

## New subrow-specific types

Lumina 5 provides some new types that are designed specificially for subrows in mind:

- `SubrowCollection<T>`: A collection of all the subrows of a particular row. This collection can be used to iterate over or arbitrarily access any matching subrow.
- `SubrowRef<T>`: A reference to a collection of subrows in a sheet. This type is used to access all the subrows of a particular row.
- `ISubrowExcelSheet`, `RawSubrowExcelSheet`, & `SubrowExcelSheet<T>`: These types contain additional helper methods on top of their traditional counterparts to access subrow-sepcific information.
- `IExcelSubrow<T>`: A new interface that all subrow types implement. This interface is similar but distinct from `IExcelRow<T>`. All subrow-specific methods and generic types require that this interface be implemented.

## LazyRow is now RowRef

The `LazyRow<T>` and `LazyRow` classes have been split into three separate structs: `RowRef<T>`, `SubrowRef<T>`, and `RowRef`. `RowRef<T>` is used to access a referenced row in a particular sheet, while `SubrowRef<T>` is used to access a collection of all the referenced subrows of a certain row. The name change was made to better reflect the purpose of these structs, as there is no lazy evaluation happening anymore (remember that all row types are trivially constructed on access).

The API for these types have also changed slightly, partly as a way to conform to the new row value semantics:

- The `RawRow` and `IsValueCreated` properties were removed.
- `ILazyRow` was removed. If you still need a generic way to reference a row in a sheet, both `RowRef<T>` and `SubrowRef<T>` can be explicitly casted to `RowRef`.
- `EmptyLazyRow` was removed. To create empty/untyped rows that do not point to any particular sheet, use `RowRef.CreateUntyped`.
  - `EmptyLazyRow.GetFirstLazyRowOrEmpty` is now equivalent to `RowRef.GetFirstValidRowOrUntyped`.
- `IsValid` can be used to check if the row exists in the referenced sheet.
- `Value` and `ValueNullable` can be used to get the row object. `Value` will throw an exception if `IsValid` is false, while `ValueNullable` will return `null`.
  - `SubrowRef<T>` returns a `SubrowCollection<T>` instead of a `T` to the first row. This collection can be used to iterate over or arbitrarily access any matching subrow.

## `ExcelModule` API Changes

The `ExcelModule` class has had a few noteworthy interface changes:

- `GetSheetNames()` has been changed to a property (`SheetNames`).
- `GetSheet<T>()` has changed to `GetSheet<T>()` and `GetSubrowSheet<T>()`.
- `GetSheetRaw()` has changed to `GetRawSheet()`.
- `GetBaseSheet()` can be used to dynamically get a sheet for any row type, including subrows.
- `RemoveSheetFromCache<T>()` has been removed. To remove all sheets whos `T` is part of a specific assembly, use `UnloadTypedCache()`.
- Some easily implementable helper methods have been removed.

## More Exceptions

Lumina 5 has added more Excel-related exceptions:

- `MismatchedColumnHashException`: The requested row type has a column hash that is different from game data.
  - Originally called `ExcelSheetColumnChecksumMismatchException`.
- `SheetAttributeMissingException`: Row type has no `SheetAttribute`. All `IExcelRow<T>` and `IExcelSubrow<T>` types must have a `SheetAttribute`.
- `SheetNameEmptyException`: Sheet name must be specified via parameter or sheet attributes.
- `SheetNotFoundException`: The requested sheet name could not be found.
- `UnsupportedLanguageException`: The sheet is not available in the requested language.

## Creating Sheets

Creating your own sheet is now a little bit different. Here's what a typical sheet implementation looks like:

<details>
<summary>Code</summary>

```csharp
using Lumina.Excel;
using Lumina.Text.ReadOnly;

[Sheet("ActionComboRoute", 0xE732FD5B)]
public unsafe readonly struct ActionComboRoute(ExcelPage page, uint offset, uint row) : IExcelRow<ActionComboRoute>
{
    public uint RowId => row;

    public readonly ReadOnlySeString Name => page.ReadString(offset, offset);
    public readonly Collection<RowRef<Action>> Action => new(page, parentOffset: offset, offset: offset, &ActionCtor, size: 7);
    public readonly sbyte Unknown3 => page.ReadInt8(offset + 18);
    public readonly bool Unknown4 => page.ReadPackedBool(offset + 19, 0);
    
    private static RowRef<Action> ActionCtor(ExcelPage page, uint parentOffset, uint offset, uint i) =>
        new(page.Module, (uint)page.ReadUInt16(offset + 4 + i * 2), page.Language);

    static ActionComboRoute IExcelRow<ActionComboRoute>.Create(ExcelPage page, uint offset, uint row) =>
        new(page, offset, row);
}
```
</details>

There are a few important things to note here:
- Column parsing is no longer the standard way to read data. If you still require column parsing, all Excel sheet types contain a `Columns` property and a `GetColumnOffset` method.
- Reading a string requires the original offset of the current row as well as the offset to the string data itself.
- Reading a `Collection<T>` requires a static constructor and cannot take a lambda. This is purely for performance reasons. See [this](https://github.com/dotnet/csharplang/discussions/6746) and [this](https://github.com/dotnet/runtime/issues/85014) for more information.
- The static `Create` method is required to be implemented for all row types. This method is used to create a new instance of the row type.
- `parentOffset` is primarily used for reading strings inside collections. It's meant to be used for the offset of the row itself.
- The `unsafe` modifier exists only for `&ActionCtor`. However, this code is perfectly safe in practice.

### Subrows

<details>
<summary>Code</summary>

```csharp
using Lumina.Excel;
using Lumina.Text.ReadOnly;

[Sheet("SatisfactionSupply", 0x8C188EB2)]
public readonly struct SatisfactionSupply(ExcelPage page, uint offset, uint row, ushort subrow) : IExcelSubrow<SatisfactionSupply>
{
    public uint RowId => row;
    public ushort SubrowId => subrow;

    public readonly RowRef<Item> Item => new(page.Module, (uint)page.ReadInt32(offset), page.Language);
    public readonly ushort CollectabilityLow => page.ReadUInt16(offset + 4);
    public readonly ushort CollectabilityMid => page.ReadUInt16(offset + 6);
    public readonly ushort CollectabilityHigh => page.ReadUInt16(offset + 8);
    public readonly RowRef<SatisfactionSupplyReward> Reward => new(page.Module, (uint)page.ReadUInt16(offset + 10), page.Language);
    public readonly ushort Unknown0 => page.ReadUInt16(offset + 12);
    public readonly ushort Unknown1 => page.ReadUInt16(offset + 14);
    public readonly byte Slot => page.ReadUInt8(offset + 16);
    public readonly byte ProbabilityPercent => page.ReadUInt8(offset + 17);
    public readonly bool Unknown2 => page.ReadPackedBool(offset + 18, 0);

    static SatisfactionSupply IExcelSubrow<SatisfactionSupply>.Create(ExcelPage page, uint offset, uint row, ushort subrow) =>
        new(page, offset, row, subrow);
}
```
</details>

The `IExcelSubrow<T>` interface is used to denote that this is a subrow type. The `subrow` parameter is used to denote the subrow id. The `Create` method (similar to `IExcelRow<T>.Create`) is used to create a new instance of the subrow type.

### Substructs

<details>
<summary>Code</summary>

```csharp
using Lumina.Excel;

[Sheet("BankaCraftWorksSupply", 0x444A6117)]
readonly public unsafe struct BankaCraftWorksSupply(ExcelPage page, uint offset, uint row) : IExcelRow<BankaCraftWorksSupply>
{
    public uint RowId => row;

    public readonly Collection<ItemStruct> Item => new(page, offset, offset, &ItemCtor, 4);
    
    private static ItemStruct ItemCtor(ExcelPage page, uint parentOffset, uint offset, uint i) => new(page, parentOffset, offset + i * 20);
    
    public readonly struct ItemStruct(ExcelPage page, uint parentOffset, uint offset)
    {
        public readonly RowRef<Item> ItemId => new(page.Module, page.ReadUInt32(offset), page.Language);
        public readonly uint XPReward => page.ReadUInt32(offset + 4);
        public readonly RowRef<CollectablesRefine> Collectability => new(page.Module, (uint)page.ReadUInt16(offset + 8), page.Language);
        public readonly ushort GilReward => page.ReadUInt16(offset + 10);
        public readonly byte Level => page.ReadUInt8(offset + 12);
        public readonly byte HighXPMultiplier => page.ReadUInt8(offset + 13);
        public readonly byte HighGilMultiplier => page.ReadUInt8(offset + 14);
        public readonly byte Unknown8 => page.ReadUInt8(offset + 15);
        public readonly byte ScripReward => page.ReadUInt8(offset + 16);
        public readonly byte HighScripMultiplier => page.ReadUInt8(offset + 17);
    }

    static BankaCraftWorksSupply IExcelRow<BankaCraftWorksSupply>.Create(ExcelPage page, uint offset, uint row) =>
        new(page, offset, row);
}
```
</details>

### Generic RowRefs

An generic or untyped `RowRef` can be created in multiple ways. If you have a column that conditionally changes the type of the sheet referenced, you can use something like this:
```csharp
public readonly RowRef SecondaryCostValue => SecondaryCostType switch
{
    32 => RowRef.Create<Sheet1>(page.Module, (uint)page.ReadUInt16(offset + 16), page.Language),
    35 => RowRef.Create<Sheet2>(page.Module, (uint)page.ReadUInt16(offset + 16), page.Language),
    46 => RowRef.Create<Sheet3>(page.Module, (uint)page.ReadUInt16(offset + 16), page.Language),
    _ => RowRef.CreateUntyped((uint)page.ReadUInt16(offset + 16), page.Language),
};
```

If you don't have a conditional value, you can use `RowRef.GetFirstValidRowOrUntyped`:
```csharp
public readonly RowRef UnlockLink =>
    RowRef.GetFirstValidRowOrUntyped(page.Module, page.ReadUInt32(offset + 4), [typeof(ChocoboTaxiStand), typeof(CraftLeve), ...], -0x62C67AEB, page.Language);
```
For more information on how to use `RowRef.GetFirstValidRowOrUntyped`, see the [additional changes](#using-rowrefcreatetypehash-to-improve-performance-for-getfirstvalidroworuntyped) section.

## Additional Changes

### Transparent RSV resolution

With API 11, Lumina now transparently resolves [RSVs](https://xiv.dev/game-internals/rsv) when accessing Excel data. This means that you no longer need to worry about resolving RSVs yourself, as Lumina will do it for you.

:::note

Dalamud is only aware of RSVs that the game has already loaded. RSVs that haven't been sent to the client yet or aren't for the client's current language will not be resolved and will stay as `_rsv_9999_-1_1_C0_0...`.

:::

### Using `RowRef.CreateTypeHash` to improve performance for `GetFirstValidRowOrUntyped`

As a side effect of removing all caching, accessing properties that use `GetFirstValidRowOrUntyped` can be ~3x slower than before. To mitigate this, you can use `RowRef.CreateTypeHash` to create a unique hash of the list of types you want to access. This hash is then used to quickly resolve the referenced sheet. This type of optimization isn't 100% necessary, but you should consider using it if you're experiencing performance issues or using a code generator to create row parsing code.