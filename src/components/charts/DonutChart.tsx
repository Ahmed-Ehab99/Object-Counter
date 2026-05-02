import type { DistributionItem } from "@/types";
import { motion } from "framer-motion";

export function DonutChart({
  distribution,
}: {
  distribution: DistributionItem[];
}) {
  const total = 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const segments = distribution.reduce<
    ((typeof distribution)[number] & { length: number; offset: number })[]
  >((acc, d) => {
    const length = (d.value / total) * circumference;

    const offset =
      acc.length === 0
        ? 0
        : acc[acc.length - 1].offset + acc[acc.length - 1].length;

    acc.push({ ...d, length, offset });
    return acc;
  }, []);

  // We can use shadcn+recharts here to animate and show tooltip for each segment, but this for simplicity
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="-rotate-90"
      >
        <defs>
          <linearGradient id="grad-cyan" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.84 0.15 210)" />
            <stop offset="100%" stopColor="oklch(0.7 0.18 240)" />
          </linearGradient>
          <linearGradient id="grad-purple" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.74 0.18 305)" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 290)" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="oklch(0.22 0.01 270)"
          strokeWidth="14"
        />

        {/* Animated segments */}
        {segments.map((s, i) => (
          <motion.circle
            key={i}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={
              s.color === "cyan" ? "url(#grad-cyan)" : "url(#grad-purple)"
            }
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${s.length} ${circumference}`}
            initial={{
              strokeDashoffset: circumference, // مخفي بالكامل
            }}
            animate={{
              strokeDashoffset: -s.offset, // يظهر في مكانه الطبيعي
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.2, // stagger effect 🔥
              ease: "easeOut",
            }}
            style={{
              filter: `drop-shadow(0 0 6px ${
                s.color === "cyan" ? "var(--neon-cyan)" : "var(--neon-purple)"
              })`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
