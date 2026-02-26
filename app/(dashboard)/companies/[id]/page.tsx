import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyContactsList } from "@/components/companies/CompanyContactsList";
import { formatDate } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Company Details" };

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const t = await getT();

  const [{ data: company }, { data: contacts }] = await Promise.all([
    supabase.from("companies").select("*").eq("id", id).single(),
    supabase.from("contacts").select("*").eq("company_id", id).order("first_name"),
  ]);

  if (!company) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={company.name}
        description={company.industry ?? company.domain ?? "Company"}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.companies.detail.companyInfo}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: t.companies.detail.domain, value: company.domain },
              { label: t.companies.detail.website, value: company.website },
              { label: t.companies.detail.industry, value: company.industry },
              { label: t.companies.detail.size, value: company.size },
              { label: t.companies.detail.phone, value: company.phone },
              { label: t.companies.detail.address, value: company.address },
              { label: t.companies.detail.added, value: formatDate(company.created_at) },
            ].map(({ label, value }) => value ? (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ) : null)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t.companies.detail.contacts} ({contacts?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyContactsList contacts={contacts ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
