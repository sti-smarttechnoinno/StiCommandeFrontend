'use client';

import { useMemo, useCallback, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useOrdersStore } from '../store';
import { filterOrders, sortOrders, formatCurrency, formatDate } from '../utils';
import { mockOrders } from '../mock-data';
import { OrderStatusBadge } from './order-status-badge';
import { OrderPriorityBadge } from './order-priority-badge';
import { OrderActions } from './order-actions';
import { OrderExpandedRow } from './order-expanded-row';
import { OrderFilters } from './order-filters';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Download,
  Printer,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ExtendedOrder, SortField } from '../types';

export function OrdersTable() {
  const { filters, selectedIds, expandedIds, sort, page, pageSize, toggleSelect, selectAll, clearSelection, toggleExpand, setSort, setPage, setPageSize } = useOrdersStore();

  const processedData = useMemo(() => {
    const filtered = filterOrders(mockOrders, filters);
    const sorted = sortOrders(filtered, sort.field, sort.direction);
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

  const allPageIds = useMemo(() => paginatedData.map((o) => o.id), [paginatedData]);
  const allSelected = allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id));
  const someSelected = allPageIds.some((id) => selectedIds.has(id)) && !allSelected;

  const handleSelectAllPage = useCallback(() => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(allPageIds);
    }
  }, [allSelected, allPageIds, selectAll, clearSelection]);

  const handleBulkApprove = () => {
    toast.success(`${selectedIds.size} orders approved`);
    clearSelection();
  };

  const handleBulkDelete = () => {
    toast.error(`${selectedIds.size} orders deleted`);
    clearSelection();
  };

  const columns = useMemo<ColumnDef<ExtendedOrder>[]>(
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
            aria-label={`Select order ${row.original.id}`}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'orderNumber',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('orderNumber')}
          >
            Order ID
            {sort.field === 'orderNumber' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <button
            className="font-bold font-mono text-xs text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-md transition-colors"
            onClick={() => toggleExpand(row.original.id)}
          >
            {row.original.orderNumber}
          </button>
        ),
        size: 110,
      },
      {
        accessorKey: 'clientName',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('clientName')}
          >
            Client
            {sort.field === 'clientName' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
              {row.original.clientName.charAt(0)}
            </div>
            <span className="font-semibold text-foreground text-xs leading-tight">
              {row.original.clientName}
            </span>
          </div>
        ),
        size: 160,
      },
      {
        accessorKey: 'delegateName',
        header: 'Delegate',
        cell: ({ row }) => <span className="text-xs font-medium text-foreground">{row.original.delegateName}</span>,
        size: 120,
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
        accessorKey: 'items',
        header: 'Items',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium">
            {row.original.items.length} {row.original.items.length === 1 ? 'item' : 'items'}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: 'totalAmount',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('totalAmount')}
          >
            Amount
            {sort.field === 'totalAmount' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-bold text-xs text-foreground tracking-tight">{formatCurrency(row.original.totalAmount)}</span>
        ),
        size: 110,
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
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
        size: 120,
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => <OrderPriorityBadge priority={row.original.priority} />,
        size: 90,
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
            onClick={() => handleSort('createdAt')}
          >
            Date
            {sort.field === 'createdAt' ? (
              sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium">{formatDate(row.original.createdAt)}</span>
        ),
        size: 80,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <OrderActions
            orderId={row.original.id}
            status={row.original.status}
            onView={(id) => toast.info(`View order ${id}`)}
            onEdit={(id) => toast.info(`Edit order ${id}`)}
            onApprove={(id) => toast.success(`Order ${id} approved`)}
            onReject={(id) => toast.error(`Order ${id} rejected`)}
            onPrint={(id) => toast.info(`Printing order ${id}`)}
            onDelete={(id) => toast.success(`Order ${id} deleted`)}
            onDuplicate={(id) => toast.info(`Duplicating order ${id}`)}
          />
        ),
        size: 120,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [sort, handleSort, selectedIds, expandedIds, toggleSelect, selectAll, allPageIds, allSelected, someSelected, toggleExpand]
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
    <Card className="border border-border/40 shadow-xs rounded-2xl overflow-hidden w-full">
      {/* Integrated Combined Header & Filters */}
      <CardHeader className="pb-3 border-b border-border/40 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold tracking-tight">Orders List</CardTitle>
                <Badge variant="secondary" className="rounded-full text-xs font-semibold px-2.5 py-0.5">
                  {processedData.length} Orders
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Search, filter, and manage all orders in real time
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Integrated Filter Component */}
        <div className="pt-2 border-t border-border/30">
          <OrderFilters />
        </div>
      </CardHeader>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary">{selectedIds.size} selected</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground" onClick={clearSelection}>
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium gap-1.5 text-emerald-600 hover:bg-emerald-500/10" onClick={handleBulkApprove}>
              Approve All
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium gap-1.5" onClick={() => toast.info('Exporting...')}>
              <Download className="h-3 w-3" /> Export
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium gap-1.5" onClick={() => toast.info('Printing...')}>
              <Printer className="h-3 w-3" /> Print
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium gap-1.5 text-destructive hover:bg-destructive/10" onClick={handleBulkDelete}>
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </div>
        </div>
      )}

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
                  <TableCell colSpan={columns.length} className="h-28 text-center text-muted-foreground text-xs">
                    No orders found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Expanded Rows */}
        {table.getRowModel().rows.map((row) =>
          expandedIds.has(row.original.id) ? (
            <OrderExpandedRow key={`expanded-${row.id}`} order={row.original} />
          ) : null
        )}

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
            of <strong className="text-foreground font-semibold">{processedData.length}</strong> orders
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
