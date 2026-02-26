"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

interface StageData {
  name: string;
  value: number;
  count: number;
  color?: string;
}

interface PipelineByStageProps {
  data: StageData[];
}

const CustomTooltip = ({ active, payload, label, t }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-xs space-y-1">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{payload[0].payload.count} {t.deals.openDeals.toLowerCase()}</p>
      <p className="text-primary font-medium">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export function PipelineByStage({ data }: PipelineByStageProps) {
  const t = useT();

  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
        {t.deals.noDeals}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: -16, right: 8 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  );
}
