'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts/sparkline';
import { Package, ArrowDown, ArrowUp, RefreshCw, Sliders, TrendingUp, TrendingDown } from 'lucide-react';

interface KPIData {
  title: string;
  value: number;
  suffix?: string;
  change: number;
  icon: React.ReactNode;
  iconColor: 'blue' | 'green' | 'amber' | 'indigo' | 'red' | 'teal';
  sparkline?: number[];
  sparkColor?: string;
}

const ICON_THEMES = {
  blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  green: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
  red: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  teal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
} as const;

const KPIS: KPIData[] = [
  {
    title: 'Current Stock',
    value: 18540,
    suffix: ' Units',
    change: 5.3,
    icon: <Package className="h-5 w-5" />,
    iconColor: 'blue',
    sparkline: [15200, 15800, 16200, 16500, 17000, 17200, 17600, 17800, 18000, 18200, 18400, 18540],
    sparkColor: '#2563EB',
  },
  {
    title: 'Incoming Today',
    value: 2450,
    suffix: ' Units',
    change: 12.8,
    icon: <ArrowDown className="h-5 w-5" />,
    iconColor: 'green',
    sparkline: [1800, 1950, 2100, 2000, 2200, 2300, 2150, 2350, 2400, 2380, 2420, 2450],
    sparkColor: '#22C55E',
  },
  {
    title: 'Outgoing Today',
    value: 1980,
    suffix: ' Units',
    change: -3.2,
    icon: <ArrowUp className="h-5 w-5" />,
    iconColor: 'red',
    sparkline: [2200, 2100, 2050, 2150, 2000, 1950, 2050, 1980, 2020, 1990, 1985, 1980],
    sparkColor: '#EF4444',
  },
  {
    title: 'Transfers Today',
    value: 42,
    change: 8.0,
    icon: <RefreshCw className="h-5 w-5" />,
    iconColor: 'indigo',
    sparkline: [30, 32, 35, 33, 38, 40, 37, 39, 41, 40, 41, 42],
    sparkColor: '#6366F1',
  },
  {
    title: 'Adjustments',
    value: 6,
    change: -14.3,
    icon: <Sliders className="h-5 w-5" />,
    iconColor: 'amber',
    sparkline: [10, 9, 8, 9, 7, 8, 7, 6, 7, 6, 6, 6],
    sparkColor: '#F59E0B',
  },
];

function formatValue(val: number, suffix: string) {
  return val.toLocaleString('en-US') + suffix;
}

function useCountUp(target: number, duration: number = 1000, suffix: string = '') {
  const [display, setDisplay] = useState(() => formatValue(target, suffix));
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
      setDisplay(formatValue(current, suffix));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, suffix]);

  return display;
}

export function StockKPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {KPIS.map((kpi) => {
        const displayValue = useCountUp(kpi.value, 1000, kpi.suffix || '');
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
                  <span className="text-xs text-muted-foreground/70">vs yesterday</span>
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
