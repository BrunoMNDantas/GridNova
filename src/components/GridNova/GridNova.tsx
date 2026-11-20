import { useMemo } from 'react'
import type { ComponentType } from 'react'
import { Context } from '../../context/GridContext'
import type { GridContext } from '../../context/GridContext'
import type { Column } from '../../types/Column/Column'
import type { SlotAttributes } from './SlotAttributes'
import type { BodyProps } from './Grid/Body/DefaultBody'
import type { CellProps } from './Grid/Cell/DefaultCell'
import type { GridProps } from './Grid/DefaultGrid'
import { Grid } from './Grid/Grid'
import type { HeaderProps } from './Grid/Header/DefaultHeader'
import type { HeaderCellProps } from './Grid/Header/HeaderCell/DefaultHeaderCell'

// A slot is a replacement for the default component, so `GridSlots` is derived from the
// props types of the default components.
export interface GridSlots<T> {
    grid?: ComponentType<GridProps>

    header?: ComponentType<HeaderProps>
    headerCell?: ComponentType<HeaderCellProps<T>>

    body?: ComponentType<BodyProps>
    cell?: ComponentType<CellProps<T>>
}

export interface GridSlotProps {
    grid?: SlotAttributes

    header?: SlotAttributes
    headerCell?: SlotAttributes

    body?: SlotAttributes
    cell?: SlotAttributes
}

export interface GridNovaProps<T> {
    columns: readonly Column<T>[]
    rows: readonly T[]

    slots?: GridSlots<T>
    slotProps?: GridSlotProps
}

/**
 * The component consumers render. It provides the grid context built from its props and renders
 * `Grid`, which reads that context like every other part.
 */
export function GridNova<T>({ rows, columns, slots, slotProps }: GridNovaProps<T>) {
    const value = useMemo<GridContext<T>>(
        () => ({ rows, columns, slots, slotProps }),
        [rows, columns, slots, slotProps],
    )

    return (
        <Context.Provider value={value as GridContext<unknown>}>
            <Grid />
        </Context.Provider>
    )
}
