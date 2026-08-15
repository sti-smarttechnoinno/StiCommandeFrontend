'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { MOCK_DELEGATES } from '../mock-data';
import { formatCurrency, getGrowthColor } from '../utils';
import { Trophy, TrendingUp } from 'lucide-react';

const MEDAL_COLORS = ['#D71920', '#2563EB', '#F59E0B'];
const AVATAR_COLORS = [
  'bg-rose-500/10 text-rose-600',
  'bg-blue-500/10 text-blue-600',
  'bg-amber-500/10 text-amber-600',
  'bg-indigo-500/10 text-indigo-600',
  'bg-teal-500/10 text-teal-600',
  'bg-purple-500/10 text-purple-600',
  'bg-emerald-500/10 text-emerald-600',
  'bg-orange-500/10 text-orange-600',
];

export function TopDelegatesCard() {
  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          Top Delegates
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-3">
          {MOCK_DELEGATES.slice(0, 6).map((delegate, i) => (
            <div
              key={delegate.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors group"
            >
              {/* Rank */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{
                  backgroundColor: i < 3 ? `${MEDAL_COLORS[i]}15` : 'transparent',
                  color: i < 3 ? MEDAL_COLORS[i] : '#6B7280',
                }}
              >
                {i + 1}
              </div>

              {/* Avatar */}
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0', AVATAR_COLORS[i])}>
                {delegate.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground truncate">{delegate.name}</span>
                  <span className="text-[10px] font-bold text-foreground ml-2">{formatCurrency(delegate.revenue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{delegate.region}</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{delegate.orders} orders</span>
                  <span className={cn('text-[10px] font-semibold ml-auto flex items-center gap-0.5', getGrowthColor(delegate.trend))}>
                    <TrendingUp className="h-2.5 w-2.5" />
                    +{delegate.trend}%
                  </span>
                </div>
                <Progress value={delegate.completion} className="h-1.5 mt-1.5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
