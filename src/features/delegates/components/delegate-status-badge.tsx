import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DelegateStatus } from '../types';

export function DelegateStatusBadge({
  status,
  lastActivity,
}: {
  status: DelegateStatus;
  lastActivity?: string;
}) {
  if (status === 'online') {
    return (
      <Badge
        variant="outline"
        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-fit shadow-2xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500 animate-pulse" />
        <span>En ligne</span>
      </Badge>
    );
  }

  if (status === 'busy') {
    return (
      <Badge
        variant="outline"
        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-fit shadow-2xs bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-500" />
        <span>Occupé</span>
      </Badge>
    );
  }

  if (status === 'suspended') {
    return (
      <Badge
        variant="outline"
        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-fit shadow-2xs bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-rose-500" />
        <span>Suspendu</span>
      </Badge>
    );
  }

  let relativeTime = 'Hors ligne';
  if (lastActivity) {
    try {
      const distance = formatDistanceToNow(new Date(lastActivity), {
        addSuffix: true,
        locale: fr,
      });
      const clean = distance
        .replace('environ ', '')
        .replace('il y a ', '');
      relativeTime = `Il y a ${clean}`;
    } catch (_) {}
  }

  return (
    <Badge
      variant="outline"
      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-fit shadow-2xs bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-400/30"
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-400" />
      <span>{relativeTime}</span>
    </Badge>
  );
}
