import { useContext } from 'react'
import { Context } from '../../context/GridContext'
import type { GridContext } from '../../context/GridContext'

export function useGrid<T>(): GridContext<T> {
    const value = useContext(Context)
    if (!value) throw new Error('This component must be rendered inside <GridNova>')

    // The context is shared by all row types; the grid's own parts know their `T`.
    return value as GridContext<T>
}
