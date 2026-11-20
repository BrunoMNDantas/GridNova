import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Column } from '../../../../types/Column/Column'
import { DefaultCell } from './DefaultCell'

interface User {
    name: string
}

const row: User = { name: 'Ana' }
const name: Column<User> = { id: 'name', header: 'Name', value: (user) => user.name }

describe('DefaultCell', () => {
    it('renders the children in an element with the given attributes', () => {
        render(
            <DefaultCell context={{ value: 'Ana', row, column: name }} role="gridcell" id="x">
                Ana
            </DefaultCell>,
        )

        expect(screen.getByRole('gridcell', { name: 'Ana' })).toHaveAttribute('id', 'x')
    })
})
