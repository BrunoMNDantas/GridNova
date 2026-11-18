# GridNova roadmap

What GridNova should do, in the approved build order. One line per feature; it is not a specification. Each substantial feature gets its own document in `docs/features/` before it is built. Features are built one at a time, and each ships with its own default styling (decision 18).

**Status:** scope and build order approved by the owner. The order is a plan, not a promise: changes are brought to the owner when real constraints appear.

## Phase 1: Core

1. Column definitions and cell rendering, with `Cell` and `Header` slots
2. Row model and data access (accessors, row ids)
3. Layout and scrolling (scroll containers, sticky header, scrollbar styling through CSS variables)
4. Virtualization (rows first, then columns)
5. Scroll to cell: an imperative method on a grid ref, working for cells not currently rendered
6. Cell selection and focus model
7. Keyboard navigation and accessibility (ARIA grid pattern)

## Phase 2: States and data operations

Data operations follow the controlled/uncontrolled state convention (decision 4).

8. Loading state
9. Empty state
10. Sorting
11. Filtering
12. Pagination
13. Row selection

## Phase 3: Columns and menus

14. Column resizing
15. Column reordering
16. Column visibility
17. Column pinning
18. Header menu: per-column actions, opened from a button
19. Row menu: per-row actions, opened from a button. Shares one accessible menu mechanism with the header menu.

## Phase 4: Editing and rows

20. Inline cell editing
21. Validation and error display
22. Row deletion (UI action plus callback; the grid never mutates the data itself)
23. Row resizing (user drags a row's height; no auto height)
24. Tooltip slot

## Phase 5: Heavier features

25. Clipboard copy (depends on cell selection)
26. Clipboard paste
27. CSV export (shares serialization logic with clipboard copy)
28. Server-side data mode (controlled sorting, filtering and paging)
29. Grouping and aggregation
30. Expandable rows and master-detail

## Phase 6: Last

31. Theming consolidation and density (design tokens, dark mode, density presets)
32. Internationalization (right-to-left scope still open)

## Not a feature

- Persisting grid state: handled by the application, since all exposed state is controllable and serializable (decision 16).
