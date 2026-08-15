'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useStockStore } from '../store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDown, ArrowUp, RefreshCw, Sliders, X } from 'lucide-react';
import { toast } from 'sonner';

const MOVEMENT_TYPES = [
  { value: 'incoming', label: 'Incoming', icon: <ArrowDown className="h-4 w-4" />, color: 'text-emerald-600' },
  { value: 'outgoing', label: 'Outgoing', icon: <ArrowUp className="h-4 w-4" />, color: 'text-rose-600' },
  { value: 'transfer', label: 'Transfer', icon: <RefreshCw className="h-4 w-4" />, color: 'text-blue-600' },
  { value: 'adjustment', label: 'Adjustment', icon: <Sliders className="h-4 w-4" />, color: 'text-amber-600' },
];

const WAREHOUSES = ['Setif Central', 'Alger Main', 'Oran Warehouse', 'Constantine Hub', 'Batna Depot'];

export function StockMovementModal() {
  const { isMovementModalOpen, setMovementModalOpen } = useStockStore();
  const [movementType, setMovementType] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    toast.success('Stock movement recorded', {
      description: `${movementType} of ${quantity} units from ${warehouse}`,
    });
    setMovementModalOpen(false);
    setMovementType('');
    setWarehouse('');
    setProduct('');
    setQuantity('');
    setReference('');
    setNotes('');
  };

  return (
    <Dialog open={isMovementModalOpen} onOpenChange={setMovementModalOpen}>
      <DialogContent className="max-w-[720px] rounded-[28px] p-0 overflow-hidden">
        <DialogHeader className="px-8 pt-8 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">New Stock Movement</DialogTitle>
            <button
              onClick={() => setMovementModalOpen(false)}
              className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-6">
          {/* Movement Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Movement Type</label>
            <div className="grid grid-cols-4 gap-3">
              {MOVEMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMovementType(type.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                    movementType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border/40 hover:border-border/60 hover:bg-muted/30'
                  )}
                >
                  <span className={cn(type.color)}>{type.icon}</span>
                  <span className="text-xs font-semibold text-foreground">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Warehouse & Product */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Warehouse</label>
              <Select value={warehouse} onValueChange={(v) => setWarehouse(v ?? '')}>
                <SelectTrigger className="h-12 rounded-xl border-border/60">
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {WAREHOUSES.map((wh) => (
                    <SelectItem key={wh} value={wh}>{wh}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Product</label>
              <Input
                placeholder="Search product..."
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="h-12 rounded-xl border-border/60"
              />
            </div>
          </div>

          {/* Quantity & Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-12 rounded-xl border-border/60"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reference Number</label>
              <Input
                placeholder="Auto-generated or custom"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="h-12 rounded-xl border-border/60"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <Input
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-12 rounded-xl border-border/60"
            />
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-0">
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl text-sm font-semibold border-border/60"
              onClick={() => setMovementModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl text-sm font-semibold bg-[#D71920] hover:bg-[#B81419] text-white shadow-lg shadow-[#D71920]/20"
              onClick={handleSubmit}
              disabled={!movementType || !warehouse || !quantity}
            >
              Confirm Movement
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
