'use client';

import { create } from 'zustand';
import type { NotificationsState } from '../types';

export const useNotificationsStore = create<NotificationsState>((set) => ({
  searchQuery: '',
  selectedCategory: '',
  selectedPriority: '',
  selectedStatus: '',
  selectedRegion: '',
  selectedDelegate: '',
  selectedDateRange: '',
  selectedNotifications: new Set<string>(),
  isDetailsDrawerOpen: false,
  isAnnouncementDialogOpen: false,
  selectedNotificationId: null,
  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedPriority: (selectedPriority) => set({ selectedPriority }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
  setSelectedDelegate: (selectedDelegate) => set({ selectedDelegate }),
  setSelectedDateRange: (selectedDateRange) => set({ selectedDateRange }),
  toggleNotificationSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedNotifications);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedNotifications: next };
    }),
  selectAllNotifications: (ids) =>
    set((state) => {
      const allSelected = ids.every((id) => state.selectedNotifications.has(id));
      return { selectedNotifications: allSelected ? new Set<string>() : new Set(ids) };
    }),
  clearSelection: () => set({ selectedNotifications: new Set<string>() }),
  setDetailsDrawerOpen: (isDetailsDrawerOpen, id) =>
    set({ isDetailsDrawerOpen, selectedNotificationId: id || null }),
  setAnnouncementDialogOpen: (isAnnouncementDialogOpen) => set({ isAnnouncementDialogOpen }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: '',
      selectedPriority: '',
      selectedStatus: '',
      selectedRegion: '',
      selectedDelegate: '',
      selectedDateRange: '',
    }),
}));
