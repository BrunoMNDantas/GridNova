import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DefaultGrid } from './DefaultGrid'

describe('DefaultGrid', () => {
    it('renders the children in an element with the given attributes', () => {
        render(
            <DefaultGrid role="grid" id="x">
                <span>content</span>
            </DefaultGrid>,
        )

        const grid = screen.getByRole('grid')
        expect(grid).toHaveAttribute('id', 'x')
        expect(grid).toHaveTextContent('content')
    })
})
