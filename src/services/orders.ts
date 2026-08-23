import api from './api';

export interface OrderItemData {
  id?: string;
  product_id?: string;
  product_name: string;
  reference?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderData {
  id: string;
  order_code: string;
  client_id?: string;
  client_name: string;
  delegate_id?: string;
  delegate_name?: string;
  region: string;
  wilaya?: string;
  total_amount: number;
  status: 'pending' | 'validated' | 'partially_validated' | 'processing' | 'delivered' | 'cancelled';
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItemData[];
}

export interface ListOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  region?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ListOrdersResponse {
  data: OrderData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderKpis {
  totalOrders: number;
  pendingOrders: number;
  validatedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

export const ordersService = {
  list: async (params?: ListOrdersParams): Promise<ListOrdersResponse> => {
    const res = await api.get<ListOrdersResponse>('/orders', { params });
    return res.data;
  },

  getKpis: async (): Promise<OrderKpis> => {
    const res = await api.get<OrderKpis>('/orders/kpis');
    return res.data;
  },

  get: async (id: string): Promise<OrderData> => {
    const res = await api.get<{ data: OrderData }>(`/orders/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<OrderData> & { items: OrderItemData[] }): Promise<OrderData> => {
    const res = await api.post<{ data: OrderData }>('/orders', data);
    return res.data.data;
  },

  updateStatus: async (id: string, status: string, validatedItems?: Record<string, number>): Promise<OrderData> => {
    const payload: any = { status };
    if (validatedItems) {
      payload.validated_items = Object.entries(validatedItems).map(([itemId, quantity]) => ({
        id: itemId,
        quantity,
      }));
    }
    const res = await api.put<{ data: OrderData }>(`/orders/${id}`, payload);
    return res.data.data;
  },
};
