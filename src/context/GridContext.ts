import { createContext } from 'react'
import type { Column } from '../types/Column/Column'
import type { GridSlotProps, GridSlots } from '../components/GridNova/GridNova'

/**
 * Internal (not public API). What every part of the grid reads instead of receiving props.
 * Later features add derived data here (sorted, filtered and reordered rows and columns)
 * and their state. Parts read it through `useGrid()`.
 */
export interface GridContext<T> {
    columns: readonly Column<T>[]
    rows: readonly T[]

    slots?: GridSlots<T>
    slotProps?: GridSlotProps
}

export const Context = createContext<GridContext<unknown> | null>(null)
