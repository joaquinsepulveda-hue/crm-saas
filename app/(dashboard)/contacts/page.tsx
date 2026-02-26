"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { ContactFilters } from "@/components/contacts/ContactFilters";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContactForm } from "@/components/contacts/ContactForm";
import { useContacts } from "@/lib/hooks/useContacts";
import { useT } from "@/lib/i18n/client";

export default function ContactsPage() {
  const t = useT();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { contacts, loading, refetch } = useContacts({ search, status: statusFilter || undefined });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.contacts.title}
        description={`${contacts.length} ${t.contacts.title.toLowerCase()}`}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> {t.contacts.addContact}
          </Button>
        }
      />

      <ContactFilters search={search} onSearchChange={setSearch} status={statusFilter} onStatusChange={setStatusFilter} />
      <ContactsTable contacts={contacts} loading={loading} onRefresh={refetch} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.contacts.addContact}</DialogTitle>
          </DialogHeader>
          <ContactForm onSuccess={() => { setCreateOpen(false); refetch(); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
