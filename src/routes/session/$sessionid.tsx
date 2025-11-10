import { createFileRoute } from '@tanstack/react-router'

// TODO: Get the Workflow Id, get branding, get session, get information

// TODO: Mobile UI Optimized
// TODO: Background Check
// TODO: Get Analytics
// TODO: Add Camera Feed 

export const Route = createFileRoute('/session/$sessionid')({
    component: RouteComponent,
})

function RouteComponent() {
    const { sessionid: id } = Route.useParams();

    return <div className='container'>
        <h1>Session {id}</h1>


    </div>
}
