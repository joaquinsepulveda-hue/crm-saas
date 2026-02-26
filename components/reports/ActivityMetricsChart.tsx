"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useT } from "@/lib/i18n/client";

interface ActivityMetric {
  week: string;
  calls: number;
  emails: number;
  meetings: number;
}

interface ActivityMetricsChartProps {
  data: ActivityMetric[];
}

export function ActivityMetricsChart({ data }: ActivityMetricsChartProps) {
  const t = useT();

  const hasData = data.some((d) => d.calls > 0 || d.emails > 0 || d.meetings > 0);

  if (!hasData) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
        {t.activities.noActivities}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ left: -16, right: 8 }}>
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#e2e2f0" }}
          cursor={{ fill: "rgba(99,102,241,0.05)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#71717a" }} />
        <Bar dataKey="calls" name={t.activities.types.call} fill="#6366f1" radius={[2, 2, 0, 0]} />
        <Bar dataKey="emails" name={t.activities.types.email} fill="#8b5cf6" radius={[2, 2, 0, 0]} />
        <Bar dataKey="meetings" name={t.activities.types.meeting} fill="#10b981" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
