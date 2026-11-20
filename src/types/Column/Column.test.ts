import { describe, expectTypeOf, it } from 'vitest'
import type { Column } from './Column'

interface Row {
    name: string
    age: number
}

describe('Column types', () => {
    it('gives value the row type', () => {
        const column: Column<Row> = {
            id: 'name',
            header: 'Name',
            value: (row) => {
                // @ts-expect-error `nmae` is not a property of Row
                const typo: unknown = row.nmae

                return String(typo) + row.name
            },
        }
        expectTypeOf(column.value).parameter(0).toEqualTypeOf<Row>()
    })

    it('keeps Column<Row, string> assignable to Column<Row>, so typed columns can be added later', () => {
        const typed: Column<Row, string> = {
            id: 'name',
            header: 'Name',
            value: (row) => row.name,
            renderCell: ({ value }) => value.toUpperCase(),
        }
        const columns: readonly Column<Row>[] = [typed]
        expectTypeOf(columns).toEqualTypeOf<readonly Column<Row>[]>()
    })
})
