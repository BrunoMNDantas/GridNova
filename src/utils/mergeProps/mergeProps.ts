type Handler = (...args: unknown[]) => void

function isHandler(name: string, a: unknown, b: unknown): boolean {
    return /^on[A-Z]/.test(name) && typeof a === 'function' && typeof b === 'function'
}

/**
 * Combines the grid's own attributes with the consumer's `slotProps`.
 * The grid's attributes win; `className` and `style` merge (the consumer's style wins per
 * property); event handlers compose (the grid's first, then the consumer's).
 */
export function mergeProps<T extends object>(gridAttributes: T, slotProps: T | undefined): T {
    // The merge works on property names, so it treats both sides as plain records.
    const grid = gridAttributes as Record<string, unknown>
    const slot = slotProps as Record<string, unknown> | undefined
    const merged: Record<string, unknown> = { ...slot }

    for (const [name, gridValue] of Object.entries(grid)) {
        if (gridValue === undefined) continue
        const slotValue = merged[name]

        if (slotValue === undefined) {
            merged[name] = gridValue
        } else if (name === 'className') {
            merged[name] = [gridValue as string, slotValue as string].join(' ')
        } else if (name === 'style') {
            merged[name] = { ...(gridValue as object), ...(slotValue as object) }
        } else if (isHandler(name, gridValue, slotValue)) {
            const gridHandler = gridValue as Handler
            const slotHandler = slotValue as Handler
            merged[name] = (...args: unknown[]) => {
                gridHandler(...args)
                slotHandler(...args)
            }
        } else {
            merged[name] = gridValue
        }
    }

    return merged as T
}
