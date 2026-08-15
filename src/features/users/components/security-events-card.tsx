'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_SECURITY_EVENTS } from '../mock-data';
import { getEventColor, getEventDot } from '../utils';
import { ShieldAlert, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const EVENT_ICONS: Record<string, React.ReactNode> = {
  Login: <CheckCircle2 className="h-3 w-3 text-emerald-500" />,
  Logout: <Clock className="h-3 w-3 text-muted-foreground" />,
  'Password Changed': <AlertTriangle className="h-3 w-3 text-amber-500" />,
  'Role Updated': <AlertTriangle className="h-3 w-3 text-amber-500" />,
  'Failed Login': <XCircle className="h-3 w-3 text-rose-500" />,
  'Backup Completed': <CheckCircle2 className="h-3 w-3 text-emerald-500" />,
};

export function SecurityEventsCard() {
  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden bg-card flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/30">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span>Security Events Log</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            Live Audit
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-3">
        <div className="space-y-3">
          {MOCK_SECURITY_EVENTS.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center justify-between gap-2 text-xs py-1 border-b border-border/20 last:border-0">
              <div className="flex items-center gap-2 min-w-0">
                {EVENT_ICONS[event.event] || <Clock className="h-3 w-3 text-muted-foreground" />}
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">{event.user}</span>
                  <span className="text-[10px] text-muted-foreground">{event.event} · {event.time}</span>
                </div>
              </div>
              <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold flex-shrink-0', getEventColor(event.status))}>
                <span className={cn('w-1.5 h-1.5 rounded-full', getEventDot(event.status))} />
                {event.status === 'success' ? 'Success' : event.status === 'warning' ? 'Warning' : 'Danger'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
