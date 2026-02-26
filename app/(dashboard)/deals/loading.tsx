import { Skeleton } from "@/components/ui/skeleton";

export default function DealsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-72 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            {Array.from({ length: Math.floor(Math.random() * 2) + 2 }).map((_, j) => (
              <div key={j} className="border border-border rounded-xl p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
