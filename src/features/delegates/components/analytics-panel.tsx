'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '../utils';
import { delegatesService, type DelegateAnalyticsResponse } from '@/services/delegates';
import { Globe, Trophy, Activity, Loader2 } from 'lucide-react';

const REGIONAL_COLORS = ['#2563EB', '#22C55E', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

const STATUS_CONFIG = {
  online: { label: 'Online', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  busy: { label: 'Busy', color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
  offline: { label: 'Offline', color: 'bg-slate-400', textColor: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-500/10 border-slate-500/20' },
  suspended: { label: 'Suspended', color: 'bg-rose-500', textColor: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-500/10 border-rose-500/20' },
};

function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  const regionalWithColors = data.map((r, i) => ({
    ...r,
    color: REGIONAL_COLORS[i % REGIONAL_COLORS.length],
  }));
  const total = regionalWithColors.reduce((s, r) => s + r.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {regionalWithColors.map((segment) => {
            const percent = total > 0 ? (segment.value / total) * 100 : 0;
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
          <span className="text-lg font-bold text-foreground leading-none">{total}</span>
          <span className="text-[9px] text-muted-foreground mt-0.5">delegates</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {regionalWithColors.map((region) => (
          <div key={region.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: region.color }} />
            <span className="text-[11px] text-muted-foreground flex-1 truncate">{region.name}</span>
            <span className="text-[11px] font-semibold text-foreground">{region.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<DelegateAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    delegatesService
      .getAnalytics()
      .then((res) => {
        if (!cancelled) {
          setAnalytics(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="h-48 border border-border/40 bg-card flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Card>
        ))}
      </div>
    );
  }

  const regionalData = analytics?.regionalDistribution || [
    { name: 'Algiers', value: 3 },
    { name: 'Oran', value: 2 },
    { name: 'Constantine', value: 2 },
    { name: 'Annaba', value: 1 },
    { name: 'Sétif', value: 1 },
    { name: 'Others', value: 1 },
  ];

  const statusCounts = analytics?.statusCounts || { online: 7, busy: 2, offline: 1, suspended: 0 };
  const totalDelegatesCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const topPerformers = analytics?.topPerformers || [];

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
              <CardTitle className="text-base font-bold tracking-tight">Regional Coverage</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Delegate distribution across regions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col justify-center">
          <DonutChart data={regionalData} />
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Top Performers</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Highest order volume & revenue
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 space-y-2.5">
          {topPerformers.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No delegate order data yet</p>
          ) : (
            topPerformers.map((delegate, i) => (
              <Link key={delegate.id} href={`/delegates/${delegate.id}`} className="flex items-center gap-3 p-1 rounded-xl hover:bg-muted/40 transition-colors">
                <div
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                    i === 0
                      ? 'bg-amber-500/10 text-amber-600'
                      : i === 1
                      ? 'bg-slate-500/10 text-slate-600'
                      : i === 2
                      ? 'bg-orange-500/10 text-orange-600'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground truncate">{delegate.name}</span>
                    <span className="text-xs font-bold text-foreground">{delegate.orders} orders</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                    <span>{formatCurrency(delegate.revenue)}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{delegate.completionRate}%</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {/* Status Overview */}
      <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Status Overview</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Real-time active shift metrics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-3.5 h-full">
            {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => {
              const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.offline;
              const pct = totalDelegatesCount > 0 ? Math.round((count / totalDelegatesCount) * 100) : 0;
              return (
                <div
                  key={status}
                  className={cn(
                    'p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]',
                    cfg.bgColor
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2.5 h-2.5 rounded-full', cfg.color)} />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground/80">
                      {pct}%
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className={cn('text-3xl font-extrabold tracking-tight', cfg.textColor)}>
                      {count}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      delegates
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
