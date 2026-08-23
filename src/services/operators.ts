import api from './api';

export interface OperatorData {
  id: number;
  name: string;
  code: string;
  color?: string;
  logo_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const operatorsService = {
  async list(params?: { active_only?: boolean; search?: string }): Promise<{ data: OperatorData[] }> {
    try {
      const response = await api.get('/operators', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch operators from API, using fallback', error);
      return {
        data: [
          { id: 1, name: 'Mobilis', code: 'MOB', color: '#10b981', is_active: true },
          { id: 2, name: 'Ooredoo', code: 'OOR', color: '#f43f5e', is_active: true },
          { id: 3, name: 'Djezzy', code: 'DJZ', color: '#f59e0b', is_active: true },
          { id: 4, name: 'Other', code: 'OTH', color: '#64748b', is_active: true },
        ],
      };
    }
  },

  async create(data: Partial<OperatorData>): Promise<{ data: OperatorData; message: string }> {
    const response = await api.post('/operators', data);
    return response.data;
  },

  async update(id: number, data: Partial<OperatorData>): Promise<{ data: OperatorData; message: string }> {
    const response = await api.put(`/operators/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/operators/${id}`);
    return response.data;
  },
};
