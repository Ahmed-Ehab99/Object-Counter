import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-center border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <NavLink to="/history" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Objex Logo" className="size-8" />
        <span className="text-2xl font-bold tracking-tight text-gradient-brand">
          Objex
        </span>
      </NavLink>
    </header>
  );
}
