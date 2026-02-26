import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

export default function ContactNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <UserX className="w-7 h-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">Contacto no encontrado</h2>
      <p className="text-sm text-muted-foreground">
        Este contacto no existe o fue eliminado.
      </p>
      <Button asChild size="sm" variant="outline">
        <Link href="/contacts">Volver a contactos</Link>
      </Button>
    </div>
  );
}
