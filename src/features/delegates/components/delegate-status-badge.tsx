import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DelegateStatus } from '../types';

const STATUS_CONFIG: Record<DelegateStatus, { label: string; style: string; dot: string }> = {
  online: {
    label: 'Online',
    style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  busy: {
    label: 'Busy',
    style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  offline: {
    label: 'Offline',
    style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
  suspended: {
    label: 'Suspended',
    style: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

export function DelegateStatusBadge({ status }: { status: DelegateStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Badge
      variant="ghost"
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit border-none shadow-2xs',
        cfg.style
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      <span>{cfg.label}</span>
    </Badge>
  );
}
