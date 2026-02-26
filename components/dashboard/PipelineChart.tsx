"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

interface PipelineChartProps {
  data: { stage_name: string; count: number; value: number }[];
}

export function PipelineChart({ data }: PipelineChartProps) {
  const t = useT();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{t.reports.charts.pipelineByStage}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            {t.deals.noDeals}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="stage_name" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip
                contentStyle={{ backgroundColor: "#12121a", border: "1px solid #1e1e2e", borderRadius: "8px" }}
                labelStyle={{ color: "#e2e2f0", fontWeight: 600 }}
                formatter={((value: number | undefined, name: string | undefined) => [name === "value" ? formatCurrency(value ?? 0) : (value ?? 0), name === "value" ? t.deals.form.value : t.deals.openDeals]) as any}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
