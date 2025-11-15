/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

type Session = {
    userAgent?: string;
    browser?: string;
    device?: string;
    os?: string;
    geolocation?: { lat: number; lng: number } | null;
    ipAddress?: string | null;
};

function getClientInfo() {
    return {
        userAgent: navigator.userAgent,
        browser:
            (navigator as any)?.userAgentData?.brands?.[0]?.brand ??
            null,
        device: (navigator as any)?.userAgentData?.platform ?? null,
        os: navigator.platform,
    };
}

export function useSyncSessionClientInfo(
    sessionId: Id<"sessions">,
    session: Session | null | undefined | any
) {
    const updateSession = useMutation(api.sessions.updateSession);

    // Prevent double-updates
    const hasUpdated = useRef(false);

    useEffect(() => {
        if (!session || hasUpdated.current) return;

        const missingClientInfo =
            !session.userAgent ||
            !session.browser ||
            !session.device ||
            !session.os;

        if (!missingClientInfo) return;

        const info = getClientInfo();

        hasUpdated.current = true;

        updateSession({
            sessionId,
            updates: {
                userAgent: info.userAgent,
                browser: info.browser,
                device: info.device,
                os: info.os,
            },
        }).catch((err) => {
            console.error("Failed to update client info:", err);
            hasUpdated.current = false; // allow retry on failure
        });
    }, [session, sessionId, updateSession]);

    // OPTIONAL: add geolocation update
    useEffect(() => {
        if (!session || session.geolocation || hasUpdated.current) return;

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                updateSession({
                    sessionId,
                    updates: {
                        geolocation: {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                        },
                    },
                }).catch((err) => console.error("Failed to update geolocation:", err));
            },
            (err) => {
                console.warn("Geolocation permission denied:", err);
            }
        );
    }, [session, sessionId, updateSession]);
}
