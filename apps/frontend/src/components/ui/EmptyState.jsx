import { cn } from "../../lib/utils";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-4">
          <Icon size={20} className="text-text-muted" />
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-[13px] text-text-muted max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
