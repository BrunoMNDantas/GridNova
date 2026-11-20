import type { SlotAttributes } from '../SlotAttributes'

/**
 * What `slots.grid` (the grid's outer element) receives, and what the default component
 * takes: the element's attributes as ordinary props. `children` are the header and the rows.
 */
export type GridProps = SlotAttributes

export function DefaultGrid(attributes: GridProps) {
    return <div {...attributes} />
}
