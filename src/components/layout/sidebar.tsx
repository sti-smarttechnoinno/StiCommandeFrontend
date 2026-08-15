'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/constants';
import { useUIStore } from '@/store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { CheckCircle } from 'lucide-react';

const SYSTEM_STATUS = [
  { label: 'Connected Server', online: true },
  { label: 'API Online', online: true },
  { label: 'Redis Connected', online: true },
  { label: 'PostgreSQL Connected', online: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const collapsed = !isMobile && sidebarCollapsed;

  return (
    <>
      {isMobile && sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-white border-r border-border flex flex-col transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[280px]',
          isMobile
            ? sidebarMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        )}
      >
        {/* Header with Centered Larger Logo & Refined Text */}
        <div className="flex flex-col items-center justify-center text-center px-4 py-6 border-b border-border/40">
          {collapsed ? (
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image
                src="/assets/logo.png"
                alt="ESTSTAR Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-3 w-full">
              {/* Centered Bigger Logo Image */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <Image
                  src="/assets/logo.png"
                  alt="ESTSTAR Logo"
                  width={96}
                  height={96}
                  className="object-contain"
                  priority
                />
              </div>

              {/* Centered Refined Text Below Logo */}
              <div className="text-center">
                <span className="block text-xl font-bold tracking-tight text-foreground leading-none">
                  ESTSTAR
                </span>
                <span className="block text-sm font-semibold text-primary mt-1.5 leading-none">
                  Distribution
                </span>
                <span className="block text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wider mt-2.5">
                  ERP Management System
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={() => isMobile && setSidebarMobileOpen(false)}
              >
                {isActive && (
                  <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                )}
                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : 'opacity-70 group-hover:opacity-100')} />
                {!collapsed && <span>{item.label}</span>}
                {item.badge && !collapsed && (
                  <span className="ml-auto bg-primary text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="h-px bg-border/40 my-3" />

          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  'text-destructive hover:bg-destructive/10'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Status */}
        {!collapsed && (
          <div className="px-5 py-4 border-t border-border/40">
            <div className="space-y-1.5">
              {SYSTEM_STATUS.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
