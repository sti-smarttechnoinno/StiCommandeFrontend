'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts/sparkline';
import {
  Bell,
  Mail,
  TriangleAlert,
  ShoppingCart,
  Package,
  Shield,
  TrendingUp,
} from 'lucide-react';

interface KPIData {
  title: string;
  value: number;
  suffix?: string;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor: 'red' | 'amber' | 'orange' | 'blue' | 'green' | 'rose';
  sparkline?: number[];
  sparkColor?: string;
  isLive?: boolean;
}

const ICON_THEMES = {
  red: 'bg-rose-500/10 text-rose-600',
  amber: 'bg-amber-500/10 text-amber-600',
  orange: 'bg-orange-500/10 text-orange-600',
  blue: 'bg-blue-500/10 text-blue-600',
  green: 'bg-emerald-500/10 text-emerald-600',
  rose: 'bg-rose-500/10 text-rose-600',
} as const;

const KPIS: KPIData[] = [
  { title: 'All Notifications', value: 482, changeLabel: 'Today', icon: <Bell className="h-5 w-5" />, iconColor: 'red', sparkline: [380, 400, 410, 420, 435, 450, 460, 470, 475, 480, 482], sparkColor: '#D71920' },
  { title: 'Unread', value: 37, changeLabel: 'Need Review', icon: <Mail className="h-5 w-5" />, iconColor: 'amber', sparkline: [25, 28, 30, 32, 33, 34, 35, 36, 36, 37, 37], sparkColor: '#F59E0B' },
  { title: 'High Priority', value: 8, changeLabel: 'Immediate Action', icon: <TriangleAlert className="h-5 w-5" />, iconColor: 'orange', sparkline: [3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 8], sparkColor: '#F97316' },
  { title: 'Orders', value: 156, isLive: true, icon: <ShoppingCart className="h-5 w-5" />, iconColor: 'blue', sparkline: [100, 110, 120, 128, 135, 140, 145, 148, 152, 155, 156], sparkColor: '#2563EB' },
  { title: 'Stock Alerts', value: 21, changeLabel: 'Warehouse', icon: <Package className="h-5 w-5" />, iconColor: 'green', sparkline: [15, 16, 17, 18, 18, 19, 19, 20, 20, 21, 21], sparkColor: '#22C55E' },
  { title: 'Security Events', value: 12, changeLabel: 'Monitoring', icon: <Shield className="h-5 w-5" />, iconColor: 'rose', sparkline: [8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 12], sparkColor: '#EF4444' },
];

function useCountUp(target: number, duration: number = 1200) {
  const [display, setDisplay] = useState('0');
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

export function NotificationsKPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {KPIS.map((kpi) => {
        const displayValue = useCountUp(kpi.value, 1200);
        return (
          <Card
            key={kpi.title}
            className="group relative overflow-hidden p-5 bg-card border border-border/40 shadow-xs hover:shadow-md transition-all duration-200 rounded-[20px] cursor-default"
          >
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">{kpi.title}</span>
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <span className="text-[28px] font-bold text-foreground tracking-tight leading-none">{displayValue}</span>
                  {kpi.suffix && <span className="text-xs text-muted-foreground font-medium">{kpi.suffix}</span>}
                </div>
                {kpi.isLive && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-semibold text-emerald-600">Live</span>
                  </div>
                )}
                {kpi.changeLabel && !kpi.isLive && (
                  <span className="text-[10px] text-muted-foreground/70 mt-2 block">{kpi.changeLabel}</span>
                )}
              </div>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', ICON_THEMES[kpi.iconColor])}>
                {kpi.icon}
              </div>
            </div>
            {kpi.sparkline && kpi.sparkColor && (
              <div className="absolute bottom-0 right-0 left-0 h-10 opacity-15 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none overflow-hidden rounded-b-[20px]">
                <Sparkline data={kpi.sparkline} color={kpi.sparkColor} className="w-full h-full" />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
