'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatTime, getMovementTypeColor, getMovementTypeLabel, getStatusColor, getStatusLabel, getStatusDot, getQuantityColor, getQuantityPrefix } from '../utils';
import { mockMovements } from '../mock-data';
import { Clock, Package } from 'lucide-react';

const recentMovements = [...mockMovements]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10);

export function RecentActivityTable() {
  return (
    <Card className="border border-border/40 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/30">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Recent Stock Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">Time</th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">Product</th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">Movement</th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">Quantity</th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">Warehouse</th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">User</th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">Reference</th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.map((m) => (
                <tr key={m.id} className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-xs text-muted-foreground font-medium">{formatTime(m.date)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">{m.product}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold', getMovementTypeColor(m.movementType))}>
                      {getMovementTypeLabel(m.movementType)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn('text-xs font-bold', getQuantityColor(m.movementType, m.quantity))}>
                      {getQuantityPrefix(m.movementType)}{m.quantity.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-muted-foreground">{m.warehouse}</td>
                  <td className="py-3 px-4 text-[11px] text-foreground font-medium">{m.delegate}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">{m.reference}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold', getStatusColor(m.status))}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', getStatusDot(m.status))} />
                      {getStatusLabel(m.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
