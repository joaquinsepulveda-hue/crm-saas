import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function CompanyNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <Building2 className="w-7 h-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">Empresa no encontrada</h2>
      <p className="text-sm text-muted-foreground">
        Esta empresa no existe o fue eliminada.
      </p>
      <Button asChild size="sm" variant="outline">
        <Link href="/companies">Volver a empresas</Link>
      </Button>
    </div>
  );
}
