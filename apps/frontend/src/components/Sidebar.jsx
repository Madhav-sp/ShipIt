import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Rocket,
  FolderGit2,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  X,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

const navItems = [
  { name: "Projects", path: "/dashboard", icon: LayoutDashboard },
  { name: "Deployments", path: "/dashboard", icon: Rocket },
  { name: "Repositories", path: "/dashboard", icon: FolderGit2 },
  { name: "Settings", path: "/dashboard", icon: Settings },
];

function NavLink({ item, isCollapsed, onClick }) {
  const location = useLocation();
  const isActive =
    item.path === "/dashboard"
      ? location.pathname === "/dashboard" || location.pathname === "/"
      : location.pathname.startsWith(item.path);

  const Icon = item.icon;

  const link = (
    <Link
      to={item.path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
        isCollapsed && "justify-center px-0",
        isActive
          ? "bg-white/[0.08] text-text-primary"
          : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
      )}
    >
      <Icon size={18} strokeWidth={1.8} className="shrink-0" />
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="z-[100] rounded-md bg-card border border-border px-3 py-1.5 text-xs font-medium text-text-primary shadow-lg"
          >
            {item.name}
            <Tooltip.Arrow className="fill-card" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  return link;
}

function SidebarContent({ isCollapsed, isMobile, onClose }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 shrink-0 border-b border-border px-4",
          isCollapsed && !isMobile && "justify-center px-0"
        )}
      >
        {isMobile && (
          <button
            onClick={onClose}
            className="mr-3 p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors lg:hidden"
          >
            <X size={18} />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center shrink-0">
            <Rocket size={14} className="text-background" />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-[15px] font-semibold tracking-tight text-text-primary">
              ShipIt
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-3 space-y-1", isCollapsed && !isMobile ? "px-3" : "px-3")}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            item={item}
            isCollapsed={isCollapsed && !isMobile}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </nav>

      {/* User section — pinned to bottom */}
      <div className={cn("mt-auto border-t border-border p-3", isCollapsed && !isMobile && "px-3")}>
        {user && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2",
              isCollapsed && !isMobile && "justify-center p-2"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-card border border-border overflow-hidden shrink-0">
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
                <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-semibold">
                  {(user.username || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary truncate">
                  {user.username || user.displayName || "User"}
                </p>
                <p className="text-[11px] text-text-muted truncate">Free Plan</p>
              </div>
            )}
            {(!isCollapsed || isMobile) && (
              <button
                onClick={logout}
                className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } =
    useSidebar();

  return (
    <Tooltip.Provider>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-surface border-r border-border z-40 transition-sidebar",
          isCollapsed ? "w-[72px]" : "w-[240px]"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} isMobile={false} />

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors z-50"
        >
          {isCollapsed ? (
            <ChevronsRight size={12} />
          ) : (
            <ChevronsLeft size={12} />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 h-screen w-[280px] bg-surface border-r border-border z-50 lg:hidden"
            >
              <SidebarContent
                isCollapsed={false}
                isMobile={true}
                onClose={closeMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Tooltip.Provider>
  );
}
