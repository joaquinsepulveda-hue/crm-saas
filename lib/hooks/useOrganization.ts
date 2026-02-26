"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Organization, Profile } from "@/lib/types";

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchOrgData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*, organizations(*)")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData as Profile);
          setOrganization(profileData.organizations as unknown as Organization);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrgData();
  }, []);

  return { organization, profile, loading };
}
