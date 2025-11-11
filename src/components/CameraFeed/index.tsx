/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useRef, useState } from "react";

export function CameraFeed() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [devices, setDevices] = useState<Array<MediaDeviceInfo>>([]);
    const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);

    // 🔹 Request permission
    async function requestPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setPermissionGranted(true);
            stream.getTracks().forEach((t) => t.stop());
            await getDevices();
        } catch (err) {
            console.error("Camera permission denied:", err);
            setPermissionGranted(false);
            setError("Camera access denied. Please enable permissions.");
        }
    }

    // 🔹 Get camera devices
    async function getDevices() {
        try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
            setDevices(videoDevices);

            if (videoDevices.length > 0) {
                const preferred =
                    videoDevices.find((d) => /front|user/i.test(d.label)) ||
                    videoDevices[0];
                setCurrentDeviceId(preferred.deviceId);
            }
        } catch (err) {
            console.error("Error listing devices:", err);
            setError("Failed to list camera devices.");
        }
    }

    // 🔹 Start camera
    async function startCamera(deviceId?: string) {
        if (!deviceId) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
                audio: false,
            });
            if (videoRef.current) videoRef.current.srcObject = stream;
            setError(null);
        } catch (err) {
            console.error("Error starting camera:", err);
            setError("Unable to access selected camera.");
        }
    }

    // 🔹 Stop camera
    function stopCamera() {
        const stream = videoRef.current?.srcObject as MediaStream | null;
        if (stream) stream.getTracks().forEach((t) => t.stop());
    }

    // 🔹 On mount → check permission
    useEffect(() => {
        navigator.permissions
            ?.query({ name: "camera" as PermissionName })
            .then((status) => {
                if (status.state === "granted") {
                    setPermissionGranted(true);
                    getDevices();
                } else if (status.state === "prompt") {
                    setPermissionGranted(null);
                } else {
                    setPermissionGranted(false);
                    setError("Camera permission not granted.");
                }
            })
            .catch(() => setPermissionGranted(null)); // Safari fallback

        return () => stopCamera();
    }, []);

    // 🔹 When camera changes → restart
    useEffect(() => {
        if (currentDeviceId && permissionGranted) {
            stopCamera();
            startCamera(currentDeviceId);
        }
    }, [currentDeviceId, permissionGranted]);

    // 🔹 Toggle front/back
    function toggleCamera() {
        if (devices.length < 2) return;
        const currentIndex = devices.findIndex((d) => d.deviceId === currentDeviceId);
        const nextDevice = devices[(currentIndex + 1) % devices.length];
        setCurrentDeviceId(nextDevice.deviceId);
    }

    // 🔹 Capture a screenshot
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

    // 🔹 Download screenshot
    function downloadScreenshot() {
        if (!screenshot) return;
        const link = document.createElement("a");
        link.href = screenshot;
        link.download = "screenshot.png";
        link.click();
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {permissionGranted === null && (
                <button
                    onClick={requestPermission}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Enable Camera
                </button>
            )}

            {permissionGranted && (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full max-w-md rounded-lg bg-black aspect-video object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="flex gap-2">
                        {devices.length > 1 && (
                            <button
                                onClick={toggleCamera}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Switch Camera
                            </button>
                        )}
                        <button
                            onClick={captureScreenshot}
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            Capture
                        </button>
                        <select
                            value={currentDeviceId ?? ""}
                            onChange={(e) => setCurrentDeviceId(e.target.value)}
                            className="border rounded-md px-2 py-1"
                        >
                            {devices.map((device, idx) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Camera ${idx + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {screenshot && (
                        <div className="flex flex-col items-center gap-2 mt-4">
                            <img
                                src={screenshot}
                                alt="Captured"
                                className="w-64 rounded-lg shadow-md"
                            />
                            <button
                                onClick={downloadScreenshot}
                                className="px-4 py-2 bg-gray-800 text-white rounded-md"
                            >
                                Download
                            </button>
                        </div>
                    )}
                </>
            )}

            {error && (
                <p className="text-red-600 text-sm text-center max-w-sm">{error}</p>
            )}
        </div>
    );
}
