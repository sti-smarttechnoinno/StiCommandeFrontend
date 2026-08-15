import { create } from 'zustand';

interface AuthState {
  user: { id: string; name: string; email: string; role: string; avatar?: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthState['user'], token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token, refreshToken) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
}));

interface DashboardState {
  dateRange: '7' | '30' | '90' | '365';
  setDateRange: (range: DashboardState['dateRange']) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dateRange: '30',
  setDateRange: (range) => set({ dateRange: range }),
}));
