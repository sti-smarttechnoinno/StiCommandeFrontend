'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatCurrency } from '../utils';
import { ShoppingCart, DollarSign, Clock, CheckCircle, XCircle, TrendingUp, BarChart3 } from 'lucide-react';

const summaryItems = [
  { label: 'Total Orders', value: '145', change: '+18.2%', icon: <ShoppingCart className="h-4 w-4" />, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { label: 'Total Revenue', value: formatCurrency(3250000), change: '+24.5%', icon: <DollarSign className="h-4 w-4" />, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { label: 'Pending Approval', value: '24', change: '-6.1%', icon: <Clock className="h-4 w-4" />, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { label: 'Delivered Today', value: '98', change: '+12.4%', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { label: 'Rejected Orders', value: '8', change: '-2.0%', icon: <XCircle className="h-4 w-4" />, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { label: 'Avg. Order Value', value: formatCurrency(22414), change: '+5.8%', icon: <TrendingUp className="h-4 w-4" />, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
];

export function TodaySummary() {
  const fulfillmentRate = 88.5;

  return (
    <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <BarChart3 className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold tracking-tight">Today&apos;s Summary</CardTitle>
              <Badge variant="secondary" className="rounded-full text-xs font-semibold px-2 py-0.5">
                Live
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Fulfillment and order performance metrics
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1 flex-1">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', item.color)}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Today&apos;s activity
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xs font-bold text-foreground tracking-tight">
                  {item.value}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-semibold',
                    item.change.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  )}
                >
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Progress Bar */}
        <div className="pt-3 border-t border-border/30 space-y-1.5 px-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground">Fulfillment Rate</span>
            <span className="font-bold text-foreground">{fulfillmentRate}%</span>
          </div>
          <Progress
            value={fulfillmentRate}
            className="h-1.5 bg-muted rounded-full"
            indicatorClassName="bg-emerald-500 rounded-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
