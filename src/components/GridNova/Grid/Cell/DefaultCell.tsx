import type { Column } from '../../../../types/Column/Column'
import type { SlotAttributes } from '../../SlotAttributes'

export interface CellContext<T> {
    value: unknown
    row: T
    column: Column<T>
}

/**
 * What `slots.cell` receives, and what the default component takes: the element's attributes
 * (role, class, `data-column-id`, merged `slotProps`) as ordinary props, `children` and the
 * cell's own data in `context`. Pull out `context` and spread the rest onto the element.
 */
export type CellProps<T> = SlotAttributes & { context: CellContext<T> }

export function DefaultCell<T>({ context, ...attributes }: CellProps<T>) {
    return <div {...attributes} />
}
