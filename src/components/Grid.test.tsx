import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Grid } from './Grid'

interface User {
  name: string
  age: number
}

describe('Grid', () => {
  it('renders a header per column and a cell per row value', () => {
    const rows: User[] = [
      { name: 'Ana', age: 31 },
      { name: 'Rui', age: 45 },
    ]

    render(
      <Grid
        rows={rows}
        columns={[
          { id: 'name', header: 'Name' },
          { id: 'age', header: 'Age' },
        ]}
      />,
    )

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Age' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Ana' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '45' })).toBeInTheDocument()
  })
})
