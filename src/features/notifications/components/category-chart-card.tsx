'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notificationsService } from '@/services/notifications';
import { useNotificationsStore } from '../store';
import { PieChart } from 'lucide-react';
import { PieChart as RechartPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function CustomTooltip({ active, payload, total }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-border/60 rounded-xl shadow-lg p-3">
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-semibold text-foreground">{data.name}</span>
      </div>
      <p className="text-sm font-bold text-foreground mt-1">{data.value} notifications</p>
      {total > 0 && (
        <p className="text-[10px] text-muted-foreground">{((data.value / total) * 100).toFixed(1)}% of total</p>
      )}
    </div>
  );
}

export function CategoryChartCard() {
  const refreshKey = useNotificationsStore((s) => s.refreshKey);
  const [data, setData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    notificationsService
      .getAnalytics()
      .then((res) => {
        if (isMounted) {
          setData(res.categoryDistribution);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const total = data.reduce((s, r) => s + r.value, 0);

  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card h-full flex flex-col justify-between">
      <CardHeader className="pb-2 border-b border-border/30">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          Notifications by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-3 flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="py-10 text-center text-xs text-muted-foreground">Loading chart...</div>
        ) : data.length === 0 ? (
          <div className="py-10 text-center text-xs text-muted-foreground">No category data available</div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPie>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1000}
                    stroke="none"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip total={total} />} />
                </RechartPie>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-foreground leading-none">{total}</span>
                <span className="text-[9px] font-semibold text-muted-foreground uppercase mt-1">Total</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full">
              {data.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground font-medium text-[11px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
