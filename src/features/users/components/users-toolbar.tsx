'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsersStore } from '../store';
import { Search, X, RefreshCw, FileDown, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export function UsersToolbar() {
  const {
    searchQuery, setSearchQuery,
    selectedRole, setSelectedRole,
    selectedRegion, setSelectedRegion,
    selectedWilaya, setSelectedWilaya,
    selectedStatus, setSelectedStatus,
    selectedLastLogin, setSelectedLastLogin,
    selectedTwoFactor, setSelectedTwoFactor,
    resetFilters,
  } = useUsersStore();

  const hasFilters = searchQuery || selectedRole || selectedRegion || selectedWilaya || selectedStatus || selectedLastLogin || selectedTwoFactor;

  return (
    <div className="w-full bg-muted/20 border border-border/40 rounded-xl p-2.5 flex items-center gap-2.5 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 h-9 text-xs rounded-xl bg-card border-border/60 focus-visible:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Role */}
      <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v ?? '')}>
        <SelectTrigger className="h-9 rounded-xl border-border/60 text-xs w-[120px] bg-card">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="administrator">Administrator</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="delegate">Delegate</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>

      {/* Region */}
      <Select value={selectedRegion} onValueChange={(v) => setSelectedRegion(v ?? '')}>
        <SelectTrigger className="h-9 rounded-xl border-border/60 text-xs w-[120px] bg-card">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="east">East</SelectItem>
          <SelectItem value="center">Center</SelectItem>
          <SelectItem value="west">West</SelectItem>
          <SelectItem value="south">South</SelectItem>
        </SelectContent>
      </Select>

      {/* Wilaya */}
      <Select value={selectedWilaya} onValueChange={(v) => setSelectedWilaya(v ?? '')}>
        <SelectTrigger className="h-9 rounded-xl border-border/60 text-xs w-[120px] bg-card">
          <SelectValue placeholder="Wilaya" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="setif">Setif</SelectItem>
          <SelectItem value="algiers">Algiers</SelectItem>
          <SelectItem value="oran">Oran</SelectItem>
          <SelectItem value="constantine">Constantine</SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}
      <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v ?? '')}>
        <SelectTrigger className="h-9 rounded-xl border-border/60 text-xs w-[120px] bg-card">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="locked">Locked</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear All */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 rounded-xl text-xs font-semibold gap-1 text-destructive hover:bg-destructive/10"
          onClick={resetFilters}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border/60 bg-card hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          title="Refresh Users"
          onClick={() => toast.success('Users refreshed')}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border/60 bg-card hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          title="Export Users"
          onClick={() => toast.success('Users exported')}
        >
          <FileDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
