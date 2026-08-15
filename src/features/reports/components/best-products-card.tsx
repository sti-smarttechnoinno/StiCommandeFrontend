'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { MOCK_BEST_PRODUCTS } from '../mock-data';
import { formatCurrency, getGrowthColor, getCategoryColor, getCategoryLabel } from '../utils';
import { Crown, TrendingUp } from 'lucide-react';

export function BestProductsCard() {
  const maxRevenue = Math.max(...MOCK_BEST_PRODUCTS.map((p) => p.revenue));

  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Crown className="h-4 w-4 text-primary" />
          Best Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-3">
          {MOCK_BEST_PRODUCTS.slice(0, 6).map((product, i) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors"
            >
              {/* Rank */}
              <div className="w-5 text-[10px] font-bold text-muted-foreground text-center flex-shrink-0">
                {i + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground truncate">{product.name}</span>
                  <span className="text-[10px] font-bold text-foreground ml-2">{formatCurrency(product.revenue)}</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn('text-[9px] font-semibold px-1.5 py-0.5 rounded-full', getCategoryColor(product.category))}>
                    {getCategoryLabel(product.category)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{product.quantitySold.toLocaleString()} sold</span>
                  <span className={cn('text-[10px] font-semibold ml-auto flex items-center gap-0.5', getGrowthColor(product.trend))}>
                    <TrendingUp className="h-2.5 w-2.5" />
                    +{product.trend}%
                  </span>
                </div>
                <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
