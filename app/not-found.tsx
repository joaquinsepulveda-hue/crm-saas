import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <SearchX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted-foreground max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <Button asChild>
        <Link href="/dashboard">Ir al inicio</Link>
      </Button>
    </div>
  );
}
