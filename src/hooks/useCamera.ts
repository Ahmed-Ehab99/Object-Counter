import { postDetect } from "@/lib/api";
import type { Detection, DetectResponseData } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type Mode = "idle" | "live" | "captured";

export interface UseCameraReturn {
  mode: Mode;
  capturedImage: string | null;
  scanning: boolean;
  loading: boolean;
  detections: Detection[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fileRef: React.RefObject<HTMLInputElement | null>;
  handleOpenCamera: () => Promise<void>;
  handleCapture: () => void;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleReset: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const [mode, setMode] = useState<Mode>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectResponseData | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  const runDetection = async (imageBase64: string) => {
    setScanning(true);
    setLoading(true);
    setResult(null);
    try {
      const res = await postDetect(imageBase64);
      setResult(res.data);
      if (res.data.image) setCapturedImage(res.data.image);
      toast.success("Detection complete", {
        description: `${res.data.detections.length} object(s) found`,
      });
    } catch {
      toast.error("Detection failed", {
        description: "Could not reach the server. Please try again.",
      });
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setMode("live");
      setCapturedImage(null);
      setResult(null);
    } catch {
      toast.error("Camera permission denied");
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    stopStream();
    setMode("captured");
    toast.success("Frame captured", { description: "Sending to detector..." });
    runDetection(dataUrl);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image under 10MB.",
      });
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    stopStream();
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
      setMode("captured");
      runDetection(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    stopStream();
    setCapturedImage(null);
    setResult(null);
    setMode("idle");
    setScanning(false);
    if (fileRef.current) fileRef.current.value = "";
    toast("Cleared", { description: "Ready for a new scan" });
  };

  return {
    mode,
    capturedImage,
    scanning,
    loading,
    detections: result?.detections ?? [],
    videoRef,
    canvasRef,
    fileRef,
    handleOpenCamera,
    handleCapture,
    handleUpload,
    handleReset,
  };
};
