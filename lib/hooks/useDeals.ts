"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Deal, PipelineStage } from "@/lib/types";

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [closedDeals, setClosedDeals] = useState<Deal[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const [dealsResult, stagesResult, closedResult] = await Promise.all([
      supabase
        .from("deals")
        .select("*, stage:pipeline_stages(*), contact:contacts(id, first_name, last_name, email), company:companies(id, name)")
        .eq("status", "open")
        .order("position", { ascending: true }),
      supabase
        .from("pipeline_stages")
        .select("*")
        .order("position", { ascending: true }),
      supabase
        .from("deals")
        .select("*, contact:contacts(id, first_name, last_name), company:companies(id, name), stage:pipeline_stages(name)")
        .in("status", ["won", "lost"])
        .order("updated_at", { ascending: false })
        .limit(100),
    ]);
    if (dealsResult.data) setDeals(dealsResult.data as Deal[]);
    if (stagesResult.data) setStages(stagesResult.data as PipelineStage[]);
    if (closedResult.data) setClosedDeals(closedResult.data as Deal[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);
  return { deals, closedDeals, stages, loading, refetch: fetchDeals };
}
