"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import type { Contact } from "@/lib/types";

interface CompanyContactsListProps {
  contacts: Contact[];
}

export function CompanyContactsList({ contacts }: CompanyContactsListProps) {
  const t = useT();
  if (contacts.length === 0) {
    return <EmptyState icon={Users} title={t.contacts.noContacts} description="No hay contactos vinculados a esta empresa." />;
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact) => (
        <Link
          key={contact.id}
          href={`/contacts/${contact.id}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(`${contact.first_name} ${contact.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{contact.first_name} {contact.last_name}</p>
            {contact.title && <p className="text-xs text-muted-foreground truncate">{contact.title}</p>}
          </div>
          <Badge variant="secondary" className="capitalize text-xs flex-shrink-0">{contact.status}</Badge>
        </Link>
      ))}
    </div>
  );
}
