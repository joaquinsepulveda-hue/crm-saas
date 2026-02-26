"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface WinRateGaugeProps {
  winRate: number;
}

export function WinRateGauge({ winRate }: WinRateGaugeProps) {
  const data = [{ value: winRate, fill: "#6366f1" }];

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={120} height={120}>
        <RadialBarChart
          innerRadius={40}
          outerRadius={55}
          startAngle={180}
          endAngle={0}
          data={data}
          barSize={10}
        >
          <RadialBar dataKey="value" background={{ fill: "#1e1e2e" }} cornerRadius={5} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{winRate}%</span>
        <span className="text-xs text-muted-foreground">Win Rate</span>
      </div>
    </div>
  );
}
