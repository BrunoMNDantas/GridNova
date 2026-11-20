import { GridNova } from 'gridnova'
import type { CellProps, Column } from 'gridnova'

interface User {
    name: string
    email: string
    age: number
    firstName: string
    lastName: string
}

const rows: User[] = [
    { name: 'Ana Silva', email: 'ana@example.com', age: 31, firstName: 'Ana', lastName: 'Silva' },
    { name: 'Rui Costa', email: 'rui@example.com', age: 45, firstName: 'Rui', lastName: 'Costa' },
    {
        name: 'Marta Reis',
        email: 'marta@example.com',
        age: 28,
        firstName: 'Marta',
        lastName: 'Reis',
    },
]

const columns: Column<User>[] = [
    { id: 'name', header: 'Name', value: (user) => user.name, minWidth: 160 },
    // Computed value.
    {
        id: 'initials',
        header: 'Initials',
        value: (user) => user.firstName.charAt(0) + user.lastName.charAt(0),
        width: 90,
    },
    { id: 'email', header: 'Email', value: (user) => user.email },
    // Custom cell content through renderCell.
    {
        id: 'age',
        header: 'Age',
        value: (user) => user.age,
        width: 100,
        renderCell: ({ value }) => <strong>{String(value)} y</strong>,
    },
]

// Custom cell element through the `cell` slot: highlights the cells of one column.
function HighlightCell({ context, style, ...props }: CellProps<User>) {
    return (
        <div
            {...props}
            style={{ ...style, background: context.column.id === 'age' ? '#fef9c3' : undefined }}
        />
    )
}

export function App() {
    return (
        <main>
            <h1>GridNova playground</h1>
            <h2>Default</h2>
            <GridNova rows={rows} columns={columns} />
            <h2>Custom cell slot and slotProps</h2>
            <GridNova
                rows={rows}
                columns={columns}
                slots={{ cell: HighlightCell }}
                slotProps={{ header: { style: { textTransform: 'uppercase' } } }}
            />
        </main>
    )
}
