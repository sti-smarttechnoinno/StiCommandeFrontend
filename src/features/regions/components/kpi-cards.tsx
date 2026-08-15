'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts/sparkline';
import { Globe, MapPin, Users, UserCheck, ShoppingCart, Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface KPIData {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change: number;
  icon: React.ReactNode;
  iconColor: 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'teal';
  sparkline?: number[];
  sparkColor?: string;
}

const ICON_THEMES = {
  blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  green: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  red: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
  teal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
} as const;

const KPIS: KPIData[] = [
  {
    title: 'Regions',
    value: 4,
    change: 0,
    icon: <Globe className="h-5 w-5" />,
    iconColor: 'blue',
    sparkline: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    sparkColor: '#2563EB',
  },
  {
    title: 'Wilayas',
    value: 58,
    change: 0,
    icon: <MapPin className="h-5 w-5" />,
    iconColor: 'red',
    sparkline: [52, 53, 54, 55, 56, 56, 57, 57, 58, 58, 58, 58],
    sparkColor: '#EF4444',
  },
  {
    title: 'Delegates',
    value: 38,
    change: 2.7,
    icon: <UserCheck className="h-5 w-5" />,
    iconColor: 'green',
    sparkline: [30, 31, 32, 33, 33, 34, 35, 35, 36, 37, 37, 38],
    sparkColor: '#22C55E',
  },
  {
    title: 'Clients',
    value: 2485,
    change: 3.1,
    icon: <Users className="h-5 w-5" />,
    iconColor: 'indigo',
    sparkline: [2100, 2150, 2200, 2250, 2300, 2320, 2360, 2380, 2420, 2450, 2470, 2485],
    sparkColor: '#6366F1',
  },
  {
    title: 'Orders Today',
    value: 845,
    change: 5.4,
    icon: <ShoppingCart className="h-5 w-5" />,
    iconColor: 'amber',
    sparkline: [700, 720, 750, 780, 800, 790, 810, 820, 830, 835, 840, 845],
    sparkColor: '#F59E0B',
  },
  {
    title: 'Coverage',
    value: 100,
    suffix: '%',
    change: 0,
    icon: <Shield className="h-5 w-5" />,
    iconColor: 'teal',
    sparkline: [95, 96, 97, 98, 98, 99, 99, 100, 100, 100, 100, 100],
    sparkColor: '#14B8A6',
  },
];

function formatValue(val: number, prefix: string, suffix: string) {
  if (val >= 1000000) return prefix + (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' + suffix;
  if (val >= 1000) return prefix + val.toLocaleString('en-US') + suffix;
  return prefix + String(val) + suffix;
}

function useCountUp(target: number, duration: number = 1000, suffix: string = '', prefix: string = '') {
  const [display, setDisplay] = useState(() => formatValue(target, prefix, suffix));
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);
      setDisplay(formatValue(current, prefix, suffix));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, suffix, prefix]);

  return display;
}

export function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {KPIS.map((kpi) => {
        const displayValue = useCountUp(kpi.value, 1000, kpi.suffix || '', kpi.prefix || '');
        return (
          <Card
            key={kpi.title}
            className="group relative overflow-hidden p-5 bg-card border border-border/40 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl"
          >
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  {kpi.title}
                </span>
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
                    {displayValue}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                  {kpi.change > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full dark:text-emerald-400">
                      <TrendingUp className="h-3 w-3" />
                      +{kpi.change}%
                    </span>
                  ) : kpi.change < 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full dark:text-rose-400">
                      <TrendingDown className="h-3 w-3" />
                      {kpi.change}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-500/10 px-2 py-0.5 rounded-full dark:text-slate-400">
                      Stable
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground/70">vs last month</span>
                </div>
              </div>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', ICON_THEMES[kpi.iconColor])}>
                {kpi.icon}
              </div>
            </div>

            {kpi.sparkline && kpi.sparkColor && (
              <div className="absolute bottom-0 right-0 left-0 h-10 opacity-20 group-hover:opacity-35 transition-opacity duration-200 pointer-events-none overflow-hidden rounded-b-2xl">
                <Sparkline data={kpi.sparkline} color={kpi.sparkColor} className="w-full h-full" />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
