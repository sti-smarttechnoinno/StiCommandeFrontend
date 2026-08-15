'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotificationsStore } from '../store';
import { Search, X, RefreshCw, FileDown } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationsToolbar() {
  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedPriority, setSelectedPriority,
    selectedStatus, setSelectedStatus,
    selectedRegion, setSelectedRegion,
    selectedDelegate, setSelectedDelegate,
    selectedDateRange, setSelectedDateRange,
    resetFilters,
  } = useNotificationsStore();

  const hasFilters = searchQuery || selectedCategory || selectedPriority || selectedStatus || selectedRegion || selectedDelegate || selectedDateRange;

  return (
    <Card className="border border-border/40 shadow-xs rounded-[20px] bg-card">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notifications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9 pl-9 rounded-lg border-border/60 text-xs" />
          </div>

          <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v ?? '')}>
            <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="delegates">Delegates</SelectItem>
              <SelectItem value="clients">Clients</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={(v) => setSelectedPriority(v ?? '')}>
            <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v ?? '')}>
            <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRegion} onValueChange={(v) => setSelectedRegion(v ?? '')}>
            <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs w-[120px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="west">West</SelectItem>
              <SelectItem value="south">South</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDelegate} onValueChange={(v) => setSelectedDelegate(v ?? '')}>
            <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs w-[130px]">
              <SelectValue placeholder="Delegate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ahmed">Ahmed Benali</SelectItem>
              <SelectItem value="fatima">Fatima Zeroual</SelectItem>
              <SelectItem value="karim">Karim Hadj</SelectItem>
              <SelectItem value="omar">Omar Tlemcani</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDateRange} onValueChange={(v) => setSelectedDateRange(v ?? '')}>
            <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs w-[130px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-6 w-px bg-border/40 hidden sm:block" />

          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-9 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground" onClick={resetFilters}>
              <X className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/60 text-xs font-semibold" onClick={() => toast.success('Filters applied')}>
            Apply
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/60 text-xs font-semibold" onClick={() => toast.success('Notifications exported')}>
            <FileDown className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/60 text-xs font-semibold" onClick={() => toast.success('Notifications refreshed')}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
