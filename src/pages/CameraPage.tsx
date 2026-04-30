import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { detections } from "@/data/mock";
import { AnimatePresence, motion } from "framer-motion";
import { Camera as CameraIcon, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import cameraFeed from "/camera-feed.png";

const CameraPage = () => {
  const [bgImage, setBgImage] = useState<string>(cameraFeed);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const triggerScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 5000);
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      toast.success("Camera ready", { description: "Capturing frame..." });
      triggerScan();
    } catch {
      toast.error("Your permission is required");
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
    triggerScan();
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <motion.img
        key={bgImage}
        src={bgImage}
        alt="Detection feed"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-background/60 via-transparent to-background/80" />

      {/* Detection boxes */}
      {detections.map((d, i) => {
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
            className="absolute top-0 bottom-0 w-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--neon-cyan) 40%, transparent), transparent)",
              boxShadow: "0 0 40px var(--neon-cyan)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "calc(100vw + 100%)" }}
            transition={{
              duration: 5,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        )}
      </AnimatePresence>

      {/* Capture controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 glass rounded-full px-3 py-3 shadow-soft">
        {/* Capture Image */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCapture}
              className="flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3 text-sm font-bold tracking-wider text-background shadow-[0_0_30px_color-mix(in_oklab,var(--neon-cyan)_50%,transparent)] cursor-pointer"
            >
              <CameraIcon className="h-4 w-4" />
              CAPTURE
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>Open yuor camera</span>
          </TooltipContent>
        </Tooltip>

        {/* Upload Image */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-surface-2/60 text-muted-foreground transition hover:text-neon-cyan hover:border-neon-cyan/60 cursor-pointer"
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
      </div>
    </div>
  );
};

export default CameraPage;
