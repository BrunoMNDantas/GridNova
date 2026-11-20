import type { SlotAttributes } from '../../SlotAttributes'

/**
 * What `slots.header` (the header row) receives, and what the default component takes: the
 * element's attributes as ordinary props. `children` are the header cells.
 */
export type HeaderProps = SlotAttributes

export function DefaultHeader(attributes: HeaderProps) {
    return <div {...attributes} />
}
