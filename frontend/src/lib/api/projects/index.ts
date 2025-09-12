import { Project, PaginatedResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await fetch(`${API_BASE}/projects/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  return response.json();
};

export const createProject = async (project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  
  return response.json();
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
  
  return response.json();
};

export const deleteProject = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
};
