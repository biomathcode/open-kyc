import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { WorkflowForm } from '~/components/forms/WorkflowForm'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'

import {
    Modal,
    ModalBody,
    ModalClose,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
} from "~/components/ui/modal"

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


    return <div className="container w-full h-full flex flex-col gap-2 ">
        <div className="flex justify-between h-10">
            <div className="text-xl font-semibold">
                Workflows
            </div>
            <Modal >
                <ModalTrigger>
                    <Button><PlusIcon /> Workflow</Button>
                </ModalTrigger>

                <ModalContent className="p-6" size="4xl"> <WorkflowForm /></ModalContent>

            </Modal>
        </div>



        <div className="flex flex-col gap-2  ">

            {
                data.map((e) => {
                    return <Card key={e._id} className="p-4 flex justify-between border  px-2">
                        <CardHeader >
                            <CardTitle>{e.name}</CardTitle>
                            <CardDescription>
                                {e.description}
                            </CardDescription>
                            <CardAction>
                                <Button
                                    intent="danger"
                                    size="sm"
                                    className=''
                                    onClick={() => { deleteWorkflow({ id: e._id }) }}>
                                    <TrashIcon size="14" />
                                </Button>
                            </CardAction>
                        </CardHeader>



                    </Card>
                })
            }
        </div>



    </div>
}
