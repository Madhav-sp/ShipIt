import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CommandPalette from "../components/CommandPalette";
import { cn } from "../lib/utils";

import Footer from "../components/Footer";

function DashboardShell() {
  const { user, isLoading } = useAuth();
  const { isCollapsed } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-text-muted border-t-text-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      {/* Main area — pushed right by sidebar width */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-sidebar",
          "lg:ml-[240px]",
          isCollapsed && "lg:ml-[72px]"
        )}
      >
        <Topbar onSearchOpen={() => setSearchOpen(true)} />

        {/* Scrollable content area — this is the ONLY scroll container */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardShell />
    </SidebarProvider>
  );
}
