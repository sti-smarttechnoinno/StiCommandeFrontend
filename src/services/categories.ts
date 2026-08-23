import api from './api';

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const categoriesService = {
  async list(params?: { active_only?: boolean; search?: string }): Promise<{ data: CategoryData[] }> {
    try {
      const response = await api.get('/categories', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch categories from API, using fallback', error);
      return {
        data: [
          { id: 1, name: 'Mobile Credit', slug: 'mobile_credit', icon: 'smartphone', description: 'Electronic flexy mobile credit top-up', is_active: true },
          { id: 2, name: 'SIM Cards', slug: 'sim_cards', icon: 'sim-card', description: 'Prepaid and postpaid SIM cards', is_active: true },
          { id: 3, name: 'Scratch Cards', slug: 'scratch_cards', icon: 'credit-card', description: 'Physical recharge scratch vouchers', is_active: true },
          { id: 4, name: 'Data Packs', slug: 'data_packs', icon: 'wifi', description: 'Internet data bundle packages', is_active: true },
          { id: 5, name: 'Voice Packages', slug: 'voice_packages', icon: 'phone-call', description: 'Voice calling minutes packages', is_active: true },
          { id: 6, name: 'SMS Packages', slug: 'sms_packages', icon: 'message-square', description: 'Text messaging bundles', is_active: true },
          { id: 7, name: 'Accessories', slug: 'accessories', icon: 'headphones', description: 'Telecom accessories and hardware', is_active: true },
        ],
      };
    }
  },

  async create(data: Partial<CategoryData>): Promise<{ data: CategoryData; message: string }> {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async update(id: number, data: Partial<CategoryData>): Promise<{ data: CategoryData; message: string }> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
