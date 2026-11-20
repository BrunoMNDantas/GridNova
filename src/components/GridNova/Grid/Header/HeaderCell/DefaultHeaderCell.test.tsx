import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Column } from '../../../../../types/Column/Column'
import { DefaultHeaderCell } from './DefaultHeaderCell'

interface User {
    name: string
}

const column: Column<User> = { id: 'name', header: 'Name', value: (user) => user.name }

describe('DefaultHeaderCell', () => {
    it('renders the children in an element with the given attributes', () => {
        render(
            <DefaultHeaderCell context={{ column }} role="columnheader" id="x">
                Name
            </DefaultHeaderCell>,
        )

        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('id', 'x')
    })
})
