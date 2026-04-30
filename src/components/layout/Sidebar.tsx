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
    <aside className="border-border/40 bg-surface/40 fixed top-0 left-0 z-40 flex h-screen w-16 flex-col items-center border-r pt-20 backdrop-blur-xl">
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
                      <span className="bg-neon-cyan absolute top-1/2 -left-3 h-6 w-0.5 -translate-y-1/2 rounded-full shadow-[0_0_12px_var(--neon-cyan)]" />
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
