'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usersService } from '@/services/users';
import { getRoleColor, getRoleLabel, getStatusColor } from '@/features/users/utils';
import {
  Calendar,
  UserPlus,
  User,
  Mail,
  Phone,
  Shield,
  Building2,
  Lock,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const DEFAULT_PASSWORD = 'EstStar2026!';

export default function NewUserPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('Friday, July 31, 2026');
  const [submitting, setSubmitting] = useState(false);

  // Form Fields (Only for system users, no territory/delegates)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('administrator');
  const [department, setDepartment] = useState('Commercial Operations');
  const [status, setStatus] = useState('offline');
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [forcePasswordChange, setForcePasswordChange] = useState(true);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(format(new Date(), 'EEEE, MMMM d, yyyy'));
  }, []);

  if (!mounted) return null;

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setEmployeeId('');
    setRole('administrator');
    setDepartment('Commercial Operations');
    setStatus('offline');
    setPassword(DEFAULT_PASSWORD);
    setShowPassword(false);
    setForcePasswordChange(true);
    toast.info('Form reset to default values');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !role) {
      toast.error('Please fill in all required fields (Full Name, Email, and Role)');
      return;
    }

    setSubmitting(true);

    try {
      await usersService.create({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        employeeId: employeeId.trim(),
        role: role as any,
        department: department.trim(),
        status: status as any,
      });

      toast.success('User Account Created Successfully!', {
        description: `${fullName} has been registered as ${role}.`,
      });

      router.push('/users');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create user account';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const avatarInitials = fullName.trim()
    ? fullName
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'NU';

  return (
    <div className="space-y-8 pb-10">
      {/* Top Breadcrumb & Page Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/users" className="text-muted-foreground text-xs capitalize hover:text-foreground transition-colors">
                  Users
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/users/new" className="text-foreground text-xs font-semibold capitalize">
                  New User
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Add New User Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Onboard new platform user (Administrator, Manager, or Viewer) into ESTSTAR system.
              </p>
            </div>
          </div>
        </div>

        {/* Date Badge */}
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground bg-card/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-border/70 shadow-xs">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Main 2-Column Grid (8 cols Left + 4 cols Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card 1: Personal Information */}
            <Card className="border border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Personal Information</CardTitle>
                    <CardDescription className="text-xs">User contact details and identification credentials.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" /> Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Karim Benziane"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 rounded-xl text-xs border-border/60 bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-500" /> Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. k.benziane@eststar.dz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl text-xs border-border/60 bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" /> Phone Number
                  </label>
                  <Input
                    placeholder="e.g. 0550 11 22 33"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 rounded-xl text-xs border-border/60 bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-purple-500" /> Employee ID (Optional)
                  </label>
                  <Input
                    placeholder="EMP-2026-000001 (Auto-generated if empty)"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="h-11 rounded-xl text-xs border-border/60 bg-background font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Role & Access Control (All 3 in Same Line) */}
            <Card className="border border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Role & Access Control</CardTitle>
                    <CardDescription className="text-xs">Assign administrative role, department, and account status in one line.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                  {/* Selector 1: Role */}
                  <div className="space-y-2 w-full">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5 h-5 whitespace-nowrap">
                      <Shield className="h-3.5 w-3.5 text-primary shrink-0" /> Account Role *
                    </label>
                    <Select value={role} onValueChange={(v) => setRole(v ?? 'administrator')}>
                      <SelectTrigger className="!h-11 data-[size=default]:!h-11 rounded-xl border-border/60 text-xs bg-background w-full px-3.5 font-medium flex items-center justify-between shadow-xs">
                        <SelectValue placeholder="Select system role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/60 shadow-lg">
                        <SelectItem value="administrator" className="text-xs font-medium cursor-pointer py-2">
                          Administrator (Full Access)
                        </SelectItem>
                        <SelectItem value="manager" className="text-xs font-medium cursor-pointer py-2">
                          Manager (Operational Control)
                        </SelectItem>
                        <SelectItem value="viewer" className="text-xs font-medium cursor-pointer py-2">
                          Viewer (Read-Only Access)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selector 2: Department */}
                  <div className="space-y-2 w-full">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5 h-5 whitespace-nowrap">
                      <Building2 className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Department
                    </label>
                    <Input
                      placeholder="e.g. Commercial Operations"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="!h-11 rounded-xl text-xs border-border/60 bg-background w-full font-medium shadow-xs"
                    />
                  </div>

                  {/* Selector 3: Initial Status */}
                  <div className="space-y-2 w-full">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5 h-5 whitespace-nowrap">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Account Status
                    </label>
                    <Select value={status} onValueChange={(v) => setStatus(v ?? 'online')}>
                      <SelectTrigger className="!h-11 data-[size=default]:!h-11 rounded-xl border-border/60 text-xs bg-background w-full px-3.5 font-medium flex items-center justify-between shadow-xs">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/60 shadow-lg">
                        <SelectItem value="online" className="text-xs font-medium cursor-pointer py-2">
                          Online / Active
                        </SelectItem>
                        <SelectItem value="offline" className="text-xs font-medium cursor-pointer py-2">
                          Offline
                        </SelectItem>
                        <SelectItem value="invited" className="text-xs font-medium cursor-pointer py-2">
                          Invited
                        </SelectItem>
                        <SelectItem value="locked" className="text-xs font-medium cursor-pointer py-2">
                          Locked
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Security & Password */}
            <Card className="border border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Security & Initial Password</CardTitle>
                    <CardDescription className="text-xs">Set temporary login password and force first login change policy.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2 max-w-md">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-rose-500" /> Temporary Password
                    </label>
                    <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/10 text-primary border-primary/20">
                      Default: {DEFAULT_PASSWORD}
                    </Badge>
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="!h-11 rounded-xl text-xs border-border/60 bg-background pr-10 font-mono shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                    <span>Assigned initial password: <code className="font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">{DEFAULT_PASSWORD}</code></span>
                    <button
                      type="button"
                      onClick={() => {
                        setPassword(DEFAULT_PASSWORD);
                        toast.success(`Reset to default password: ${DEFAULT_PASSWORD}`);
                      }}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-muted/20 max-w-md">
                  <Checkbox
                    id="forcePass"
                    checked={forcePasswordChange}
                    onCheckedChange={(val) => setForcePasswordChange(val === true)}
                  />
                  <label htmlFor="forcePass" className="text-xs font-semibold text-foreground cursor-pointer">
                    Force user to change password on first login
                  </label>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Column: Live User Preview Sidebar (4 cols sticky) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <Card className="border border-border/60 shadow-md rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold text-foreground">User Live Preview</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary bg-primary/10">
                  Draft Preview
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Avatar & Main Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-primary/15 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xl font-bold">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground leading-tight">
                    {fullName.trim() || 'New User'}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {employeeId.trim() || 'EMP-2026-AUTO'}
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", getRoleColor(role as any))}>
                      {getRoleLabel(role as any)}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[10px] font-bold capitalize", getStatusColor(status as any))}>
                      {status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/40 w-full" />

              {/* Summary Details */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-500" /> Email:
                  </span>
                  <span className="font-semibold text-foreground truncate max-w-[160px]">
                    {email.trim() || 'user@eststar.dz'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" /> Phone:
                  </span>
                  <span className="font-semibold text-foreground">
                    {phone.trim() || '0550 00 00 00'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-amber-500" /> Department:
                  </span>
                  <span className="font-semibold text-foreground">
                    {department}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" /> Role Type:
                  </span>
                  <span className="font-semibold text-foreground capitalize">{role}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !fullName || !email || !role}
                  className="w-full h-11 rounded-xl font-bold text-xs bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary-foreground" />
                      Creating User...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User Account
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full h-10 rounded-xl font-semibold text-xs border-border/70 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-2" />
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
