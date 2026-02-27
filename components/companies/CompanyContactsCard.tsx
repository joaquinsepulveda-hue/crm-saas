"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { CompanyContactsList } from "./CompanyContactsList";
import type { Contact } from "@/lib/types";

interface CompanyContactsCardProps {
  companyId: string;
  initialContacts: Contact[];
}

export function CompanyContactsCard({ companyId, initialContacts }: CompanyContactsCardProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .eq("company_id", companyId)
      .order("first_name");
    if (data) setContacts(data as Contact[]);
  }, [companyId]);

  return (
    <CompanyContactsList contacts={contacts} companyId={companyId} onRefresh={refresh} />
  );
}
