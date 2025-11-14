/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import type { flowStates } from "~/components/session";

import { CameraFeed } from "~/components/session/CameraFeed";
import { StartKycWelcome } from "~/components/session/StartKycWelcome";
import { DocumentStep } from "~/components/session/DocumentStep";
import { CameraView } from "~/components/session/CameraView";
import ProgressStepper from "~/components/session/ProgressStepper";


export const Route = createFileRoute("/sessions/$sessionid")({
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        await queryClient.ensureQueryData(
            convexQuery(api.sessions.getSessionById, {
                sessionId: params.sessionid as Id<"sessions">,
            })
        );
    },
    pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
    const { sessionid } = Route.useParams();

    // LIVE Convex query
    const session = useQuery(api.sessions.getSessionById, {
        sessionId: sessionid as Id<"sessions">
    });

    const updateSession = useMutation(api.sessions.updateSession);

    // Local UI state mirrors backend "step"
    const [flow, setFlowState] = useState<flowStates | null>(null);

    /**
     * Sync local "flow" with backend once session loads or updates.
     * This guarantees no stale value, no flicker.
     */
    useEffect(() => {
        if (session?.step && session.step !== flow) {
            setFlowState(session.step as flowStates);
        }
    }, [session?.step]);

    // While live query is still loading
    if (!session || !flow) {
        return <div className="p-4">Loading...</div>;
    }

    // Update backend + instantly update UI
    const setFlow = async (newFlow: flowStates) => {
        setFlowState(newFlow); // instant UI update

        try {
            await updateSession({
                sessionId: sessionid as Id<"sessions">,
                updates: {
                    step: newFlow,
                    status:
                        newFlow === "success"
                            ? "completed"
                            : newFlow === "start"
                                ? "initiated"
                                : "in_progress",
                },
            });
        } catch (err) {
            console.error("Failed to update session:", err);
        }
    };

    const renderFlow = () => {
        switch (flow) {
            case "start":
                return <StartKycWelcome setFlow={setFlow} />;

            case "document":
                return <DocumentStep setFlow={setFlow} />;

            case "camera":
                return <CameraView setFlow={setFlow} />;

            case "frontSide":
                return (
                    <CameraFeed
                        title="Front Side of the Document"
                        flow={flow}
                        setFlow={() => setFlow("backSide")}
                        sessionId={sessionid as Id<"sessions">}
                    />
                );

            case "backSide":
                return (
                    <CameraFeed
                        title="Back Side of the Document"
                        flow={flow}
                        setFlow={() => setFlow("liveliness")}
                        sessionId={sessionid as Id<"sessions">}
                    />
                );

            case "liveliness":
                return (
                    <CameraFeed
                        title="Please Click a Selfie"
                        flow={flow}
                        setFlow={() => setFlow("success")}
                        sessionId={sessionid as Id<"sessions">}
                    />
                );

            case "success":
                return (
                    <div className="text-center text-lg font-medium p-4">
                        ✅ Your verification process is complete! <br />
                        Thank you for your patience.
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full h-screen backdrop-blur-3xl flex items-center justify-center">
            <div
                id="start-kyc-welcome"
                data-testid="start-kyc-welcome"
                className="flex flex-col w-fit h-full md:max-h-fit rounded-none md:rounded-pnl-xl overflow-hidden"
            >
                <div className="px-2">
                    {flow !== "start" && <ProgressStepper flow={flow} setFlow={setFlow} />}
                </div>

                <div className="flex flex-col gap-2 w-full px-2 py-2 h-full min-w-sm lg:min-w-md">
                    {renderFlow()}
                </div>
            </div>
        </div>
    );
}
