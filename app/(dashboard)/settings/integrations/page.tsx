"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntegrationCard } from "@/components/settings/IntegrationCard";
import { useT } from "@/lib/i18n/client";

export default function IntegrationsPage() {
  const t = useT();
  const [apiKey, setApiKey] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchKey = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single();
    if (!profile) return;
    const { data } = await supabase
      .from("api_keys")
      .select("id, key_prefix, name, created_at")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    setApiKey(data ?? null);
    setLoading(false);
  };

  useEffect(() => { fetchKey(); }, []);

  return (
    <div className="space-y-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t.settings.integrations.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t.settings.integrations.apiDesc}
            Base URL: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{process.env.NEXT_PUBLIC_APP_URL}/api/v1</code>
          </p>
          {!loading && (
            <IntegrationCard
              name={t.settings.integrations.restApi}
              description={t.settings.integrations.restApiDesc}
              apiKey={apiKey}
              onRefresh={fetchKey}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
