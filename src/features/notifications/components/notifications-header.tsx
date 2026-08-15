'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNotificationsStore } from '../store';
import { toast } from 'sonner';
import { Megaphone, CheckCheck, FileDown, Settings, RefreshCw, Radio } from 'lucide-react';

export function NotificationsHeader() {
  const { setAnnouncementDialogOpen } = useNotificationsStore();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications Center</h1>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <Radio className="h-3 w-3 mr-1 animate-pulse" />
            Live &bull; Connected
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground font-medium">Monitor operational alerts, system events, stock updates, orders, delegates, security incidents and announcements in real time</p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/60 text-xs font-semibold" onClick={() => toast.success('Notifications exported')}>
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export notifications to Excel</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/60 text-xs font-semibold" onClick={() => toast.info('Notification settings opened')}>
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Settings
            </Button>
          </TooltipTrigger>
          <TooltipContent>Configure notification channels</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/60 text-xs font-semibold" onClick={() => toast.success('All notifications marked as read')}>
              <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
              Mark All Read
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mark all notifications as read</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/60 text-xs font-semibold" onClick={() => toast.success('Notifications refreshed')}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Refresh
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh notification feed</TooltipContent>
        </Tooltip>
        <Button
          size="sm"
          className="h-9 rounded-lg text-xs font-semibold bg-[#D71920] hover:bg-[#B81419] text-white shadow-md shadow-[#D71920]/20 hover:shadow-lg hover:shadow-[#B81419]/30 hover:scale-105 active:scale-95 transition-all duration-200"
          onClick={() => setAnnouncementDialogOpen(true)}
        >
          <Megaphone className="h-3.5 w-3.5 mr-1.5" />
          Create Announcement
        </Button>
      </div>
    </div>
  );
}
