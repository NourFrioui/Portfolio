import { useState, useEffect } from 'react';
import api from '../utils/api';

interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCategories = (activeOnly = true): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = activeOnly ? '/categories/active' : '/categories';
      const response = await api.get(endpoint);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
      // Fallback data based on the user's example
      setCategories([
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Frontend',
          description: 'Frontend development technologies',
          color: '#3B82F6',
          icon: 'fas fa-laptop-code',
          order: 1,
          isActive: true,
          createdAt: '2025-09-10T09:00:00.000Z',
          updatedAt: '2025-09-10T09:00:00.000Z',
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Backend',
          description: 'Backend frameworks and server-side technologies',
          color: '#10B981',
          icon: 'fas fa-server',
          order: 2,
          isActive: true,
          createdAt: '2025-09-10T09:05:00.000Z',
          updatedAt: '2025-09-10T09:05:00.000Z',
        },
        {
          _id: '507f1f77bcf86cd799439013',
          name: 'ERP',
          description: 'Enterprise Resource Planning systems',
          color: '#8B5CF6',
          icon: 'fas fa-cogs',
          order: 3,
          isActive: true,
          createdAt: '2025-09-10T09:10:00.000Z',
          updatedAt: '2025-09-10T09:10:00.000Z',
        },
        {
          _id: '507f1f77bcf86cd799439014',
          name: 'Database',
          description: 'Databases and storage engines',
          color: '#F59E0B',
          icon: 'fas fa-database',
          order: 4,
          isActive: true,
          createdAt: '2025-09-10T09:15:00.000Z',
          updatedAt: '2025-09-10T09:15:00.000Z',
        },
        {
          _id: '507f1f77bcf86cd799439015',
          name: 'Languages',
          description: 'Programming and scripting languages',
          color: '#EF4444',
          icon: 'fas fa-code',
          order: 5,
          isActive: true,
          createdAt: '2025-09-10T09:20:00.000Z',
          updatedAt: '2025-09-10T09:20:00.000Z',
        },
        {
          _id: '507f1f77bcf86cd799439016',
          name: 'Cloud',
          description: 'Cloud platforms and services',
          color: '#06B6D4',
          icon: 'fas fa-cloud',
          order: 6,
          isActive: true,
          createdAt: '2025-09-10T09:25:00.000Z',
          updatedAt: '2025-09-10T09:25:00.000Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeOnly]);

  const refetch = () => {
    fetchCategories();
  };

  return { categories, loading, error, refetch };
};

export type { Category };
