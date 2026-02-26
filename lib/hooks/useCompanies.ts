"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Company } from "@/lib/types";

export function useCompanies(search?: string) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("companies").select("*").order("name");
    if (search) query = query.ilike("name", `%${search}%`);
    const { data } = await query;
    setCompanies(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, [search]);

  return { companies, loading, refetch: fetchCompanies };
}
