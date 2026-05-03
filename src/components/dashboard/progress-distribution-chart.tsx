"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  "On Track":                 { color: "#10b981", label: "On Track" },
  "At Risk":                  { color: "#f59e0b", label: "At Risk" },
  "Delayed":                  { color: "#f97316", label: "Delayed" },
  "Critical":                 { color: "#f43f5e", label: "Critical" },
  "Labor Issue":              { color: "#8b5cf6", label: "Labor Issue" },
  "Completed":                { color: "#0f172a", label: "Completed" },
};

const FALLBACK_COLORS = ["#10b981", "#f59e0b", "#f97316", "#f43f5e", "#8b5cf6", "#0f172a"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { name: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700">{item.payload.name}</p>
      <p className="text-slate-500 mt-0.5">
        <span className="font-bold text-slate-900">{item.value}</span> tasks
      </p>
    </div>
  );
}

export function ProgressDistributionChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const filteredData = data.filter((d) => d.value > 0);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 md:px-6">
        <p className="text-base font-semibold text-slate-900">Task Status Mix</p>
        <p className="mt-0.5 text-sm text-slate-500">
          Portfolio health breakdown across all tasks
        </p>
      </div>
      <div className="p-5 md:p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_CONFIG[entry.name]?.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-slate-900 tabular-nums">{total}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Tasks</p>
            </div>
          </div>

          {/* Legend */}
          <div className="grid w-full grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-1">
            {data.map((entry, index) => {
              const color = STATUS_CONFIG[entry.name]?.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
              const pct = total > 0 ? ((entry.value / total) * 100).toFixed(0) : "0";
              return (
                <div key={entry.name} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="text-slate-600">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 tabular-nums">{entry.value}</span>
                    <span className="text-slate-400 tabular-nums w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
