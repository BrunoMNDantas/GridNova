import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { GridNova } from './GridNova'
import type { CellProps } from './Grid/Cell/DefaultCell'
import type { GridProps } from './Grid/DefaultGrid'
import type { HeaderProps } from './Grid/Header/DefaultHeader'
import type { HeaderCellProps } from './Grid/Header/HeaderCell/DefaultHeaderCell'
import type { Column } from '../../types/Column/Column'

interface User {
    name: string
    first: string
    last: string
    age: number
}

const rows: User[] = [
    { name: 'Ana', first: 'Ana', last: 'Silva', age: 31 },
    { name: 'Rui', first: 'Rui', last: 'Costa', age: 45 },
]

const columns: Column<User>[] = [
    { id: 'name', header: 'Name', value: (user) => user.name },
    { id: 'age', header: 'Age', value: (user) => user.age },
]

describe('GridNova structure', () => {
    it('renders a header per column and a cell per row and column with ARIA roles', () => {
        render(<GridNova rows={rows} columns={columns} />)

        const grid = screen.getByRole('grid')
        expect(within(grid).getAllByRole('columnheader')).toHaveLength(2)
        expect(within(grid).getAllByRole('row')).toHaveLength(3)
        expect(within(grid).getAllByRole('gridcell')).toHaveLength(4)
        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
        expect(screen.getByRole('gridcell', { name: 'Ana' })).toBeInTheDocument()
        expect(screen.getByRole('gridcell', { name: '45' })).toBeInTheDocument()
    })

    it('marks headers and cells with data-column-id', () => {
        render(<GridNova rows={rows} columns={columns} />)

        expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveAttribute(
            'data-column-id',
            'age',
        )
        expect(screen.getByRole('gridcell', { name: 'Rui' })).toHaveAttribute(
            'data-column-id',
            'name',
        )
    })

    it('renders a computed value', () => {
        render(
            <GridNova
                rows={rows}
                columns={[{ id: 'full', header: 'Full', value: (u) => `${u.first} ${u.last}` }]}
            />,
        )

        expect(screen.getByRole('gridcell', { name: 'Ana Silva' })).toBeInTheDocument()
    })

    it('renders nothing for null and undefined values', () => {
        render(
            <GridNova
                rows={[{ id: 1 }]}
                columns={[{ id: 'x', header: 'X', value: (): string | undefined => undefined }]}
            />,
        )

        expect(screen.getByRole('gridcell')).toBeEmptyDOMElement()
    })
})

describe('renderCell', () => {
    it('replaces the cell content and receives value, row and column', () => {
        const renderCell = vi.fn(({ value }: { value: unknown }) => <b>{String(value)} years</b>)
        render(
            <GridNova
                rows={rows}
                columns={[{ id: 'age', header: 'Age', value: (u) => u.age, renderCell }]}
            />,
        )

        expect(screen.getByRole('gridcell', { name: '31 years' })).toBeInTheDocument()
        const ctx = renderCell.mock.calls[0]?.[0] as unknown as {
            value: number
            row: User
            column: Column<User>
        }
        expect(ctx.value).toBe(31)
        expect(ctx.row).toBe(rows[0])
        expect(ctx.column.id).toBe('age')
    })
})

describe('slots', () => {
    function Cell({ context, ...props }: CellProps<User>) {
        return <div {...props} data-custom="cell" data-raw={String(context.value)} />
    }

    function Header(props: HeaderProps) {
        return <div {...props} data-custom="header" />
    }

    function HeaderCell({ context, ...props }: HeaderCellProps<User>) {
        return <div {...props} data-custom="header-cell" title={context.column.id} />
    }

    it('replaces the cell, header and header cell elements and keeps the grid attributes', () => {
        render(
            <GridNova
                rows={rows}
                columns={columns}
                slots={{ cell: Cell, header: Header, headerCell: HeaderCell }}
            />,
        )

        const headerRow = screen.getAllByRole('row')[0]
        expect(headerRow).toHaveAttribute('data-custom', 'header')
        expect(headerRow).toHaveClass('gridnova-header')
        const header = screen.getByRole('columnheader', { name: 'Name' })
        expect(header).toHaveAttribute('data-custom', 'header-cell')
        expect(header).toHaveAttribute('data-column-id', 'name')
        const cell = screen.getByRole('gridcell', { name: 'Ana' })
        expect(cell).toHaveAttribute('data-custom', 'cell')
        expect(cell).toHaveAttribute('data-raw', 'Ana')
        expect(cell).toHaveAttribute('data-column-id', 'name')
        expect(cell).toHaveClass('gridnova-cell')
    })

    it('uses the defaults when no slot is given', () => {
        render(<GridNova rows={rows} columns={columns} />)

        expect(screen.getByRole('gridcell', { name: 'Ana' })).not.toHaveAttribute('data-custom')
    })
})

