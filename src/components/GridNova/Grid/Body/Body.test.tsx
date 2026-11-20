import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderInGrid } from '../../../../test/renderInGrid'
import type { Column } from '../../../../types/Column/Column'
import { Body } from './Body'
import { DefaultBody } from './DefaultBody'
import type { BodyProps } from './DefaultBody'

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
    { id: 'age', header: 'Age', value: (user) => user.age },
]

describe('Body', () => {
    it('renders a rowgroup with one row per data row and one cell per column', () => {
        renderInGrid(<Body />, { rows, columns })

        const body = screen.getByRole('rowgroup')
        expect(body).toHaveClass('gridnova-body')
        expect(within(body).getAllByRole('row')).toHaveLength(2)
        expect(within(body).getAllByRole('row')[0]).toHaveClass('gridnova-row')
        expect(within(body).getAllByRole('gridcell')).toHaveLength(4)
    })

    it('renders no rows when there is no data', () => {
        renderInGrid(<Body />, { rows: [], columns })

        expect(within(screen.getByRole('rowgroup')).queryAllByRole('row')).toHaveLength(0)
    })

    it('renders the slot with the same props the default component takes', () => {
        const received: BodyProps[] = []
        function Slot(props: BodyProps) {
            received.push(props)

            return <DefaultBody {...props} data-custom="body" />
        }
        renderInGrid(<Body />, { rows, columns, slots: { body: Slot } })

        const body = screen.getByRole('rowgroup')
        expect(body).toHaveAttribute('data-custom', 'body')
        expect(within(body).getAllByRole('row')).toHaveLength(2)
        expect(received[0]).toMatchObject({ role: 'rowgroup', className: 'gridnova-body' })
    })

    it('merges slotProps.body and keeps its own role', () => {
        renderInGrid(<Body />, {
            rows,
            columns,
            slotProps: { body: { className: 'mine', role: 'presentation' } },
        })

        expect(screen.getByRole('rowgroup')).toHaveClass('gridnova-body', 'mine')
    })
})
