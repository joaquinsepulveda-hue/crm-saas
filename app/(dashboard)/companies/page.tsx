"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CompaniesTable } from "@/components/companies/CompaniesTable";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { SearchInput } from "@/components/shared/SearchInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { useT } from "@/lib/i18n/client";

export default function CompaniesPage() {
  const t = useT();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { companies, loading, refetch } = useCompanies(search);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.companies.title}
        description={`${companies.length} ${t.companies.title.toLowerCase()}`}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> {t.companies.addCompany}
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder={t.companies.searchPlaceholder} />

      <CompaniesTable companies={companies} loading={loading} onRefresh={refetch} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.companies.addCompany}</DialogTitle>
          </DialogHeader>
          <CompanyForm onSuccess={() => { setCreateOpen(false); refetch(); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
