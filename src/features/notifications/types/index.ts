export type NotificationCategory = 'orders' | 'stock' | 'delegates' | 'clients' | 'reports' | 'security' | 'system' | 'finance';
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';
export type NotificationStatus = 'unread' | 'read' | 'resolved' | 'archived';

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  user: string;
  region: string;
  module: string;
  referenceId?: string;
  timestamp: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  status: 'scheduled' | 'published' | 'draft';
}

export interface NotificationsState {
  searchQuery: string;
  selectedCategory: string;
  selectedPriority: string;
  selectedStatus: string;
  selectedRegion: string;
  selectedDelegate: string;
  selectedDateRange: string;
  selectedNotifications: Set<string>;
  isDetailsDrawerOpen: boolean;
  isAnnouncementDialogOpen: boolean;
  selectedNotificationId: string | null;
  refreshKey: number;
  triggerRefresh: () => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  setSelectedPriority: (p: string) => void;
  setSelectedStatus: (s: string) => void;
  setSelectedRegion: (r: string) => void;
  setSelectedDelegate: (d: string) => void;
  setSelectedDateRange: (d: string) => void;
  toggleNotificationSelection: (id: string) => void;
  selectAllNotifications: (ids: string[]) => void;
  clearSelection: () => void;
  setDetailsDrawerOpen: (open: boolean, id?: string) => void;
  setAnnouncementDialogOpen: (open: boolean) => void;
  resetFilters: () => void;
}
