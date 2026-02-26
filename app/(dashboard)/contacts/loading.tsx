import { Skeleton } from "@/components/ui/skeleton";

export default function ContactsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Search */}
      <Skeleton className="h-9 w-full max-w-sm" />

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="p-3 border-b border-border">
          <div className="grid grid-cols-4 gap-4">
            {["Nombre", "Empresa", "Estado", "Creado"].map((h) => (
              <Skeleton key={h} className="h-4 w-16" />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-3 border-b border-border last:border-0">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
