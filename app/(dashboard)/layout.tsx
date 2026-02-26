import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(name, plan)")
    .eq("id", user.id)
    .single();

  const org = profile?.organizations as { name: string; plan: string } | null;

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex">
        <Sidebar
          profile={profile ? { full_name: profile.full_name, avatar_url: profile.avatar_url, role: profile.role } : undefined}
          orgName={org?.name}
        />
      </div>
      <DashboardShell
        profile={profile ? { full_name: profile.full_name, avatar_url: profile.avatar_url, role: profile.role } : undefined}
        orgName={org?.name}
      >
        {children}
      </DashboardShell>
    </div>
  );
}
