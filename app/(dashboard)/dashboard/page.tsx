import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { formatCurrency } from "@/lib/utils";
import { Users, Briefcase, TrendingUp, DollarSign, Activity, UserPlus } from "lucide-react";
import type { DashboardKPIs } from "@/lib/types";
import type { Metadata } from "next";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const t = await getT();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, full_name")
    .eq("id", user!.id)
    .single();

  let kpis: DashboardKPIs | null = null;
  if (profile?.organization_id) {
    const { data } = await supabase.rpc("get_dashboard_kpis", { p_org_id: profile.organization_id });
    if (data) {
      kpis = data as DashboardKPIs;
    } else {
      // Fallback: direct queries if RPC is unavailable
      const [{ count: contacts }, openDealsResult, wonDealsResult] = await Promise.all([
        supabase.from("contacts").select("id", { count: "exact", head: true }).eq("organization_id", profile.organization_id),
        supabase.from("deals").select("value").eq("organization_id", profile.organization_id).eq("status", "open"),
        supabase.from("deals").select("value").eq("organization_id", profile.organization_id).eq("status", "won"),
      ]);
      const openDealsValue = (openDealsResult.data ?? []).reduce((s, d) => s + (d.value ?? 0), 0);
      const wonDealsValue = (wonDealsResult.data ?? []).reduce((s, d) => s + (d.value ?? 0), 0);
      const totalOpen = openDealsResult.data?.length ?? 0;
      const totalWon = wonDealsResult.data?.length ?? 0;
      const winRate = totalOpen + totalWon > 0 ? Math.round((totalWon / (totalOpen + totalWon)) * 100) : 0;
      kpis = {
        total_contacts: contacts ?? 0,
        total_deals: totalOpen,
        open_deals_value: openDealsValue,
        won_deals_value: wonDealsValue,
        win_rate: winRate,
        activities_this_week: 0,
        new_contacts_this_month: 0,
        deals_by_stage: [],
      };
    }
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.dashboard.greetingMorning : hour < 18 ? t.dashboard.greetingAfternoon : t.dashboard.greetingEvening;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${profile?.full_name?.split(" ")[0] ?? "allí"}`}
        description={t.dashboard.description}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KPICard title={t.dashboard.kpis.totalContacts} value={kpis?.total_contacts ?? 0} icon={Users} trend={kpis?.new_contacts_this_month} trendLabel={t.dashboard.kpis.newThisMonth} />
        <KPICard title={t.dashboard.kpis.openDeals} value={kpis?.total_deals ?? 0} icon={Briefcase} />
        <KPICard title={t.dashboard.kpis.pipelineValue} value={formatCurrency(kpis?.open_deals_value ?? 0)} icon={DollarSign} />
        <KPICard title={t.dashboard.kpis.won30} value={formatCurrency(kpis?.won_deals_value ?? 0)} icon={TrendingUp} />
        <KPICard title={t.dashboard.kpis.winRate} value={`${kpis?.win_rate ?? 0}%`} icon={TrendingUp} />
        <KPICard title={t.dashboard.kpis.activitiesWeek} value={kpis?.activities_this_week ?? 0} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineChart data={kpis?.deals_by_stage ?? []} />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
