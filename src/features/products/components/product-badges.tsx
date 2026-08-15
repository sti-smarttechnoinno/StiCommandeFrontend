import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ProductStatus, ExtendedProduct } from '../types';

const STATUS_CONFIG: Record<ProductStatus, { label: string; style: string; dot: string }> = {
  active: {
    label: 'Active',
    style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  low_stock: {
    label: 'Low Stock',
    style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  draft: {
    label: 'Draft',
    style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
  out_of_stock: {
    label: 'Out of Stock',
    style: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

function getProductStatus(product: ExtendedProduct): ProductStatus {
  if (product.stock === 0) return 'out_of_stock';
  if (product.stock < product.minStock) return 'low_stock';
  if (product.status === 'inactive') return 'draft';
  return 'active';
}

export function ProductStatusBadge({ product }: { product: ExtendedProduct }) {
  const status = getProductStatus(product);
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

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  mobile_credit: { label: 'Mobile Credit', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
  sim_cards: { label: 'SIM Card', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  scratch_cards: { label: 'Scratch Card', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  accessories: { label: 'Accessory', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  data_packs: { label: 'Data Pack', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
  voice_packages: { label: 'Voice Pack', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
  sms_packages: { label: 'SMS Pack', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10' },
};

export function CategoryBadge({ category }: { category: string }) {
  const cfg = CATEGORY_CONFIG[category] || { label: category, color: 'text-slate-600', bg: 'bg-slate-500/10' };
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border-none w-fit', cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  );
}

const OPERATOR_CONFIG: Record<string, { color: string; bg: string }> = {
  Mobilis: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  Ooredoo: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
  Djezzy: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  '-': { color: 'text-slate-600', bg: 'bg-slate-500/10' },
};

export function OperatorBadge({ operator }: { operator: string }) {
  const cfg = OPERATOR_CONFIG[operator] || OPERATOR_CONFIG['-'];
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold border-none w-fit', cfg.bg, cfg.color)}>
      {operator}
    </span>
  );
}
