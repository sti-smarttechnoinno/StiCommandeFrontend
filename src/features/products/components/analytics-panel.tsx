'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCompactCurrency, formatCurrency } from '../utils';
import { mockProducts } from '../mock-data';
import { PieChart, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';

const CATEGORY_DATA = [
  { name: 'Mobile Credit', value: 12, color: '#EF4444' },
  { name: 'SIM Cards', value: 11, color: '#2563EB' },
  { name: 'Scratch Cards', value: 4, color: '#F59E0B' },
  { name: 'Accessories', value: 4, color: '#22C55E' },
  { name: 'Data Packs', value: 6, color: '#6366F1' },
  { name: 'Voice/SMS', value: 3, color: '#8B5CF6' },
];

const BEST_SELLING = [...mockProducts]
  .sort((a, b) => b.totalSold - a.totalSold)
  .slice(0, 5);

const OPERATOR_DATA = [
  { name: 'Mobilis', products: 22, revenue: 45000000, color: '#22C55E' },
  { name: 'Ooredoo', products: 20, revenue: 38000000, color: '#EF4444' },
  { name: 'Djezzy', products: 18, revenue: 32000000, color: '#F59E0B' },
];

function DonutChart() {
  const total = CATEGORY_DATA.reduce((s, r) => s + r.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {CATEGORY_DATA.map((segment) => {
            const percent = (segment.value / total) * 100;
            const dashArray = `${percent} ${100 - percent}`;
            const offset = -cumulativePercent;
            cumulativePercent += percent;
            return (
              <circle
                key={segment.name}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={segment.color}
                strokeWidth="4"
                strokeDasharray={dashArray}
                strokeDashoffset={offset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground leading-none">{total}</span>
          <span className="text-[9px] text-muted-foreground mt-0.5">categories</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {CATEGORY_DATA.map((cat) => (
          <div key={cat.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="text-[11px] text-muted-foreground flex-1">{cat.name}</span>
            <span className="text-[11px] font-semibold text-foreground">{cat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch w-full">
      {/* Inventory Distribution */}
      <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <PieChart className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Category Distribution</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Product catalog breakdown by category
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col justify-center">
          <DonutChart />
        </CardContent>
      </Card>

      {/* Best Selling Products */}
      <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Best Selling Products</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Highest sales volume catalog items
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 space-y-2.5">
          {BEST_SELLING.map((product, i) => (
            <div key={product.id} className="flex items-center gap-3 p-1 rounded-xl hover:bg-muted/40 transition-colors">
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                i === 0 ? 'bg-amber-500/10 text-amber-600' :
                i === 1 ? 'bg-slate-500/10 text-slate-600' :
                i === 2 ? 'bg-orange-500/10 text-orange-600' :
                'bg-muted text-muted-foreground'
              )}>
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate">{product.name}</span>
                  <span className="text-xs font-bold text-foreground">{product.totalSold} sold</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>{formatCompactCurrency(product.revenue)}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{product.operator}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Operator Breakdown */}
      <Card className="h-full border border-border/40 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Telecom Operators</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Market share & product revenue
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col justify-center space-y-4">
          {OPERATOR_DATA.map((op) => (
            <div key={op.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">{op.name}</span>
                <span className="font-medium text-muted-foreground">{op.products} items ({formatCompactCurrency(op.revenue)})</span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{ width: `${(op.products / 25) * 100}%`, backgroundColor: op.color }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