describe('slotProps', () => {
    it('adds attributes, merges className and style, and keeps the grid attributes', () => {
        render(
            <GridNova
                rows={rows}
                columns={columns}
                slotProps={{
                    cell: {
                        className: 'mine',
                        style: { color: 'red' },
                        role: 'presentation',
                        'data-column-id': 'hijacked',
                        'data-extra': 'yes',
                    },
                }}
            />,
        )

        const cell = screen.getByRole('gridcell', { name: 'Ana' })
        expect(cell).toHaveClass('gridnova-cell', 'mine')
        expect(cell).toHaveStyle({ color: 'rgb(255, 0, 0)' })
        expect(cell).toHaveAttribute('data-extra', 'yes')
        expect(cell).toHaveAttribute('data-column-id', 'name')
    })

    it('applies to custom slots too', () => {
        function Cell({ context, ...props }: CellProps<User>) {
            return <div {...props} />
        }
        render(
            <GridNova
                rows={rows}
                columns={columns}
                slots={{ cell: Cell }}
                slotProps={{ cell: { className: 'mine' } }}
            />,
        )

        expect(screen.getByRole('gridcell', { name: 'Ana' })).toHaveClass('gridnova-cell', 'mine')
    })

    it('calls the consumer handler', async () => {
        const onClick = vi.fn()
        render(<GridNova rows={rows} columns={columns} slotProps={{ headerCell: { onClick } }} />)

        await userEvent.click(screen.getByRole('columnheader', { name: 'Name' }))

        expect(onClick).toHaveBeenCalledOnce()
    })
})

describe('grid', () => {
    it('gives the grid an accessible name through slotProps.grid', () => {
        render(
            <GridNova
                rows={rows}
                columns={columns}
                slotProps={{ grid: { 'aria-label': 'Users' } }}
            />,
        )

        expect(screen.getByRole('grid', { name: 'Users' })).toBeInTheDocument()
    })

    it('merges className and style, keeps the grid role and the column template', () => {
        render(
            <GridNova
                rows={rows}
                columns={columns}
                slotProps={{
                    grid: {
                        className: 'mine',
                        style: { color: 'red' },
                        role: 'presentation',
                        id: 'users-grid',
                    },
                }}
            />,
        )

        const grid = screen.getByRole('grid')
        expect(grid).toHaveClass('gridnova', 'mine')
        expect(grid).toHaveAttribute('id', 'users-grid')
        expect(grid).toHaveStyle({ color: 'rgb(255, 0, 0)' })
        expect(grid.style.getPropertyValue('--gridnova-template-columns')).not.toBe('')
    })

    it('replaces the grid element through slots.grid and still renders the content', () => {
        function CustomGrid(props: GridProps) {
            return <section {...props} data-custom="grid" />
        }
        render(
            <GridNova
                rows={rows}
                columns={columns}
                slots={{ grid: CustomGrid }}
                slotProps={{ grid: { className: 'mine' } }}
            />,
        )

        const grid = screen.getByRole('grid')
        expect(grid.tagName).toBe('SECTION')
        expect(grid).toHaveAttribute('data-custom', 'grid')
        expect(grid).toHaveClass('gridnova', 'mine')
        expect(grid.style.getPropertyValue('--gridnova-template-columns')).not.toBe('')
        expect(within(grid).getAllByRole('gridcell')).toHaveLength(4)
    })
})

describe('default styles', () => {
    // Each component owns a CSS file; together they form the stylesheet.
    const css = readdirSync('src/components/GridNova', { recursive: true, encoding: 'utf8' })
        .filter((file) => file.endsWith('.css'))
        .map((file) => readFileSync(`src/components/GridNova/${file}`, 'utf8'))
        .join('\n')
        // Prettier may wrap a long `var(` call; ignore that whitespace.
        .replace(/var\(\s+/g, 'var(')

    // jsdom does not compute styles from stylesheets, so check the contract textually:
    // every documented variable is read by the stylesheet (or by the component).
    it.each([
        '--gridnova-font',
        '--gridnova-border-color',
        '--gridnova-header-border',
        '--gridnova-row-border',
        '--gridnova-header-background',
        '--gridnova-header-color',
        '--gridnova-header-font-weight',
        '--gridnova-cell-padding',
    ])('reads %s', (variable) => {
        expect(css).toContain(`var(${variable}`)
    })

    it('reads --gridnova-column-min-width in the column template', () => {
        render(<GridNova rows={rows} columns={columns} />)
        expect(
            screen.getByRole('grid').style.getPropertyValue('--gridnova-template-columns'),
        ).toContain('var(--gridnova-column-min-width')
    })
})
