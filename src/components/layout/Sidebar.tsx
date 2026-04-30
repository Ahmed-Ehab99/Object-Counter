import { motion } from "framer-motion";
import { Camera, History } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const items = [
  { to: "/camera", icon: Camera, label: "Camera" },
  { to: "/history", icon: History, label: "History" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center border-r border-border/40 bg-surface/40 backdrop-blur-xl pt-20">
      <nav className="flex flex-col gap-2">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink to={to} className="relative" key={label}>
            {({ isActive }) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex size-11 items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-neon-cyan bg-neon-cyan/10 glow-cyan"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -left-3 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_12px_var(--neon-cyan)]" />
                    )}
                    <Icon className="h-5 w-5" />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <span>{label}</span>
                </TooltipContent>
              </Tooltip>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
