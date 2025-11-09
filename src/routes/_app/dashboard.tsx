import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="container w-full h-full ">

    <div>
      Hello Dashboard
    </div>
  </div>
}
