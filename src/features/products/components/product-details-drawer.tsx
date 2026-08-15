'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatCurrency, formatFullCurrency, formatFullDate, getStockBarColor } from '../utils';
import { ProductStatusBadge, CategoryBadge, OperatorBadge } from './product-badges';
import { mockProducts } from '../mock-data';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { X, Package, Tag, DollarSign, BarChart3, ShoppingCart, Clock, Pencil, ArrowRightLeft, DollarSign as DollarIcon, Ban } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProductDetailsDrawerProps {
  productId: string | null;
  onClose: () => void;
}

export function ProductDetailsDrawer({ productId, onClose }: ProductDetailsDrawerProps) {
  const product = mockProducts.find((p) => p.id === productId);

  if (!product) return null;

  const stockPercent = product.minStock > 0 ? Math.min((product.stock / (product.minStock * 10)) * 100, 100) : 100;
  const available = product.stock - product.reserved;

  return (
    <Drawer open={!!productId} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="w-[450px] max-w-[450px]">
        <DrawerHeader className="border-b border-border/40 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 rounded-2xl bg-primary/10">
                <AvatarFallback className="text-primary text-lg font-bold rounded-2xl">
                  <Package className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <DrawerTitle className="text-lg font-bold text-foreground">{product.name}</DrawerTitle>
                <div className="flex items-center gap-2 mt-1">
                  <OperatorBadge operator={product.operator} />
                  <CategoryBadge category={product.category} />
                </div>
              </div>
            </div>
            <DrawerClose className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center">
              <X className="h-4 w-4" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Product Status */}
          <div className="flex items-center gap-3">
            <ProductStatusBadge product={product} />
            <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
            <span className="text-xs text-muted-foreground">Barcode: {product.barcode}</span>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30">
                <span className="text-[10px] text-muted-foreground block mb-0.5">Category</span>
                <span className="text-sm font-semibold text-foreground">{product.category.replace(/_/g, ' ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <span className="text-[10px] text-muted-foreground block mb-0.5">Operator</span>
                <span className="text-sm font-semibold text-foreground">{product.operator}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <span className="text-[10px] text-muted-foreground block mb-0.5">Warehouse</span>
                <span className="text-sm font-semibold text-foreground">{product.warehouse}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <span className="text-[10px] text-muted-foreground block mb-0.5">Created</span>
                <span className="text-sm font-semibold text-foreground">{formatFullDate(product.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Pricing</h4>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-border/40 shadow-xs rounded-xl">
                <CardContent className="p-3 text-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-lg font-bold text-foreground block">{formatCurrency(product.faceValue)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Face Value</span>
                </CardContent>
              </Card>
              <Card className="border border-border/40 shadow-xs rounded-xl">
                <CardContent className="p-3 text-center">
                  <Tag className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-lg font-bold text-foreground block">{formatCurrency(product.sellingPrice)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Selling Price</span>
                </CardContent>
              </Card>
              <Card className="border border-border/40 shadow-xs rounded-xl">
                <CardContent className="p-3 text-center">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">{product.margin}%</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Margin</span>
                </CardContent>
              </Card>
              <Card className="border border-border/40 shadow-xs rounded-xl">
                <CardContent className="p-3 text-center">
                  <span className="text-lg font-bold text-foreground block">{formatCurrency(product.profit)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Profit / Unit</span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Inventory</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Current Stock</span>
                <span className="text-sm font-bold text-foreground">{product.stock.toLocaleString()}</span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-500', getStockBarColor(product.stock, product.minStock))}
                  style={{ width: `${stockPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 rounded-lg bg-muted/30 text-center">
                  <span className="text-[10px] text-muted-foreground block">Reserved</span>
                  <span className="text-sm font-semibold text-foreground">{product.reserved}</span>
                </div>
                <div className="p-2 rounded-lg bg-muted/30 text-center">
                  <span className="text-[10px] text-muted-foreground block">Available</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{available}</span>
                </div>
                <div className="p-2 rounded-lg bg-muted/30 text-center">
                  <span className="text-[10px] text-muted-foreground block">Min Stock</span>
                  <span className="text-sm font-semibold text-foreground">{product.minStock}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Sales</h4>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-border/40 shadow-xs rounded-xl">
                <CardContent className="p-3 text-center">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-lg font-bold text-foreground block">{product.totalSold.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Units Sold</span>
                </CardContent>
              </Card>
              <Card className="border border-border/40 shadow-xs rounded-xl">
                <CardContent className="p-3 text-center">
                  <BarChart3 className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-lg font-bold text-foreground block">{formatFullCurrency(product.revenue)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Revenue</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border/40 p-4 flex items-center gap-2">
          <Button className="flex-1 h-10 rounded-xl text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Pencil className="h-3.5 w-3.5" /> Edit Product
          </Button>
          <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-semibold gap-1.5 border-border/60">
            <ArrowRightLeft className="h-3.5 w-3.5" /> Adjust Stock
          </Button>
          <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-semibold gap-1.5 border-border/60">
            <DollarIcon className="h-3.5 w-3.5" /> Update Price
          </Button>
          <Button variant="outline" className="h-10 w-10 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10">
            <Ban className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
