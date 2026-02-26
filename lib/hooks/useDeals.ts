"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Deal, PipelineStage } from "@/lib/types";

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const [dealsResult, stagesResult] = await Promise.all([
      supabase
        .from("deals")
        .select("*, stage:pipeline_stages(*), contact:contacts(id, first_name, last_name, email), company:companies(id, name)")
        .eq("status", "open")
        .order("position", { ascending: true }),
      supabase
        .from("pipeline_stages")
        .select("*")
        .order("position", { ascending: true }),
    ]);
    if (dealsResult.data) setDeals(dealsResult.data as Deal[]);
    if (stagesResult.data) setStages(stagesResult.data as PipelineStage[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);
  return { deals, stages, loading, refetch: fetchDeals };
}
