'use client';

import { useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useDelegatesStore } from '../store';
import { filterDelegates, sortDelegates, formatCurrency } from '../utils';
import { mockDelegates } from '../mock-data';
import { DelegateStatusBadge } from './delegate-status-badge';
import { DelegateFilters } from './delegate-filters';
import { BulkActions } from './bulk-actions';
import { DelegateProfileDrawer } from './delegate-profile-drawer';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Users,
  Eye,
  Pencil,
  ShoppingCart,
  BarChart3,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import type { SortField } from '../types';
import type { Delegate } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AVATAR_COLORS = [
  'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
];

export function DelegatesTable() {
  const { filters, selectedIds, sort, page, pageSize, selectedDelegate, toggleSelect, selectAll, clearSelection, setSort, setPage, setPageSize, setSelectedDelegate } = useDelegatesStore();

  const processedData = useMemo(() => {
    const filtered = filterDelegates(mockDelegates, filters);
    const sorted = sortDelegates(filtered, sort.field, sort.direction);
    return sorted;
  }, [filters, sort]);

  const pageCount = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, page, pageSize]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sort.field === field) {
        setSort(field, sort.direction === 'asc' ? 'desc' : 'asc');
      } else {
        setSort(field, 'desc');
      }
    },
    [sort, setSort]
  );

  const allPageIds = useMemo(() => paginatedData.map((d) => d.id), [paginatedData]);
  const allSelected = allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id));
  const someSelected = allPageIds.some((id) => selectedIds.has(id)) && !allSelected;

  const handleSelectAllPage = useCallback(() => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(allPageIds);
    }
  }, [allSelected, allPageIds, selectAll, clearSelection]);

  const columns = useMemo<ColumnDef<Delegate>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={allSelected ? true : someSelected ? false : false}
            onCheckedChange={handleSelectAllPage}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.has(row.original.id)}
            onCheckedChange={() => toggleSelect(row.original.id)}
            aria-label={`Select delegate ${row.original.name}`}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-bold font-mono text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-md">
            {row.original.id}
          </span>
        ),
        size: 90,
      },
      {
        accessorKey: 'name',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('name')}
          >
            Delegate Name
            {sort.field === 'name' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            onClick={() => setSelectedDelegate(row.original.id)}
          >
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback className={cn('text-xs font-bold', AVATAR_COLORS[row.index % AVATAR_COLORS.length])}>
                {row.original.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <span className="font-semibold text-foreground text-xs block truncate leading-tight group-hover:text-primary transition-colors">
                {row.original.name}
              </span>
              <span className="text-[11px] text-muted-foreground block truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
        size: 180,
      },
      {
        accessorKey: 'region',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('region')}
          >
            Region
            {sort.field === 'region' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium bg-muted/60 px-2 py-0.5 rounded-md">
            {row.original.region}
          </span>
        ),
        size: 110,
      },
      {
        accessorKey: 'wilaya',
        header: 'Wilaya',
        cell: ({ row }) => <span className="text-xs font-medium text-foreground">{row.original.wilaya}</span>,
        size: 100,
      },
      {
        accessorKey: 'totalOrders',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('totalOrders')}
          >
            Total Orders
            {sort.field === 'totalOrders' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => <span className="text-xs font-bold text-foreground">{row.original.totalOrders}</span>,
        size: 100,
      },
      {
        accessorKey: 'totalRevenue',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('totalRevenue')}
          >
            Total Revenue
            {sort.field === 'totalRevenue' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-bold text-xs text-foreground tracking-tight">{formatCurrency(row.original.totalRevenue)}</span>
        ),
        size: 120,
      },
      {
        accessorKey: 'completionRate',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('completionRate')}
          >
            Performance
            {sort.field === 'completionRate' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const rate = row.original.completionRate;
          return (
            <div className="space-y-1 min-w-[100px]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-foreground">{rate}%</span>
                <span className={cn(
                  'font-semibold',
                  rate >= 90 ? 'text-emerald-600' : rate >= 80 ? 'text-blue-600' : 'text-amber-600'
                )}>
                  {rate >= 90 ? 'Top' : rate >= 80 ? 'Good' : 'Avg'}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    rate >= 90 ? 'bg-emerald-500' : rate >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                  )}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'status',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('status')}
          >
            Status
            {sort.field === 'status' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => <DelegateStatusBadge status={row.original.status} />,
        size: 110,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setSelectedDelegate(row.original.id)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setSelectedDelegate(row.original.id)}>
                  <BarChart3 className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info(`Edit ${row.original.name}`)}>
                  <Pencil className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info(`New order for ${row.original.name}`)}>
                  <ShoppingCart className="h-3.5 w-3.5 mr-2 text-blue-600" /> Assign Order
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => toast.error(`Deleted ${row.original.name}`)}>
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Delegate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 70,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [sort, handleSort, selectedIds, allPageIds, allSelected, someSelected, handleSelectAllPage, toggleSelect, setSelectedDelegate]
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount,
    state: {
      pagination: { pageIndex: page, pageSize },
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater({ pageIndex: page, pageSize }) : updater;
      setPage(newPagination.pageIndex);
      if (newPagination.pageSize !== pageSize) setPageSize(newPagination.pageSize);
    },
    manualPagination: true,
  });

  return (
    <>
      <Card className="border border-border/40 shadow-xs rounded-2xl overflow-hidden w-full">
        {/* Integrated Combined Header & Filters */}
        <CardHeader className="pb-3 border-b border-border/40 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold tracking-tight">Delegates Directory</CardTitle>
                  <Badge variant="secondary" className="rounded-full text-xs font-semibold px-2 py-0.5">
                    {processedData.length} Delegates
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Search, filter, and manage active sales representatives
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Integrated Filter Component */}
          <div className="pt-2 border-t border-border/30">
            <DelegateFilters />
          </div>
        </CardHeader>

        {/* Bulk Actions */}
        <BulkActions />

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="hover:bg-transparent border-b border-border/30">
                    {hg.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-3.5 px-4"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        'hover:bg-muted/40 transition-colors border-b border-border/30 last:border-0',
                        selectedIds.has(row.original.id) && 'bg-primary/5'
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3.5 px-4 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-xs">
                      No delegates found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/30 text-xs">
            <span className="text-muted-foreground">
              Showing{' '}
              <strong className="text-foreground font-semibold">
                {page * pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-foreground font-semibold">
                {Math.min((page + 1) * pageSize, processedData.length)}
              </strong>{' '}
              of <strong className="text-foreground font-semibold">{processedData.length}</strong> delegates
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 rounded-lg text-xs font-medium gap-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </Button>

              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                  let pageNum: number;
                  if (pageCount <= 5) {
                    pageNum = i;
                  } else if (page < 3) {
                    pageNum = i;
                  } else if (page >= pageCount - 3) {
                    pageNum = pageCount - 5 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'h-7 w-7 p-0 text-xs font-semibold rounded-md',
                        page === pageNum
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 rounded-lg text-xs font-medium gap-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delegate Profile Drawer */}
      {selectedDelegate && (
        <DelegateProfileDrawer
          delegateId={selectedDelegate}
          onClose={() => setSelectedDelegate(null)}
        />
      )}
    </>
  );
}
