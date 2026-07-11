import { cn, getStatusColor, getStatusText } from "../../lib/utils";

export default function StatusBadge({ status, size = "default" }) {
  const colors = getStatusColor(status);
  const text = getStatusText(status);
  const isAnimating =
    status?.toLowerCase() === "building" ||
    status?.toLowerCase() === "queued";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border",
        colors.bg,
        colors.border,
        size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1"
      )}
    >
      <span
        className={cn(
          "rounded-full shrink-0",
          colors.dot,
          isAnimating && "animate-pulse",
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
        )}
      />
      <span
        className={cn(
          "font-medium capitalize",
          colors.text,
          size === "sm" ? "text-[10px]" : "text-[11px]"
        )}
      >
        {text}
      </span>
    </div>
  );
}
