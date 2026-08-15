'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Monitor, Smartphone, Globe } from 'lucide-react';

export function ActiveSessionsCard() {
  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Active Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
              <Monitor className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-lg font-bold text-foreground block">18</span>
            <span className="text-[10px] text-muted-foreground">Desktop</span>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
              <Smartphone className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-lg font-bold text-foreground block">6</span>
            <span className="text-[10px] text-muted-foreground">Mobile</span>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground block">24</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Desktop Sessions</span>
            <span className="font-semibold text-foreground">75%</span>
          </div>
          <Progress value={75} className="h-1.5 rounded-full" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Mobile Sessions</span>
            <span className="font-semibold text-foreground">25%</span>
          </div>
          <Progress value={25} className="h-1.5 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
