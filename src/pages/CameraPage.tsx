import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCamera } from "@/hooks/useCamera";
import { useImageBounds } from "@/hooks/useImageBounds";
import { AnimatePresence, motion } from "framer-motion";
import { Camera as CameraIcon, ImageIcon, X } from "lucide-react";

const CameraPage = () => {
  const {
    mode,
    capturedImage,
    scanning,
    loading,
    detections,
    videoRef,
    canvasRef,
    fileRef,
    handleOpenCamera,
    handleCapture,
    handleUpload,
    handleReset,
  } = useCamera();

  const [imgRef, bounds] = useImageBounds(capturedImage);

  // Convert a percentage string like "14%" to an absolute px value
  // relative to where the image is actually rendered inside the container
  const toAbsolute = (val: string, axis: "x" | "y"): string => {
    const pct = parseFloat(val) / 100;
    if (axis === "x") {
      return `${bounds.offsetX + pct * bounds.renderedWidth}px`;
    }
    return `${bounds.offsetY + pct * bounds.renderedHeight}px`;
  };

  const toSize = (val: string, axis: "x" | "y"): string => {
    const pct = parseFloat(val) / 100;
    if (axis === "x") return `${pct * bounds.renderedWidth}px`;
    return `${pct * bounds.renderedHeight}px`;
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="hidden" />

      {/* Idle prompt */}
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

      {/* Live video */}
      <video
        ref={videoRef}
        muted
        playsInline
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
          mode === "live" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Captured still — ref attached here for bounds calculation */}
      <AnimatePresence>
        {mode === "captured" && capturedImage && (
          <motion.img
            ref={imgRef}
            key={capturedImage}
            src={capturedImage}
            alt="Captured frame"
            className="absolute inset-0 h-full w-full object-contain"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Gradient overlay */}
      {mode !== "idle" && (
        <div className="from-background/60 to-background/80 pointer-events-none absolute inset-0 bg-linear-to-b via-transparent" />
      )}

      {/* Loading indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass flex items-center gap-3 rounded-2xl px-6 py-4">
              <div className="border-neon-cyan h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              <span className="text-neon-cyan text-sm font-bold tracking-widest uppercase">
                Analyzing...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detection boxes — repositioned to match object-contain layout */}
      {mode === "captured" &&
        !loading &&
        bounds.renderedWidth > 0 &&
        detections.map((d, i) => {
          const colorClass =
            d.color === "cyan" ? "glow-border-cyan" : "glow-border-purple";
          const labelBg =
            d.color === "cyan"
              ? "bg-neon-cyan text-background"
              : "bg-neon-purple text-background";

          const style = {
            left: toAbsolute(d.box.left, "x"),
            top: toAbsolute(d.box.top, "y"),
            width: toSize(d.box.width, "x"),
            height: toSize(d.box.height, "y"),
          };

          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
              className={`absolute rounded-sm ${colorClass}`}
              style={style}
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
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="glass shadow-soft absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full px-3 py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={mode === "live" ? handleCapture : handleOpenCamera}
              disabled={loading}
              className="bg-gradient-brand text-background flex cursor-pointer items-center gap-2 rounded-full px-7 py-3 text-sm font-bold tracking-wider shadow-[0_0_30px_color-mix(in_oklab,var(--neon-cyan)_50%,transparent)] disabled:cursor-not-allowed disabled:opacity-50"
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

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="border-border/60 bg-surface-2/60 text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/60 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-50"
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

        <AnimatePresence>
          {mode === "captured" && !loading && (
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
