import type { HTMLAttributes } from 'react'

/**
 * The element attributes of a slot: what `slotProps.<part>` accepts, and what a slot
 * component receives as ordinary props (role, class, `data-*`, merged `slotProps`, `children`).
 * Slot components spread them onto their element.
 */
export type SlotAttributes = HTMLAttributes<HTMLDivElement> &
    Partial<Record<`data-${string}`, string>>
