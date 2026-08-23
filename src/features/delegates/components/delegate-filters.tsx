'use client';

import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useDelegatesStore } from '../store';
import { Search, X, ChevronDown, Calendar, RotateCcw, SlidersHorizontal, Columns3, Rows3 } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'online', label: 'Online' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Offline' },
  { value: 'suspended', label: 'Suspended' },
];

const REGION_OPTIONS = ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Batna', 'Sétif', 'Blida', 'Tizi Ouzou', 'Biskra', 'Tlemcen'];

const PERFORMANCE_OPTIONS = [
  { value: 'all', label: 'All Performance' },
  { value: 'excellent', label: 'Excellent (90%+)' },
  { value: 'good', label: 'Good (80-89%)' },
  { value: 'average', label: 'Average (70-79%)' },
  { value: 'poor', label: 'Poor (<70%)' },
];

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

function FilterDropdown({ label, options, selected, onToggle, onClear }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'h-9 px-3.5 rounded-[12px] text-xs font-medium gap-1.5 border transition-colors outline-none cursor-pointer',
          selected.length > 0
            ? 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
            : 'border-border/60 bg-white text-muted-foreground hover:bg-muted/70'
        )}
      >
        {label}
        {selected.length > 0 && (
          <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px] rounded-full bg-primary/20 text-primary">
            {selected.length}
          </Badge>
        )}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52 rounded-xl p-1.5">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {selected.length > 0 && (
          <>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={onClear}
              className="rounded-lg cursor-pointer text-xs text-primary"
              onSelect={(e) => e.preventDefault()}
            >
              Clear all
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
          </>
        )}
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            checked={selected.includes(opt.value)}
            onCheckedChange={() => onToggle(opt.value)}
            className="rounded-lg cursor-pointer text-xs"
          >
            {opt.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DelegateFilters() {
  const { filters, setFilter, resetFilters } = useDelegatesStore();

  const activeFilterCount =
    filters.status.length +
    filters.region.length +
    filters.wilaya.length +
    (filters.performance !== 'all' ? 1 : 0) +
    (filters.dateRange.start ? 1 : 0);

  const toggleArrayFilter = (key: 'status' | 'region' | 'wilaya', value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setFilter(key, next as any);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Search */}
      <div className="relative flex-1 min-w-[240px] max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search delegates..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className="pl-10 pr-10 h-9 text-sm rounded-[12px] bg-white border-border/60"
        />
        {filters.search && (
          <button
            onClick={() => setFilter('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Region Filter */}
      <FilterDropdown
        label="Region"
        options={REGION_OPTIONS.map((r) => ({ value: r, label: r }))}
        selected={filters.region}
        onToggle={(v) => toggleArrayFilter('region', v)}
        onClear={() => setFilter('region', [])}
      />

      {/* Status Filter */}
      <FilterDropdown
        label="Status"
        options={STATUS_OPTIONS}
        selected={filters.status}
        onToggle={(v) => toggleArrayFilter('status', v)}
        onClear={() => setFilter('status', [])}
      />

      {/* Performance Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 px-3.5 rounded-[12px] text-xs font-medium gap-1.5 border transition-colors',
              filters.performance !== 'all'
                ? 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
                : 'border-border/60 bg-white text-muted-foreground hover:bg-muted/70'
            )}
          >
            Performance
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 rounded-xl p-1.5">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2">Performance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PERFORMANCE_OPTIONS.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={filters.performance === opt.value}
              onCheckedChange={() => setFilter('performance', opt.value as any)}
              className="rounded-lg cursor-pointer text-xs"
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Range */}
      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setFilter('dateRange', {
              ...filters.dateRange,
              start: e.target.value ? new Date(e.target.value) : null,
            })
          }
          className="h-9 rounded-[12px] border border-border/60 bg-white px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20"
        />
        <span className="text-xs text-muted-foreground">-</span>
        <input
          type="date"
          value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setFilter('dateRange', {
              ...filters.dateRange,
              end: e.target.value ? new Date(e.target.value) : null,
            })
          }
          className="h-9 rounded-[12px] border border-border/60 bg-white px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3.5 rounded-[12px] text-xs font-medium gap-1.5 text-destructive hover:bg-destructive/10"
          onClick={resetFilters}
        >
          <RotateCcw className="h-3 w-3" />
          Clear ({activeFilterCount})
        </Button>
      )}

      {/* Right-side actions */}
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[12px] text-muted-foreground hover:text-foreground" title="Refresh">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[12px] text-muted-foreground hover:text-foreground" title="Columns">
          <Columns3 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[12px] text-muted-foreground hover:text-foreground" title="Density">
          <Rows3 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
