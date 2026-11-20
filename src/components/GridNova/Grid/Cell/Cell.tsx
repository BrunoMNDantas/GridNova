import './Cell.css'
import type { ComponentType, ReactNode } from 'react'
import { useGrid } from '../../../../hooks/useGrid/useGrid'
import { mergeProps } from '../../../../utils/mergeProps/mergeProps'
import type { Column } from '../../../../types/Column/Column'
import { DefaultCell } from './DefaultCell'
import type { CellProps } from './DefaultCell'

/** Primitives render as text; anything else needs a `renderCell`. */
function defaultContent(value: unknown): ReactNode {
    switch (typeof value) {
        case 'string':
        case 'number':
        case 'bigint':
        case 'boolean':
            return String(value)
        default:
            return ''
    }
}

/** One body cell: computes its value, content and attributes, and renders the slot or the default. */
export function Cell<T>({ row, column }: { row: T; column: Column<T> }) {
    const { slots, slotProps } = useGrid<T>()
    const value = column.value(row)
    const content = column.renderCell
        ? column.renderCell({ value, row, column })
        : defaultContent(value)
    const attributes = mergeProps(
        { role: 'gridcell', className: 'gridnova-cell', 'data-column-id': column.id },
        slotProps?.cell,
    )

    const Component: ComponentType<CellProps<T>> = slots?.cell ?? DefaultCell

    return (
        <Component {...attributes} context={{ value, row, column }}>
            {content}
        </Component>
    )
}
