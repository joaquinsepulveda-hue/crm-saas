"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { toast } from "@/lib/hooks/use-toast";
import { Building2, Trash2, ExternalLink, Pencil } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useT } from "@/lib/i18n/client";
import type { Company } from "@/lib/types";

interface CompaniesTableProps {
  companies: Company[];
  loading: boolean;
  onRefresh: () => void;
}

export function CompaniesTable({ companies, loading, onRefresh }: CompaniesTableProps) {
  const t = useT();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState<Company | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    const { error } = await supabase.from("companies").delete().eq("id", deleteId);
    if (error) toast({ title: t.common.error, description: error.message, variant: "destructive" });
    else { toast({ title: "Empresa eliminada" }); onRefresh(); }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-card">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return <EmptyState icon={Building2} title={t.companies.noCompanies} description={t.companies.noCompaniesDesc} />;
  }

  return (
    <>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{t.companies.table.name}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">{t.companies.table.industry}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">{t.companies.table.size}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">{t.companies.table.domain}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden xl:table-cell">{t.companies.table.created}</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(company.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/companies/${company.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                        {company.name}
                      </Link>
                      {company.website && (
                        <p className="text-xs text-muted-foreground">{company.website.replace(/^https?:\/\//, "")}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-muted-foreground capitalize">{company.industry ?? "—"}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{company.size ?? "—"}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">{company.domain ?? "—"}</span>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-sm text-muted-foreground">{formatDate(company.created_at)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditCompany(company)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <Link href={`/companies/${company.id}`}><ExternalLink className="w-3.5 h-3.5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => setDeleteId(company.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!editCompany} onOpenChange={(open) => !open && setEditCompany(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.common.edit} {t.companies.title.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          {editCompany && (
            <CompanyForm
              company={editCompany}
              onSuccess={() => { setEditCompany(null); onRefresh(); }}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="¿Eliminar empresa?"
        description="Se desvinculará de todos sus contactos. Esta acción no se puede deshacer."
        confirmLabel={t.common.delete}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
