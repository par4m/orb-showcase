'use client'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}

function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ['id'],
    queryFn: () => fetch('http://localhost:8000/repositories').then((res) => res.json()),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  console.log(data)

  return (
    <div>
      <div>
        {data.map((a) => (
          <h1 key={a.id}>{a.name}</h1>
        ))}
      </div>
    </div>
  )
}
