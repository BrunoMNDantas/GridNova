import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderInGrid } from '../../../test/renderInGrid'
import type { Column } from '../../../types/Column/Column'
import { DefaultGrid } from './DefaultGrid'
import type { GridProps } from './DefaultGrid'
import { Grid } from './Grid'

interface User {
    name: string
    age: number
}

const rows: User[] = [
    { name: 'Ana', age: 31 },
    { name: 'Rui', age: 27 },
]
const columns: Column<User>[] = [
    { id: 'name', header: 'Name', value: (user) => user.name },
    { id: 'age', header: 'Age', value: (user) => user.age, width: 80 },
]

describe('Grid', () => {
    it('renders a grid with the header row and one row per data row', () => {
        renderInGrid(<Grid />, { rows, columns })

        const grid = screen.getByRole('grid')
        expect(grid).toHaveClass('gridnova')
        expect(within(grid).getAllByRole('row')).toHaveLength(3)
        expect(within(grid).getAllByRole('gridcell')).toHaveLength(4)
    })

    it('sets the column template from the columns', () => {
        renderInGrid(<Grid />, { rows, columns })

        expect(screen.getByRole('grid').style.getPropertyValue('--gridnova-template-columns')).toBe(
            'minmax(var(--gridnova-column-min-width, 100px), 1fr) 80px',
        )
    })

    it('renders the slot with the same props the default component takes', () => {
        const received: GridProps[] = []
        function Slot(props: GridProps) {
            received.push(props)

            return <DefaultGrid {...props} data-custom="grid" />
        }
        renderInGrid(<Grid />, { rows, columns, slots: { grid: Slot } })

        expect(screen.getByRole('grid')).toHaveAttribute('data-custom', 'grid')
        expect(received[0]).toMatchObject({ role: 'grid', className: 'gridnova' })
    })

    it('merges slotProps.grid and keeps its own role', () => {
        renderInGrid(<Grid />, {
            rows,
            columns,
            slotProps: { grid: { className: 'mine', role: 'presentation', 'aria-label': 'Users' } },
        })

        const grid = screen.getByRole('grid', { name: 'Users' })
        expect(grid).toHaveClass('gridnova', 'mine')
    })
})
