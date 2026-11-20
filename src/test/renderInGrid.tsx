import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Context } from '../context/GridContext'
import type { GridContext } from '../context/GridContext'

/** Renders a single grid part with a grid context, without the rest of the grid. */
export function renderInGrid<T>(ui: ReactElement, context: Partial<GridContext<T>> = {}) {
    const value = { rows: [], columns: [], ...context } as GridContext<unknown>

    return render(<Context.Provider value={value}>{ui}</Context.Provider>)
}
