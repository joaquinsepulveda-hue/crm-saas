"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold">Error al cargar la página</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        No se pudieron cargar los datos. Verifica tu conexión e intenta de nuevo.
      </p>
      <Button onClick={reset} size="sm" variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Intentar de nuevo
      </Button>
    </div>
  );
}
