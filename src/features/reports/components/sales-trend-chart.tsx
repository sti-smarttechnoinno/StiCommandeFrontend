'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_SALES_TREND } from '../mock-data';
import { formatCurrency } from '../utils';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-card border border-border/60 rounded-xl shadow-lg p-3">
      <p className="text-[11px] font-bold text-foreground mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.dataKey}</span>
          </div>
          <span className="font-semibold text-foreground">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function SalesTrendChart() {
  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Sales Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_SALES_TREND} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v.toLocaleString()} DA`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#D71920"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#D71920', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                animationDuration={1200}
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
            <div className="w-3 h-0.5 rounded-full bg-[#D71920]" />
            Sales
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
            <div className="w-3 h-0.5 rounded-full bg-[#EF4444] border-dashed" />
            Returns
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
