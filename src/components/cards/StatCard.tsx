import { motion } from "framer-motion";
import { NumberTicker } from "../ui/number-ticker";

export function StatCard({
  title,
  value,
  subtitle,
  color = "cyan",
  icon,
}: {
  title: string;
  value: string;
  subtitle: React.ReactNode;
  color?: "cyan" | "purple";
  icon?: React.ReactNode;
}) {
  const barColor =
    color === "cyan"
      ? "from-neon-cyan to-neon-cyan/40"
      : "from-neon-purple to-neon-purple/40";
  const titleColor = color === "cyan" ? "text-neon-cyan" : "text-neon-purple";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl border border-border/60 bg-card p-5 overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <h3 className={`text-sm font-semibold ${titleColor} max-w-[70%]`}>
          {title}
        </h3>
        {icon && <div className={`${titleColor}`}>{icon}</div>}
      </div>
      <NumberTicker
        value={Number(value)}
        className="mt-4 text-4xl font-bold tracking-tight text-white"
      />
      <div className="mt-2 text-xs text-muted-foreground">{subtitle}</div>
      <div className="mt-5 h-1 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-linear-to-r ${barColor} rounded-full`}
        />
      </div>
    </motion.div>
  );
}
