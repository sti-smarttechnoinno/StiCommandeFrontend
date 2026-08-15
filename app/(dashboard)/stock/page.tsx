'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StockKPICards } from '@/features/stock/components/stock-kpi-cards';
import { StockToolbar } from '@/features/stock/components/stock-toolbar';
import { StockTable } from '@/features/stock/components/stock-table';
import { AnalyticsSidebar } from '@/features/stock/components/analytics-sidebar';
import { RecentActivityTable } from '@/features/stock/components/recent-activity-table';
import { StockMovementModal } from '@/features/stock/components/stock-movement-modal';
import { FloatingActionButton } from '@/features/stock/components/floating-action-button';
import { StockLoadingSkeleton } from '@/features/stock/components/stock-loading-skeleton';
import { StockErrorState } from '@/features/stock/components/stock-error-state';
import { useStockStore } from '@/features/stock/store';
import {
  RefreshCw,
  FileDown,
  Calendar,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function StockPage() {
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const { setMovementModalOpen } = useStockStore();

  if (isLoading) return <StockLoadingSkeleton />;
  if (isError) return <StockErrorState />;

  return (
    <TooltipProvider delay={300}>
      <div className="space-y-6">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-primary font-bold">stock</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Stock Operations</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-none text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(), 'dd MMM yyyy')}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-full border-border/70 text-xs font-semibold bg-card hover:bg-muted/80"
              onClick={() => toast.success('Stock movements exported')}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-full border-border/70 text-xs font-semibold bg-card hover:bg-muted/80"
              onClick={() => toast.success('Stock data refreshed')}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Refresh
            </Button>

            <Button
              size="sm"
              className="h-9 px-4 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => setMovementModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New Stock Movement
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <StockKPICards />

        {/* Integrated Filter Toolbar */}
        <StockToolbar />

        {/* Full-Width Stock Movements Table */}
        <StockTable />

        {/* Bottom 3-Column Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          <AnalyticsSidebar />
        </div>

        {/* Recent Activity Log */}
        <RecentActivityTable />

        {/* Floating Action Button */}
        <FloatingActionButton />

        {/* Stock Movement Modal */}
        <StockMovementModal />
      </div>
    </TooltipProvider>
  );
}
