import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="border-border/40 bg-background/60 fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-center border-b backdrop-blur-xl">
      <NavLink to="/history" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Objex Logo" className="size-8" />
        <span className="text-gradient-brand text-2xl font-bold tracking-tight">
          Objex
        </span>
      </NavLink>
    </header>
  );
}
