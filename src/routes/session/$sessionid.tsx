import { createFileRoute } from '@tanstack/react-router'

// TODO: Get the Workflow Id, get branding, get session, get information


export const Route = createFileRoute('/session/$sessionid')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/session/$sessionid"!</div>
}
