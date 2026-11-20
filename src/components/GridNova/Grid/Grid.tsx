import './Grid.css'
import type { ComponentType, CSSProperties } from 'react'
import { useGrid } from '../../../hooks/useGrid/useGrid'
import { mergeProps } from '../../../utils/mergeProps/mergeProps'
import { trackSize } from '../../../utils/trackSize/trackSize'
import { Body } from './Body/Body'
import { DefaultGrid } from './DefaultGrid'
import type { GridProps } from './DefaultGrid'
import { Header } from './Header/Header'

/** The grid element: computes its attributes and renders the slot or the default around the header and the body. */
export function Grid() {
    const { columns, slots, slotProps } = useGrid<unknown>()
    const style = {
        '--gridnova-template-columns': columns.map(trackSize).join(' '),
    } as CSSProperties
    const attributes = mergeProps({ role: 'grid', className: 'gridnova', style }, slotProps?.grid)

    const Component: ComponentType<GridProps> = slots?.grid ?? DefaultGrid

    return (
        <Component {...attributes}>
            <Header />
            <Body />
        </Component>
    )
}
