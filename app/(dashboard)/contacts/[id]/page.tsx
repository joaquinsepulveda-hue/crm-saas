import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadScoreBadge } from "@/components/contacts/LeadScoreBadge";
import { AIScoreButton } from "@/components/contacts/AIScoreButton";
import { formatDate } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Details" };

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const t = await getT();

  const { data: contact } = await supabase
    .from("contacts")
    .select("*, company:companies(*)")
    .eq("id", id)
    .single();

  if (!contact) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={`${contact.first_name} ${contact.last_name}`}
        description={contact.title ?? contact.company?.name ?? "Contact"}
        actions={<AIScoreButton contactId={contact.id} currentScore={contact.lead_score} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.contacts.detail.contactInfo}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: t.contacts.detail.email, value: contact.email },
              { label: t.contacts.detail.phone, value: contact.phone },
              { label: t.contacts.detail.title, value: contact.title },
              { label: t.contacts.detail.company, value: contact.company?.name },
              { label: t.contacts.detail.source, value: contact.source },
              { label: t.contacts.detail.added, value: formatDate(contact.created_at) },
            ].map(({ label, value }) => value ? (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ) : null)}
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground">{t.contacts.detail.status}</span>
              <Badge variant="secondary" className="capitalize">{contact.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">{t.contacts.detail.leadScore}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <LeadScoreBadge score={contact.lead_score} grade={contact.lead_score_breakdown?.grade} />
            </div>
            {contact.lead_score_breakdown ? (
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{contact.lead_score_breakdown.summary}</p>
                <p className="font-medium text-primary mt-2">{contact.lead_score_breakdown.recommended_action}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t.contacts.detail.scorePrompt}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {contact.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {contact.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}

      {contact.notes && (
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.contacts.detail.notes}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
