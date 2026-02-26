import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkspaceForm } from "@/components/settings/WorkspaceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Workspace Settings" };

export default async function WorkspaceSettingsPage() {
  const t = await getT();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single();
  const { data: org } = await supabase.from("organizations").select("*").eq("id", profile!.organization_id).single();

  if (!org) redirect("/dashboard");

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-sm">{t.settings.workspace.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <WorkspaceForm organization={org} />
      </CardContent>
    </Card>
  );
}
