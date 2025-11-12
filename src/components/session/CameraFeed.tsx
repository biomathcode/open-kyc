/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import type { flowStates } from "./index";

interface CameraFeedProps {
    setFlow: (flow: flowStates) => void;
    title: string;
    lottieUrl?: string;
    flow: flowStates;
}

export function CameraFeed({ setFlow, title, lottieUrl, flow }: CameraFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [devices, setDevices] = useState<Array<MediaDeviceInfo>>([]);
    const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                const preferred =
                    videoDevices.find((d) => /front|user/i.test(d.label)) ?? videoDevices[0];
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

    function captureScreenshot() {
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
        const imageData = canvas.toDataURL("image/png");
        setScreenshot(imageData);
    }

    function handleContinue() {
        const nextFlowMap: Record<flowStates, flowStates> = {
            start: "document",
            document: "camera",
            camera: "frontSide",
            frontSide: "backSide",
            backSide: "liveliness",
            liveliness: "success",
            success: "success",
        };
        setFlow(nextFlowMap[flow]);
    }

    return (
        <div className="flex flex-col items-center max-w-md w-full h-full justify-between">
            {/* 🔹 Permission Request */}
            {permissionGranted === null && (
                <div className="flex flex-col items-center text-center max-w-sm p-6 border rounded-lg shadow bg-gray-50 dark:bg-gray-900">
                    <h2 className="text-lg font-semibold mb-2">Allow Camera Access</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Please grant permission to use your camera.
                    </p>
                    <button
                        onClick={requestPermission}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading ? "Requesting..." : "Enable Camera"}
                    </button>
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
                            <button
                                onClick={toggleCamera}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                Switch Camera
                            </button>
                        )}
                        <button
                            onClick={captureScreenshot}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Capture
                        </button>
                        <select
                            value={currentDeviceId ?? ""}
                            onChange={(e) => setCurrentDeviceId(e.target.value)}
                            className="border rounded-md px-2 py-1 text-sm"
                        >
                            {devices.map((device, i) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Camera ${i + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-neutral-600 text-xl font-semibold text-center">{title}</div>

                    {screenshot && (
                        <div className="flex flex-col items-center gap-6 w-full pb-4">
                            <img src={screenshot} alt="Captured" className="w-full rounded-lg shadow-md" />
                            <Button intent="primary" className="w-full" onClick={handleContinue}>
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
