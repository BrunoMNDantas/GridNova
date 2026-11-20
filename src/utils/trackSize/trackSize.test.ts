import { describe, expect, it } from 'vitest'
import type { Column } from '../../types/Column/Column'
import { trackSize } from './trackSize'

function column(sizing: Partial<Column<unknown>>): Column<unknown> {
    return { id: 'a', header: 'A', value: () => 1, ...sizing }
}

describe('trackSize', () => {
    it('is flexible by default', () => {
        expect(trackSize(column({}))).toBe('minmax(var(--gridnova-column-min-width, 100px), 1fr)')
    })

    it('uses a fixed width, treating numbers as pixels', () => {
        expect(trackSize(column({ width: 120 }))).toBe('120px')
    })

    it('keeps string lengths as they are', () => {
        expect(trackSize(column({ width: '20rem' }))).toBe('20rem')
    })

    it('applies minWidth and maxWidth to flexible columns', () => {
        expect(trackSize(column({ minWidth: 80, maxWidth: '300px' }))).toBe('minmax(80px, 300px)')
    })

    it('clamps a fixed width between minWidth and maxWidth', () => {
        expect(trackSize(column({ width: 200, minWidth: 250, maxWidth: 400 }))).toBe(
            'min(400px, max(250px, 200px))',
        )
    })
})
