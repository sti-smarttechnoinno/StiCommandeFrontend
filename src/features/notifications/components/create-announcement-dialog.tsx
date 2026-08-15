'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useNotificationsStore } from '../store';
import { toast } from 'sonner';
import { Megaphone, X, Paperclip } from 'lucide-react';

export function CreateAnnouncementDialog() {
  const { isAnnouncementDialogOpen, setAnnouncementDialogOpen } = useNotificationsStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [message, setMessage] = useState('');
  const [sendImmediately, setSendImmediately] = useState(true);

  const handleSubmit = () => {
    toast.success('Announcement published', { description: `"${title}" has been sent to ${targetUsers || 'all users'}` });
    setAnnouncementDialogOpen(false);
    setTitle(''); setCategory(''); setPriority(''); setTargetUsers(''); setTargetRegion(''); setTargetRole(''); setMessage('');
  };

  return (
    <Dialog open={isAnnouncementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
      <DialogContent className="max-w-[720px] rounded-[28px] p-0 overflow-hidden max-h-[85vh] overflow-y-auto">
        <DialogHeader className="px-8 pt-8 pb-0 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Create Announcement
            </DialogTitle>
            <button onClick={() => setAnnouncementDialogOpen(false)} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Announcement Title</label>
            <Input placeholder="Enter announcement title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 rounded-xl border-border/60" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? '')}>
                <SelectTrigger className="h-12 rounded-xl border-border/60"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="update">System Update</SelectItem>
                  <SelectItem value="policy">Policy Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v ?? '')}>
                <SelectTrigger className="h-12 rounded-xl border-border/60"><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Users</label>
              <Select value={targetUsers} onValueChange={(v) => setTargetUsers(v ?? '')}>
                <SelectTrigger className="h-12 rounded-xl border-border/60"><SelectValue placeholder="All Users" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admins">Administrators</SelectItem>
                  <SelectItem value="managers">Managers</SelectItem>
                  <SelectItem value="delegates">Delegates</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Region</label>
              <Select value={targetRegion} onValueChange={(v) => setTargetRegion(v ?? '')}>
                <SelectTrigger className="h-12 rounded-xl border-border/60"><SelectValue placeholder="All Regions" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Role</label>
              <Select value={targetRole} onValueChange={(v) => setTargetRole(v ?? '')}>
                <SelectTrigger className="h-12 rounded-xl border-border/60"><SelectValue placeholder="All Roles" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="delegate">Delegate</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Message</label>
            <textarea
              placeholder="Write your announcement message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-28 rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Schedule Date</label>
              <Input type="datetime-local" className="h-12 rounded-xl border-border/60" disabled={sendImmediately} />
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 h-12">
                <Checkbox checked={sendImmediately} onCheckedChange={(v) => setSendImmediately(v === true)} />
                <span className="text-xs font-medium text-foreground">Send Immediately</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border/60 hover:bg-muted/20 transition-colors cursor-pointer">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Attach files (optional)</span>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-0 sticky bottom-0 bg-white">
          <div className="flex items-center gap-3 w-full">
            <Button variant="outline" className="flex-1 h-12 rounded-xl text-sm font-semibold border-border/60" onClick={() => setAnnouncementDialogOpen(false)}>Cancel</Button>
            <Button className="flex-1 h-12 rounded-xl text-sm font-semibold bg-[#D71920] hover:bg-[#B81419] text-white shadow-lg shadow-[#D71920]/20" onClick={handleSubmit} disabled={!title || !message}>
              Publish Announcement
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
