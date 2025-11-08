import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workflow')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/workflow"!</div>
}
