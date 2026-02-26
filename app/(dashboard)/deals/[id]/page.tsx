import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AINextActions } from "@/components/deals/AINextActions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Deal Details" };

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const t = await getT();

  const { data: deal } = await supabase
    .from("deals")
    .select("*, stage:pipeline_stages(*), contact:contacts(first_name, last_name, email, company:companies(name))")
    .eq("id", id)
    .single();

  if (!deal) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={deal.title}
        description={deal.contact ? `${deal.contact.first_name} ${deal.contact.last_name}` : "No contact linked"}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.deals.detail.dealInfo}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: t.deals.detail.value, value: deal.value ? formatCurrency(deal.value) : null },
              { label: t.deals.detail.stage, value: deal.stage?.name },
              { label: t.deals.detail.closeDate, value: deal.close_date ? formatDate(deal.close_date) : null },
              { label: t.deals.detail.contact, value: deal.contact ? `${deal.contact.first_name} ${deal.contact.last_name}` : null },
              { label: t.deals.detail.company, value: deal.contact?.company?.name },
              { label: t.deals.detail.created, value: formatDate(deal.created_at) },
            ].map(({ label, value }) => value ? (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ) : null)}
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground">{t.deals.detail.status}</span>
              <Badge variant={deal.status === "won" ? "success" : deal.status === "lost" ? "destructive" : "secondary"} className="capitalize">
                {deal.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <AINextActions
          dealId={deal.id}
          suggestions={deal.ai_suggestions ?? null}
          updatedAt={deal.ai_suggestions_updated_at ?? null}
        />
      </div>

      {deal.notes && (
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.contacts.detail.notes}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{deal.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
