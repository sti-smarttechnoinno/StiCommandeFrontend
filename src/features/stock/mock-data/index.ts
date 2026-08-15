import type { StockMovement, StockFilters, MovementType, MovementStatus, LowStockItem, WarehouseActivity } from '../types';

const PRODUCTS = [
  'Mobilis SIM Card', 'Ooredoo SIM Card', 'Djezzy SIM Card',
  'Mobilis Credit 1000 DA', 'Mobilis Credit 2000 DA', 'Mobilis Credit 5000 DA',
  'Ooredoo Credit 1000 DA', 'Ooredoo Credit 2000 DA',
  'Djezzy Scratch 500 DA', 'Djezzy Scratch 1000 DA',
  'Phone Case Universal', 'Screen Protector 6.1"', 'Charger Cable USB-C',
  'Power Bank 10000mAh', 'Data Pack 5GB', 'Data Pack 10GB',
];

const WAREHOUSES = ['Setif Central', 'Alger Main', 'Oran Warehouse', 'Constantine Hub', 'Batna Depot'];
const DELEGATES = ['Ahmed Benali', 'Yacine B.', 'Amine K.', 'Sofiane M.', 'Rachid T.', 'Karim A.', 'Mohamed S.'];
const STATUSES: MovementStatus[] = ['completed', 'pending', 'in_transit', 'cancelled'];
const TYPES: MovementType[] = ['incoming', 'outgoing', 'transfer', 'adjustment'];

function generateRef(i: number): string {
  return `STK-${new Date().getFullYear()}-${String(1000 + i).padStart(4, '0')}`;
}

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  d.setHours(Math.floor(Math.random() * 14) + 6, Math.floor(Math.random() * 60));
  return d.toISOString();
}

function buildMovements(): StockMovement[] {
  return Array.from({ length: 60 }, (_, i) => {
    const type = TYPES[i % TYPES.length];
    const qty = type === 'adjustment' ? Math.floor(Math.random() * 50) + 1 : Math.floor(Math.random() * 2000) + 50;
    return {
      id: `mov-${i + 1}`,
      reference: generateRef(i),
      productId: `prod-${(i % PRODUCTS.length) + 1}`,
      product: PRODUCTS[i % PRODUCTS.length],
      movementType: type,
      quantity: qty,
      warehouse: WAREHOUSES[i % WAREHOUSES.length],
      destinationWarehouse: type === 'transfer' ? WAREHOUSES[(i + 2) % WAREHOUSES.length] : undefined,
      delegate: DELEGATES[i % DELEGATES.length],
      status: i < 40 ? 'completed' : i < 50 ? 'pending' : i < 55 ? 'in_transit' : 'cancelled',
      date: randomDate(14),
      notes: i % 5 === 0 ? 'Urgent restocking request' : undefined,
    };
  });
}

export const mockMovements: StockMovement[] = buildMovements();

export const mockLowStock: LowStockItem[] = [
  { id: 'ls-1', product: 'Djezzy SIM Card', currentStock: 65, minimumStock: 500, warehouse: 'Setif Central', severity: 'critical' },
  { id: 'ls-2', product: 'Mobilis Credit 5000 DA', currentStock: 120, minimumStock: 300, warehouse: 'Alger Main', severity: 'critical' },
  { id: 'ls-3', product: 'Power Bank 10000mAh', currentStock: 250, minimumStock: 400, warehouse: 'Oran Warehouse', severity: 'warning' },
  { id: 'ls-4', product: 'Charger Cable USB-C', currentStock: 180, minimumStock: 500, warehouse: 'Constantine Hub', severity: 'warning' },
  { id: 'ls-5', product: 'Screen Protector 6.1"', currentStock: 320, minimumStock: 600, warehouse: 'Batna Depot', severity: 'low' },
];

export const mockWarehouses: WarehouseActivity[] = [
  { name: 'Setif Central', utilization: 82, color: '#22C55E' },
  { name: 'Alger Main', utilization: 68, color: '#2563EB' },
  { name: 'Oran Warehouse', utilization: 73, color: '#6366F1' },
  { name: 'Constantine Hub', utilization: 54, color: '#F59E0B' },
  { name: 'Batna Depot', utilization: 49, color: '#EF4444' },
];

export const mockSummary = {
  incoming: 2450,
  outgoing: 1980,
  transfers: 42,
  adjustments: 6,
};
