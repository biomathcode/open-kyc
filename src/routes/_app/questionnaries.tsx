import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/questionnaries')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/questionnaires"!</div>
}
