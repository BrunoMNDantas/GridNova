import './HeaderCell.css'
import type { ComponentType } from 'react'
import { useGrid } from '../../../../../hooks/useGrid/useGrid'
import { mergeProps } from '../../../../../utils/mergeProps/mergeProps'
import type { Column } from '../../../../../types/Column/Column'
import { DefaultHeaderCell } from './DefaultHeaderCell'
import type { HeaderCellProps } from './DefaultHeaderCell'

/** One column header: computes its attributes and renders the slot or the default. */
export function HeaderCell<T>({ column }: { column: Column<T> }) {
    const { slots, slotProps } = useGrid<T>()
    const attributes = mergeProps(
        { role: 'columnheader', className: 'gridnova-header-cell', 'data-column-id': column.id },
        slotProps?.headerCell,
    )

    const Component: ComponentType<HeaderCellProps<T>> = slots?.headerCell ?? DefaultHeaderCell

    return (
        <Component {...attributes} context={{ column }}>
            {column.header}
        </Component>
    )
}
