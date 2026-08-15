'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useUsersStore } from '../store';
import { toast } from 'sonner';
import { UserPlus, X } from 'lucide-react';

export function NewUserDialog() {
  const { isNewUserDialogOpen, setNewUserDialogOpen } = useUsersStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [region, setRegion] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [role, setRole] = useState('');
  const [userGroup, setUserGroup] = useState('');
  const [password, setPassword] = useState('');
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [enable2FA, setEnable2FA] = useState(false);
  const [sendInvitation, setSendInvitation] = useState(true);

  const handleSubmit = () => {
    toast.success('User created successfully', { description: `${fullName} has been invited as ${role}` });
    setNewUserDialogOpen(false);
    setFullName(''); setEmail(''); setPhone(''); setEmployeeId(''); setRegion(''); setWilaya(''); setRole(''); setUserGroup(''); setPassword('');
  };

  return (
    <Dialog open={isNewUserDialogOpen} onOpenChange={setNewUserDialogOpen}>
      <DialogContent className="max-w-[720px] rounded-[28px] p-0 overflow-hidden max-h-[85vh] overflow-y-auto">
        <DialogHeader className="px-8 pt-8 pb-0 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Create New User
            </DialogTitle>
            <button onClick={() => setNewUserDialogOpen(false)} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center">
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
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11 rounded-xl border-border/60" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" placeholder="user@eststar.dz" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl border-border/60" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input placeholder="+213 555 XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl border-border/60" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Employee ID</label>
                <Input placeholder="EMP-XXX" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="h-11 rounded-xl border-border/60" />
              </div>
            </div>
          </div>

          {/* Employment */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Employment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Region</label>
                <Select value={region} onValueChange={(v) => setRegion(v ?? '')}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60"><SelectValue placeholder="Select region" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Wilaya</label>
                <Select value={wilaya} onValueChange={(v) => setWilaya(v ?? '')}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60"><SelectValue placeholder="Select wilaya" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="setif">Setif</SelectItem>
                    <SelectItem value="algiers">Algiers</SelectItem>
                    <SelectItem value="oran">Oran</SelectItem>
                    <SelectItem value="constantine">Constantine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Access Control</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <Select value={role} onValueChange={(v) => setRole(v ?? '')}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="delegate">Delegate</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">User Group</label>
                <Select value={userGroup} onValueChange={(v) => setUserGroup(v ?? '')}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60"><SelectValue placeholder="Select group" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin Group</SelectItem>
                    <SelectItem value="sales">Sales Team</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
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
                <label className="text-sm font-medium text-foreground">Temporary Password</label>
                <Input type="password" placeholder="Enter temporary password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl border-border/60" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                <Checkbox checked={forcePasswordChange} onCheckedChange={(v) => setForcePasswordChange(v === true)} />
                <span className="text-xs font-medium text-foreground">Force password change on first login</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                <Checkbox checked={enable2FA} onCheckedChange={(v) => setEnable2FA(v === true)} />
                <span className="text-xs font-medium text-foreground">Enable two-factor authentication</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                <Checkbox checked={sendInvitation} onCheckedChange={(v) => setSendInvitation(v === true)} />
                <span className="text-xs font-medium text-foreground">Send invitation email</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-0 sticky bottom-0 bg-white">
          <div className="flex items-center gap-3 w-full">
            <Button variant="outline" className="flex-1 h-12 rounded-xl text-sm font-semibold border-border/60" onClick={() => setNewUserDialogOpen(false)}>Cancel</Button>
            <Button className="flex-1 h-12 rounded-xl text-sm font-semibold bg-[#D71920] hover:bg-[#B81419] text-white shadow-lg shadow-[#D71920]/20" onClick={handleSubmit} disabled={!fullName || !email || !role}>
              Create User
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
