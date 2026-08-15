'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, X, Clock, ShieldCheck, CheckCheck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialOrders = [
  { id: 'ORD-2026-0891', client: 'Telecom Plus DZ', region: 'Algiers', amount: 125000, time: '10 min ago', priority: 'high' as const },
  { id: 'ORD-2026-0889', client: 'Oran Digital Shop', region: 'Oran', amount: 87500, time: '25 min ago', priority: 'normal' as const },
  { id: 'ORD-2026-0887', client: 'Batna Mobile Center', region: 'Batna', amount: 45000, time: '1h ago', priority: 'urgent' as const },
  { id: 'ORD-2026-0885', client: 'Sétif Wireless', region: 'Sétif', amount: 210000, time: '2h ago', priority: 'high' as const },
];

const PRIORITY_BADGES = {
  normal: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold',
};

export function ApprovalQueue() {
  const [orders, setOrders] = useState(initialOrders);

  const handleApprove = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success(`Order ${id} approved successfully`);
  };

  const handleReject = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.error(`Order ${id} rejected`);
  };

  const handleApproveAll = () => {
    setOrders([]);
    toast.success('All pending orders approved');
  };

  return (
    <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold tracking-tight">Approval Queue</CardTitle>
              <Badge variant="secondary" className="rounded-full text-xs font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none">
                {orders.length} Pending
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              High-value orders requiring admin sign-off
            </CardDescription>
          </div>
        </div>

        {orders.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleApproveAll}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 gap-1 px-2.5 h-8 rounded-lg"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Approve All</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-3">
        {orders.length > 0 ? (
          <div className="space-y-2.5 flex-1">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group flex flex-col gap-2 p-3 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors"
              >
                {/* Top Row: Client & Priority */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {order.client.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate leading-tight">
                        {order.client}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5 text-muted-foreground/70" />
                        {order.region}
                      </span>
                    </div>
                  </div>

                  <Badge variant="ghost" className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border-none flex-shrink-0', PRIORITY_BADGES[order.priority])}>
                    {order.priority}
                  </Badge>
                </div>

                {/* Bottom Row: ID, Time, Amount & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-border/20 mt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {order.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {order.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {order.amount.toLocaleString()} DA
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        className="h-7 px-2.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs gap-1"
                        onClick={() => handleApprove(order.id)}
                      >
                        <Check className="h-3 w-3" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-500/10"
                        onClick={() => handleReject(order.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCheck className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-foreground">Queue Clear!</p>
            <p className="text-[11px] text-muted-foreground">All pending orders have been processed.</p>
          </div>
        )}

        {/* Card Footer Note */}
        <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>Admin Authorization Required</span>
          <span className="font-semibold text-foreground font-mono">100% Operational</span>
        </div>
      </CardContent>
    </Card>
  );
}
