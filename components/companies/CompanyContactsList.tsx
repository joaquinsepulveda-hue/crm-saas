"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/hooks/use-toast";
import { Users, UserPlus } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import type { Contact } from "@/lib/types";

interface CompanyContactsListProps {
  contacts: Contact[];
  companyId: string;
  onRefresh: () => void;
}

export function CompanyContactsList({ contacts, companyId, onRefresh }: CompanyContactsListProps) {
  const t = useT();
  const [linkOpen, setLinkOpen] = useState(false);
  const [available, setAvailable] = useState<{ id: string; first_name: string; last_name: string }[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [linking, setLinking] = useState(false);

  const openLinkDialog = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("contacts")
      .select("id, first_name, last_name")
      .is("company_id", null)
      .order("first_name");
    setAvailable(data ?? []);
    setSelectedId("");
    setLinkOpen(true);
  };

  const handleLink = async () => {
    if (!selectedId) return;
    setLinking(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("contacts")
      .update({ company_id: companyId })
      .eq("id", selectedId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Contacto vinculado" });
      setLinkOpen(false);
      onRefresh();
    }
    setLinking(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">{contacts.length} contacto{contacts.length !== 1 ? "s" : ""}</span>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={openLinkDialog}>
          <UserPlus className="w-3 h-3" /> Vincular contacto
        </Button>
      </div>

      {contacts.length === 0 ? (
        <EmptyState icon={Users} title={t.contacts.noContacts} description="No hay contactos vinculados a esta empresa." />
      ) : (
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
      )}

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Vincular contacto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {available.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay contactos sin empresa disponibles.</p>
            ) : (
              <Select onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contacto" />
                </SelectTrigger>
                <SelectContent>
                  {available.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.first_name} {c.last_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button className="w-full" onClick={handleLink} disabled={!selectedId || linking}>
              {linking ? "Vinculando..." : "Vincular"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
