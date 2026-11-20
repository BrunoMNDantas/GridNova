import type { SlotAttributes } from '../../SlotAttributes'

/**
 * What `slots.body` (the element that holds the data rows) receives, and what the default
 * component takes: the element's attributes as ordinary props. `children` are the rows.
 */
export type BodyProps = SlotAttributes

export function DefaultBody(attributes: BodyProps) {
    return <div {...attributes} />
}
