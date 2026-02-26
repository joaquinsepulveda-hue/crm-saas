import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversionFunnel } from "@/components/reports/ConversionFunnel";
import { ActivityMetricsChart } from "@/components/reports/ActivityMetricsChart";
import { PipelineByStage } from "@/components/reports/PipelineByStage";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const t = await getT();
  const supabase = await createClient();

  const [{ data: stages }, { data: deals }, { data: activities }] = await Promise.all([
    supabase.from("pipeline_stages").select("id, name, color").order("position"),
    supabase.from("deals").select("stage_id, value, status, created_at").eq("status", "open"),
    supabase.from("activities").select("type, status, created_at"),
  ]);

  // Build pipeline by stage data
  const pipelineData = (stages ?? []).map((stage) => {
    const stageDeals = (deals ?? []).filter((d) => d.stage_id === stage.id);
    return {
      name: stage.name.split(" ")[0], // Truncate for display
      value: stageDeals.reduce((sum, d) => sum + (d.value ?? 0), 0),
      count: stageDeals.length,
      color: stage.color ?? "#6366f1",
    };
  });

  // Build funnel data
  const funnelData = (stages ?? []).map((stage) => {
    const stageDeals = (deals ?? []).filter((d) => d.stage_id === stage.id);
    return {
      name: stage.name,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + (d.value ?? 0), 0),
    };
  });

  // Build activity metrics (last 8 weeks)
  const now = new Date();
  const activityMetrics = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (7 - i) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekActivities = (activities ?? []).filter((a) => {
      const d = new Date(a.created_at);
      return d >= weekStart && d < weekEnd;
    });

    const weekLabel = weekStart.toLocaleDateString("es-MX", { month: "short", day: "numeric" });
    return {
      week: weekLabel,
      calls: weekActivities.filter((a) => a.type === "call").length,
      emails: weekActivities.filter((a) => a.type === "email").length,
      meetings: weekActivities.filter((a) => a.type === "meeting").length,
    };
  });

  // KPIs
  const totalPipelineValue = (deals ?? []).reduce((sum, d) => sum + (d.value ?? 0), 0);
  const avgDealValue = deals?.length ? totalPipelineValue / deals.length : 0;
  const completedActivities = (activities ?? []).filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader title={t.reports.title} description={t.reports.description} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t.reports.kpis.openDeals, value: deals?.length ?? 0 },
          { label: t.reports.kpis.pipelineValue, value: formatCurrency(totalPipelineValue) },
          { label: t.reports.kpis.avgDealValue, value: formatCurrency(avgDealValue) },
          { label: t.reports.kpis.activitiesDone, value: completedActivities },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold mt-1">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.reports.charts.pipelineByStage}</CardTitle></CardHeader>
          <CardContent>
            <PipelineByStage data={pipelineData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">{t.reports.charts.conversionFunnel}</CardTitle></CardHeader>
          <CardContent>
            <ConversionFunnel data={funnelData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">{t.reports.charts.activityMetrics}</CardTitle></CardHeader>
        <CardContent>
          <ActivityMetricsChart data={activityMetrics} />
        </CardContent>
      </Card>
    </div>
  );
}
