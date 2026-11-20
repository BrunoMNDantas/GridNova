import type { Column } from '../../../../../types/Column/Column'
import type { SlotAttributes } from '../../../SlotAttributes'

export interface HeaderCellContext<T> {
    column: Column<T>
}

/**
 * What `slots.headerCell` receives, and what the default component takes: the element's
 * attributes (role, class, `data-column-id`, merged `slotProps`) as ordinary props, `children`
 * and the cell's own data in `context`. Pull out `context` and spread the rest onto the element.
 */
export type HeaderCellProps<T> = SlotAttributes & { context: HeaderCellContext<T> }

export function DefaultHeaderCell<T>({ context, ...attributes }: HeaderCellProps<T>) {
    return <div {...attributes} />
}
