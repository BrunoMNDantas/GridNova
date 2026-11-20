import type { ReactNode } from 'react'

export interface Column<T, V = unknown> {
    id: string
    header: string
    value: (row: T) => V
    /** Replaces the content inside the default cell. */
    renderCell?(ctx: { value: V; row: T; column: Column<T, V> }): ReactNode

    /** A CSS length (numbers are pixels). Default: flexible. */
    width?: number | string
    minWidth?: number | string
    maxWidth?: number | string
}
