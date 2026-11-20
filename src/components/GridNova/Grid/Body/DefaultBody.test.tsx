import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DefaultBody } from './DefaultBody'

describe('DefaultBody', () => {
    it('renders the children in an element with the given attributes', () => {
        render(
            <DefaultBody role="rowgroup" id="x">
                <span>content</span>
            </DefaultBody>,
        )

        const body = screen.getByRole('rowgroup')
        expect(body).toHaveAttribute('id', 'x')
        expect(body).toHaveTextContent('content')
    })
})
