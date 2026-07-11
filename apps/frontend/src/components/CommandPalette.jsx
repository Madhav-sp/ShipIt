import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Rocket, ArrowRight, LayoutDashboard, Settings, FolderGit2 } from "lucide-react";
import { fetchDeployments } from "../lib/api";
import { extractRepoName, getStatusColor, formatRelativeTime } from "../lib/utils";

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    if (open) {
      fetchDeployments()
        .then((data) => setDeployments(data || []))
        .catch(() => setDeployments([]));
    }
  }, [open]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = useCallback(
    (path) => {
      navigate(path);
      onOpenChange(false);
      setSearch("");
    },
    [navigate, onOpenChange]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-[560px] z-[201]"
          >
            <Command
              className="bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
              shouldFilter={true}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={16} className="text-text-muted shrink-0" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search projects, deployments, or navigate..."
                  className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-muted outline-none"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] text-text-muted font-mono">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[320px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-[13px] text-text-muted">
                  No results found.
                </Command.Empty>

                {/* Navigation shortcuts */}
                <Command.Group
                  heading={
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2">
                      Navigation
                    </span>
                  }
                  className="mb-2"
                >
                  <Command.Item
                    value="Go to Dashboard Projects"
                    onSelect={() => handleSelect("/dashboard")}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-text-secondary cursor-pointer data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-text-primary transition-colors"
                  >
                    <LayoutDashboard size={15} className="shrink-0 text-text-muted" />
                    <span>Projects</span>
                    <ArrowRight size={12} className="ml-auto text-text-muted" />
                  </Command.Item>
                  <Command.Item
                    value="Go to Settings"
                    onSelect={() => handleSelect("/dashboard")}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-text-secondary cursor-pointer data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-text-primary transition-colors"
                  >
                    <Settings size={15} className="shrink-0 text-text-muted" />
                    <span>Settings</span>
                    <ArrowRight size={12} className="ml-auto text-text-muted" />
                  </Command.Item>
                </Command.Group>

                {/* Deployments */}
                {deployments.length > 0 && (
                  <Command.Group
                    heading={
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2">
                        Deployments
                      </span>
                    }
                  >
                    {deployments.slice(0, 8).map((d) => {
                      const repoName = extractRepoName(d.repoUrl);
                      const statusColors = getStatusColor(d.status);
                      return (
                        <Command.Item
                          key={d.id}
                          value={`${repoName} ${d.status} ${d.id}`}
                          onSelect={() => handleSelect(`/projects/${d.id}`)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-text-secondary cursor-pointer data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-text-primary transition-colors"
                        >
                          <FolderGit2
                            size={15}
                            className="shrink-0 text-text-muted"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="truncate">{repoName}</span>
                          </div>
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColors.dot}`}
                          />
                          <span className="text-[11px] text-text-muted shrink-0">
                            {formatRelativeTime(d.createdAt)}
                          </span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
