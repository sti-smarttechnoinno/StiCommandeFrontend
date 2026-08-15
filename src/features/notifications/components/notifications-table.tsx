'use client';

import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender, type ColumnDef, type SortingState } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MOCK_NOTIFICATIONS } from '../mock-data';
import { useNotificationsStore } from '../store';
import { getCategoryColor, getPriorityColor, getStatusColor, getStatusDot, getStatusLabel } from '../utils';
import { toast } from 'sonner';
import { Eye, Archive, CheckCircle2, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

export function NotificationsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { searchQuery, setDetailsDrawerOpen } = useNotificationsStore();

  const filteredData = useMemo(() => {
    let data = [...MOCK_NOTIFICATIONS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.user.toLowerCase().includes(q));
    }
    return data;
  }, [searchQuery]);

  const columns = useMemo<ColumnDef<typeof MOCK_NOTIFICATIONS[0]>[]>(
    () => [
      {
        accessorKey: 'timestamp',
        header: 'Time',
        cell: ({ getValue }) => {
          const d = new Date(getValue() as string);
          return <span className="text-[11px] text-muted-foreground font-medium">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>;
        },
        size: 80,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ getValue }) => {
          const cat = getValue() as string;
          return (
            <Badge variant="ghost" className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full', getCategoryColor(cat as any))}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Badge>
          );
        },
        size: 100,
      },
      {
        accessorKey: 'title',
        header: 'Notification',
        cell: ({ row }) => (
          <div className="max-w-[280px]">
            <span className="text-xs font-semibold text-foreground line-clamp-1">{row.original.title}</span>
            <span className="text-[10px] text-muted-foreground line-clamp-1">{row.original.description}</span>
          </div>
        ),
        size: 300,
      },
      {
        accessorKey: 'user',
        header: 'User',
        cell: ({ getValue }) => <span className="text-xs text-foreground font-medium">{getValue() as string}</span>,
        size: 120,
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ getValue }) => {
          const p = getValue() as string;
          return (
            <Badge variant="outline" className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full border-0', getPriorityColor(p as any))}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Badge>
          );
        },
        size: 90,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const s = getValue() as string;
          return (
            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold', getStatusColor(s as any))}>
              <span className={cn('w-1.5 h-1.5 rounded-full', getStatusDot(s as any))} />
              {getStatusLabel(s as any)}
            </span>
          );
        },
        size: 90,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setDetailsDrawerOpen(true, row.original.id)}>
                <Eye className="h-3.5 w-3.5 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Archived')}>
                <Archive className="h-3.5 w-3.5 mr-2" /> Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Resolved')}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Resolve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.error('Deleted')} className="text-rose-600">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 50,
      },
    ],
    [setDetailsDrawerOpen]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-[20px] overflow-hidden bg-card">
      <CardHeader className="pb-3 border-b border-border/30">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Recent Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-border/30 hover:bg-transparent">
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-border/20 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setDetailsDrawerOpen(true, row.original.id)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4" onClick={(e) => cell.column.id === 'actions' ? e.stopPropagation() : undefined}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/30">
          <span className="text-[11px] text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of {filteredData.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg border-border/60" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <Button key={i} variant={table.getState().pagination.pageIndex === i ? 'default' : 'ghost'} size="sm" className={cn('h-7 w-7 p-0 rounded-lg text-[10px] font-semibold', table.getState().pagination.pageIndex === i ? 'bg-[#D71920] text-white' : 'text-muted-foreground')} onClick={() => table.setPageIndex(i)}>
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg border-border/60" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
