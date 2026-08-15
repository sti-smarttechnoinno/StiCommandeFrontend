'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ShoppingCart, DollarSign, Clock, Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Sparkline } from '@/components/charts/sparkline';

interface KPIData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  icon: React.ReactNode;
  iconColor: 'blue' | 'green' | 'orange' | 'indigo' | 'red';
  sparkline?: number[];
  sparkColor?: string;
}

const ICON_THEMES = {
  blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  green: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  orange: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
  red: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
} as const;

const KPIS: KPIData[] = [
  {
    title: "Today's Orders",
    value: 145,
    change: 18.2,
    icon: <ShoppingCart className="h-5 w-5" />,
    iconColor: 'blue',
    sparkColor: '#2563EB',
    sparkline: [28, 35, 42, 38, 55, 62, 58, 72, 68, 85, 92, 145],
  },
  {
    title: "Today's Revenue",
    value: 3250000,
    prefix: '',
    suffix: ' DA',
    change: 24.5,
    icon: <DollarSign className="h-5 w-5" />,
    iconColor: 'green',
    sparkColor: '#22C55E',
    sparkline: [180, 220, 250, 210, 290, 310, 280, 340, 360, 380, 350, 325],
  },
  {
    title: 'Pending Orders',
    value: 24,
    change: -6.1,
    icon: <Clock className="h-5 w-5" />,
    iconColor: 'orange',
    sparkColor: '#F59E0B',
    sparkline: [42, 38, 35, 32, 28, 30, 26, 24, 22, 25, 23, 24],
  },
  {
    title: 'Active Delegates',
    value: 38,
    change: 5.3,
    icon: <Users className="h-5 w-5" />,
    iconColor: 'indigo',
    sparkColor: '#6366F1',
    sparkline: [30, 32, 33, 34, 35, 36, 34, 37, 36, 38, 37, 38],
  },
  {
    title: 'Low Stock Alerts',
    value: 3,
    change: -15.0,
    icon: <AlertTriangle className="h-5 w-5" />,
    iconColor: 'red',
    sparkColor: '#EF4444',
    sparkline: [8, 7, 6, 5, 6, 5, 4, 5, 4, 3, 4, 3],
  },
];

function formatValue(val: number, prefix: string, suffix: string) {
  return prefix + (val > 10000 ? val.toLocaleString('en-US') : String(val)) + suffix;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {KPIS.map((kpi) => {
        const displayValue = useCountUp(kpi.value, 1000, kpi.suffix || '', kpi.prefix || '');
        return (
          <Card key={kpi.title} className="group relative overflow-hidden p-5 bg-card border border-border/40 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{kpi.title}</span>

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

              {/* Icon Badge */}
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', ICON_THEMES[kpi.iconColor])}>
                {kpi.icon}
              </div>
            </div>

            {/* Sparkline Background */}
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
