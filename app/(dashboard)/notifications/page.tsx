'use client';

import { NotificationsHeader } from '@/features/notifications/components/notifications-header';
import { NotificationsKPICards } from '@/features/notifications/components/notifications-kpi-cards';
import { NotificationsToolbar } from '@/features/notifications/components/notifications-toolbar';
import { NotificationFeed } from '@/features/notifications/components/notification-feed';
import { CategoryChartCard } from '@/features/notifications/components/category-chart-card';
import { ActivitySummaryCard } from '@/features/notifications/components/activity-summary-card';
import { NotificationStatusCard } from '@/features/notifications/components/notification-status-card';
import { AnnouncementsCard } from '@/features/notifications/components/announcements-card';
import { QuickActionsCard } from '@/features/notifications/components/quick-actions-card';
import { NotificationsTable } from '@/features/notifications/components/notifications-table';
import { NotificationDetailsDrawer } from '@/features/notifications/components/notification-details-drawer';
import { CreateAnnouncementDialog } from '@/features/notifications/components/create-announcement-dialog';
import { FloatingActionButton } from '@/features/notifications/components/floating-action-button';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function NotificationsPage() {
  return (
    <TooltipProvider delay={300}>
      <div className="space-y-6">
        {/* Page Hero Header */}
        <NotificationsHeader />

        {/* KPI Cards */}
        <NotificationsKPICards />

        {/* Integrated Filter Toolbar */}
        <NotificationsToolbar />

        {/* Main Grid: Left Notification Feed & Table + Right Sticky Analytics Side Components */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Left Column: Feeds & Table */}
          <div className="space-y-6">
            <NotificationFeed />
            <NotificationsTable />
          </div>

          {/* Right Column: Sticky Side Components (moves smoothly when scrolling) */}
          <div className="sticky top-20 self-start space-y-5">
            <CategoryChartCard />
            <ActivitySummaryCard />
            <NotificationStatusCard />
            <AnnouncementsCard />
            <QuickActionsCard />
          </div>
        </div>

        {/* Notification Details Drawer */}
        <NotificationDetailsDrawer />

        {/* Create Announcement Dialog */}
        <CreateAnnouncementDialog />

        {/* Floating Action Button */}
        <FloatingActionButton />
      </div>
    </TooltipProvider>
  );
}
