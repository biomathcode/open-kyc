import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/blocklist')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Blocklist Coming Soon !!</div>
}
