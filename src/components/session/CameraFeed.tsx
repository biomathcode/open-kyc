/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

import { SwitchCamera } from "lucide-react";
import { Button } from "../ui/button";
import type { flowStates } from "./index";
import type { Id } from "convex/_generated/dataModel";



interface CameraFeedProps {
    setFlow: () => void;
    title: string;
    flow: flowStates;
    sessionId: Id<"sessions">;

}

export function CameraFeed({ setFlow, title, flow, sessionId }: CameraFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [devices, setDevices] = useState<Array<MediaDeviceInfo>>([]);
    const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [uploading, setUploading] = useState(false);

    const generateUploadUrl = useMutation(api.documents.generateUploadUrl); // assuming you already have this in convex
    const updateSession = useMutation(api.sessions.updateSession);

    // 🔹 Reset state when flow changes
    useEffect(() => {
        stopCamera();
        setScreenshot(null);
        setError(null);
        setPermissionGranted(null);
        setDevices([]);
        setCurrentDeviceId(null);

        checkPermission();
        return () => stopCamera();
    }, [flow]);

    // 🔹 Check and request permission
    async function checkPermission() {
        try {
            const status = await navigator.permissions?.query({ name: "camera" as PermissionName });
            if (status?.state === "granted") {
                setPermissionGranted(true);
                await getDevices();
            } else if (status?.state === "prompt") {
                setPermissionGranted(null);
            } else {
                setPermissionGranted(false);
                setError("Camera permission not granted.");
            }
        } catch {
            // Safari fallback
            setPermissionGranted(null);
        }
    }

    async function requestPermission() {
        setLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((t) => t.stop());
            setPermissionGranted(true);
            await getDevices();
        } catch (err) {
            console.error("Camera permission denied:", err);
            setError("Camera access denied. Please enable permissions.");
            setPermissionGranted(false);
        } finally {
            setLoading(false);
        }
    }

    async function getDevices() {
        try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter((d) => d.kind === "videoinput");

            setDevices(videoDevices);

            if (videoDevices.length) {
                // Prioritize back/environment cameras
                const backCam = videoDevices.find((d) =>
                    /back|rear|environment/i.test(d.label)
                );

                const preferred = backCam ?? videoDevices[0];
                setCurrentDeviceId(preferred.deviceId);
            }
        } catch {
            setError("Failed to list camera devices.");
        }
    }

    async function startCamera(deviceId?: string) {
        if (!deviceId) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
            });
            if (videoRef.current) videoRef.current.srcObject = stream;
            setError(null);
        } catch {
            setError("Unable to access selected camera.");
        }
    }

    function stopCamera() {
        const stream = videoRef.current?.srcObject as MediaStream | null;
        stream?.getTracks().forEach((t) => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
    }

    useEffect(() => {
        if (currentDeviceId && permissionGranted) {
            stopCamera();
            startCamera(currentDeviceId);
        }
        return () => stopCamera();
    }, [currentDeviceId, permissionGranted]);

    function toggleCamera() {
        if (devices.length < 2) return;
        const currentIndex = devices.findIndex((d) => d.deviceId === currentDeviceId);
        const nextDevice = devices[(currentIndex + 1) % devices.length];
        setCurrentDeviceId(nextDevice.deviceId);
    }

    async function captureScreenshot() {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const width = video.videoWidth;
        const height = video.videoHeight;
        if (!width || !height) return;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/png");
        setScreenshot(dataUrl);
        setUploading(true);

        try {
            // Convert base64 to Blob
            const res = await fetch(dataUrl);
            const blob = await res.blob();

            // Generate upload URL
            const uploadUrl = await generateUploadUrl();

            // Upload to Convex storage
            const uploadRes = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": blob.type },
                body: blob,
            });
            const { storageId } = await uploadRes.json();

            // Update session based on flow
            const imageFieldMap: Record<flowStates, keyof Omit<Parameters<typeof updateSession>[0]["updates"], "step">> = {
                frontSide: "front_image",
                backSide: "back_image",
                liveliness: "person_image",
                start: "front_image",
                document: "front_image",
                camera: "front_image",
                success: "person_image",
            };

            const field = imageFieldMap[flow];
            if (field) {
                await updateSession({
                    sessionId,
                    updates: {
                        [field]: storageId,
                        step: flow,
                        status: "in_progress",
                    },
                });
            }
        } catch (err) {
            console.error("❌ Upload failed:", err);
            setError("Failed to upload image.");
        } finally {
            setUploading(false);

        }
    }

    function handleContinue() {

        setFlow();
    }

    return (
        <div className="flex flex-col items-center w-full h-full justify-between max-w-xs">
            {/* 🔹 Permission Request */}
            {permissionGranted === null && (
                <div className="flex flex-col items-center text-center max-w-sm p-6 border rounded-lg shadow bg-gray-50 dark:bg-gray-900">
                    <h2 className="text-lg font-semibold mb-2">Allow Camera Access</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Please grant permission to use your camera.
                    </p>
                    <Button
                        onClick={requestPermission}
                        intent="plain"
                        isDisabled={loading}
                    >
                        {loading ? "Requesting..." : "Enable Camera"}
                    </Button>
                </div>
            )}

            {/* 🔹 Live Camera */}
            {permissionGranted && (
                <div className="flex flex-col gap-4 items-center w-full h-full justify-between">
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>

                    <canvas ref={canvasRef} className="hidden" />

                    <div className="flex flex-wrap justify-center gap-2">
                        {devices.length > 1 && (
                            <Button
                                onClick={toggleCamera}
                                intent="plain"
                            >
                                <SwitchCamera size={14} />
                            </Button>
                        )}
                        <Button
                            onClick={captureScreenshot}
                            intent="secondary"
                        >
                            Capture
                        </Button>

                    </div>

                    <div className="text-neutral-600 text-xl font-semibold text-center">{title}</div>

                    {screenshot && (
                        <div className="flex flex-col items-center gap-6 w-full pb-4">
                            <img src={screenshot} alt="Captured" className="w-full rounded-lg shadow-md" />
                            <Button
                                className="absolute bottom-10 w-fit"
                                isDisabled={uploading}
                                intent="primary" onClick={handleContinue}>
                                Continue
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-red-600 text-sm text-center mt-3 max-w-sm">{error}</p>}
        </div>
    );
}
