'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatFullCurrency, formatFullDate, getPerformanceLevel } from '../utils';
import { DelegateStatusBadge } from './delegate-status-badge';
import { mockDelegates } from '../mock-data';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { X, Mail, Phone, Calendar, MapPin, Users, ShoppingCart, TrendingUp, Pencil, UserPlus, ArrowLeftRight, Ban } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DelegateProfileDrawerProps {
  delegateId: string | null;
  onClose: () => void;
}

export function DelegateProfileDrawer({ delegateId, onClose }: DelegateProfileDrawerProps) {
  const delegate = mockDelegates.find((d) => d.id === delegateId);

  if (!delegate) return null;

  const perfLevel = getPerformanceLevel(delegate.completionRate);

  return (
    <Drawer open={!!delegateId} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="w-[450px] max-w-[450px]">
        <DrawerHeader className="border-b border-border/40 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                  {delegate.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <DrawerTitle className="text-lg font-bold text-foreground">{delegate.name}</DrawerTitle>
                <div className="flex items-center gap-2 mt-1">
                  <DelegateStatusBadge status={delegate.status as any} />
                  <span className="text-xs text-muted-foreground">{delegate.region}</span>
                </div>
              </div>
            </div>
            <DrawerClose className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center">
              <X className="h-4 w-4" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Personal Information</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Email</span>
                  <span className="text-sm font-medium text-foreground">{delegate.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Phone</span>
                  <span className="text-sm font-medium text-foreground">{delegate.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Joined</span>
                  <span className="text-sm font-medium text-foreground">{formatFullDate(delegate.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Assignment</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Region</span>
                  <span className="text-sm font-medium text-foreground">{delegate.region} &middot; {delegate.wilaya}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Clients</span>
                  <span className="text-sm font-medium text-foreground">{Math.floor(delegate.totalOrders * 0.3)} assigned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Performance</h4>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-border/40 shadow-xs rounded-xl">
                <CardContent className="p-3 text-center">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-lg font-bold text-foreground block">{delegate.totalOrders}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Orders</span>
                </CardContent>
              </Card>
              <Card className="border border-border/40 shadow-xs rounded-xl">
                <CardContent className="p-3 text-center">
                  <TrendingUp className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-lg font-bold text-foreground block">{formatFullCurrency(delegate.totalRevenue)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Revenue</span>
                </CardContent>
              </Card>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
                <span className="text-xs font-bold" style={{ color: perfLevel.color }}>{delegate.completionRate}%</span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{ width: `${delegate.completionRate}%`, backgroundColor: perfLevel.color }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{perfLevel.label}</span>
            </div>
          </div>

          {/* Recent Orders Mini Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recent Orders</h4>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left font-semibold text-muted-foreground px-3 py-2">Order</th>
                    <th className="text-right font-semibold text-muted-foreground px-3 py-2">Amount</th>
                    <th className="text-right font-semibold text-muted-foreground px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-t border-border/30">
                      <td className="px-3 py-2 font-mono font-semibold text-foreground">ORD-2026-{String(892 - i).padStart(4, '0')}</td>
                      <td className="px-3 py-2 text-right text-foreground">{(50000 + i * 25000).toLocaleString()} DA</td>
                      <td className="px-3 py-2 text-right">
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-[9px] font-semibold',
                          i === 1 ? 'bg-emerald-500/10 text-emerald-600' : i === 2 ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'
                        )}>
                          {i === 1 ? 'Delivered' : i === 2 ? 'Pending' : 'Preparing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border/40 p-4 flex items-center gap-2">
          <Button className="flex-1 h-10 rounded-xl text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Pencil className="h-3.5 w-3.5" /> Edit Delegate
          </Button>
          <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-semibold gap-1.5 border-border/60">
            <UserPlus className="h-3.5 w-3.5" /> Assign Clients
          </Button>
          <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-semibold gap-1.5 border-border/60">
            <ArrowLeftRight className="h-3.5 w-3.5" /> Transfer
          </Button>
          <Button variant="outline" className="h-10 w-10 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10">
            <Ban className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
