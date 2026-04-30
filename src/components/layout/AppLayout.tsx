import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      <main className="pl-16 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
