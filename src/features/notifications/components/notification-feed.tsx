'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MOCK_NOTIFICATIONS } from '../mock-data';
import { useNotificationsStore } from '../store';
import { getCategoryColor, getPriorityColor, getPriorityBorder, getStatusColor, getStatusDot } from '../utils';
import { toast } from 'sonner';
import {
  Eye,
  CheckCheck,
  Archive,
  Trash2,
  MoreHorizontal,
  ShoppingCart,
  Package,
  Users,
  Shield,
  Server,
  FileText,
  DollarSign,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  orders: <ShoppingCart className="h-4 w-4" />,
  stock: <Package className="h-4 w-4" />,
  delegates: <UserCheck className="h-4 w-4" />,
  clients: <Users className="h-4 w-4" />,
  reports: <FileText className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  system: <Server className="h-4 w-4" />,
  finance: <DollarSign className="h-4 w-4" />,
};

function NotificationCard({ notification }: { notification: typeof MOCK_NOTIFICATIONS[0] }) {
  const { setDetailsDrawerOpen } = useNotificationsStore();

  return (
    <div
      className={cn(
        'relative flex items-start gap-4 p-4 rounded-2xl border border-border/30 border-l-4 transition-all hover:bg-muted/20 hover:shadow-sm cursor-pointer group',
        getPriorityBorder(notification.priority),
        !notification.read && 'bg-primary/5'
      )}
      onClick={() => setDetailsDrawerOpen(true, notification.id)}
    >
      {/* Category Icon */}
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', getCategoryColor(notification.category))}>
        {CATEGORY_ICONS[notification.category]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant="outline" className={cn('text-[9px] font-bold px-1.5 py-0 rounded-full border-0', getPriorityColor(notification.priority))}>
            {notification.priority.toUpperCase()}
          </Badge>
          <Badge variant="outline" className={cn('text-[9px] font-bold px-1.5 py-0 rounded-full border-0', getCategoryColor(notification.category))}>
            {notification.category}
          </Badge>
          {!notification.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
        </div>
        <h4 className="text-xs font-semibold text-foreground mb-0.5 leading-snug">{notification.title}</h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{notification.description}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground/70 font-medium">{notification.user}</span>
          <span className="text-[10px] text-muted-foreground/50">&bull;</span>
          <span className="text-[10px] text-muted-foreground/70">{notification.region} Region</span>
          <span className="text-[10px] text-muted-foreground/50">&bull;</span>
          <span className="text-[10px] text-muted-foreground/70">{notification.module}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap">
          {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); toast.success('Viewing notification'); }}>
            <Eye className="h-3 w-3 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); toast.success('Marked as read'); }}>
            <CheckCheck className="h-3 w-3 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); toast.success('Archived'); }}>
            <Archive className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NotificationFeed() {
  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Notification Feed
          </CardTitle>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{MOCK_NOTIFICATIONS.length} notifications</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {MOCK_NOTIFICATIONS.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
