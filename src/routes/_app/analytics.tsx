import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/analytics')({
  component: RouteComponent,
  pendingComponent: () => (<div>Loading...</div>),
})

function RouteComponent() {
  return <div className="container w-full h-full ">
    Analytics
  </div>
}
