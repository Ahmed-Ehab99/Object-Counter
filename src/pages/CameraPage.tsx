import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { detections } from "@/data/mock";
import { AnimatePresence, motion } from "framer-motion";
import { Camera as CameraIcon, ImageIcon, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Mode = "idle" | "live" | "captured";

const CameraPage = () => {
  const [mode, setMode] = useState<Mode>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Stop any active stream
  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Clean up on unmount
  useEffect(() => () => stopStream(), [stopStream]);

  const triggerScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 5000);
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
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
    stopStream();
    setMode("captured");
    toast.success("Frame captured", { description: "Detecting objects..." });
    triggerScan();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopStream();
    const url = URL.createObjectURL(file);
    setCapturedImage(url);
    setMode("captured");
    triggerScan();
  };

  const handleReset = () => {
    stopStream(); // أمان زيادة
    setCapturedImage(null);
    setMode("idle");
    setScanning(false);

    if (fileRef.current) fileRef.current.value = "";

    toast("Cleared", { description: "Ready for a new scan" });
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-black">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Idle state — black screen with prompt */}
      <AnimatePresence>
        {mode === "idle" && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CameraIcon className="text-muted-foreground/40 h-10 w-10" />
            <p className="text-muted-foreground/50 text-sm tracking-widest uppercase">
              Open camera or upload an image
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live video feed */}
      <video
        ref={videoRef}
        muted
        playsInline
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          mode === "live" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Captured still image */}
      <AnimatePresence>
        {mode === "captured" && capturedImage && (
          <motion.img
            key={capturedImage}
            src={capturedImage}
            alt="Captured frame"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Overlay gradient */}
      {mode !== "idle" && (
        <div className="from-background/60 to-background/80 pointer-events-none absolute inset-0 bg-linear-to-b via-transparent" />
      )}

      {/* Detection boxes — only shown after capture */}
      {mode === "captured" &&
        detections.map((d, i) => {
          const colorClass =
            d.color === "cyan" ? "glow-border-cyan" : "glow-border-purple";
          const labelBg =
            d.color === "cyan"
              ? "bg-neon-cyan text-background"
              : "bg-neon-purple text-background";
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              className={`absolute rounded-sm ${colorClass}`}
              style={d.box}
            >
              <div
                className={`absolute -top-7 left-0 px-2 py-1 text-[10px] font-bold tracking-wider ${labelBg} rounded-sm whitespace-nowrap`}
              >
                {d.id} [{d.label}]
              </div>
              <div
                className={`absolute -bottom-6 left-0 text-[10px] font-bold tracking-wider ${
                  d.color === "cyan" ? "text-neon-cyan" : "text-neon-purple"
                }`}
              >
                CONFIDENCE: {d.confidence}%
              </div>
            </motion.div>
          );
        })}

      {/* Scanning line */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            className="pointer-events-none absolute top-0 bottom-0 w-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--neon-cyan) 40%, transparent), transparent)",
              boxShadow: "0 0 40px var(--neon-cyan)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "calc(100vw + 100%)" }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="glass shadow-soft absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full px-3 py-3">
        {/* Open Camera / Capture toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={mode === "live" ? handleCapture : handleOpenCamera}
              className="bg-gradient-brand text-background flex cursor-pointer items-center gap-2 rounded-full px-7 py-3 text-sm font-bold tracking-wider shadow-[0_0_30px_color-mix(in_oklab,var(--neon-cyan)_50%,transparent)]"
            >
              <CameraIcon className="h-4 w-4" />
              {mode === "live" ? "CAPTURE" : "OPEN CAMERA"}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>
              {mode === "live" ? "Capture current frame" : "Open your camera"}
            </span>
          </TooltipContent>
        </Tooltip>

        {/* Upload Image */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => fileRef.current?.click()}
              className="border-border/60 bg-surface-2/60 text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/60 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition"
              aria-label="Upload image"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <TooltipContent side="right">
            <span>Upload image</span>
          </TooltipContent>
        </Tooltip>

        {/* Reset */}
        <AnimatePresence>
          {mode === "captured" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-400 transition hover:border-red-500 hover:bg-red-500/20"
                    aria-label="Reset"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Start over</span>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CameraPage;
