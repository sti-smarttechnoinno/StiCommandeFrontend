'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNotificationsStore } from '../store';
import { notificationsService } from '@/services/notifications';
import type { Notification } from '../types';
import { getCategoryColor, getPriorityColor, getStatusColor, getStatusDot, getStatusLabel } from '../utils';
import { toast } from 'sonner';
import { Eye, Archive, CheckCircle2, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Bell, BellOff, Loader2 } from 'lucide-react';

export function NotificationsTable() {
  const {
    searchQuery,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    selectedRegion,
    refreshKey,
    triggerRefresh,
    setDetailsDrawerOpen,
  } = useNotificationsStore();

  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    notificationsService
      .list({
        search: searchQuery,
        category: selectedCategory,
        priority: selectedPriority,
        status: selectedStatus,
        region: selectedRegion,
        page,
        pageSize,
      })
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setTotalPages(res.totalPages);
          setTotalItems(res.total);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, selectedPriority, selectedStatus, selectedRegion, page, refreshKey]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      toast.success('Notification marked as read');
      triggerRefresh();
    } catch {
      toast.error('Failed to update notification');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsService.delete(id);
      toast.success('Notification deleted');
      triggerRefresh();
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notification Records
          </CardTitle>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            Total: {totalItems}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10 w-[80px]">Time</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10 w-[100px]">Category</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10">Notification</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10 w-[120px]">User</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10 w-[90px]">Priority</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10 w-[90px]">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 py-8">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">Fetching notifications registry...</p>
                        <p className="text-[11px] text-muted-foreground">Loading system alerts, orders and announcements</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <BellOff className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-xs font-semibold">No notifications found</p>
                      <p className="text-[11px] text-muted-foreground/70">
                        There are no notifications matching your current filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((n) => (
                  <TableRow
                    key={n.id}
                    className={cn('border-border/20 hover:bg-muted/30 transition-colors cursor-pointer', !n.read && 'bg-primary/5')}
                    onClick={() => setDetailsDrawerOpen(true, n.id)}
                  >
                    <TableCell className="py-3 px-4">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Badge variant="ghost" className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full', getCategoryColor(n.category))}>
                        {n.category.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="max-w-[280px]">
                        <span className="text-xs font-semibold text-foreground line-clamp-1">{n.title}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{n.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-xs text-foreground font-medium">{n.user}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Badge variant="outline" className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full border-0', getPriorityColor(n.priority))}>
                        {n.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold', getStatusColor(n.status))}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', getStatusDot(n.status))} />
                        {getStatusLabel(n.status)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setDetailsDrawerOpen(true, n.id)}>
                            <Eye className="h-3.5 w-3.5 mr-2" /> View
                          </DropdownMenuItem>
                          {!n.read && (
                            <DropdownMenuItem onClick={() => handleMarkRead(n.id)}>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Mark Read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(n.id)} className="text-rose-600">
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalItems > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/30">
            <span className="text-[11px] text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 rounded-lg border-border/60"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs font-semibold px-2 text-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 rounded-lg border-border/60"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
