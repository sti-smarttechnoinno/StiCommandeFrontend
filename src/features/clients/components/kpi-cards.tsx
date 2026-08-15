'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts/sparkline';
import { Users, UserCheck, UserX, Wallet, ShoppingBag, TrendingUp, TrendingDown } from 'lucide-react';

interface KPIData {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change: number;
  icon: React.ReactNode;
  iconColor: 'blue' | 'green' | 'gray' | 'amber' | 'red' | 'indigo';
  sparkline?: number[];
  sparkColor?: string;
}

const ICON_THEMES = {
  blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  green: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  gray: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  red: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
} as const;

const KPIS: KPIData[] = [
  {
    title: 'Total Clients',
    value: 2458,
    change: 12.5,
    icon: <Users className="h-5 w-5" />,
    iconColor: 'blue',
    sparkline: [180, 195, 210, 205, 225, 240, 235, 260, 255, 280, 275, 2458],
    sparkColor: '#2563EB',
  },
  {
    title: 'Active Clients',
    value: 2130,
    change: 8.3,
    icon: <UserCheck className="h-5 w-5" />,
    iconColor: 'green',
    sparkline: [160, 172, 185, 180, 195, 210, 205, 225, 220, 240, 235, 2130],
    sparkColor: '#22C55E',
  },
  {
    title: 'Inactive Clients',
    value: 328,
    change: -4.2,
    icon: <UserX className="h-5 w-5" />,
    iconColor: 'gray',
    sparkline: [45, 42, 38, 40, 36, 34, 35, 32, 33, 30, 31, 328],
    sparkColor: '#6B7280',
  },
  {
    title: 'Outstanding Credit',
    value: 14250000,
    prefix: '',
    suffix: ' DA',
    change: -2.8,
    icon: <Wallet className="h-5 w-5" />,
    iconColor: 'amber',
    sparkline: [16, 15.5, 15, 14.8, 14.5, 14.3, 14.6, 14.4, 14.3, 14.2, 14.3, 14.25],
    sparkColor: '#F59E0B',
  },
  {
    title: 'Orders This Month',
    value: 6842,
    change: 15.7,
    icon: <ShoppingBag className="h-5 w-5" />,
    iconColor: 'indigo',
    sparkline: [420, 480, 520, 490, 560, 610, 580, 650, 680, 720, 700, 6842],
    sparkColor: '#6366F1',
  },
  {
    title: 'Total Revenue',
    value: 198500000,
    prefix: '',
    suffix: ' DA',
    change: 22.1,
    icon: <TrendingUp className="h-5 w-5" />,
    iconColor: 'green',
    sparkline: [120, 135, 148, 142, 158, 168, 162, 178, 185, 192, 195, 198.5],
    sparkColor: '#22C55E',
  },
];

function formatValue(val: number, prefix: string, suffix: string) {
  if (val >= 1000000) return prefix + (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' + suffix;
  if (val >= 1000) return prefix + val.toLocaleString('en-US') + suffix;
  return prefix + String(val) + suffix;
}

function useCountUp(target: number, duration: number = 1000, suffix: string = '', prefix: string = '') {
  // Initialize with target value so SSR and page reload display immediately without flashing 0
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
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {kpi.title}
                </span>
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
                    {displayValue}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                      kpi.change >= 0
                        ? 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400'
                        : 'text-rose-600 bg-rose-500/10 dark:text-rose-400'
                    )}
                  >
                    {kpi.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-xs text-muted-foreground/70">vs last month</span>
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
