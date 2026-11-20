import './Body.css'
import type { ComponentType } from 'react'
import { useGrid } from '../../../../hooks/useGrid/useGrid'
import { mergeProps } from '../../../../utils/mergeProps/mergeProps'
import { Cell } from '../Cell/Cell'
import { DefaultBody } from './DefaultBody'
import type { BodyProps } from './DefaultBody'

/** The body: computes its attributes and renders the slot or the default around the data rows. */
export function Body() {
    const { rows, columns, slots, slotProps } = useGrid<unknown>()
    const attributes = mergeProps({ role: 'rowgroup', className: 'gridnova-body' }, slotProps?.body)

    const Component: ComponentType<BodyProps> = slots?.body ?? DefaultBody

    return (
        <Component {...attributes}>
            {rows.map((row, rowIndex) => (
                // Rows use their index as key until feature 2 introduces row ids.
                <div key={rowIndex} role="row" className="gridnova-row">
                    {columns.map((column) => (
                        <Cell key={column.id} row={row} column={column} />
                    ))}
                </div>
            ))}
        </Component>
    )
}
