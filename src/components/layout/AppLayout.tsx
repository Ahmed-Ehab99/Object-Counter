import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <Sidebar />
      <main className="pt-16 pl-16">
        <Outlet />
      </main>
    </div>
  );
}
