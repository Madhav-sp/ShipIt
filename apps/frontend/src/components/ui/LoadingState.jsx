import { cn } from "../../lib/utils";

function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl animate-pulse",
        className
      )}
    />
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[140px]" />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[88px]" />
      ))}
    </div>
  );
}

export function DeployFormSkeleton() {
  return <Skeleton className="h-[148px]" />;
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <Skeleton className="h-[280px]" />
      <Skeleton className="h-[400px]" />
    </div>
  );
}

export default function LoadingState({ variant = "cards" }) {
  switch (variant) {
    case "stats":
      return <StatsSkeleton />;
    case "deploy":
      return <DeployFormSkeleton />;
    case "detail":
      return <DetailSkeleton />;
    case "cards":
    default:
      return <CardSkeleton />;
  }
}
