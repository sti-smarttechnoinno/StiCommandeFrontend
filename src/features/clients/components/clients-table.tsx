'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useCallback, useEffect } from 'react';
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
import { useClientsStore } from '../store';
import { formatCurrency } from '../utils';
import { clientsService, type ClientData } from '@/services/clients';
import { ClientStatusBadge, ClientTypeBadge } from './client-badges';
import { ClientFilters } from './client-filters';
import { BulkActions } from './bulk-actions';
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
  Trash2,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { SortField } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ClientsTable() {
  const router = useRouter();
  const { filters, selectedIds, sort, page, pageSize, toggleSelect, selectAll, clearSelection, setSort, setPage, setPageSize } = useClientsStore();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchClients = async () => {
      try {
        const params: Record<string, string | string[] | number> = {};

        if (filters.search) params.search = filters.search;
        if (filters.status.length) params.status = filters.status;
        if (filters.region.length) params.region = filters.region;
        if (filters.delegate.length) params.delegate = filters.delegate;
        if (filters.clientType.length) params.clientType = filters.clientType;
        if (filters.dateRange.start) params.dateStart = filters.dateRange.start.toISOString();
        if (filters.dateRange.end) params.dateEnd = filters.dateRange.end.toISOString();
        params.sortField = sort.field === 'delegateName' ? 'region' : sort.field;
        params.sortDirection = sort.direction;
        params.page = page + 1;
        params.pageSize = pageSize;

        const result = await clientsService.list(params);
        if (!cancelled) {
          setClients(result.data);
          setTotal(result.total);
        }
      } catch {
        if (!cancelled) {
          toast.error('Failed to load clients');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClients();
    return () => { cancelled = true; };
  }, [filters, sort, page, pageSize]);

  const processedData = clients;
  const pageCount = Math.ceil(total / pageSize);

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

  const allPageIds = useMemo(() => processedData.map((c) => c.id), [processedData]);
  const allSelected = allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id));
  const someSelected = allPageIds.some((id) => selectedIds.has(id)) && !allSelected;

  const handleSelectAllPage = useCallback(() => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(allPageIds);
    }
  }, [allSelected, allPageIds, selectAll, clearSelection]);

  const columns = useMemo<ColumnDef<ClientData>[]>(
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
            aria-label={`Select client ${row.original.name}`}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'clientCode',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('clientCode')}
          >
            Client Code
            {sort.field === 'clientCode' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-foreground/80">
            {row.original.clientCode}
          </span>
        ),
        size: 110,
      },
      {
        accessorKey: 'name',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('name')}
          >
            Client Name
            {sort.field === 'name' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
              {row.original.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-foreground text-xs block truncate leading-tight">
                {row.original.name}
              </span>
              <span className="text-[11px] text-muted-foreground block truncate">
                {row.original.phone}
              </span>
            </div>
          </div>
        ),
        size: 180,
      },
      {
        accessorKey: 'clientType',
        header: 'Type',
        cell: ({ row }) => <ClientTypeBadge type={row.original.clientType} />,
        size: 100,
      },
      {
        accessorKey: 'region',
        header: 'Region',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium bg-muted/60 px-2 py-0.5 rounded-md">
            {row.original.region}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: 'delegateName',
        header: 'Delegate',
        cell: ({ row }) => <span className="text-xs font-medium text-foreground">{row.original.delegateName || 'Unassigned'}</span>,
        size: 120,
      },
      {
        accessorKey: 'totalOrders',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('totalOrders')}
          >
            Orders
            {sort.field === 'totalOrders' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => <span className="text-xs font-bold text-foreground">{row.original.totalOrders}</span>,
        size: 80,
      },
      {
        accessorKey: 'totalSpent',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('totalSpent')}
          >
            Total Spent
            {sort.field === 'totalSpent' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-bold text-xs text-foreground tracking-tight">{formatCurrency(row.original.totalSpent)}</span>
        ),
        size: 110,
      },
      {
        accessorKey: 'outstandingBalance',
        header: 'Credit Used',
        cell: ({ row }) => {
          const used = row.original.outstandingBalance;
          const limit = row.original.creditLimit;
          const ratio = limit > 0 ? (used / limit) * 100 : 0;
          return (
            <div className="space-y-1 min-w-[100px]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-foreground">{formatCurrency(used)}</span>
                <span className="text-muted-foreground">{ratio.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    ratio > 85 ? 'bg-rose-500' : ratio > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  )}
                  style={{ width: `${Math.min(ratio, 100)}%` }}
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
        cell: ({ row }) => <ClientStatusBadge status={row.original.status} />,
        size: 110,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link href={`/clients/${row.original.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="View Client Profile"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 text-xs">
                <DropdownMenuItem className="gap-2" onClick={() => router.push(`/clients/${row.original.id}`)}>
                  <Eye className="h-3.5 w-3.5" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => toast.info(`Client details for ${row.original.name}`)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit Client
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <ShoppingCart className="h-3.5 w-3.5" /> New Order
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-rose-600 dark:text-rose-400">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 80,
      },
    ],
    [
      allSelected,
      someSelected,
      selectedIds,
      sort,
      handleSelectAllPage,
      toggleSelect,
      handleSort,
    ]
  );

  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      pagination: {
        pageIndex: page,
        pageSize,
      },
    },
  });

  return (
    <Card className="border border-border/40 shadow-xs bg-card overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border/40 space-y-3 bg-muted/20">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Clients List
              <Badge variant="secondary" className="rounded-full text-xs font-semibold px-2">
                {total}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Filter, search, and manage your client portfolio.
            </CardDescription>
          </div>

          <ClientFilters />
        </div>

        <BulkActions />
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-2xs flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <Table>
            <TableHeader className="bg-muted/40 text-[11px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: header.getSize() }} className="py-3 px-3">
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
                      'hover:bg-muted/30 transition-colors border-b border-border/30 text-xs',
                      selectedIds.has(row.original.id) && 'bg-primary/5 hover:bg-primary/10'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5 px-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-36 text-center text-muted-foreground text-xs">
                    No clients found. Try adjusting your filters.
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
              {total === 0 ? 0 : page * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-foreground font-semibold">
              {Math.min((page + 1) * pageSize, total)}
            </strong>{' '}
            of <strong className="text-foreground font-semibold">{total}</strong> clients
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
  );
}
