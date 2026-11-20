import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { Context } from '../../context/GridContext'
import type { GridContext } from '../../context/GridContext'
import { useGrid } from './useGrid'

describe('useGrid', () => {
    it('returns the grid context value', () => {
        const value: GridContext<unknown> = { rows: [], columns: [] }
        function Wrapper({ children }: { children: ReactNode }) {
            return <Context.Provider value={value}>{children}</Context.Provider>
        }

        const { result } = renderHook(() => useGrid(), { wrapper: Wrapper })

        expect(result.current).toBe(value)
    })

    it('throws outside a grid', () => {
        expect(() => renderHook(() => useGrid())).toThrow('inside <GridNova>')
    })
})
