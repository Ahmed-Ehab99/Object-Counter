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
  value: number;
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
      className="border-border/60 bg-card relative overflow-hidden rounded-2xl border p-5"
    >
      <div className="flex items-start justify-between">
        <h3 className={`text-sm font-semibold ${titleColor} max-w-[70%]`}>
          {title}
        </h3>
        {icon && <div className={`${titleColor}`}>{icon}</div>}
      </div>
      <NumberTicker
        value={value}
        className="mt-4 text-4xl font-bold tracking-tight text-white"
      />
      <div className="text-muted-foreground mt-2 text-xs">{subtitle}</div>
      <div className="bg-surface-2 mt-5 h-1 overflow-hidden rounded-full">
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
