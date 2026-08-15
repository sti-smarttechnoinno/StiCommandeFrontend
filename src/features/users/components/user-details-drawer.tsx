'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { MOCK_USERS } from '../mock-data';
import { useUsersStore } from '../store';
import { getRoleColor, getRoleLabel, getStatusColor, getStatusDot, getStatusLabel, getAvatarColor, getEventColor, getEventDot } from '../utils';
import { toast } from 'sonner';
import { X, Pencil, KeyRound, Lock, Unlock, Trash2, Shield, ShieldOff, Monitor, Smartphone, MapPin, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

const EVENT_ICONS: Record<string, React.ReactNode> = {
  login: <CheckCircle2 className="h-3 w-3 text-emerald-500" />,
  logout: <Clock className="h-3 w-3 text-muted-foreground" />,
  password_changed: <AlertTriangle className="h-3 w-3 text-amber-500" />,
  role_updated: <AlertTriangle className="h-3 w-3 text-amber-500" />,
  failed_login: <XCircle className="h-3 w-3 text-rose-500" />,
};

const MODULES = ['Dashboard', 'Orders', 'Products', 'Clients', 'Reports', 'Settings', 'Users', 'Stock', 'Notifications'];

export function UserDetailsDrawer() {
  const { isDetailsDrawerOpen, setDetailsDrawerOpen, selectedUserId } = useUsersStore();
  const user = MOCK_USERS.find((u) => u.id === selectedUserId);

  if (!user) return null;

  return (
    <Drawer open={isDetailsDrawerOpen} onOpenChange={(open) => setDetailsDrawerOpen(open)}>
      <DrawerContent className="max-w-[480px]">
        <DrawerHeader className="border-b border-border/30 pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-bold">User Details</DrawerTitle>
            <button onClick={() => setDetailsDrawerOpen(false)} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>
        </DrawerHeader>

        <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className={cn('text-lg font-bold', getAvatarColor(MOCK_USERS.indexOf(user)))}>{user.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base font-bold text-foreground">{user.name}</h3>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="ghost" className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', getRoleColor(user.role))}>{getRoleLabel(user.role)}</Badge>
                <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold', getStatusColor(user.status))}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', getStatusDot(user.status))} />
                  {getStatusLabel(user.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/30">
              <span className="text-[10px] text-muted-foreground block mb-0.5">Phone</span>
              <span className="text-xs font-semibold text-foreground">{user.phone}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <span className="text-[10px] text-muted-foreground block mb-0.5">Employee ID</span>
              <span className="text-xs font-semibold text-foreground font-mono">{user.employeeId}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <span className="text-[10px] text-muted-foreground block mb-0.5">Last Login</span>
              <span className="text-xs font-semibold text-foreground">{user.lastLogin}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <span className="text-[10px] text-muted-foreground block mb-0.5">2FA</span>
              <span className={cn('text-xs font-semibold flex items-center gap-1', user.twoFactorEnabled ? 'text-emerald-600' : 'text-muted-foreground')}>
                {user.twoFactorEnabled ? <Shield className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Assigned Territory */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Assigned Territory</h4>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border/40">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{user.region} Region — {user.wilaya}</span>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Permissions</h4>
            <div className="space-y-2">
              {MODULES.map((mod) => {
                const perm = user.permissions.find((p) => p.module === mod);
                return (
                  <div key={mod} className="flex items-center justify-between p-2.5 rounded-xl border border-border/30 hover:bg-muted/20 transition-colors">
                    <span className="text-xs font-semibold text-foreground">{mod}</span>
                    <div className="flex items-center gap-3">
                      {['read', 'create', 'update', 'delete'].map((action) => (
                        <div key={action} className="flex items-center gap-1">
                          <Checkbox checked={perm ? (perm as any)[action] : false} disabled />
                          <span className="text-[9px] text-muted-foreground capitalize">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Login History */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Login History</h4>
            <div className="space-y-2">
              {user.loginHistory.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border/30 hover:bg-muted/20 transition-colors">
                  {EVENT_ICONS[event.type]}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground capitalize">{event.type.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[9px] text-muted-foreground bg-muted/50 px-1 py-0.5 rounded">{event.ipAddress}</span>
                      <span className="text-[9px] text-muted-foreground">{event.device}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Devices</h4>
            <div className="space-y-2">
              {user.devices.map((device, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/30">
                  {device.type === 'Desktop' ? <Monitor className="h-4 w-4 text-blue-500" /> : <Smartphone className="h-4 w-4 text-emerald-500" />}
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-foreground">{device.type} — {device.browser}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[9px] text-muted-foreground bg-muted/50 px-1 py-0.5 rounded">{device.ip}</span>
                      <span className="text-[9px] text-muted-foreground">{device.location}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{device.lastActive}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border/30 flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-9 rounded-xl text-xs font-semibold border-border/60" onClick={() => toast.info('Editing user')}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-9 rounded-xl text-xs font-semibold border-border/60" onClick={() => toast.info('Password reset')}>
            <KeyRound className="h-3.5 w-3.5 mr-1.5" /> Reset
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-9 rounded-xl text-xs font-semibold border-border/60" onClick={() => toast.info(user.status === 'locked' ? 'Account unlocked' : 'Account locked')}>
            {user.status === 'locked' ? <Unlock className="h-3.5 w-3.5 mr-1.5" /> : <Lock className="h-3.5 w-3.5 mr-1.5" />}
            {user.status === 'locked' ? 'Unlock' : 'Lock'}
          </Button>
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-border/60 text-rose-600" onClick={() => toast.error('User deleted')}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
