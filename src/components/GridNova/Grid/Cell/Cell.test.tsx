import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderInGrid } from '../../../../test/renderInGrid'
import type { Column } from '../../../../types/Column/Column'
import { Cell } from './Cell'
import { DefaultCell } from './DefaultCell'
import type { CellProps } from './DefaultCell'

interface User {
    name: string
    age: number
    tags: string[]
}

const row: User = { name: 'Ana', age: 31, tags: ['a'] }
const name: Column<User> = { id: 'name', header: 'Name', value: (user) => user.name }

describe('Cell', () => {
    it('renders a gridcell with the value and data-column-id', () => {
        renderInGrid(<Cell row={row} column={name} />)

        const cell = screen.getByRole('gridcell', { name: 'Ana' })
        expect(cell).toHaveAttribute('data-column-id', 'name')
        expect(cell).toHaveClass('gridnova-cell')
    })

    it('renders numbers and booleans as text, and anything else as empty', () => {
        const age: Column<User> = { id: 'age', header: 'Age', value: (user) => user.age }
        const tags: Column<User> = { id: 'tags', header: 'Tags', value: (user) => user.tags }
        renderInGrid(
            <>
                <Cell row={row} column={age} />
                <Cell row={row} column={tags} />
            </>,
        )

        const [ageCell, tagsCell] = screen.getAllByRole('gridcell')
        expect(ageCell).toHaveTextContent('31')
        expect(tagsCell).toBeEmptyDOMElement()
    })

    it('uses renderCell for the content', () => {
        const column: Column<User> = {
            ...name,
            renderCell: ({ value }) => <b>{String(value)}!</b>,
        }
        renderInGrid(<Cell row={row} column={column} />)

        expect(screen.getByRole('gridcell', { name: 'Ana!' })).toBeInTheDocument()
    })

    it('renders the slot with the same props the default component takes', () => {
        const received: CellProps<User>[] = []
        function Slot(props: CellProps<User>) {
            received.push(props)

            return <DefaultCell {...props} />
        }
        renderInGrid(<Cell row={row} column={name} />, { slots: { cell: Slot } })

        expect(received[0]?.context).toEqual({ value: 'Ana', row, column: name })
        expect(received[0]).toMatchObject({ role: 'gridcell', 'data-column-id': 'name' })
    })

    it('merges slotProps.cell and keeps its own role and data-column-id', () => {
        renderInGrid(<Cell row={row} column={name} />, {
            slotProps: { cell: { className: 'mine', role: 'presentation', 'data-column-id': 'x' } },
        })

        const cell = screen.getByRole('gridcell', { name: 'Ana' })
        expect(cell).toHaveClass('gridnova-cell', 'mine')
        expect(cell).toHaveAttribute('data-column-id', 'name')
    })
})
