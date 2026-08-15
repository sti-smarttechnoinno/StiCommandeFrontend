'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency, formatFullDate } from '../utils';
import type { ExtendedOrder } from '../types';
import { CreditCard, MapPin, FileText, Package } from 'lucide-react';

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
  cash: { label: 'Cash on Delivery', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  credit: { label: 'Credit Terms', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  transfer: { label: 'Bank Transfer', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
};

export function OrderExpandedRow({ order }: { order: ExtendedOrder }) {
  const payment = PAYMENT_LABELS[order.paymentMethod];

  return (
    <div className="bg-muted/20 px-6 py-4 border-t border-border/30">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Products Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Items</h4>
          </div>
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left font-semibold text-muted-foreground px-3 py-2">Product</th>
                  <th className="text-left font-semibold text-muted-foreground px-3 py-2">SKU</th>
                  <th className="text-right font-semibold text-muted-foreground px-3 py-2">Qty</th>
                  <th className="text-right font-semibold text-muted-foreground px-3 py-2">Unit Price</th>
                  <th className="text-right font-semibold text-muted-foreground px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-border/30">
                    <td className="px-3 py-2 font-medium text-foreground">{item.productName}</td>
                    <td className="px-3 py-2 text-muted-foreground font-mono">{item.sku}</td>
                    <td className="px-3 py-2 text-right text-foreground">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-foreground">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td colSpan={4} className="px-3 py-2 text-right font-bold text-foreground">Total</td>
                  <td className="px-3 py-2 text-right font-bold text-primary text-sm">{formatCurrency(order.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-4">
          <Card className="border border-border/40 shadow-xs rounded-xl">
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment</h4>
              </div>
              <Badge variant="ghost" className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', payment.color)}>
                {payment.label}
              </Badge>
            </CardContent>
          </Card>

          {order.deliveryAddress && (
            <Card className="border border-border/40 shadow-xs rounded-xl">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Address</h4>
                </div>
                <p className="text-xs text-foreground">{order.deliveryAddress}</p>
              </CardContent>
            </Card>
          )}

          {order.notes && (
            <Card className="border border-border/40 shadow-xs rounded-xl">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes</h4>
                </div>
                <p className="text-xs text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          <Card className="border border-border/40 shadow-xs rounded-xl">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Created</span>
                <span className="text-xs font-medium text-foreground">{formatFullDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Updated</span>
                <span className="text-xs font-medium text-foreground">{formatFullDate(order.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
