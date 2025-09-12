import { Technology, PaginatedResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

export const getTechnologies = async (): Promise<Technology[]> => {
  const response = await fetch(`${API_BASE}/technologies`);
  if (!response.ok) {
    throw new Error('Failed to fetch technologies');
  }
  return response.json();
};

export const getTechnologyById = async (id: string): Promise<Technology> => {
  const response = await fetch(`${API_BASE}/technologies/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch technology');
  }
  return response.json();
};

export const createTechnology = async (technology: Omit<Technology, '_id' | 'createdAt' | 'updatedAt'>): Promise<Technology> => {
  const response = await fetch(`${API_BASE}/technologies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(technology),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create technology');
  }
  
  return response.json();
};

export const updateTechnology = async (id: string, technology: Partial<Technology>): Promise<Technology> => {
  const response = await fetch(`${API_BASE}/technologies/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(technology),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update technology');
  }
  
  return response.json();
};

export const deleteTechnology = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/technologies/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete technology');
  }
};
