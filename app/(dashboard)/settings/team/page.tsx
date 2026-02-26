"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMembersTable } from "@/components/settings/TeamMembersTable";
import { InviteUserDialog } from "@/components/settings/InviteUserDialog";
import { UserPlus } from "lucide-react";
import { useT } from "@/lib/i18n/client";
import type { Profile } from "@/lib/types";

export default function TeamSettingsPage() {
  const t = useT();
  const [members, setMembers] = useState<Profile[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);

    const { data: myProfile } = await supabase.from("profiles").select("organization_id, role").eq("id", user.id).single();
    if (!myProfile) return;
    setCurrentRole(myProfile.role);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("organization_id", myProfile.organization_id)
      .order("created_at");
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const isAdmin = ["owner", "admin"].includes(currentRole);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm">{t.settings.team.cardTitle}</CardTitle>
        {isAdmin && (
          <Button size="sm" className="gap-1.5 h-8" onClick={() => setInviteOpen(true)}>
            <UserPlus className="w-3.5 h-3.5" /> {t.settings.team.invite}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!loading && (
          <TeamMembersTable
            members={members}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onRefresh={fetchMembers}
          />
        )}
      </CardContent>

      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSuccess={() => { setInviteOpen(false); fetchMembers(); }}
      />
    </Card>
  );
}
