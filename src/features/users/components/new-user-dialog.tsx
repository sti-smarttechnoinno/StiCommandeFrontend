'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useUsersStore } from '../store';
import { usersService } from '@/services/users';
import { toast } from 'sonner';
import { UserPlus, X, Loader2 } from 'lucide-react';

export function NewUserDialog() {
  const { isNewUserDialogOpen, setNewUserDialogOpen } = useUsersStore();
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [region, setRegion] = useState('Algiers');
  const [wilaya, setWilaya] = useState('16 - Alger');
  const [role, setRole] = useState('administrator');
  const [department, setDepartment] = useState('Commercial Operations');
  const [password, setPassword] = useState('Sti2026!');
  const [forcePasswordChange, setForcePasswordChange] = useState(true);

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !role) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await usersService.create({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        employeeId: employeeId.trim(),
        role: role as any,
        department,
        status: 'online',
      });

      toast.success('User created successfully', { description: `${fullName} has been created as ${role}` });
      setNewUserDialogOpen(false);
      setFullName(''); setEmail(''); setPhone(''); setEmployeeId(''); setRegion('Algiers'); setWilaya('16 - Alger'); setRole('administrator'); setDepartment('Commercial Operations'); setPassword('password');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create user';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isNewUserDialogOpen} onOpenChange={setNewUserDialogOpen}>
      <DialogContent className="max-w-[720px] rounded-[28px] p-0 overflow-hidden max-h-[85vh] overflow-y-auto bg-card text-card-foreground">
        <DialogHeader className="px-8 pt-8 pb-0 sticky top-0 bg-card border-b border-border/30 z-10">
          <div className="flex items-center justify-between pb-4">
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Create New User
            </DialogTitle>
            <button onClick={() => setNewUserDialogOpen(false)} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Full Name *</label>
                <Input placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11 rounded-xl border-border/60 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Email *</label>
                <Input type="email" placeholder="user@sti.dz" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl border-border/60 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Phone</label>
                <Input placeholder="0550 11 22 33" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl border-border/60 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Employee ID</label>
                <Input placeholder="EMP-2026-000001 (Auto generated if blank)" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="h-11 rounded-xl border-border/60 text-xs" />
              </div>
            </div>
          </div>

          {/* Territory & Department */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Territory & Department</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Region</label>
                <Input placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} className="h-11 rounded-xl border-border/60 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Wilaya</label>
                <Input placeholder="Wilaya" value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="h-11 rounded-xl border-border/60 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Department</label>
                <Input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} className="h-11 rounded-xl border-border/60 text-xs" />
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Access Control</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Role *</label>
                <Select value={role} onValueChange={(v) => setRole(v ?? 'administrator')}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60 text-xs"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent className="rounded-xl border-border/60">
                    <SelectItem value="administrator" className="text-xs">Administrator</SelectItem>
                    <SelectItem value="manager" className="text-xs">Manager</SelectItem>
                    <SelectItem value="delegate" className="text-xs">Delegate</SelectItem>
                    <SelectItem value="viewer" className="text-xs">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Security</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Temporary Password</label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl border-border/60 text-xs" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                <Checkbox checked={forcePasswordChange} onCheckedChange={(v) => setForcePasswordChange(v === true)} />
                <span className="text-xs font-medium text-foreground">Force password change on first login</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-0 sticky bottom-0 bg-card border-t border-border/30 pt-4">
          <div className="flex items-center gap-3 w-full">
            <Button variant="outline" className="flex-1 h-11 rounded-xl text-xs font-semibold border-border/60" onClick={() => setNewUserDialogOpen(false)}>Cancel</Button>
            <Button className="flex-1 h-11 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" onClick={handleSubmit} disabled={submitting || !fullName || !email || !role}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" /> : 'Create User'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
