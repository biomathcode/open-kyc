import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import useSingleFlight from "./useSingleFlight";
import type { Id } from "convex/_generated/dataModel";
import type { flowStates } from "~/components/session";

export function useSessionFlow(sessionId: Id<"sessions">) {
    // Live-query the session (realtime)
    const session = useQuery(api.sessions.getSessionById, { sessionId });

    // Local UI state mirrors backend
    const [flow, setFlow] = useState<flowStates>("start");

    // Server mutation
    const updateSession = useSingleFlight(
        useMutation(api.sessions.updateSession)
    );

    // Whenever server changes → update local UI
    useEffect(() => {
        if (session?.step && session.step !== flow) {
            setFlow(session.step as flowStates);
        }
    }, [session?.step]);

    // Update both UI & backend
    const updateFlow = async (newFlow: flowStates) => {
        setFlow(newFlow); // optimistic UI

        await updateSession({
            sessionId,
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
    };

    return { flow, updateFlow, session };
}
