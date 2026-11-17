import { Grid } from 'gridnova'

interface User {
  name: string
  email: string
  age: number
}

const rows: User[] = [
  { name: 'Ana Silva', email: 'ana@example.com', age: 31 },
  { name: 'Rui Costa', email: 'rui@example.com', age: 45 },
  { name: 'Marta Reis', email: 'marta@example.com', age: 28 },
]

export function App() {
  return (
    <main>
      <h1>GridNova playground</h1>
      <Grid
        rows={rows}
        columns={[
          { id: 'name', header: 'Name' },
          { id: 'email', header: 'Email' },
          { id: 'age', header: 'Age' },
        ]}
      />
    </main>
  )
}
