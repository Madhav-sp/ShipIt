import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Download, Terminal, Check, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function LogsModal({
  open,
  onOpenChange,
  logs,
  isLoading,
  title = "Build Logs",
}) {
  const scrollRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = async () => {
    if (!logs) return;
    try {
      await navigator.clipboard.writeText(logs);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (!logs) return;
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `build-logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95%] max-w-4xl max-h-[80vh] bg-surface border border-border rounded-xl shadow-2xl z-[101] flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-text-muted" />
                    <Dialog.Title className="text-[14px] font-semibold text-text-primary">
                      {title}
                    </Dialog.Title>
                    {isLoading && (
                      <Loader2
                        size={14}
                        className="animate-spin text-text-muted"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                      title="Copy logs"
                    >
                      {copied ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                      title="Download logs"
                    >
                      <Download size={14} />
                    </button>
                    <Dialog.Close asChild>
                      <button className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors ml-1">
                        <X size={14} />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Logs content */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto bg-[#09090B] p-4"
                >
                  {isLoading && !logs ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2
                          size={24}
                          className="animate-spin text-text-muted"
                        />
                        <p className="text-[13px] text-text-muted">
                          Loading build logs...
                        </p>
                      </div>
                    </div>
                  ) : logs ? (
                    <pre className="terminal-text text-text-secondary whitespace-pre-wrap break-words">
                      {logs}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center py-16">
                      <p className="text-[13px] text-text-muted">
                        No logs available yet.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
