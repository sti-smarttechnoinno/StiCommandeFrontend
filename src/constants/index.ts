import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  UserPlus,
  Package,
  Globe,
  MapPin,
  BarChart3,
  FileText,
  Bell,
  Settings,
  LogOut,
  HardDrive,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Delegates', href: '/delegates', icon: UserPlus },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Regions', href: '/regions', icon: Globe },
  { label: 'Wilayas', href: '/wilayas', icon: MapPin },
  { label: 'Stock', href: '/stock', icon: HardDrive },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Users', href: '/users', icon: FileText },
  { label: 'Notifications', href: '/notifications', icon: Bell, badge: 5 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: 'Logout', href: '/logout', icon: LogOut },
];

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#F59E0B' },
  { value: 'validated', label: 'Validated', color: '#22C55E' },
  { value: 'preparing', label: 'Preparing', color: '#2563EB' },
  { value: 'delivered', label: 'Delivered', color: '#8B5CF6' },
  { value: 'rejected', label: 'Rejected', color: '#EF4444' },
  { value: 'cancelled', label: 'Cancelled', color: '#6B7280' },
] as const;

export const PRODUCT_CATEGORIES = [
  { value: 'sim_cards', label: 'SIM Cards' },
  { value: 'mobile_credit', label: 'Mobile Credit' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bundles', label: 'Bundles' },
  { value: 'data_packs', label: 'Data Packs' },
] as const;

export const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'DELEGATE', label: 'Delegate' },
] as const;

export const COLORS = {
  primary: '#D71920',
  primaryHover: '#B81419',
  background: '#F8FAFC',
  cardBg: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#2563EB',
  indigo: '#6366F1',
  purple: '#8B5CF6',
  teal: '#14B8A6',
  cyan: '#06B6D4',
} as const;

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;
