'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useReportsStore } from '../store';
import { MOCK_REVENUE_DATA } from '../mock-data';
import { getDateRangeLabel, formatCurrency } from '../utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

const RANGES = ['7d', '30d', '90d', '1y'] as const;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-card border border-border/60 rounded-xl shadow-lg p-3 min-w-[160px]">
      <p className="text-[11px] font-bold text-foreground mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.dataKey}</span>
          </div>
          <span className="font-semibold text-foreground">
            {entry.dataKey === 'revenue' ? formatCurrency(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueOverviewChart() {
  const { dateRange, setDateRange } = useReportsStore();
  const data = MOCK_REVENUE_DATA[dateRange] || MOCK_REVENUE_DATA['30d'];

  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Revenue Overview
          </CardTitle>
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
            {RANGES.map((r) => (
              <Button
                key={r}
                variant={dateRange === r ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'h-7 px-3 rounded-md text-[10px] font-semibold transition-all',
                  dateRange === r
                    ? 'bg-card shadow-xs text-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setDateRange(r)}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : '1 Year'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D71920" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#D71920" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#D71920"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
