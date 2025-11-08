import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/verifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/verification"!</div>
}
