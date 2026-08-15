'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MOCK_RECENT_REPORTS } from '../mock-data';
import { getStatusColor, getStatusDot, getCategoryColor, getCategoryLabel } from '../utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Eye,
  Download,
  Share2,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  Printer,
  ClipboardList,
} from 'lucide-react';

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-3.5 w-3.5 text-rose-500" />,
  excel: <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />,
  csv: <FileSpreadsheet className="h-3.5 w-3.5 text-blue-500" />,
  print: <Printer className="h-3.5 w-3.5 text-muted-foreground" />,
};

const ROWS_PER_PAGE = 6;

export function RecentReportsTable() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(MOCK_RECENT_REPORTS.length / ROWS_PER_PAGE);
  const paginatedData = MOCK_RECENT_REPORTS.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <Card className="border border-border/40 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden bg-card">
      <CardHeader className="pb-3 border-b border-border/30">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Recent Reports Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10">Report Name</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10">Created By</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10">Date</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10">Category</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10">Format</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground h-10 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((report) => (
                <TableRow key={report.id} className="border-border/20 hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <span className="text-xs font-semibold text-foreground">{report.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground font-medium">{report.createdBy}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground font-medium">{format(new Date(report.createdDate), 'dd MMM yyyy, HH:mm')}</span>
                  </TableCell>
                  <TableCell>
                    <span className={cn('text-[9px] font-semibold px-2 py-0.5 rounded-full', getCategoryColor(report.category))}>
                      {getCategoryLabel(report.category)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {FORMAT_ICONS[report.format]}
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">{report.format}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold', getStatusColor(report.status))}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', getStatusDot(report.status))} />
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg pointer-events-none">
                          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-md">
                        <DropdownMenuItem onClick={() => toast.success('Viewing report')} className="rounded-lg text-xs font-medium cursor-pointer">
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success('Downloading report')} className="rounded-lg text-xs font-medium cursor-pointer">
                          <Download className="h-3.5 w-3.5 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success('Report shared')} className="rounded-lg text-xs font-medium cursor-pointer">
                          <Share2 className="h-3.5 w-3.5 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.error('Report deleted')} className="rounded-lg text-xs font-medium cursor-pointer text-destructive focus:text-destructive">
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/30 text-xs">
          <span className="text-muted-foreground">
            Showing <strong className="text-foreground font-semibold">{page * ROWS_PER_PAGE + 1}</strong> to{' '}
            <strong className="text-foreground font-semibold">{Math.min((page + 1) * ROWS_PER_PAGE, MOCK_RECENT_REPORTS.length)}</strong> of{' '}
            <strong className="text-foreground font-semibold">{MOCK_RECENT_REPORTS.length}</strong> reports
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-lg border-border/60"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={page === i ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'h-7 w-7 p-0 rounded-lg text-[10px] font-semibold',
                  page === i ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'
                )}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-lg border-border/60"
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
