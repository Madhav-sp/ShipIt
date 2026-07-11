import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import { cn } from "../lib/utils";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Topbar({ onSearchOpen }) {
  const { user, logout } = useAuth();
  const { toggleMobile } = useSidebar();

  return (
    <header className="h-16 shrink-0 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left: Hamburger (mobile) + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors lg:hidden"
        >
          <Menu size={18} />
        </button>

        <nav className="hidden md:flex items-center gap-1.5 text-[13px]">
          <span className="text-text-muted font-medium">ShipIt</span>
          <ChevronRight size={12} className="text-text-muted" />
          <span className="text-text-primary font-medium">Projects</span>
        </nav>
      </div>

      {/* Center: Search trigger */}
      <button
        onClick={onSearchOpen}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-card hover:border-border-hover transition-colors text-text-muted text-[13px] w-[280px] lg:w-[320px]"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search projects...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border text-[10px] text-text-muted font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <button
          onClick={onSearchOpen}
          className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors md:hidden"
        >
          <Search size={18} />
        </button>

        <button className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors relative">
          <Bell size={18} />
        </button>

        {/* User dropdown */}
        {user ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="w-8 h-8 rounded-full overflow-hidden border border-border hover:border-border-hover transition-colors focus:outline-none">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : user.photos && user.photos[0] ? (
                  <img
                    src={user.photos[0].value}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-card flex items-center justify-center text-text-muted text-xs font-semibold">
                    {(user.username || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-[100] w-56 rounded-lg bg-surface border border-border shadow-xl py-1 animate-in fade-in-0 zoom-in-95"
              >
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-[13px] font-medium text-text-primary truncate">
                    {user.username || user.displayName || "User"}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    Free Plan
                  </p>
                </div>

                <DropdownMenu.Item
                  onSelect={logout}
                  className="mx-1 mt-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-red-400 hover:bg-red-400/10 cursor-pointer outline-none transition-colors"
                >
                  Log Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <div className="w-8 h-8 rounded-full bg-card border border-border animate-pulse" />
        )}
      </div>
    </header>
  );
}
