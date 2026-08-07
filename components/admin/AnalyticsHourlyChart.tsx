"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface AnalyticsHourlyChartProps {
  data: { hour: number; count: number }[];
}

export function AnalyticsHourlyChart({ data }: AnalyticsHourlyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 11, fontFamily: "monospace" }}
          tickFormatter={(value: number) => `${value.toString().padStart(2, "0")}:00`}
          interval={2}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: "monospace" }} />
        <Tooltip
          labelFormatter={(value) => `${String(value).padStart(2, "0")}:00 UTC`}
          contentStyle={{
            fontSize: 12,
            fontFamily: "monospace",
            border: "1px solid var(--color-rule)",
          }}
        />
        <Bar dataKey="count" fill="var(--color-accent)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
