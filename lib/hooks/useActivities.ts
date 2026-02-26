"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Activity } from "@/lib/types";

interface UseActivitiesOptions {
  contact_id?: string;
  deal_id?: string;
  type?: string;
  status?: string;
  limit?: number;
}

export function useActivities(options: UseActivitiesOptions = {}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    let query = supabase
      .from("activities")
      .select("*, contact:contacts(id, first_name, last_name), deal:deals(id, title)")
      .order("created_at", { ascending: false });

    if (options.contact_id) query = query.eq("contact_id", options.contact_id);
    if (options.deal_id) query = query.eq("deal_id", options.deal_id);
    if (options.type) query = query.eq("type", options.type);
    if (options.status) query = query.eq("status", options.status);
    if (options.limit) query = query.limit(options.limit);

    const { data } = await query;
    if (data) setActivities(data as Activity[]);
    setLoading(false);
  }, [options.contact_id, options.deal_id, options.type, options.status, options.limit]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);
  return { activities, loading, refetch: fetchActivities };
}
