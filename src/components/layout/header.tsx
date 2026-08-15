'use client';

import { useUIStore } from '@/store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { toggleSidebar, setSidebarMobileOpen } = useUIStore();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 gap-4">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={() => setSidebarMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex" aria-label="Toggle sidebar">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Middle: Search Bar Only */}
      <div className="flex-1 max-w-xl mx-auto px-2">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders, clients, delegates..."
            className="w-full pl-10 pr-16 bg-muted/60 hover:bg-muted focus:bg-background border-border/60 h-10 rounded-full text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20 shadow-inner"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex text-[10px] text-muted-foreground bg-background border border-border rounded-md px-1.5 py-0.5 font-mono shadow-xs">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications, Messages, Dark Mode, User Info Card */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full h-9 w-9" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
            3
          </span>
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full h-9 w-9" aria-label="Messages">
          <MessageSquare className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
            2
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="h-5 w-[1px] bg-border/60 mx-1 hidden sm:block"></div>

        {/* User Information Card */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full border border-border/70 bg-card hover:bg-muted/70 transition-all cursor-pointer outline-none group shadow-xs">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                A
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <span className="block text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                Admin
              </span>
              <span className="block text-[10px] text-muted-foreground font-medium leading-tight">
                Administrator
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 shadow-lg border-border/80">
            <div className="px-3 py-2 border-b border-border/60 mb-1 md:hidden">
              <p className="text-xs font-semibold text-foreground">Admin</p>
              <p className="text-[10px] text-muted-foreground">Administrator</p>
            </div>
            <DropdownMenuItem className="rounded-lg cursor-pointer">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="rounded-lg cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
