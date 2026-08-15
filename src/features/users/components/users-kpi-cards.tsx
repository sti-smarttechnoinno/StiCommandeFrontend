'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts/sparkline';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Activity,
  Lock,
  Wifi,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface KPIData {
  title: string;
  value: number;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor: 'red' | 'blue' | 'indigo' | 'green' | 'rose' | 'emerald';
  sparkline?: number[];
  sparkColor?: string;
  extra?: string;
  isLive?: boolean;
}

const ICON_THEMES = {
  red: 'bg-rose-500/10 text-rose-600',
  blue: 'bg-blue-500/10 text-blue-600',
  indigo: 'bg-indigo-500/10 text-indigo-600',
  green: 'bg-emerald-500/10 text-emerald-600',
  rose: 'bg-rose-500/10 text-rose-600',
  emerald: 'bg-emerald-500/10 text-emerald-600',
} as const;

const KPIS: KPIData[] = [
  { title: 'Total Users', value: 84, change: 12, changeLabel: 'vs last month', icon: <Users className="h-5 w-5" />, iconColor: 'red', sparkline: [60, 65, 68, 70, 72, 74, 76, 78, 80, 82, 84], sparkColor: '#D71920' },
  { title: 'Administrators', value: 6, changeLabel: 'System Access', icon: <ShieldCheck className="h-5 w-5" />, iconColor: 'blue', sparkline: [4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 6], sparkColor: '#2563EB' },
  { title: 'Delegates', value: 38, changeLabel: 'Sales Team', icon: <UserCheck className="h-5 w-5" />, iconColor: 'indigo', sparkline: [28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 38], sparkColor: '#6366F1' },
  { title: 'Active Users', value: 79, change: 6, changeLabel: '94% active', icon: <Activity className="h-5 w-5" />, iconColor: 'green', extra: '94%', sparkline: [65, 68, 70, 72, 73, 74, 75, 76, 77, 78, 79], sparkColor: '#22C55E' },
  { title: 'Locked Users', value: 2, changeLabel: 'Security Alert', icon: <Lock className="h-5 w-5" />, iconColor: 'rose', sparkline: [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2], sparkColor: '#EF4444' },
  { title: 'Online Now', value: 24, isLive: true, icon: <Wifi className="h-5 w-5" />, iconColor: 'emerald', sparkline: [18, 20, 22, 21, 23, 22, 24, 23, 25, 24, 24], sparkColor: '#22C55E' },
];

function useCountUp(target: number, duration: number = 1000) {
  const [display, setDisplay] = useState(() => target.toString());
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(target * eased).toString());
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return display;
}

export function UsersKPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {KPIS.map((kpi) => {
        const displayValue = useCountUp(kpi.value, 1000);
        return (
          <Card
            key={kpi.title}
            className="group relative overflow-hidden p-5 bg-card border border-border/40 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl cursor-default"
          >
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{kpi.title}</span>
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <span className="text-2xl xl:text-3xl font-bold text-foreground tracking-tight leading-none">{displayValue}</span>
                  {kpi.suffix && <span className="text-xs text-muted-foreground font-medium">{kpi.suffix}</span>}
                </div>
                {kpi.extra && <span className="text-[10px] font-semibold text-emerald-600 mt-1 block">{kpi.extra}</span>}
                {kpi.isLive && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-semibold text-emerald-600">Live</span>
                  </div>
                )}
                {kpi.change !== undefined && (
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', kpi.change >= 0 ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10')}>
                      {kpi.change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                    </span>
                    <span className="text-[10px] text-muted-foreground/70">{kpi.changeLabel}</span>
                  </div>
                )}
                {!kpi.change && kpi.changeLabel && !kpi.isLive && !kpi.extra && (
                  <span className="text-[10px] text-muted-foreground/70 mt-2 block">{kpi.changeLabel}</span>
                )}
              </div>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', ICON_THEMES[kpi.iconColor])}>
                {kpi.icon}
              </div>
            </div>
            {kpi.sparkline && kpi.sparkColor && (
              <div className="absolute bottom-0 right-0 left-0 h-10 opacity-15 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none overflow-hidden rounded-b-2xl">
                <Sparkline data={kpi.sparkline} color={kpi.sparkColor} className="w-full h-full" />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
