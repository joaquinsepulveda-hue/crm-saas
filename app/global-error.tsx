"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
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
    <html>
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Algo salió mal</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            Ocurrió un error inesperado. Por favor intenta de nuevo.
          </p>
          <Button onClick={reset}>Intentar de nuevo</Button>
        </div>
      </body>
    </html>
  );
}
