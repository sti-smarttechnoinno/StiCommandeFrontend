'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { productsService, type ProductData } from '@/services/products';
import { regionsService } from '@/services/regions';
import { operatorsService, type OperatorData } from '@/services/operators';
import { categoriesService, type CategoryData } from '@/services/categories';
import type { RegionData } from '@/features/regions/types';
import { ProductStatusBadge, CategoryBadge, OperatorBadge } from './product-badges';
import { formatCurrency } from '../utils';
import {
  Package,
  Sparkles,
  ArrowLeft,
  Check,
  RotateCcw,
  DollarSign,
  Barcode,
  Layers,
  AlertCircle,
  Loader2,
  RefreshCw,
  Hash,
  Globe,
  Radio,
  Boxes,
} from 'lucide-react';
import { toast } from 'sonner';

const fetchNextProductCode = async (operator: string, category: string): Promise<string> => {
  try {
    const result = await productsService.list({ pageSize: 1, sortField: 'created_at', sortDirection: 'desc' });
    const count = (result.total || 0) + 1;
    const prefix = `${(operator || 'MOB').slice(0, 3).toUpperCase()}-${(category || 'MOB').slice(0, 3).toUpperCase()}`;
    return `${prefix}-${String(count).padStart(4, '0')}`;
  } catch {
    return 'MOB-MOB-0001';
  }
};

