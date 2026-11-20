import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderInGrid } from '../../../../test/renderInGrid'
import type { Column } from '../../../../types/Column/Column'
import { DefaultHeader } from './DefaultHeader'
import type { HeaderProps } from './DefaultHeader'
import { Header } from './Header'
import type { HeaderCellProps } from './HeaderCell/DefaultHeaderCell'

interface User {
    name: string
    age: number
}

const columns: Column<User>[] = [
    { id: 'name', header: 'Name', value: (user) => user.name },
    { id: 'age', header: 'Age', value: (user) => user.age },
]

describe('Header', () => {
    it('renders a row with one header cell per column', () => {
        renderInGrid(<Header />, { columns })

        const row = screen.getByRole('row')
        expect(row).toHaveClass('gridnova-header')
        expect(row).not.toHaveClass('gridnova-row')
        expect(within(row).getAllByRole('columnheader')).toHaveLength(2)
    })

    it('renders a custom header slot around the header cells', () => {
        function Slot(props: HeaderProps) {
            return <DefaultHeader {...props} data-custom="header" />
        }
        renderInGrid(<Header />, { columns, slots: { header: Slot } })

        const row = screen.getByRole('row')
        expect(row).toHaveAttribute('data-custom', 'header')
        expect(within(row).getAllByRole('columnheader')).toHaveLength(2)
    })

    it('passes slotProps.header to the row and slotProps.headerCell to the cells', () => {
        renderInGrid(<Header />, {
            columns,
            slotProps: {
                header: { className: 'row-mine' },
                headerCell: { className: 'cell-mine' },
            },
        })

        expect(screen.getByRole('row')).toHaveClass('gridnova-header', 'row-mine')
        expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveClass(
            'gridnova-header-cell',
            'cell-mine',
        )
    })

    it('passes slots.headerCell to the cells', () => {
        function Slot({ context, ...props }: HeaderCellProps<User>) {
            return <div {...props} data-custom="cell" />
        }
        renderInGrid(<Header />, { columns, slots: { headerCell: Slot } })

        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
            'data-custom',
            'cell',
        )
    })
})
