import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderInGrid } from '../../../../../test/renderInGrid'
import type { Column } from '../../../../../types/Column/Column'
import { DefaultHeaderCell } from './DefaultHeaderCell'
import type { HeaderCellProps } from './DefaultHeaderCell'
import { HeaderCell } from './HeaderCell'

interface User {
    name: string
}

const column: Column<User> = { id: 'name', header: 'Name', value: (user) => user.name }

describe('HeaderCell', () => {
    it('renders a columnheader with the header text and data-column-id', () => {
        renderInGrid(<HeaderCell column={column} />)

        const cell = screen.getByRole('columnheader', { name: 'Name' })
        expect(cell).toHaveAttribute('data-column-id', 'name')
        expect(cell).toHaveClass('gridnova-header-cell')
    })

    it('renders the slot with the same props the default component takes', () => {
        const received: HeaderCellProps<User>[] = []
        function Slot(props: HeaderCellProps<User>) {
            received.push(props)

            return <DefaultHeaderCell {...props} />
        }
        renderInGrid(<HeaderCell column={column} />, { slots: { headerCell: Slot } })

        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
        expect(received[0]?.context.column).toBe(column)
        expect(received[0]).toMatchObject({
            role: 'columnheader',
            'data-column-id': 'name',
        })
    })

    it('merges slotProps.headerCell and keeps its own role and data-column-id', () => {
        renderInGrid(<HeaderCell column={column} />, {
            slotProps: {
                headerCell: { className: 'mine', role: 'presentation', 'data-column-id': 'x' },
            },
        })

        const cell = screen.getByRole('columnheader', { name: 'Name' })
        expect(cell).toHaveClass('gridnova-header-cell', 'mine')
        expect(cell).toHaveAttribute('data-column-id', 'name')
    })
})
