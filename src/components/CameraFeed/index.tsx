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
    const [loading, setLoading] = useState(false);

    // 🔹 Request permission
    async function requestPermission() {
        setLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setPermissionGranted(true);
            stream.getTracks().forEach((t) => t.stop());
            await getDevices();
        } catch (err) {
            console.error("Camera permission denied:", err);
            setPermissionGranted(false);
            setError("Camera access denied. Please enable permissions.");
        } finally {
            setLoading(false);
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
        <div className="flex flex-col items-center justify-center p-4 w-full">
            {/* 🔹 Permission request screen */}
            {permissionGranted === null && (
                <div className="flex flex-col items-center text-center max-w-sm p-6 border rounded-lg shadow-md bg-gray-50 dark:bg-gray-900">
                    <h2 className="text-lg font-semibold mb-2">Allow Camera Access</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        We need permission to access your camera. Please click the button below
                        and allow access in your browser popup.
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

            {/* 🔹 Camera feed */}
            {permissionGranted && (
                <div className="w-full max-w-md flex flex-col items-center gap-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>

                    <canvas ref={canvasRef} className="hidden" />

                    {/* 🔹 Controls */}
                    <div className="flex flex-wrap justify-center gap-2 w-full">
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
                            {devices.map((device, idx) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Camera ${idx + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 🔹 Screenshot Preview */}
                    {screenshot && (
                        <div className="flex flex-col items-center gap-2 mt-4">
                            <img
                                src={screenshot}
                                alt="Captured"
                                className="w-64 sm:w-72 rounded-lg shadow-md"
                            />
                            <button
                                onClick={downloadScreenshot}
                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
                            >
                                Download
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 🔹 Error message */}
            {error && (
                <p className="text-red-600 text-sm text-center mt-3 max-w-sm">{error}</p>
            )}
        </div>
    );
}
