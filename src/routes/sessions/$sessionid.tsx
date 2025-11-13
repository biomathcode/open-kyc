import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";


import type { flowStates } from "~/components/session";
import { CameraFeed } from "~/components/session/CameraFeed";
import { StartKycWelcome } from "~/components/session/StartKycWelcome";
import { DocumentStep } from "~/components/session/DocumentStep";
import { CameraView } from "~/components/session/CameraView";
import ProgressStepper from "~/components/session/ProgressStepper";

// TODO: Integrate workflow ID, session data, analytics, etc.
// TODO: Add session events as well 


export const Route = createFileRoute("/sessions/$sessionid")({
    component: RouteComponent,
});

function RouteComponent() {
    const [flow, setFlow] = useState<flowStates>("start");

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
