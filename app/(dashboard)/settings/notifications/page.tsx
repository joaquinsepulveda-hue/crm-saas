"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/hooks/use-toast";
import { useT } from "@/lib/i18n/client";

const DEFAULT_PREFS = {
  deal_won: true,
  deal_assigned: true,
  activity_reminder: true,
  team_invite: true,
  weekly_digest: false,
};

export default function NotificationsPage() {
  const t = useT();
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [profileId, setProfileId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setProfileId(user.id);
      const { data } = await supabase.from("profiles").select("notification_prefs").eq("id", user.id).single();
      if (data?.notification_prefs) {
        setPrefs({ ...DEFAULT_PREFS, ...data.notification_prefs });
      }
    };
    fetchPrefs();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ notification_prefs: prefs }).eq("id", profileId);
    if (error) toast({ title: t.common.error, description: error.message, variant: "destructive" });
    else toast({ title: t.settings.notifications.save });
    setLoading(false);
  };

  const ITEMS = [
    { key: "deal_won" as const, label: t.settings.notifications.dealWon, description: t.settings.notifications.dealWonDesc },
    { key: "deal_assigned" as const, label: t.settings.notifications.dealAssigned, description: t.settings.notifications.dealAssignedDesc },
    { key: "activity_reminder" as const, label: t.settings.notifications.activityReminder, description: t.settings.notifications.activityReminderDesc },
    { key: "team_invite" as const, label: t.settings.notifications.teamInvite, description: t.settings.notifications.teamInviteDesc },
    { key: "weekly_digest" as const, label: t.settings.notifications.weeklyDigest, description: t.settings.notifications.weeklyDigestDesc },
  ];

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-sm">{t.settings.notifications.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ITEMS.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">{label}</Label>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch
              checked={prefs[key]}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
            />
          </div>
        ))}
        <Button onClick={handleSave} disabled={loading} className="w-full mt-2">
          {loading ? t.common.saving : t.settings.notifications.save}
        </Button>
      </CardContent>
    </Card>
  );
}
