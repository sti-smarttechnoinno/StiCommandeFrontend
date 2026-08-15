'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_REGION_REVENUE } from '../mock-data';
import { formatCurrency } from '../utils';
import { MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white dark:bg-card border border-border/60 rounded-xl shadow-lg p-3">
      <p className="text-xs font-bold text-foreground mb-1">{data.region} Region</p>
      <p className="text-sm font-bold text-foreground">{formatCurrency(data.revenue)}</p>
      <p className="text-[10px] text-muted-foreground">{data.percentage}% of total</p>
    </div>
  );
}

export function RevenueRegionChart() {
  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Revenue by Region
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MOCK_REGION_REVENUE}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v.toLocaleString()} DA`}
              />
              <YAxis
                type="category"
                dataKey="region"
                tick={{ fontSize: 11, fill: '#111827', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar
                dataKey="revenue"
                radius={[0, 6, 6, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
                barSize={28}
              >
                {MOCK_REGION_REVENUE.map((entry) => (
                  <Cell key={entry.region} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {MOCK_REGION_REVENUE.map((r) => (
            <div key={r.region} className="text-center">
              <div className="text-[10px] font-semibold text-muted-foreground">{r.region}</div>
              <div className="text-xs font-bold text-foreground">{r.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
