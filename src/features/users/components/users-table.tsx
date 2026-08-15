'use client';

import { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender, type ColumnDef, type SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MOCK_USERS } from '../mock-data';
import { useUsersStore } from '../store';
import { getRoleColor, getRoleLabel, getStatusColor, getStatusDot, getStatusLabel, getAvatarColor } from '../utils';
import { toast } from 'sonner';
import { Eye, Pencil, KeyRound, Lock, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown, Shield } from 'lucide-react';

export function UsersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { searchQuery, selectedUsers, toggleUserSelection, selectAllUsers, setDetailsDrawerOpen } = useUsersStore();

  const filteredData = useMemo(() => {
    let data = [...MOCK_USERS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.employeeId.toLowerCase().includes(q));
    }
    return data;
  }, [searchQuery]);

  const allIds = filteredData.map((u) => u.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedUsers.has(id));

  const columns = useMemo<ColumnDef<typeof MOCK_USERS[0]>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox checked={allSelected} onCheckedChange={() => selectAllUsers(allIds)} />
        ),
        cell: ({ row }) => (
          <Checkbox checked={selectedUsers.has(row.original.id)} onCheckedChange={() => toggleUserSelection(row.original.id)} />
        ),
        size: 40,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <button className="flex items-center gap-1 font-bold hover:text-foreground" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            User <ArrowUpDown className="h-3 w-3 opacity-40" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/40">
              <AvatarFallback className={cn('text-xs font-bold', getAvatarColor(row.index))}>
                {row.original.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="block text-xs font-semibold text-foreground">{row.original.name}</span>
              <span className="block text-[11px] text-muted-foreground">{row.original.email}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'employeeId',
        header: 'Employee ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {row.original.employeeId}
          </span>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <span className={cn('text-[9px] font-semibold px-2.5 py-0.5 rounded-full', getRoleColor(row.original.role))}>
            {getRoleLabel(row.original.role)}
          </span>
        ),
      },
      {
        accessorKey: 'wilaya',
        header: 'Territory / Wilaya',
        cell: ({ row }) => (
          <div className="text-xs font-medium text-foreground">
            {row.original.wilaya || 'Central Headquarters'}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold', getStatusColor(row.original.status))}>
            <span className={cn('w-1.5 h-1.5 rounded-full', getStatusDot(row.original.status))} />
            {getStatusLabel(row.original.status)}
          </span>
        ),
      },
      {
        accessorKey: 'twoFactorEnabled',
        header: '2FA',
        cell: ({ row }) => (
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', row.original.twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground')}>
            {row.original.twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg pointer-events-none">
                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-1 shadow-md">
              <DropdownMenuItem onClick={() => { setDetailsDrawerOpen(true, row.original.id); }} className="rounded-lg text-xs font-medium cursor-pointer">
                <Eye className="h-3.5 w-3.5 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Editing user')} className="rounded-lg text-xs font-medium cursor-pointer">
                <Pencil className="h-3.5 w-3.5 mr-2" /> Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Password reset initiated')} className="rounded-lg text-xs font-medium cursor-pointer">
                <KeyRound className="h-3.5 w-3.5 mr-2" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Account locked')} className="rounded-lg text-xs font-medium cursor-pointer">
                <Lock className="h-3.5 w-3.5 mr-2" /> Lock Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.error('User deleted')} className="rounded-lg text-xs font-medium cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 50,
      },
    ],
    [allSelected, allIds, selectedUsers, toggleUserSelection, selectAllUsers, setDetailsDrawerOpen]
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
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden bg-card">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>Enterprise Users Directory</span>
          </CardTitle>
          {selectedUsers.size > 0 && (
            <Badge variant="ghost" className="bg-primary/10 text-primary border-none text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {selectedUsers.size} Selected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
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
                <TableRow key={row.id} className={cn('border-border/20 hover:bg-muted/30 transition-colors cursor-pointer', selectedUsers.has(row.original.id) && 'bg-primary/5')} onClick={() => setDetailsDrawerOpen(true, row.original.id)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 px-4 align-middle" onClick={(e) => cell.column.id === 'select' || cell.column.id === 'actions' ? e.stopPropagation() : undefined}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/30 text-xs">
          <span className="text-muted-foreground">
            Showing <strong className="text-foreground font-semibold">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</strong> to{' '}
            <strong className="text-foreground font-semibold">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)}</strong> of{' '}
            <strong className="text-foreground font-semibold">{filteredData.length}</strong> users
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg border-border/60" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <Button key={i} variant={table.getState().pagination.pageIndex === i ? 'default' : 'ghost'} size="sm" className={cn('h-7 w-7 p-0 rounded-lg text-[10px] font-semibold', table.getState().pagination.pageIndex === i ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground')} onClick={() => table.setPageIndex(i)}>
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
