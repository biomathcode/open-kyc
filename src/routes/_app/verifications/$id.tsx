import { Link, createFileRoute } from '@tanstack/react-router'
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";


import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import { Label } from '~/components/ui/field';

import {
    DescriptionDetails,
    DescriptionList,
    DescriptionTerm,
} from "~/components/ui/description-list"
import { CardContent } from '~/components/ui/card';


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
    createdAt: number;
}) {
    return (
        <div className="w-full  overflow-hidden border rounded-2xl">
            <div className="py-2 bg-accent z-10 text-md font-semibold px-2 text-neutral-700">
                Analytics
            </div>
            <DescriptionList className="px-4">
                <DescriptionTerm> Device</DescriptionTerm>
                <DescriptionDetails> {device || '-'}</DescriptionDetails>

                <DescriptionTerm> Browser</DescriptionTerm>
                <DescriptionDetails>{browser || '-'}</DescriptionDetails>

                <DescriptionTerm> Operating System</DescriptionTerm>
                <DescriptionDetails>{os || '-'}</DescriptionDetails>

                <DescriptionTerm> IP Address</DescriptionTerm>
                <DescriptionDetails>{ipAddress || '-'}</DescriptionDetails>

                <DescriptionTerm> Geolocation</DescriptionTerm>
                <DescriptionDetails>{geolocation?.country || '-'}</DescriptionDetails>

                <DescriptionTerm> User Agent</DescriptionTerm>
                <DescriptionDetails>{userAgent || '-'}</DescriptionDetails>

                <DescriptionTerm> Created At</DescriptionTerm>
                <DescriptionDetails>{format(new Date(createdAt), "dd MMM yyyy, hh:mm a") || '-'}</DescriptionDetails>
            </DescriptionList>
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
        <div className="max-w-sm w-full overflow-hidden border rounded-2xl">
            <div className="py-2 bg-accent z-10 text-md font-semibold px-2 text-neutral-700">
                Person Information
            </div>

            <DescriptionList className="px-4 py-2">
                <DescriptionTerm>First Name</DescriptionTerm>
                <DescriptionDetails>{first_name || '-'}</DescriptionDetails>

                <DescriptionTerm>Last Name</DescriptionTerm>
                <DescriptionDetails>{last_name || '-'}</DescriptionDetails>

                <DescriptionTerm>Nationality</DescriptionTerm>
                <DescriptionDetails>{nationality || '-'}</DescriptionDetails>

                <DescriptionTerm>Issuing State</DescriptionTerm>
                <DescriptionDetails>{issuing_state || '-'}</DescriptionDetails>

                <DescriptionTerm>Date of Birth</DescriptionTerm>
                <DescriptionDetails>{dob || '-'}</DescriptionDetails>

                <DescriptionTerm>Address</DescriptionTerm>
                <DescriptionDetails>{address || '-'}</DescriptionDetails>

                <DescriptionTerm>Gender</DescriptionTerm>
                <DescriptionDetails>{gender || '-'}</DescriptionDetails>

                <DescriptionTerm>Document Number</DescriptionTerm>
                <DescriptionDetails>{document_number || '-'}</DescriptionDetails>
            </DescriptionList>
        </div>
    );
}


function ContactDetails({
    email,
    phone,
    issuing_state,
}: {
    email?: string;
    phone?: string;
    issuing_state?: string;
}) {
    return (
        <div className="max-w-sm w-full overflow-hidden border rounded-2xl">
            <div className="py-2 bg-accent z-10 text-md font-semibold px-2 text-neutral-700">
                Contact Details
            </div>

            <DescriptionList className="px-4 py-2">
                <DescriptionTerm>Issuing State</DescriptionTerm>
                <DescriptionDetails>{issuing_state || '-'}</DescriptionDetails>

                <DescriptionTerm>Email</DescriptionTerm>
                <DescriptionDetails>{email || '-'}</DescriptionDetails>

                <DescriptionTerm>Phone Number</DescriptionTerm>
                <DescriptionDetails>{phone || '-'}</DescriptionDetails>
            </DescriptionList>
        </div>
    );
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
        <div className=" overflow-hidden border rounded-2xl w-full">
            <div className="py-2 bg-accent z-10 text-md font-semibold px-2 text-neutral-700">
                ID Verification
            </div>

            <div className="flex  gap-4 px-2 py-4">

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



    return <div className="w-full h-full flex flex-col gap-4 flex-wrap max-w-[1500px] ">

        <div className="flex w-full gap-4 min-w-fit">
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

        <div>

            <div className=" overflow-hidden border rounded-2xl w-full">
                <div className="py-2 bg-accent z-10 text-md font-semibold px-2 text-neutral-700">
                    In The News
                </div>

                <CardContent className="space-y-4 p-4">
                    {session.news_results?.map((item) => (
                        <div key={item.url} className="border-b pb-3">
                            <Link
                                to={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold hover:underline"
                            >
                                {item.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </CardContent>
            </div>

        </div>

    </div>
}
