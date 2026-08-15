'use client';

import { create } from 'zustand';
import type { UsersState } from '../types';

export const useUsersStore = create<UsersState>((set) => ({
  searchQuery: '',
  selectedRole: '',
  selectedRegion: '',
  selectedWilaya: '',
  selectedStatus: '',
  selectedLastLogin: '',
  selectedTwoFactor: '',
  selectedUsers: new Set<string>(),
  isNewUserDialogOpen: false,
  isDetailsDrawerOpen: false,
  selectedUserId: null,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
  setSelectedWilaya: (selectedWilaya) => set({ selectedWilaya }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  setSelectedLastLogin: (selectedLastLogin) => set({ selectedLastLogin }),
  setSelectedTwoFactor: (selectedTwoFactor) => set({ selectedTwoFactor }),
  toggleUserSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedUsers);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedUsers: next };
    }),
  selectAllUsers: (ids) =>
    set((state) => {
      const allSelected = ids.every((id) => state.selectedUsers.has(id));
      return { selectedUsers: allSelected ? new Set<string>() : new Set(ids) };
    }),
  clearSelection: () => set({ selectedUsers: new Set<string>() }),
  setNewUserDialogOpen: (isNewUserDialogOpen) => set({ isNewUserDialogOpen }),
  setDetailsDrawerOpen: (isDetailsDrawerOpen, userId) =>
    set({ isDetailsDrawerOpen, selectedUserId: userId || null }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedRole: '',
      selectedRegion: '',
      selectedWilaya: '',
      selectedStatus: '',
      selectedLastLogin: '',
      selectedTwoFactor: '',
    }),
}));
