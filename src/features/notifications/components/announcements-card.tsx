'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MOCK_ANNOUNCEMENTS } from '../mock-data';
import { CalendarClock, CheckCircle2, Clock, Pencil, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'bg-blue-500/10 text-blue-600',
  published: 'bg-emerald-500/10 text-emerald-600',
  draft: 'bg-muted text-muted-foreground',
};

export function AnnouncementsCard() {
  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          Upcoming Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-3">
          {MOCK_ANNOUNCEMENTS.map((ann) => (
            <div key={ann.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 hover:bg-muted/20 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {ann.status === 'published' ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-foreground truncate">{ann.title}</span>
                  <Badge variant="outline" className={cn('text-[9px] font-bold px-1.5 py-0 rounded-full border-0 ml-2', STATUS_STYLES[ann.status])}>
                    {ann.status.charAt(0).toUpperCase() + ann.status.slice(1)}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">{ann.date}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-4 h-8 text-xs font-semibold text-primary hover:bg-primary/10 rounded-xl" onClick={() => toast.info('Viewing all announcements')}>
          View All
        </Button>
      </CardContent>
    </Card>
  );
}
