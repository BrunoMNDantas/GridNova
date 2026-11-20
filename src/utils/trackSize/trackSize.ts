import type { Column } from '../../types/Column/Column'

// A column without `width` is flexible: between these two bounds, sharing the free space.
const DEFAULT_MIN_WIDTH = 'var(--gridnova-column-min-width, 100px)'
const DEFAULT_MAX_WIDTH = '1fr'

function toCssLength(value: number | string): string {
    return typeof value === 'number' ? `${String(value)}px` : value
}

/** The CSS grid track for one column, from its `width`, `minWidth` and `maxWidth`. */
export function trackSize<T>(column: Column<T>): string {
    const { width, minWidth, maxWidth } = column
    const min = minWidth === undefined ? undefined : toCssLength(minWidth)
    const max = maxWidth === undefined ? undefined : toCssLength(maxWidth)
    const size = width === undefined ? undefined : toCssLength(width)

    if (size === undefined) {
        return `minmax(${min ?? DEFAULT_MIN_WIDTH}, ${max ?? DEFAULT_MAX_WIDTH})`
    }

    const atLeastMin = min === undefined ? size : `max(${min}, ${size})`

    return max === undefined ? atLeastMin : `min(${max}, ${atLeastMin})`
}
