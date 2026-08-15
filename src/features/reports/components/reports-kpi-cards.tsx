'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts/sparkline';
import {
  DollarSign,
  ShoppingCart,
  Users,
  UserCheck,
  Package,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface KPIData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  iconColor: 'green' | 'blue' | 'indigo' | 'teal' | 'amber' | 'purple';
  sparkline?: number[];
  sparkColor?: string;
  extra?: string;
}

const ICON_THEMES = {
  green: 'bg-emerald-500/10 text-emerald-600',
  blue: 'bg-blue-500/10 text-blue-600',
  indigo: 'bg-indigo-500/10 text-indigo-600',
  teal: 'bg-teal-500/10 text-teal-600',
  amber: 'bg-amber-500/10 text-amber-600',
  purple: 'bg-purple-500/10 text-purple-600',
} as const;

const KPIS: KPIData[] = [
  {
    title: 'Total Revenue',
    value: 18500000,
    prefix: '',
    suffix: ' DA',
    change: 12.6,
    changeLabel: 'vs last month',
    icon: <DollarSign className="h-5 w-5" />,
    iconColor: 'green',
    sparkline: [14200000, 15100000, 15800000, 16200000, 16800000, 17200000, 17600000, 18000000, 18500000],
    sparkColor: '#22C55E',
  },
  {
    title: 'Orders',
    value: 4285,
    change: 8.3,
    changeLabel: 'vs last month',
    icon: <ShoppingCart className="h-5 w-5" />,
    iconColor: 'blue',
    sparkline: [3200, 3400, 3600, 3800, 3900, 4000, 4100, 4200, 4285],
    sparkColor: '#2563EB',
  },
  {
    title: 'Delegates',
    value: 38,
    change: 5.6,
    changeLabel: 'vs last month',
    icon: <Users className="h-5 w-5" />,
    iconColor: 'indigo',
    extra: '34 Online',
    sparkline: [30, 31, 32, 33, 33, 34, 35, 36, 38],
    sparkColor: '#6366F1',
  },
  {
    title: 'Active Clients',
    value: 1254,
    change: 3.7,
    changeLabel: '+45 this month',
    icon: <UserCheck className="h-5 w-5" />,
    iconColor: 'teal',
    sparkline: [1100, 1120, 1150, 1170, 1190, 1210, 1230, 1245, 1254],
    sparkColor: '#14B8A6',
  },
  {
    title: 'Products Sold',
    value: 52430,
    change: 6.2,
    changeLabel: 'this month',
    icon: <Package className="h-5 w-5" />,
    iconColor: 'amber',
    sparkline: [42000, 44000, 46000, 48000, 49000, 50000, 51000, 52000, 52430],
    sparkColor: '#F59E0B',
  },
  {
    title: 'Avg Order Value',
    value: 4320,
    prefix: '',
    suffix: ' DA',
    change: 4.1,
    changeLabel: 'vs last month',
    icon: <Wallet className="h-5 w-5" />,
    iconColor: 'purple',
    sparkline: [3800, 3900, 4000, 4050, 4100, 4150, 4200, 4280, 4320],
    sparkColor: '#8B5CF6',
  },
];

function formatVal(val: number, prefix: string = '', suffix: string = ''): string {
  return `${prefix}${new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 0 }).format(val)}${suffix}`;
}

function useCountUp(target: number, duration: number = 1000, suffix: string = '', prefix: string = '') {
  const [display, setDisplay] = useState(() => formatVal(target, prefix, suffix));
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
      setDisplay(formatVal(current, prefix, suffix));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, suffix, prefix]);

  return display;
}

export function ReportsKPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {KPIS.map((kpi) => {
        const displayValue = useCountUp(kpi.value, 1000, kpi.suffix || '', kpi.prefix || '');
        return (
          <Card
            key={kpi.title}
            className="group relative overflow-hidden p-5 bg-card border border-border/40 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl cursor-default"
          >
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {kpi.title}
                </span>
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <span className="text-xl xl:text-2xl font-bold text-foreground tracking-tight leading-none">
                    {displayValue}
                  </span>
                </div>
                {kpi.extra && (
                  <span className="text-[10px] font-semibold text-muted-foreground mt-1 block">{kpi.extra}</span>
                )}
                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      kpi.change >= 0
                        ? 'text-emerald-600 bg-emerald-500/10'
                        : 'text-rose-600 bg-rose-500/10'
                    )}
                  >
                    {kpi.change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">{kpi.changeLabel}</span>
                </div>
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
