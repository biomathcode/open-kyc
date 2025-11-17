
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'

import {
  ChoiceBox,
  ChoiceBoxDescription,
  ChoiceBoxItem,
  ChoiceBoxLabel,
} from "~/components/ui/choice-box"
import { TrafficChart } from '~/components/charts/TrafficChart'
import { NewsChart } from '~/components/charts/CountryChart'
import { SessionChart } from '~/components/charts/SessionChart'


export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.sessions.getSessions, {}))
  },
  pendingComponent: () => (<div>Loading...</div>),
})



export function GetStartedList() {




  return (
    <div className=" overflow-hidden border rounded-2xl w-full">
      <div className="py-2 bg-sidebar  z-10 text-md font-semibold px-2 text-neutral-600">
        Get Started with OpenKYC
      </div>
      <div className="p-2">
        <ChoiceBox className=" selection:bg-primary ring-0 hover:ring-0 active:ring-0 " aria-label="Select items" selectionMode="multiple">
          <ChoiceBoxItem textValue="premium">
            <ChoiceBoxLabel>Create Workflow</ChoiceBoxLabel>
            <ChoiceBoxDescription>Automate tasks with advanced workflow tools.</ChoiceBoxDescription>
          </ChoiceBoxItem>
          <ChoiceBoxItem textValue="deluxe">
            <ChoiceBoxLabel>Create Verification Sessions</ChoiceBoxLabel>
            <ChoiceBoxDescription>Run secure and efficient verification sessions.</ChoiceBoxDescription>
          </ChoiceBoxItem>
          <ChoiceBoxItem textValue="ultimate">
            <ChoiceBoxLabel>Get Analytics</ChoiceBoxLabel>
            <ChoiceBoxDescription>Gain full insights with comprehensive analytics.</ChoiceBoxDescription>
          </ChoiceBoxItem>
          <ChoiceBoxItem textValue="enterprise">
            <ChoiceBoxLabel>AI powered verification</ChoiceBoxLabel>
            <ChoiceBoxDescription>Custom AI solutions for enterprise-scale operations.</ChoiceBoxDescription>
          </ChoiceBoxItem>
        </ChoiceBox>

      </div>

    </div>

  )
}








function RouteComponent() {
  const { data: sessions } = useSuspenseQuery(convexQuery(api.sessions.getSessions, {}));



  return (<div className="container w-full h-full flex flex-col gap-4 ">
    <div className="flex gap-2 w-full">
      <GetStartedList />

      <div className='w-full flex items-center justify-center border rounded-2xl'>
        Insert vide0
      </div>
    </div>

    <div className="flex w-full gap-2">
      <TrafficChart sessions={sessions} />
      <NewsChart sessions={sessions} />
      <SessionChart sessions={sessions} />

    </div>



  </div >)
}
