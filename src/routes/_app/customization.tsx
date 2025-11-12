import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/customization')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Customizations Coming Soon !!</div>
}
