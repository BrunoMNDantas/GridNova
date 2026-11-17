export interface Column<T> {
  id: keyof T & string
  header: string
}

export interface GridProps<T> {
  rows: readonly T[]
  columns: readonly Column<T>[]
}

/** Scaffold placeholder: proves generics, the build and the playground. Replaced by the first real feature. */
export function Grid<T>({ rows, columns }: GridProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.id}>{String(row[column.id])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
