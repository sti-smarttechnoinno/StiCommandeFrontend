'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_ORDERS_BY_STATUS } from '../mock-data';
import { PieChart } from 'lucide-react';
import { PieChart as RechartPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const TOTAL = MOCK_ORDERS_BY_STATUS.reduce((s, r) => s + r.value, 0);

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-border/60 rounded-xl shadow-lg p-3">
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-semibold text-foreground">{data.name}</span>
      </div>
      <p className="text-sm font-bold text-foreground mt-1">{data.value.toLocaleString()} orders</p>
      <p className="text-[10px] text-muted-foreground">{((data.value / TOTAL) * 100).toFixed(1)}% of total</p>
    </div>
  );
}

export function OrdersStatusChart() {
  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          Orders by Status
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex flex-col items-center">
          <div className="relative w-[200px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPie>
                <Pie
                  data={MOCK_ORDERS_BY_STATUS}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1000}
                  animationEasing="ease-out"
                  stroke="none"
                >
                  {MOCK_ORDERS_BY_STATUS.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartPie>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-foreground leading-none">{TOTAL.toLocaleString()}</span>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase mt-1">Total Orders</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full">
            {MOCK_ORDERS_BY_STATUS.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-foreground">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
