# Feature 1: Column definitions and cell rendering

**Status: DRAFT. Nothing here is approved until the owner decides the open questions.**

## Goal

Replace the scaffold placeholder `Grid` with the real foundation: typed column definitions, a header and cell for each column, and a way for consumers to customize how cells and headers render.

## In scope

- `Column<T>` definition: identity, header text, how to read the value from a row, optional custom cell rendering, optional width.
- Header and cell rendering with accessible roles.
- Customization through slots (decision 3): `Cell` and `Header`.
- Default styling with `--gridnova-` CSS variables (decision 18), delivered to consumers in the way decided below.
- `data-*` styling hooks (decision 22): `data-column-id` on headers and cells.
- Playground demo and tests.

## Out of scope (later features)

Row ids and row-model details (feature 2), scrolling and sticky header (3), virtualization (4), selection and focus (6), keyboard navigation (7), sorting, resizing and everything else. Rows use their index as the React key until feature 2.

## Open decisions for the owner

### D1. DOM structure: `<table>` or `div` with ARIA roles

- **A. `<table>`.** The simplest markup, with native semantics for free. Virtualization, sticky and pinned columns, and resizing are all awkward in tables and need workarounds.
- **B. `div`s with ARIA roles (`grid`, `row`, `columnheader`, `gridcell`) and CSS grid layout.** More work up front, since we must set roles correctly ourselves. It is the standard base for virtualized grids and makes pinning, resizing and virtualization natural.

**Recommendation: B.** Features 3, 4, 14 and 17 would otherwise force a rewrite of the markup.

### D2. Column typing

- **A. Simple:** `Column<T>` with `field: keyof T` for plain properties and an optional `value: (row: T) => unknown` for computed ones. A cell's value type is `unknown` (not narrowed per column).
- **B. Per-column value typing:** `Column<T, V>` plus a helper that infers `V` for each column, so a custom cell receives a correctly typed value. Strongest typing, but more API surface and a helper function consumers must use.

**Recommendation: A**, with `Column<T, V = unknown>` so B can be added later without breaking anyone.

### D3. Where customization lives

- **Per column:** `renderCell: ({ value, row }) => ReactNode` replaces only the content inside the default cell (formatting a date, rendering a badge). This is what most users need.
- **Grid-level slots:** `slots={{ Cell, Header }}` replace the whole cell or header element for every column (decision 3).

**Recommendation: both**, kept minimal: per-column `renderCell`, and grid-level `Cell` and `Header` slots. Each slot's props become public API, so they stay small (`value`, `row`, `column` for `Cell`; `column` for `Header`).

### D4. How CSS reaches consumers

- **A. A stylesheet the consumer imports once** (`import 'gridnova/styles.css'`). Plain CSS with prefixed class names and variables, works with every bundler and with SSR, easy to override. One extra import line for users.
- **B. Styles injected by the JS bundle.** No extra import, but styles are added at runtime, which can conflict with strict Content Security Policies and cause flashes on server rendering.
- **C. CSS-in-JS at runtime.** Heavy and awkward with React 19 and server rendering. Not recommended.

**Recommendation: A**, with plain `gridnova-*` class names (not hashed) so consumers can target them. This needs the Vite library build to emit the CSS file and `package.json` `exports` to expose it.

## Proposed public API (if the recommendations are accepted)

```tsx
interface Column<T, V = unknown> {
  id: string // unique
  header: string
  field?: keyof T & string // plain property
  value?: (row: T) => V // computed value; takes precedence over field
  renderCell?: (ctx: { value: V; row: T; column: Column<T, V> }) => ReactNode
  width?: number | string // default: flexible (minmax(100px, 1fr))
}

interface GridProps<T> {
  rows: readonly T[]
  columns: readonly Column<T>[]
  slots?: { Cell?: ComponentType<CellProps<T>>; Header?: ComponentType<HeaderProps<T>> }
}
```

CSS variables (initial set, prefixed `--gridnova-`): header background and color, cell padding, border color, font. The list is finalized when styles are written.

## Acceptance criteria

- One header per column, one cell per row and column, with `grid`, `row`, `columnheader` and `gridcell` roles (if D1 = B).
- A plain `field` and a computed `value` both render; `value` wins when both are set.
- `renderCell` replaces cell content; `slots.Cell` and `slots.Header` replace the elements; the default is used when absent.
- Types: `field` only accepts keys of the row type; passing a wrong key is a compile error (tested).
- Default styles apply and every documented variable changes the result.
- Headers and cells carry `data-column-id`, and custom `Cell` and `Header` slots receive the attributes to spread onto their element (tested).
- The playground shows the grid with a custom `renderCell` and a custom `Cell` slot.
- `format:check`, `lint`, `typecheck`, `test:run` and `build` pass.

## Risks

- D1 and D4 are expensive to reverse once consumers exist.
- Slot props are public API from the first release; keeping them minimal limits future breaking changes.
