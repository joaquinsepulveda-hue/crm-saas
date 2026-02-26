import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-lg">
      <div className="border border-border rounded-xl p-4 space-y-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
