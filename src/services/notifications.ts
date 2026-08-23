import api from './api';
import type { Notification, Announcement } from '@/features/notifications/types';

export interface NotificationsListParams {
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  region?: string;
  page?: number;
  pageSize?: number;
}

export interface NotificationsListResponse {
  data: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NotificationsKPIMetrics {
  totalNotifications: number;
  unreadCount: number;
  criticalAlerts: number;
  pendingActions: number;
  trends: {
    totalNotifications: number;
    unreadCount: number;
    criticalAlerts: number;
    pendingActions: number;
  };
  sparklines: {
    totalNotifications: number[];
    unreadCount: number[];
    criticalAlerts: number[];
    pendingActions: number[];
  };
}

export interface NotificationsAnalytics {
  categoryDistribution: Array<{ name: string; value: number; color: string }>;
  activitySummary: Array<{ name: string; value: number; color: string }>;
  statusDistribution: Array<{ name: string; value: number; color: string }>;
}

export const notificationsService = {
  async list(params: NotificationsListParams = {}): Promise<NotificationsListResponse> {
    const { data } = await api.get<NotificationsListResponse>('/notifications', { params });
    return data;
  },

  async getKpis(): Promise<NotificationsKPIMetrics> {
    const { data } = await api.get<NotificationsKPIMetrics>('/notifications/kpis');
    return data;
  },

  async getAnalytics(): Promise<NotificationsAnalytics> {
    const { data } = await api.get<NotificationsAnalytics>('/notifications/analytics');
    return data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const { data } = await api.put<{ data: Notification }>(`/notifications/${id}/read`);
    return data.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  async bulkAction(ids: string[], action: 'read' | 'archive' | 'delete'): Promise<void> {
    await api.post('/notifications/bulk', { ids, action });
  },

  async getAnnouncements(): Promise<Announcement[]> {
    const { data } = await api.get<{ data: Announcement[] }>('/notifications/announcements');
    return data.data;
  },

  async createAnnouncement(announcement: { title: string; description?: string; scheduledAt?: string }): Promise<Announcement> {
    const { data } = await api.post<{ data: Announcement }>('/notifications/announcements', announcement);
    return data.data;
  },
};
