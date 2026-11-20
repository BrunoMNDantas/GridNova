import './Header.css'
import type { ComponentType } from 'react'
import { useGrid } from '../../../../hooks/useGrid/useGrid'
import { mergeProps } from '../../../../utils/mergeProps/mergeProps'
import { DefaultHeader } from './DefaultHeader'
import type { HeaderProps } from './DefaultHeader'
import { HeaderCell } from './HeaderCell/HeaderCell'

/** The header row: computes its attributes and renders the slot or the default. */
export function Header() {
    const { columns, slots, slotProps } = useGrid<unknown>()
    const attributes = mergeProps({ role: 'row', className: 'gridnova-header' }, slotProps?.header)

    const Component: ComponentType<HeaderProps> = slots?.header ?? DefaultHeader

    return (
        <Component {...attributes}>
            {columns.map((column) => (
                <HeaderCell key={column.id} column={column} />
            ))}
        </Component>
    )
}
