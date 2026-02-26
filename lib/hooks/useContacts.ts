"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Contact } from "@/lib/types";

interface UseContactsOptions {
  search?: string;
  status?: string;
  company_id?: string;
  limit?: number;
}

export function useContacts(options: UseContactsOptions = {}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      let query = supabase
        .from("contacts")
        .select("*, company:companies(id, name, industry)")
        .order("created_at", { ascending: false });

      if (options.search) {
        query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%`);
      }
      if (options.status) query = query.eq("status", options.status);
      if (options.company_id) query = query.eq("company_id", options.company_id);
      if (options.limit) query = query.limit(options.limit);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setContacts((data as Contact[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  }, [options.search, options.status, options.company_id, options.limit]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);
  return { contacts, loading, error, refetch: fetchContacts };
}
