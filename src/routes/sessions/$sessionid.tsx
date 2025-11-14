/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { CameraFeed } from "~/components/session/CameraFeed";
import { StartKycWelcome } from "~/components/session/StartKycWelcome";
import { DocumentStep } from "~/components/session/DocumentStep";
import { CameraView } from "~/components/session/CameraView";
import ProgressStepper from "~/components/session/ProgressStepper";
import { useSessionFlow } from "~/hooks/useSessionFlow";

// TODO: Integrate workflow ID, session data, analytics, etc.
// TODO: Add session events as well 


export const Route = createFileRoute("/sessions/$sessionid")({

    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        await queryClient.ensureQueryData(convexQuery(api.sessions.getSessionById, { sessionId: params.sessionid as Id<"sessions"> }))
    },
    pendingComponent: () => (<div>Loading...</div>),

});


function RouteComponent() {

    const { sessionid } = Route.useParams();

    const { flow, updateFlow, session } = useSessionFlow(
        sessionid as Id<"sessions">
    );




    const renderFlow = () => {
        switch (flow) {
            case "start":
                return (
                    <StartKycWelcome
                        setFlow={updateFlow}
                        sessionId={sessionid as Id<"sessions">}
                    />
                );

            case "document":
                return <DocumentStep setFlow={updateFlow} />;

            case "camera":
                return <CameraView setFlow={updateFlow} />;

            case "frontSide":
                return (
                    <CameraFeed
                        title="Front Side of the Document"
                        flow="frontSide"
                        setFlow={() => updateFlow("backSide")}
                        sessionId={sessionid as Id<"sessions">}
                    />
                );

            case "backSide":
                return (
                    <CameraFeed
                        title="Back Side of the Document"
                        flow="backSide"
                        setFlow={() => updateFlow("liveliness")}
                        sessionId={sessionid as Id<"sessions">}
                    />
                );

            case "liveliness":
                return (
                    <CameraFeed
                        title="Please Click a Selfie"
                        flow="liveliness"
                        setFlow={() => updateFlow("success")}
                        sessionId={sessionid as Id<"sessions">}
                    />
                );

            case "success":
                return (
                    <div className="text-center text-lg font-medium p-4">
                        ✅ Your verification process is complete!
                        <br />
                        Thank you for your patience.
                    </div>
                );

            default:
                return null;
        }
    };


    console.log("sessions", session)

    return (
        <div className="w-full h-screen backdrop-blur-3xl flex items-center justify-center">
            <div className="flex flex-col w-fit h-full md:max-h-fit bg-transparent shadow-card rounded-none md:rounded-pnl-xl overflow-hidden">
                <div className="px-2">
                    {flow !== "start" && <ProgressStepper flow={flow} setFlow={updateFlow} />}
                </div>

                <div className="flex flex-col gap-2 w-full px-2 py-2 h-full min-w-sm lg:min-w-md">
                    {renderFlow()}
                </div>
            </div>
        </div>
    );
}
