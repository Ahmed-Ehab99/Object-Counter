import { motion } from "framer-motion";
import { NumberTicker } from "../ui/number-ticker";

export function MetricBar({
  label,
  value,
  suffix,
  max = 100,
  color,
}: {
  label: string;
  value: number;
  suffix: string;
  max?: number;
  color: "cyan" | "purple";
}) {
  const pct = Math.min(100, (value / max) * 100);
  const grad =
    color === "cyan"
      ? "from-neon-cyan to-neon-purple"
      : "from-neon-purple to-neon-cyan";

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">
          <NumberTicker value={value} decimalPlaces={1} className="text-white" />
          {suffix}
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className={`h-full bg-linear-to-r ${grad} rounded-full`}
        />
      </div>
    </div>
  );
}
