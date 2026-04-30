import { StatCard } from "@/components/cards/StatCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { MetricBar } from "@/components/charts/MetricBar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { NumberTicker } from "@/components/ui/number-ticker";
import { distribution, metrics, pastWeek, tabs } from "@/data/mock";
import { motion } from "framer-motion";
import { Camera, CircleCheck, Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import previewDetection from "/preview-detection.png";

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("ALL SCANS");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-[1400px] px-8 py-8"
    >
      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search previous scans..."
          className="bg-surface-2/70 border-border/60 placeholder:text-muted-foreground focus:border-neon-cyan/60 w-full rounded-2xl border py-3.5 pr-4 pl-11 text-sm transition focus:shadow-[0_0_20px_color-mix(in_oklab,var(--neon-cyan)_25%,transparent)] focus:outline-none"
        />
      </div>

      {/* Tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = activeTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold tracking-wider transition-all ${
                active
                  ? "border-neon-cyan text-neon-cyan bg-neon-cyan/5 border shadow-[0_0_16px_color-mix(in_oklab,var(--neon-cyan)_45%,transparent)]"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border border"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Daily Summary */}
      <h2 className="mt-10 text-2xl font-bold">Daily Summary</h2>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <StatCard
          title="Daily Total Object Counted"
          value="1284"
          icon={<TrendingUp className="h-5 w-5" />}
          subtitle={
            <>
              <span className="text-neon-cyan">↑ 12%</span>{" "}
              <span className="ml-1">vs yesterday</span>
            </>
          }
          color="cyan"
        />
        <StatCard
          title="Daily Total Scans"
          value="42"
          icon={<Camera className="h-5 w-5" />}
          subtitle={
            <div className="flex items-center gap-1">
              <span className="text-neon-purple flex items-center gap-1 font-semibold">
                <CircleCheck size={10} /> Optimized
              </span>{" "}
              <span className="ml-1">Efficiency peak</span>
            </div>
          }
          color="purple"
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-neon-cyan/30 glow-cyan relative overflow-hidden rounded-2xl border"
        >
          <img
            src={previewDetection}
            alt="Preview detection"
            className="size-full object-cover"
            loading="lazy"
          />
          <div className="bg-background/70 text-foreground absolute top-3 left-3 rounded-md px-2 py-1 text-[10px] font-bold tracking-wider backdrop-blur">
            4K ULTRA
          </div>
        </motion.div>
      </div>

      {/* Distribution + Metrics */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="border-border/60 bg-card rounded-2xl border p-6">
          <h3 className="font-semibold">Object Distribution</h3>
          <div className="mt-4 grid grid-cols-2 items-center gap-6">
            <div className="space-y-3 overflow-hidden">
              {distribution.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between overflow-y-auto text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        d.color === "cyan"
                          ? "bg-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]"
                          : "bg-neon-purple shadow-[0_0_8px_var(--neon-purple)]"
                      }`}
                    />
                    <span className="text-muted-foreground">{d.label}</span>
                  </div>
                  <span>
                    <NumberTicker value={d.value} className="text-white" />%
                  </span>
                </div>
              ))}
            </div>
            <DonutChart />
          </div>
        </div>

        <div className="border-border/60 bg-card space-y-5 rounded-2xl border p-6">
          {metrics.map((m) => (
            <MetricBar key={m.label} {...m} />
          ))}
        </div>
      </div>

      {/* Past Week */}
      <h2 className="text-muted-foreground mt-10 text-sm font-bold tracking-[0.2em]">
        PAST WEEK
      </h2>
      <Carousel
        opts={{ dragFree: true, containScroll: "trimSnaps" }}
        className="mt-4 w-full"
      >
        <CarouselContent className="-ml-4 py-4">
          {pastWeek.map((p) => (
            <CarouselItem key={p.id} className="basis-[200px] pl-4">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="border-border/60 bg-card hover:border-neon-cyan/50 cursor-grab rounded-2xl border p-3 transition-all hover:shadow-[0_0_24px_color-mix(in_oklab,var(--neon-cyan)_25%,transparent)] active:cursor-grabbing"
              >
                <div className="aspect-square overflow-hidden rounded-xl">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 px-1">
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    {p.date}
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </motion.div>
  );
};

export default HistoryPage;
