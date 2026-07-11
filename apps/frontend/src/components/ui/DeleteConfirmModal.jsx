import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}) {
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
                className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95%] max-w-md bg-surface border border-border rounded-xl shadow-2xl z-[101] overflow-hidden p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} className="text-red-400" />
                  </div>
                  <div>
                    <Dialog.Title className="text-[16px] font-semibold text-text-primary leading-tight">
                      Delete Deployment
                    </Dialog.Title>
                  </div>
                </div>

                <Dialog.Description className="text-[13px] text-text-muted mt-2 leading-relaxed">
                  Are you sure you want to delete this deployment? This action
                  cannot be undone.
                </Dialog.Description>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      disabled={isDeleting}
                      className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-white/[0.04] text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 active:scale-[0.98] text-[13px] font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
