'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { notificationsService } from '@/services/notifications';
import { useNotificationsStore } from '../store';
import type { Announcement } from '../types';
import { CalendarClock, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'bg-blue-500/10 text-blue-600',
  published: 'bg-emerald-500/10 text-emerald-600',
  draft: 'bg-muted text-muted-foreground',
};

export function AnnouncementsCard() {
  const refreshKey = useNotificationsStore((s) => s.refreshKey);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    notificationsService
      .getAnnouncements()
      .then((res) => {
        if (isMounted) {
          setAnnouncements(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            System Announcements
          </CardTitle>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {announcements.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-3 flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="py-6 text-center text-xs text-muted-foreground">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">No announcements published yet.</div>
        ) : (
          <div className="space-y-3">
            {announcements.slice(0, 4).map((ann) => (
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
                    <Badge variant="outline" className={cn('text-[9px] font-bold px-1.5 py-0 rounded-full border-0 ml-2', STATUS_STYLES[ann.status] ?? STATUS_STYLES.published)}>
                      {ann.status ? ann.status.charAt(0).toUpperCase() + ann.status.slice(1) : 'Published'}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{ann.date}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
