"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ProductivityChartPoint } from "@/types/progress";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs">
      <p className="mb-2 font-semibold text-slate-700">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-slate-500 capitalize">{entry.name}:</span>
          <span className="font-semibold text-slate-900">{entry.value.toFixed(0)} sq.m</span>
        </div>
      ))}
    </div>
  );
}

export function ProductivityChart({ data }: { data: ProductivityChartPoint[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 md:px-6">
        <p className="text-base font-semibold text-slate-900">Monthly Productivity</p>
        <p className="mt-0.5 text-sm text-slate-500">
          Expected output vs. actual completed area per month
        </p>
      </div>
      <div className="p-5 md:p-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(248,250,252,0.8)" }} />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: 11, color: "#64748b", paddingTop: 12 }}
            />
            <Bar dataKey="expected" name="Expected" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="#0f172a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
