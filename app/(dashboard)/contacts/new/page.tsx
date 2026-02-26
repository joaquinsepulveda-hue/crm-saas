"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contacts/ContactForm";
import { useT } from "@/lib/i18n/client";

export default function NewContactPage() {
  const router = useRouter();
  const t = useT();

  return (
    <div className="max-w-lg space-y-6">
      <PageHeader title={t.contacts.addContact} description={t.contacts.detail.contactInfo} />
      <Card>
        <CardHeader><CardTitle className="text-sm">{t.contacts.detail.contactInfo}</CardTitle></CardHeader>
        <CardContent>
          <ContactForm onSuccess={() => router.push("/contacts")} />
        </CardContent>
      </Card>
    </div>
  );
}
