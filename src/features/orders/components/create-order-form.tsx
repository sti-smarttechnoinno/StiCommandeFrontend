'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { clientsService, type ClientData } from '@/services/clients';
import { productsService, type ProductData } from '@/services/products';
import { ordersService } from '@/services/orders';
import { formatCurrency } from '../utils';
import {
  User,
  Package,
  MapPin,
  FileText,
  ArrowLeft,
  Check,
  RotateCcw,
  AlertCircle,
  Loader2,
  Sparkles,
  ShoppingBag,
  Plus,
  Trash2,
  DollarSign,
  Globe,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItemRow {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export function CreateOrderForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Reference Data
  const [clients, setClients] = useState<ClientData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);

  // Form State
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    setLoadingData(true);

    Promise.all([
      clientsService.list({ pageSize: 100 }),
      productsService.list({ pageSize: 100 }),
    ])
      .then(([clientsRes, productsRes]) => {
        if (!active) return;
        const loadedClients = clientsRes.data || [];
        const loadedProducts = productsRes.data || [];
        setClients(loadedClients);
        setProducts(loadedProducts);

        // Auto select first client if available
        if (loadedClients.length > 0) {
          setSelectedClientId(loadedClients[0].id);
        }

        // Initialize 1 default product row
        if (loadedProducts.length > 0) {
          const firstProd = loadedProducts[0];
          setItems([
            {
              id: String(Date.now()),
              productId: firstProd.id,
              productName: firstProd.name,
              sku: firstProd.sku || firstProd.code || 'SKU-001',
              quantity: 10,
              unitPrice: Number(firstProd.sellingPrice || firstProd.nominalPrice || firstProd.price || 0),
            },
          ]);
        }
      })
      .catch(() => {
        if (active) toast.error('Failed to load clients and products directory.');
      })
      .finally(() => {
        if (active) setLoadingData(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleAddRow = () => {
    const firstProd = products[0];
    if (!firstProd) return;

    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        productId: firstProd.id,
        productName: firstProd.name,
        sku: firstProd.sku || firstProd.code || 'SKU-001',
        quantity: 1,
        unitPrice: Number(firstProd.sellingPrice || firstProd.nominalPrice || firstProd.price || 0),
      },
    ]);
  };

  const handleRemoveRow = (rowId: string) => {
    if (items.length <= 1) {
      toast.warning('An order must contain at least 1 product item.');
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== rowId));
  };

  const handleProductChange = (rowId: string, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === rowId
          ? {
              ...item,
              productId: prod.id,
              productName: prod.name,
              sku: prod.sku || prod.code || 'SKU-001',
              unitPrice: Number(prod.sellingPrice || prod.nominalPrice || prod.price || 0),
            }
          : item
      )
    );
  };

  const handleQuantityChange = (rowId: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === rowId ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const handleUnitPriceChange = (rowId: string, price: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === rowId ? { ...item, unitPrice: Math.max(0, price) } : item
      )
    );
  };

  const handleResetForm = () => {
    if (clients.length > 0) setSelectedClientId(clients[0].id);
    if (products.length > 0) {
      const firstProd = products[0];
      setItems([
        {
          id: String(Date.now()),
          productId: firstProd.id,
          productName: firstProd.name,
          sku: firstProd.sku || firstProd.code || 'SKU-001',
          quantity: 10,
          unitPrice: Number(firstProd.sellingPrice || firstProd.nominalPrice || firstProd.price || 0),
        },
      ]);
    }
    setDeliveryAddress('');
    setNotes('');
    setErrors({});
    toast.info('Form reset to default values');
  };

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedClientId) errs.client = 'Please select a beneficiary client';
    if (items.length === 0) errs.items = 'At least 1 product item is required';
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
    try {
      const payload = {
        client_id: selectedClientId,
        client_name: selectedClient?.name || '',
        delegate_name: selectedClient?.delegateName || 'Délégué Commercial',
        region: selectedClient?.region || 'Algiers',
        wilaya: selectedClient?.wilaya || '',
        payment_method: paymentMethod,
        notes,
        items: items.map((i) => ({
          product_id: i.productId,
          product_name: i.productName,
          reference: i.sku,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          subtotal: i.quantity * i.unitPrice,
        })),
      };

      const newOrder = await ordersService.create(payload);
      toast.success(`Order "${newOrder.order_code || 'created'}" registered successfully!`);
      router.push('/orders');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to register new order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center gap-3 border border-border/60 rounded-2xl bg-card">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Loading clients & products directory...</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Action Toolbar Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Link href="/orders" title="Back to Orders">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full h-9 px-3 text-xs font-semibold gap-1.5 bg-card hover:bg-muted text-foreground border-border/70 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Orders</span>
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
            disabled={submitting || !selectedClientId}
            size="sm"
            className="gap-2 rounded-full h-9 px-5 font-bold text-xs bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-foreground" />
                <span>Saving Order...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-primary-foreground" />
                <span>Save Order ({formatCurrency(totalAmount)})</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Fields (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Client Selection */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">1. Beneficiary Client & Territory</CardTitle>
                  <CardDescription className="text-xs">
                    Select target client for order assignment and territory distribution.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-primary" /> Target Client <span className="text-primary">*</span>
                </label>
                <Select value={selectedClientId} onValueChange={(val) => setSelectedClientId(val)}>
                  <SelectTrigger className="w-full h-10 min-h-[40px] text-sm font-semibold text-foreground bg-background rounded-xl border-border/70 focus:ring-primary/20 shadow-2xs">
                    <SelectValue placeholder="Choose a client..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/60 p-1">
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs font-semibold py-2 rounded-lg cursor-pointer">
                        <span className="flex items-center justify-between gap-3 w-full">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">({c.wilaya} — {c.region})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.client && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.client}
                  </p>
                )}
              </div>

              {selectedClient && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{selectedClient.name}</span>
                    <Badge variant="outline" className="text-[10px] font-bold bg-background text-primary border-primary/30">
                      {selectedClient.wilaya}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <span>Region: <strong className="text-foreground">{selectedClient.region}</strong></span>
                    <span>Commercial Delegate: <strong className="text-foreground">{selectedClient.delegateName || 'Délégué Commercial'}</strong></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Ordered Items & Quantities */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">2. Ordered Items & Quantities</CardTitle>
                    <CardDescription className="text-xs">
                      Add products, adjust quantities, and set unit pricing.
                    </CardDescription>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRow}
                  className="h-9 px-3.5 text-xs font-bold gap-1.5 rounded-xl border-border/70 hover:bg-muted"
                >
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  <span>Add Product Line</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="rounded-xl border border-border/60 overflow-hidden bg-background shadow-2xs">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 border-b border-border/40">
                    <tr>
                      <th className="text-left font-bold text-muted-foreground px-4 py-3">Product Name</th>
                      <th className="text-center font-bold text-muted-foreground px-3 py-3 w-32">Qty (Units)</th>
                      <th className="text-right font-bold text-muted-foreground px-3 py-3 w-36">Unit Price (DA)</th>
                      <th className="text-right font-bold text-muted-foreground px-4 py-3 w-36">Subtotal</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row) => (
                      <tr key={row.id} className="border-t border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <Select
                            value={row.productId}
                            onValueChange={(val) => handleProductChange(row.id, val)}
                          >
                            <SelectTrigger className="w-full h-10 text-xs font-semibold text-foreground bg-background rounded-xl border-border/70 focus:ring-primary/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/60 p-1">
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id} className="text-xs font-medium py-2">
                                  {p.name} ({p.sku || p.code}) — {formatCurrency(p.sellingPrice || p.nominalPrice || p.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <Input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleQuantityChange(row.id, Number(e.target.value))}
                            className="h-10 text-xs text-center font-bold rounded-xl border-border/70 bg-background focus:border-primary"
                          />
                        </td>

                        <td className="px-3 py-3 text-right">
                          <Input
                            type="number"
                            min="0"
                            step="10"
                            value={row.unitPrice}
                            onChange={(e) => handleUnitPriceChange(row.id, Number(e.target.value))}
                            className="h-10 text-xs text-right font-semibold rounded-xl border-border/70 bg-background focus:border-primary"
                          />
                        </td>

                        <td className="px-4 py-3 text-right font-bold text-foreground">
                          {formatCurrency(row.quantity * row.unitPrice)}
                        </td>

                        <td className="px-3 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRow(row.id)}
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40 border-t border-border/40">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 font-bold text-muted-foreground">
                        Total Items: <strong className="text-foreground font-extrabold">{totalQuantity} units</strong>
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-muted-foreground">
                        Total Amount:
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-primary text-base">
                        {formatCurrency(totalAmount)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Delivery Address & Notes */}
          <Card className="border-border/60 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">3. Delivery Address & Special Instructions</CardTitle>
                  <CardDescription className="text-xs">
                    Provide exact dropoff address and specific fulfillment notes.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Delivery Address
                  </label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Zone Industrielle, Route N5, Algiers"
                    className="h-10 text-sm bg-background rounded-xl border-border/70 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-500" /> Special Instructions
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Delivery window, contact person, or urgent handling notes..."
                    rows={2}
                    className="text-sm bg-background rounded-xl border-border/70 focus:border-primary focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Profile Card Sidebar (4 cols sticky) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <Card className="border-border/70 shadow-sm rounded-2xl overflow-hidden bg-card/90 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold text-foreground">Live Order Summary</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                  Preview
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {/* Header Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
                  {selectedClient ? selectedClient.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      ORD-2026-NEW
                    </span>
                    <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5">
                      Pending
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground tracking-tight line-clamp-1">
                    {selectedClient ? selectedClient.name : 'Select Client'}
                  </h3>
                </div>
              </div>

              <div className="h-px bg-border/40" />

              {/* Detail List */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" /> Region:
                  </span>
                  <Badge variant="outline" className="text-[10px] font-semibold border-border/70 text-foreground bg-muted/30">
                    {selectedClient ? selectedClient.region : '—'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" /> Wilaya:
                  </span>
                  <span className="font-semibold text-foreground">{selectedClient ? selectedClient.wilaya : '—'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-blue-500" /> Commercial Delegate:
                  </span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {selectedClient ? (selectedClient.delegateName || 'Délégué Commercial') : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-primary" /> Total Units:
                  </span>
                  <span className="font-bold text-foreground">{totalQuantity} units</span>
                </div>
              </div>

              {/* Total Revenue Box */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Total Revenue</span>
                  <span className="text-lg font-extrabold text-primary tracking-tight">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <DollarSign className="h-6 w-6 text-primary opacity-60" />
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
                disabled={submitting || !selectedClientId}
                className="gap-2 rounded-xl h-8 px-4 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? <Loader2 className="h-3 w-3 animate-spin text-primary-foreground" /> : <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                <span>Save Order</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
