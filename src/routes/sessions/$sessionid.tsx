import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useMutation } from "convex/react";

import { api } from "convex/_generated/api";
import type { flowStates } from "~/components/session";
import type { Id } from "convex/_generated/dataModel";
import { CameraFeed } from "~/components/session/CameraFeed";
import { StartKycWelcome } from "~/components/session/StartKycWelcome";
import { DocumentStep } from "~/components/session/DocumentStep";
import { CameraView } from "~/components/session/CameraView";
import ProgressStepper from "~/components/session/ProgressStepper";

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


    const { sessionid } = Route.useParams()

    const { data: session } = useSuspenseQuery(convexQuery(api.sessions.getSessionById, { sessionId: sessionid as Id<"sessions"> }))


    const updateSession = useMutation(api.sessions.updateSession);



    const [flow, setFlowState] = useState<flowStates>("start");

    const setFlow = async (newFlow: flowStates) => {
        setFlowState(newFlow);
        try {
            // Update backend when step changes
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

    // 🔹 Define camera steps declaratively
    const cameraSteps = [
        {
            key: "frontSide",
            title: "Front Side of the Document",
            next: "backSide",
        },
        {
            key: "backSide",
            title: "Back Side of the Document",
            next: "liveliness",
        },
        {
            key: "liveliness",
            title: "Please Click a Selfie",
            next: "success",
        },
    ] as const;

    const renderFlow = () => {
        // Regular flows
        switch (flow) {
            case "start":
                return <StartKycWelcome setFlow={setFlow} />;
            case "document":
                return <DocumentStep setFlow={setFlow} />;
            case "camera":
                return <CameraView setFlow={setFlow} />;
            case "success":
                return (
                    <div className="text-center text-lg font-medium p-4">
                        ✅ Your verification process is complete! <br />
                        Thank you for your patience.
                    </div>
                );
        }

        // Camera flows handled dynamically
        const step = cameraSteps.find((s) => s.key === flow);
        if (step)
            return (
                <CameraFeed
                    title={step.title}
                    flow={step.key}
                    setFlow={() => setFlow(step.next)}
                    sessionId={sessionid as Id<"sessions">}
                />
            );

        return null;
    };

    return (
        <div className="w-full h-screen backdrop-blur-3xl flex items-center justify-center">
            <div
                id="start-kyc-welcome"
                data-testid="start-kyc-welcome"
                className=" flex flex-col w-fit h-full md:max-h-fit bg-transparent shadow-card rounded-none md:rounded-pnl-xl overflow-hidden"
            >

                <div className="px-2">
                    {flow !== "start" && <ProgressStepper flow={flow} setFlow={setFlow} />}

                </div>

                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        className="flex flex-col gap-2 w-full px-2 py-2 h-full min-w-sm lg:min-w-md"
                        key={flow}
                        initial={{ x: "50%", opacity: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ x: "-50%", opacity: 0 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0 }}
                    >
                        {renderFlow()}
                    </motion.div>
                </AnimatePresence>


            </div>
        </div>
    );
}
