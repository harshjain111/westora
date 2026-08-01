"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface SubmissionsChartProps {
  data: { date: string; count: number }[];
}

export function SubmissionsChart({ data }: SubmissionsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fontFamily: "monospace" }}
          tickFormatter={(value: string) => value.slice(5)}
          interval={4}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: "monospace" }} />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            fontFamily: "monospace",
            border: "1px solid var(--color-rule)",
          }}
        />
        <Line type="monotone" dataKey="count" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
