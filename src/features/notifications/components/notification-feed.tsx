'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNotificationsStore } from '../store';
import { notificationsService } from '@/services/notifications';
import type { Notification } from '../types';
import { getCategoryColor, getPriorityColor, getPriorityBorder } from '../utils';
import { toast } from 'sonner';
import {
  Eye,
  CheckCheck,
  Trash2,
  ShoppingCart,
  Package,
  Users,
  Shield,
  Server,
  FileText,
  DollarSign,
  UserCheck,
  BellOff,
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

function NotificationCard({ notification, onRead }: { notification: Notification; onRead: () => void }) {
  const { setDetailsDrawerOpen } = useNotificationsStore();

  const handleMarkRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationsService.markAsRead(notification.id);
      toast.success('Marked as read');
      onRead();
    } catch {
      toast.error('Failed to update notification');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationsService.delete(notification.id);
      toast.success('Notification deleted');
      onRead();
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-4 p-4 rounded-2xl border border-border/30 border-l-4 transition-all hover:bg-muted/20 hover:shadow-sm cursor-pointer group',
        getPriorityBorder(notification.priority),
        !notification.read && 'bg-primary/5'
      )}
      onClick={() => setDetailsDrawerOpen(true, notification.id)}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', getCategoryColor(notification.category))}>
        {CATEGORY_ICONS[notification.category] ?? <Server className="h-4 w-4" />}
      </div>

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

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap">
          {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetailsDrawerOpen(true, notification.id)}>
            <Eye className="h-3 w-3 text-muted-foreground" />
          </Button>
          {!notification.read && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleMarkRead}>
              <CheckCheck className="h-3 w-3 text-emerald-600" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDelete}>
            <Trash2 className="h-3 w-3 text-rose-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NotificationFeed() {
  const refreshKey = useNotificationsStore((s) => s.refreshKey);
  const triggerRefresh = useNotificationsStore((s) => s.triggerRefresh);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const res = await notificationsService.list({ pageSize: 5 });
      setNotifications(res.data);
    } catch {
      // Empty feed fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [refreshKey]);

  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Notification Feed
          </CardTitle>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {notifications.length} recent
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="py-8 text-center text-xs text-muted-foreground">Loading notification feed...</div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-2 text-muted-foreground">
            <BellOff className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs font-semibold">No recent notifications</p>
            <p className="text-[11px] text-muted-foreground/70">New system alerts and order events will appear here in real time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationCard key={n.id} notification={n} onRead={triggerRefresh} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
