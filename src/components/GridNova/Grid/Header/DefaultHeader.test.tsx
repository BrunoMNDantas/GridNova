import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DefaultHeader } from './DefaultHeader'

describe('DefaultHeader', () => {
    it('renders the children in an element with the given attributes', () => {
        render(
            <DefaultHeader role="row" id="x">
                <span>content</span>
            </DefaultHeader>,
        )

        const row = screen.getByRole('row')
        expect(row).toHaveAttribute('id', 'x')
        expect(row).toHaveTextContent('content')
    })
})
