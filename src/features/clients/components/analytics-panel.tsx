'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '../utils';
import { clientsService } from '@/services/clients';
import { Globe, CreditCard, Trophy, Loader2 } from 'lucide-react';

interface RegionalData {
  name: string;
  value: number;
  color: string;
}

interface CreditUsage {
  label: string;
  limit: number;
  used: number;
  color: string;
}

interface TopDelegate {
  name: string;
  orders: number;
  revenue: number;
  completion: number;
}

const COLORS = ['#2563EB', '#22C55E', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

function DonutChart({ data }: { data: RegionalData[] }) {
  const total = data.reduce((s, r) => s + r.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {data.map((segment) => {
            const percent = (segment.value / total) * 100;
            const dashArray = `${percent} ${100 - percent}`;
            const offset = -cumulativePercent;
            cumulativePercent += percent;
            return (
              <circle
                key={segment.name}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={segment.color}
                strokeWidth="4"
                strokeDasharray={dashArray}
                strokeDashoffset={offset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground leading-none">{total.toLocaleString()}</span>
          <span className="text-[9px] text-muted-foreground mt-0.5">clients</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {data.map((region) => (
          <div key={region.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: region.color }} />
            <span className="text-[11px] text-muted-foreground flex-1">{region.name}</span>
            <span className="text-[11px] font-semibold text-foreground">{region.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPanel() {
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [creditUsage, setCreditUsage] = useState<CreditUsage[]>([]);
  const [topDelegates, setTopDelegates] = useState<TopDelegate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientsService.getAnalytics().then((data) => {
      setRegionalData(
        data.regionalDistribution.map((r, i) => ({
          ...r,
          color: COLORS[i % COLORS.length],
        }))
      );
      setCreditUsage(
        data.creditUsage.map((c, i) => ({
          label: c.name,
          limit: c.limit,
          used: c.used,
          color: COLORS[i % COLORS.length],
        }))
      );
      setTopDelegates(data.topDelegates);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden">
            <CardContent className="flex items-center justify-center h-48">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch w-full">
      {/* Regional Distribution */}
      <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Regional Distribution</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Client breakdown by wilaya
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col justify-center">
          <DonutChart data={regionalData} />
        </CardContent>
      </Card>

      {/* Credit Usage */}
      <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Credit Utilization</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Top client line of credit usage
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 space-y-3">
          {creditUsage.map((item) => {
            const percent = Math.round((item.used / item.limit) * 100);
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground truncate">{item.label}</span>
                  <span className="font-bold text-foreground">{percent}%</span>
                </div>
                <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{formatCurrency(item.used)} used</span>
                  <span>{formatCurrency(item.limit)} limit</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Top Delegates */}
      <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Top Delegates</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Performance leaderboards
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 space-y-3">
          {topDelegates.map((delegate, i) => (
            <div key={delegate.name} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-muted/40 transition-colors">
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                i === 0 ? 'bg-amber-500/10 text-amber-600' :
                i === 1 ? 'bg-slate-500/10 text-slate-600' :
                i === 2 ? 'bg-orange-500/10 text-orange-600' :
                'bg-muted text-muted-foreground'
              )}>
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate">{delegate.name}</span>
                  <span className="text-xs font-bold text-foreground">{delegate.orders} orders</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>{formatCurrency(delegate.revenue)}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{delegate.completion}%</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