export function CreateProductForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real Database Operators & Categories
  const [operators, setOperators] = useState<OperatorData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [realRegions, setRealRegions] = useState<RegionData[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  // Form fields
  const [sku, setSku] = useState('MOB-MOB-0001');
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [operator, setOperator] = useState('Mobilis');
  const [category, setCategory] = useState('mobile_credit');
  const [nominalPrice, setNominalPrice] = useState<number>(10000);
  const [stockQuantity, setStockQuantity] = useState<number>(50000);
  const [minStock, setMinStock] = useState<number>(1000);
  const [region, setRegion] = useState('All Regions');
  const [status, setStatus] = useState<ProductData['status']>('active');

  useEffect(() => {
    let active = true;

    // Load operators, categories, and regions from backend database
    Promise.all([
      operatorsService.list({ active_only: true }),
      categoriesService.list({ active_only: true }),
      regionsService.list(),
    ])
      .then(([opRes, catRes, regRes]) => {
        if (!active) return;
        if (opRes.data && opRes.data.length > 0) {
          setOperators(opRes.data);
          if (!operator) setOperator(opRes.data[0].name);
        }
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
          if (!category) setCategory(catRes.data[0].slug);
        }
        if (regRes.data) {
          setRealRegions(regRes.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingLookups(false);
      });

    fetchNextProductCode(operator, category).then((code) => {
      if (active) setSku(code);
    });

    return () => {
      active = false;
    };
  }, [operator, category]);

  const handleGenerateCode = async () => {
    const code = await fetchNextProductCode(operator, category);
    setSku(code);
    toast.success(`Generated Product Code: ${code}`);
  };

  const handleResetForm = () => {
    setName('');
    setBarcode('');
    if (operators.length > 0) setOperator(operators[0].name);
    if (categories.length > 0) setCategory(categories[0].slug);
    setNominalPrice(10000);
    setStockQuantity(50000);
    setMinStock(1000);
    setRegion('All Regions');
    setStatus('active');
    setErrors({});
    toast.info('Form reset to defaults');
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Product Name is required';
    if (!sku.trim()) errs.sku = 'SKU / Product Code is required';
    if (nominalPrice < 0) errs.nominalPrice = 'Nominal Price must be 0 or greater';
    if (stockQuantity < 0) errs.stockQuantity = 'Stock quantity cannot be negative';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve highlighted errors before submitting.');
      return;
    }

    setSubmitting(true);
    const newProductPayload: Partial<ProductData> = {
      sku: sku.trim(),
      code: sku.trim(),
      name: name.trim(),
      barcode: barcode.trim() || undefined,
      operator,
      category,
      nominalPrice: Number(nominalPrice) || 0,
      price: Number(nominalPrice) || 0,
      discountPercent: 0,
      stockQuantity: Number(stockQuantity) || 0,
      stock: Number(stockQuantity) || 0,
      minStock: Number(minStock) || 0,
      warehouse: 'Main Warehouse',
      region,
      status,
    };

    try {
      await productsService.create(newProductPayload);
      toast.success(`Product "${name}" added successfully!`);
      router.push('/products');
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || err?.message;
      toast.error(`Error adding product: ${serverMessage || 'Failed to connect to backend server'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Action Toolbar Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Link href="/products" title="Back to Products">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-9 px-3 text-xs font-semibold gap-1.5 bg-card hover:bg-muted text-foreground border-border/70 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Products</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetForm}
            className="gap-2 rounded-full h-9 px-4 font-semibold text-xs bg-card hover:bg-muted text-foreground border-border/70 shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset Form</span>
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            size="sm"
            className="gap-2 rounded-full h-9 px-5 font-bold text-xs bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-foreground" />
                <span>Saving Product...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-primary-foreground" />
                <span>Save Product</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Product Identification */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Product Identification & Operator</CardTitle>
                  <CardDescription className="text-xs">
                    Basic catalog item information, operator classification, and barcoding.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* SKU Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="sku" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-primary" /> SKU / Product Code <span className="text-primary">*</span>
                  </label>
                  <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                    Auto-Formatted
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="ARS-MOB-0001"
                    className="h-10 font-mono font-bold text-sm bg-muted/30 rounded-xl border-border/70 focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateCode}
                    className="h-10 px-3.5 rounded-xl text-xs font-semibold gap-1.5 shrink-0 border-border/70"
                    title="Generate Product Code"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-primary" />
                    <span>Auto</span>
                  </Button>
                </div>
                {errors.sku && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.sku}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Product Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-primary" /> Product Name <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Arselli Mobilis 10000 DA"
                    className={cn(
                      'h-10 text-sm bg-background rounded-xl border-border/70 focus:border-primary focus:ring-primary/20',
                      errors.name && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    )}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* EAN / Barcode */}
                <div className="space-y-2">
                  <label htmlFor="barcode" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Barcode className="h-3.5 w-3.5 text-muted-foreground" /> EAN / Barcode <span className="text-muted-foreground text-[10px]">(Optional)</span>
                  </label>
                  <Input
                    id="barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 6125000000001"
                    className="h-10 font-mono text-sm bg-background rounded-xl border-border/70 focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Telecom Operator Selection (Dynamic from DB) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-emerald-500" /> Telecom Operator <span className="text-primary">*</span>
                  </label>
                  <Select value={operator} onValueChange={(val) => setOperator(val)}>
                    <SelectTrigger className="w-full h-10 min-h-[40px] text-sm font-semibold text-foreground bg-background rounded-xl border-border/70 focus:ring-primary/20 shadow-2xs">
                      <SelectValue placeholder={loadingLookups ? 'Loading operators...' : 'Select operator'} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60 p-1">
                      {operators.map((op) => (
                        <SelectItem key={op.id} value={op.name} className="text-xs font-semibold py-2 rounded-lg cursor-pointer">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: op.color || '#10b981' }} />
                            <span>{op.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Category Selection (Dynamic from DB) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-blue-500" /> Product Category <span className="text-primary">*</span>
                  </label>
                  <Select value={category} onValueChange={(val) => setCategory(val)}>
                    <SelectTrigger className="w-full h-10 min-h-[40px] text-sm font-semibold text-foreground bg-background rounded-xl border-border/70 focus:ring-primary/20 shadow-2xs">
                      <SelectValue placeholder={loadingLookups ? 'Loading categories...' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60 p-1">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug} className="text-xs font-semibold py-2 rounded-lg cursor-pointer">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Catalog Nominal Base Price */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Catalog Nominal Base Price</CardTitle>
                  <CardDescription className="text-xs">
                    Set the base nominal face value in DZD. Commercial delegates select discount percentages (e.g. 4%) when placing orders.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="nominalPrice" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-primary" /> Nominal Price (Base / Face Value in DZD) <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="nominalPrice"
                    type="number"
                    min={0}
                    step={100}
                    value={nominalPrice}
                    onChange={(e) => setNominalPrice(Number(e.target.value))}
                    placeholder="10000"
                    className="h-10 text-sm bg-background rounded-xl border-border/70 focus:border-primary focus:ring-primary/20 font-bold pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                    DA
                  </div>
                </div>
                {errors.nominalPrice && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.nominalPrice}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground block">Delegate Order Pricing Note:</span>
                <p>
                  Commercial delegates in the mobile application choose discount presets (0%, 1.5%, 2.75%, 4%, 5%) during order creation. For example, a 4% discount on {formatCurrency(nominalPrice)} yields a unit selling price of {formatCurrency(Math.round(nominalPrice * 0.96))}.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Stock & Inventory Management */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Stock & Territory Allocation</CardTitle>
                  <CardDescription className="text-xs">
                    Initial stock levels, low stock threshold alert, distribution region scope, and status.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Initial Stock */}
                <div className="space-y-2">
                  <label htmlFor="stockQuantity" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-primary" /> Initial Stock Quantity (Units) <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    placeholder="50000"
                    className="h-10 text-sm bg-background rounded-xl border-border/70 focus:border-primary focus:ring-primary/20 font-bold"
                  />
                </div>

                {/* Min Stock */}
                <div className="space-y-2">
                  <label htmlFor="minStock" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Low Stock Alert Threshold (Min Units)
                  </label>
                  <Input
                    id="minStock"
                    type="number"
                    min={0}
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    placeholder="1000"
                    className="h-10 text-sm bg-background rounded-xl border-border/70 focus:border-primary focus:ring-primary/20 font-medium"
                  />
                </div>
              </div>

              {/* Real Distribution Region Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-emerald-500" /> Distribution Region Scope <span className="text-primary">*</span>
                </label>
                <Select value={region} onValueChange={(val) => setRegion(val)}>
                  <SelectTrigger className="w-full h-10 min-h-[40px] text-sm font-semibold text-foreground bg-background rounded-xl border-border/70 focus:ring-primary/20 shadow-2xs">
                    <SelectValue placeholder={loadingLookups ? 'Loading regions...' : 'Select region scope'} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/60 p-1">
                    <SelectItem value="All Regions" className="text-xs font-semibold py-2 rounded-lg cursor-pointer">
                      🌐 All Regions (National Scope)
                    </SelectItem>
                    {realRegions.length > 0 &&
                      realRegions.map((reg) => (
                        <SelectItem key={reg.id} value={reg.name} className="text-xs font-semibold py-2 rounded-lg cursor-pointer">
                          <span className="flex items-center gap-2">
                            <span>{reg.icon || '🗺️'}</span>
                            <span>{reg.name} Region</span>
                            <span className="text-[10px] text-muted-foreground font-normal">({reg.wilayas?.length || 0} wilayas)</span>
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-foreground">
                  Product Catalog Status <span className="text-primary">*</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(['active', 'inactive', 'draft'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st as any)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all duration-200 cursor-pointer',
                        status === st
                          ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-2xs'
                          : 'border-border/60 bg-background text-muted-foreground hover:bg-muted/60'
                      )}
                    >
                      <ProductStatusBadge product={{ status: st, stock: stockQuantity, minStock } as any} />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Product Card Preview Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <Card className="border-border/70 shadow-sm rounded-2xl overflow-hidden bg-card/90 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold text-foreground">Live Product Card</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                  Preview
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-foreground tracking-tight line-clamp-1">
                      {name.trim() || 'Product Name'}
                    </h3>
                    <p className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block mt-1">
                      {sku}
                    </p>
                  </div>
                  <ProductStatusBadge product={{ status, stock: stockQuantity, minStock } as any} />
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <OperatorBadge operator={operator} />
                  <CategoryBadge category={category} />
                </div>
              </div>

              <div className="h-px bg-border/40" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Nominal Base Price:</span>
                  <span className="font-bold text-sm text-foreground">{formatCurrency(nominalPrice)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Stock Quantity:</span>
                  <span className="font-bold text-foreground">{stockQuantity.toLocaleString()} units</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Region Scope:</span>
                  <Badge variant="outline" className="text-[10px] font-semibold border-border/70 text-foreground bg-muted/30">
                    {region}
                  </Badge>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground block">Mobile App Delegate Orders:</span>
                <p>
                  Delegates will see nominal base price ({formatCurrency(nominalPrice)}) and select their discount rate (e.g. 4%) when placing orders.
                </p>
              </div>
            </CardContent>

            <div className="p-4 bg-muted/40 border-t border-border/40 flex items-center justify-between text-xs">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetForm}
                className="text-xs text-muted-foreground hover:text-foreground h-8"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
                className="gap-2 rounded-xl h-8 px-4 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? <Loader2 className="h-3 w-3 animate-spin text-primary-foreground" /> : <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                <span>Create Product</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
