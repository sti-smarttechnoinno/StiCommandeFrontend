'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ShoppingCart, CheckCircle, XCircle, Package, User, AlertTriangle, RefreshCw, Activity, Radio } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'order_created' | 'order_validated' | 'order_delivered' | 'order_rejected' | 'delegate_active' | 'stock_alert' | 'order_updated';
  message: string;
  detail: string;
  timestamp: string;
}

const activities: ActivityItem[] = [
  { id: 'a1', type: 'order_created', message: 'New Order Received', detail: 'ORD-2026-0892 from Telecom Plus DZ', timestamp: '2026-07-29T22:58:00.000Z' },
  { id: 'a2', type: 'order_validated', message: 'Order Validated', detail: 'ORD-2026-0890 approved by Amine K.', timestamp: '2026-07-29T22:45:00.000Z' },
  { id: 'a3', type: 'order_delivered', message: 'Order Delivered', detail: 'ORD-2026-0885 delivered to Sétif Wireless', timestamp: '2026-07-29T22:30:00.000Z' },
  { id: 'a4', type: 'delegate_active', message: 'Delegate Online', detail: 'Yacine B. connected to region Algiers', timestamp: '2026-07-29T22:15:00.000Z' },
  { id: 'a5', type: 'stock_alert', message: 'Low Stock Alert', detail: 'SIM Cards threshold reached (150 units)', timestamp: '2026-07-29T22:00:00.000Z' },
  { id: 'a6', type: 'order_rejected', message: 'Order Rejected', detail: 'ORD-2026-0880 - Payment method invalid', timestamp: '2026-07-29T21:45:00.000Z' },
];

const TYPE_CONFIG: Record<ActivityItem['type'], { icon: React.ReactNode; color: string }> = {
  order_created: { icon: <ShoppingCart className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  order_validated: { icon: <CheckCircle className="h-3.5 w-3.5" />, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  order_delivered: { icon: <Package className="h-3.5 w-3.5" />, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  order_rejected: { icon: <XCircle className="h-3.5 w-3.5" />, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  delegate_active: { icon: <User className="h-3.5 w-3.5" />, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  stock_alert: { icon: <AlertTriangle className="h-3.5 w-3.5" />, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  order_updated: { icon: <RefreshCw className="h-3.5 w-3.5" />, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
};

export function LiveActivity() {
  return (
    <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold tracking-tight">Live Activity</CardTitle>
              <Badge variant="secondary" className="rounded-full text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Stream
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Real-time distribution events
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1 flex-1">
          {activities.map((activity, i) => {
            const cfg = TYPE_CONFIG[activity.type];
            return (
              <div
                key={activity.id}
                className="group flex items-start gap-3 p-2 rounded-xl hover:bg-muted/40 transition-colors relative"
              >
                {/* Timeline line */}
                {i < activities.length - 1 && (
                  <div className="absolute left-[19px] top-9 w-[1px] h-[calc(100%-12px)] bg-border/40 z-0" />
                )}

                {/* Icon Badge */}
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 z-10 mt-0.5', cfg.color)}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                      {activity.message}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {activity.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Card Footer */}
        <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span className="flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-emerald-500 animate-pulse" /> Auto-syncing
          </span>
          <span className="font-semibold text-foreground font-mono">6 Events Streamed</span>
        </div>
      </CardContent>
    </Card>
  );
}
