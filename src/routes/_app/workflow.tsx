import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { WorkflowForm } from '~/components/forms/WorkflowForm'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'

export const Route = createFileRoute('/_app/workflow')({
    component: RouteComponent,
    loader: async ({ context: { queryClient } }) => {
        await queryClient.ensureQueryData(convexQuery(api.functions.workflows.getWorkflows, {}))
    },
    pendingComponent: () => (<div>Loading...</div>),

})
// TODO: Create Model To add workflow 
// Workflow create session link where user can enable or disable the features that he requires
// Eg: KYC, AML, Identity Verification , Document Verification etc
// Personal information -> Name, Last Name, Age, 
// Live Image 
// image documents like Aadhar, Pan, VOT, etc
// Document Upload -> pdf 

function RouteComponent() {
    const { data } = useSuspenseQuery(convexQuery(api.functions.workflows.getWorkflows, {}));

    const deleteWorkflow = useConvexMutation(api.functions.workflows.deleteWorkflow);


    return <div className="container w-full h-full ">

        <div>
            Hello Workflows
        </div>

        <div className="flex flex-col gap-2">

            {
                data.map((e) => {
                    return <Card key={e._id} className="p-2 px-0">
                        <CardHeader>
                            <CardTitle>{e.name}</CardTitle>
                            <CardDescription>
                                {e.description}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <CardAction>
                                <Button
                                    intent="danger"
                                    onClick={() => { deleteWorkflow({ id: e._id }) }}>
                                    Delete
                                </Button>
                            </CardAction>
                        </CardFooter>
                    </Card>
                })
            }
        </div>

        <WorkflowForm />
    </div>
}
