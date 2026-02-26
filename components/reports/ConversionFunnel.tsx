"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useT } from "@/lib/i18n/client";

interface FunnelStage {
  name: string;
  count: number;
  value: number;
}

interface ConversionFunnelProps {
  data: FunnelStage[];
}

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export function ConversionFunnel({ data }: ConversionFunnelProps) {
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
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#e2e2f0" }} axisLine={false} tickLine={false} width={90} />
          <Tooltip
            contentStyle={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#e2e2f0" }}
            cursor={{ fill: "rgba(99,102,241,0.05)" }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {data.map((stage, i) => {
          const prev = data[i - 1];
          const rate = prev && prev.count > 0 ? Math.round((stage.count / prev.count) * 100) : 100;
          return (
            <div key={stage.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{stage.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-medium">{stage.count} {t.deals.openDeals.toLowerCase()}</span>
                {i > 0 && (
                  <span className={`text-xs ${rate >= 50 ? "text-emerald-400" : "text-amber-400"}`}>
                    {rate}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
