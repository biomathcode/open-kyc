import { createFileRoute } from '@tanstack/react-router'
import { PricingTable } from "autumn-js/react";


export const Route = createFileRoute('/_app/billing')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>

        <PricingTable />
    </div>
}
