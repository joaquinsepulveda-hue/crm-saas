import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-4 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-4 space-y-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-52 w-full" />
          </div>
        ))}
      </div>

      {/* Activity metrics */}
      <div className="border border-border rounded-xl p-4 space-y-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-52 w-full" />
      </div>
    </div>
  );
}
