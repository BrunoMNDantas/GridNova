import type { CSSProperties, MouseEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { mergeProps } from './mergeProps'

interface Attributes {
    role?: string
    id?: string
    title?: string
    className?: string
    style?: CSSProperties
    onClick?: (event: MouseEvent<HTMLDivElement>) => void
}

function merge(gridAttributes: Attributes, slotProps?: Attributes): Attributes {
    return mergeProps(gridAttributes, slotProps)
}

describe('mergeProps', () => {
    it('returns the own attributes when there are no consumer props', () => {
        expect(merge({ role: 'gridcell' })).toEqual({ role: 'gridcell' })
    })

    it('keeps own attributes over the consumer ones', () => {
        expect(merge({ role: 'gridcell' }, { role: 'presentation', id: 'x' })).toEqual({
            role: 'gridcell',
            id: 'x',
        })
    })

    it('lets the consumer set attributes the grid left undefined', () => {
        expect(merge({ role: 'gridcell', title: undefined }, { title: 'hi' })).toEqual({
            role: 'gridcell',
            title: 'hi',
        })
    })

    it('joins className and merges style, with the consumer winning per property', () => {
        const merged = merge(
            { className: 'a', style: { color: 'red', margin: 1 } },
            { className: 'b', style: { color: 'blue' } },
        )
        expect(merged.className).toBe('a b')
        expect(merged.style).toEqual({ color: 'blue', margin: 1 })
    })

    it('composes event handlers, own first', () => {
        const calls: string[] = []
        const merged = merge(
            { onClick: () => calls.push('own') },
            { onClick: () => calls.push('user') },
        )
        merged.onClick?.({} as MouseEvent<HTMLDivElement>)
        expect(calls).toEqual(['own', 'user'])
    })

    it('passes event arguments to both handlers', () => {
        const own = vi.fn()
        const user = vi.fn()
        const merged = merge({ onClick: own }, { onClick: user })
        const event = {} as MouseEvent<HTMLDivElement>
        merged.onClick?.(event)
        expect(own).toHaveBeenCalledWith(event)
        expect(user).toHaveBeenCalledWith(event)
    })
})
