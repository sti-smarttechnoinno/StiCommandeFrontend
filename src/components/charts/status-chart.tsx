'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CHART_COLORS } from '@/constants/mock-data';

const STATUS_DATA = [
  { name: 'Validated', value: 42, color: CHART_COLORS.validated },
  { name: 'Preparing', value: 31, color: CHART_COLORS.preparing },
  { name: 'Pending', value: 24, color: CHART_COLORS.pending },
  { name: 'Delivered', value: 38, color: CHART_COLORS.delivered },
  { name: 'Rejected', value: 6, color: CHART_COLORS.rejected },
  { name: 'Cancelled', value: 4, color: CHART_COLORS.cancelled },
];

const total = STATUS_DATA.reduce((sum, d) => sum + d.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const pct = ((data.value / total) * 100).toFixed(1);
    return (
      <div className="bg-background/95 backdrop-blur-md border border-border/60 p-2.5 rounded-xl shadow-md text-xs space-y-0.5">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.color }} />
          {data.name}
        </div>
        <p className="text-muted-foreground">
          {data.value} Orders <span className="font-bold text-foreground">({pct}%)</span>
        </p>
      </div>
    );
  }
  return null;
};

export function StatusChart() {
  return (
    <Card className="border border-border/40 shadow-xs rounded-2xl flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold tracking-tight">Orders by Status</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Distribution across order lifecycle
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2 pb-6 flex-1 flex flex-col justify-between">
        {/* Doughnut Chart with Center Metric */}
        <div className="relative h-[220px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={STATUS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={96}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-foreground tracking-tight leading-none">{total}</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mt-1">Total</span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {STATUS_DATA.map((item) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-xl bg-muted/30 text-xs"
              >
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-foreground">{item.value}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
