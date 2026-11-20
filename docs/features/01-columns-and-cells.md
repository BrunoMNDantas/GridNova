# Feature 1: Column definitions and cell rendering

**Status: APPROVED (2026-11-18). Decisions 22 to 30 in `docs/decisions.md`. Implemented and reviewed with the owner (2026-11-20, structure and naming decisions 27 to 30 made in review); playground checked by the owner. Pending approval to commit.**

## Goal

Replace the scaffold placeholder `Grid` with the real foundation: typed column definitions, a header and cell for each column, and a way for consumers to customize how cells and headers render.

## In scope

- `Column<T>` definition: identity, header text, accessor for the value, optional custom cell rendering, optional width limits.
- Header and cell rendering with accessible roles, on `div`s with CSS grid layout (decision 23).
- Customization: per-column `renderCell`, and grid-level `slots` and `slotProps` for the `grid`, `header` (header row), `headerCell`, `body` (the element holding the rows) and `cell` parts (decision 25).
- Default styling with `--gridnova-` CSS variables (decision 18), delivered as an imported stylesheet (decision 26).
- `data-*` styling hooks (decision 22): `data-column-id` on headers and cells.
- Playground demo and tests.

## Out of scope (later features)

Row ids and row-model details (feature 2), scrolling and sticky header (3), virtualization (4), selection and focus (6), keyboard navigation (7), sorting, resizing and everything else. Also deferred: a `Row` slot, `defaultColumn`, column/row heights, per-column value typing. Rows use their index as the React key until feature 2.

## Decisions taken

| #   | Decision                                                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------- |
| D1  | `div`s with ARIA roles (decision 23)                                                                           |
| D2  | Simple typing, `Column<T, V = unknown>`, accessor `value` only, no `field` (decision 24)                       |
| D3  | Per-column `renderCell`, plus `slots` and `slotProps` with `grid`, `header`, `headerCell`, `body`, `cell` (25) |
| D4  | Stylesheet imported by the consumer (decision 26)                                                              |

Also decided: `width`, `minWidth` and `maxWidth` on `Column`; no defaults at `GridNovaProps` level; no column or row heights yet.

Decided in review (2026-11-20), all in `docs/decisions.md`:

- Folder and file layout: one folder per component, hooks, contexts, utils and shared types in their own `src/` folders (decision 27).
- Every part is a container that reads the context and renders `slots.<part> ?? Default<Part>`; the entry component is `GridNova` (decision 28).
- Component code style (decision 29).
- All components are exported from the package entry (decision 30).

## Structure

```
GridNova          provides the context built from its props      (the component consumers render)
└─ Grid           the grid element                               slots.grid, DefaultGrid
   ├─ Header      the header row                                 slots.header, DefaultHeader
   │  └─ HeaderCell   one per column                             slots.headerCell, DefaultHeaderCell
   └─ Body        the element holding the data rows              slots.body, DefaultBody
      └─ Cell     one per row and column                         slots.cell, DefaultCell
```

Rows are plain `div`s inside `Body` until a `Row` component exists. Only `GridNova` works on its own; the other components read the grid context and throw outside `<GridNova>`.

## Public API

```tsx
interface Column<T, V = unknown> {
    id: string // unique
    header: string
    value: (row: T) => V // accessor; covers plain and computed columns
    renderCell?(ctx: { value: V; row: T; column: Column<T, V> }): ReactNode // method syntax, see below
    width?: number | string // default: flexible (minmax(100px, 1fr))
    minWidth?: number | string
    maxWidth?: number | string
}

interface GridNovaProps<T> {
    rows: readonly T[]
    columns: readonly Column<T>[]
    slots?: {
        grid?: ComponentType<GridProps>
        header?: ComponentType<HeaderProps>
        headerCell?: ComponentType<HeaderCellProps<T>>
        body?: ComponentType<BodyProps>
        cell?: ComponentType<CellProps<T>>
    }
    slotProps?: {
        grid?: SlotAttributes
        header?: SlotAttributes
        headerCell?: SlotAttributes
        body?: SlotAttributes
        cell?: SlotAttributes
    }
}

// Rendered by consumers: <GridNova rows={rows} columns={columns} />
```

Slot components take the same props as the default components (decision 28; all components are public, decision 30): `CellProps<T>`, `HeaderCellProps<T>`, `HeaderProps`, `BodyProps` and `GridProps`. Each is the part's HTML attributes as ordinary props (role, class, `data-column-id`, merged `slotProps`, `children`), so a slot spreads them onto its element. Data that is not an attribute arrives in one `context` prop: `{ value, row, column }` for `cell` and `{ column }` for `headerCell`. A slot pulls out `context` before spreading the rest, otherwise it would end up on the DOM element. `slotProps.grid` is how consumers give the grid an accessible name (`aria-label`).

Default content: strings, numbers, bigints and booleans render as text; `null`, `undefined`, objects and dates render empty, so those need a `renderCell`.

`renderCell` is declared so that `Column<T, string>` stays assignable to `Column<T>` (method syntax is bivariant); verify with a type test, since per-column typing may be added later without breaking users.

CSS variables (final set for this feature, prefixed `--gridnova-`): `font`, `border-color`, `column-min-width`, `cell-padding`, `header-background`, `header-color`, `header-font-weight`, `header-border` (full `border-block-end` under the header) and `row-border` (full `border-block-end` between rows). The two border variables default to `1px solid` in `border-color`. Class names are `gridnova`, `gridnova-header`, `gridnova-header-cell`, `gridnova-body`, `gridnova-row` (data rows only) and `gridnova-cell`.

## Acceptance criteria

- One header per column, one cell per row and column, with `grid`, `rowgroup`, `row`, `columnheader` and `gridcell` roles.
- `value` renders the cell content, for a plain property and for a computed value.
- `renderCell` replaces cell content; `slots.grid`, `slots.header`, `slots.headerCell`, `slots.body` and `slots.cell` replace the elements; the default is used when absent.
- `slotProps.grid`, `slotProps.header`, `slotProps.headerCell`, `slotProps.body` and `slotProps.cell` add attributes, `className`, `style` and handlers to the default or replaced part; the grid's own attributes win, `className` and `style` merge, and handlers compose (tested).
- `width`, `minWidth` and `maxWidth` affect the column sizing.
- Types: `value` receives the row type (a wrong property access is a compile error, tested); `Column<Row, string>` is assignable to `Column<Row>` (tested).
- Default styles apply and every documented variable changes the result.
- Headers and cells carry `data-column-id`, and custom `cell` and `headerCell` slots receive the attributes to spread onto their element (tested).
- The stylesheet is emitted by the build and exposed through `package.json` `exports` and `sideEffects`.
- The playground shows the grid with a custom `renderCell` and a custom `cell` slot.
- `format:check`, `lint`, `typecheck`, `test:run` and `build` pass.

## Risks

- Slot props and `data-*` names are public API from the first release; keeping them minimal limits future breaking changes.
- `role="grid"` needs an accessible name; consumers provide it through `slotProps.grid`.
- `role="grid"` promises keyboard behavior that only arrives in feature 7.
- Every exported component is public API (decision 30): the props of `Header`, `HeaderCell` and `Cell` follow semver, and they only work inside `<GridNova>`.
- `Default*` components are expected to stay thin wrappers of one element, because consumers wrap them inside slots.
