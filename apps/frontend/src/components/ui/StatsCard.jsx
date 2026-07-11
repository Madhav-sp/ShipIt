import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export default function StatsCard({ label, value, icon: Icon, accent, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-border-hover transition-colors"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <Icon
            size={16}
            className={cn("text-text-muted", accent && accent)}
          />
        )}
      </div>
      <span className="text-2xl font-semibold text-text-primary tracking-tight">
        {value}
      </span>
    </motion.div>
  );
}
