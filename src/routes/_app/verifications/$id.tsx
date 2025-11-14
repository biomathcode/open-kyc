import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useMutation } from "convex/react";

import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import { Label } from '~/components/ui/field';



export const Route = createFileRoute('/_app/verifications/$id')({
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        await queryClient.ensureQueryData(convexQuery(api.sessions.getSessionById, { sessionId: params.id as Id<"sessions"> }))
    },
    pendingComponent: () => (<div>Loading...</div>),
})


function Analytics({
    device,
    browser,
    os,
    ipAddress,
    geolocation,
    userAgent,
    createdAt,
}: {
    device?: string;
    browser?: string;
    os?: string;
    ipAddress?: string;
    geolocation?: Doc<"sessions">["geolocation"];
    userAgent?: string;
    createdAt?: number;
}) {
    return (
        <div className="max-w-sm overflow-hidden border rounded-2xl">
            <div className="py-2 bg-accent z-10 text-md font-semibold px-2 text-neutral-700">
                Analytics
            </div>

            <div className="flex flex-col gap-2 items-start px-2 py-4">

                <div className="flex flex-col gap-0">
                    <Label>Device</Label>
                    <div>{device || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Browser</Label>
                    <div>{browser || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Operating System</Label>
                    <div>{os || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>IP Address</Label>
                    <div>{ipAddress || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Geolocation</Label>
                    <div>{geolocation?.country || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>User Agent</Label>
                    <div className="break-all">{userAgent || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Created At</Label>
                    <div>{createdAt || '-'}</div>
                </div>

            </div>
        </div>
    );
}


function PersonInformation({
    first_name,
    last_name,
    nationality,
    issuing_state,
    dob,
    address,
    gender,
    document_number,
}: {
    first_name?: string;
    last_name?: string;
    nationality?: string;
    issuing_state?: string;
    dob?: string;
    address?: string;
    gender?: string;
    document_number?: string;
}) {
    return (
        <div className="max-w-sm overflow-hidden border rounded-2xl w-full">
            <div className="py-2 bg-accent z-10 text-md font-semibold px-2 text-neutral-700">
                Analytics
            </div>

            <div className="flex flex-col gap-2 items-start px-2 py-4">
                <div className="flex flex-col gap-0">
                    <Label>First Name</Label>
                    <div>{first_name || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Last Name</Label>
                    <div>{last_name || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Nationality</Label>
                    <div>{nationality || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Issuing State</Label>
                    <div>{issuing_state || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Date of Birth</Label>
                    <div>{dob || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Address</Label>
                    <div>{address || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Gender</Label>
                    <div>{gender || '-'}</div>
                </div>

                <div className="flex flex-col gap-0">
                    <Label>Document Number</Label>
                    <div>{document_number || '-'}</div>
                </div>
            </div>
        </div>
    );
}


function ContactDetails({ email, phone, issuing_state }: { email?: string, phone?: string, issuing_state?: string }) {
    return (

        <div className=" max-w-sm overflow-hidden border rounded-2xl w-full ">
            <div className="  py-2  bg-accent z-10 text-md font-semibold px-2 text-neutral-700  ">
                Contact Details
            </div>
            <div className="flex flex-col gap-2 items-start px-2 py-4">
                <div className="flex flex-col gap-0">
                    <Label>
                        Issuing state
                    </Label>
                    <div>
                        {issuing_state || '-'}</div>
                </div>
                <div className="flex flex-col gap-0">

                    <Label>Email</Label>
                    <div>
                        {email || '-'}
                    </div>
                </div>
                <div className="flex flex-col gap-0">
                    <Label>Phone Number</Label>
                    <div>
                        {phone || '-'}
                    </div>
                </div>
            </div>
        </div>

    )
}



function IdVerification({
    front_image,
    back_image,
    person_image,
}: {
    front_image?: string | null;
    back_image?: string | null;
    person_image?: string | null;
}) {



    return (
        <div className="max-w-sm overflow-hidden border rounded-2xl">
            <div className="py-2 bg-accent z-10 text-md font-semibold px-2 text-neutral-700">
                ID Verification
            </div>

            <div className="flex flex-col gap-4 px-2 py-4">

                {/* Front Image */}
                <div className="flex flex-col gap-1">
                    <Label>Front Image</Label>
                    {front_image ? (
                        <img
                            src={front_image || ""}
                            className="w-full rounded-lg border object-cover"
                            alt="Front ID"
                        />
                    ) : (
                        <div className="text-sm text-neutral-500">No image</div>
                    )}
                </div>

                {/* Back Image */}
                <div className="flex flex-col gap-1">
                    <Label>Back Image</Label>
                    {back_image ? (
                        <img
                            src={back_image || ""}
                            className="w-full rounded-lg border object-cover"
                            alt="Back ID"
                        />
                    ) : (
                        <div className="text-sm text-neutral-500">No image</div>
                    )}
                </div>

                {/* Person Image */}
                <div className="flex flex-col gap-1">
                    <Label>Person Image</Label>
                    {person_image ? (
                        <img
                            src={person_image || ""}
                            className="w-full rounded-lg border object-cover"
                            alt="Person"
                        />
                    ) : (
                        <div className="text-sm text-neutral-500">No image</div>
                    )}
                </div>

            </div>
        </div>
    );
}



function RouteComponent() {
    const { id } = Route.useParams();

    const { data: session } = useSuspenseQuery(convexQuery(api.sessions.getSessionById, { sessionId: id as Id<"sessions"> }))



    return <div className="w-full h-full ">
        <h1>Verification</h1>
        <div className="max-w-fit ">
            {JSON.stringify(session)}
        </div>
        <div className="flex w-full gap-2 min-w-fit">
            <ContactDetails email={session.email} phone={session.phone_number} issuing_state={session.issuing_state} />

            <PersonInformation
                first_name={session.first_name}
                last_name={session.last_name}
                nationality={session.nationality}
                issuing_state={session.issuing_state}
                dob={session.dob}
                address={session.address}
                gender={session.gender}
                document_number={session.document_number}
            />
            <Analytics
                device={session.device}
                browser={session.browser}
                os={session.os}
                ipAddress={session.ipAddress}
                geolocation={session.geolocation}
                userAgent={session.userAgent}
                createdAt={session.createdAt}

            />


        </div>

        <IdVerification
            front_image={session.front_image}
            back_image={session.back_image}
            person_image={session.person_image}
        />

    </div>
}
