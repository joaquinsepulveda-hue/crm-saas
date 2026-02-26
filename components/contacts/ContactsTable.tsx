"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Contact } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContactForm } from "@/components/contacts/ContactForm";
import { toast } from "@/lib/hooks/use-toast";
import { Users, Trash2, ExternalLink, Pencil } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useT } from "@/lib/i18n/client";

interface ContactsTableProps {
  contacts: Contact[];
  loading: boolean;
  onRefresh: () => void;
}

const STATUS_COLORS: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  lead: "secondary",
  prospect: "default",
  customer: "success",
  churned: "destructive",
};

export function ContactsTable({ contacts, loading, onRefresh }: ContactsTableProps) {
  const t = useT();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editContact, setEditContact] = useState<Contact | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    const { error } = await supabase.from("contacts").delete().eq("id", deleteId);
    if (error) toast({ title: t.common.error, description: error.message, variant: "destructive" });
    else { toast({ title: "Contacto eliminado" }); onRefresh(); }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-card">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return <EmptyState icon={Users} title={t.contacts.noContacts} description={t.contacts.noContactsDesc} />;
  }

  return (
    <>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{t.contacts.table.name}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">{t.contacts.table.company}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">{t.contacts.table.status}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">{t.contacts.table.score}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden xl:table-cell">{t.contacts.table.created}</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(`${contact.first_name} ${contact.last_name}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/contacts/${contact.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                        {contact.first_name} {contact.last_name}
                      </Link>
                      {contact.email && <p className="text-xs text-muted-foreground">{contact.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-muted-foreground">{contact.company?.name ?? "—"}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Badge variant={STATUS_COLORS[contact.status] ?? "secondary"} className="capitalize text-xs">
                    {contact.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {contact.lead_score !== null ? (
                    <span className="text-sm font-medium">{contact.lead_score}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-sm text-muted-foreground">{formatDate(contact.created_at)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditContact(contact)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <Link href={`/contacts/${contact.id}`}><ExternalLink className="w-3.5 h-3.5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => setDeleteId(contact.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!editContact} onOpenChange={(open) => !open && setEditContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.common.edit} {t.contacts.title.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          {editContact && (
            <ContactForm
              contact={editContact}
              onSuccess={() => { setEditContact(null); onRefresh(); }}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="¿Eliminar contacto?"
        description="Esta acción no se puede deshacer."
        confirmLabel={t.common.delete}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
