import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import type { ApiResponse } from "@/types";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      "An error occurred";

    // Don't show toast for 401 errors (handled by auth context)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const apiClient = {
  get: <T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> => api.get(url),
  post: <T>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.post(url, data),
  patch: <T>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.patch(url, data),
  delete: <T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.delete(url),
};

// Specific API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post("/auth/login", credentials),
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post("/auth/register", data),
  logout: () => apiClient.post("/auth/logout"),
  getProfile: () => apiClient.get("/auth/profile"),
};

export const profileApi = {
  get: () => apiClient.get("/users/portfolio/public"),
  update: (data: any) => apiClient.patch("/users/profile", data),
  uploadImage: (formData: FormData) =>
    api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const experienceApi = {
  getAll: () => apiClient.get("/experiences"),
  getPaginated: (page: number = 1, limit: number = 10) =>
    apiClient.get(`/experiences/paginated?page=${page}&limit=${limit}`),
  getById: (id: string) => apiClient.get(`/experiences/${id}`),
  create: (data: any) => apiClient.post("/experiences", data),
  update: (id: string, data: any) =>
    apiClient.patch(`/experiences/${id}`, data),
  delete: (id: string) => apiClient.delete(`/experiences/${id}`),
};

export const projectsApi = {
  getAll: () => apiClient.get("/projects"),
  create: (data: any) => apiClient.post("/projects", data),
  update: (id: string, data: any) => apiClient.patch(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
};

export const contactApi = {
  send: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => apiClient.post("/contact", data),
  getAll: () => apiClient.get("/contact"),
  markAsRead: (id: string) => apiClient.patch(`/contact/${id}/read`),
  delete: (id: string) => apiClient.delete(`/contact/${id}`),
};

export const studiesApi = {
  getAll: () => apiClient.get("/studies"),
  getPaginated: (page: number = 1, limit: number = 10) =>
    apiClient.get(`/studies/paginated?page=${page}&limit=${limit}`),
  getById: (id: string) => apiClient.get(`/studies/${id}`),
  create: (data: any) => apiClient.post("/studies", data),
  update: (id: string, data: any) => apiClient.patch(`/studies/${id}`, data),
  delete: (id: string) => apiClient.delete(`/studies/${id}`),
};

export const tagsApi = {
  getAll: () => apiClient.get("/tags"),
  getPaginated: (page: number = 1, limit: number = 10) =>
    apiClient.get(`/tags/paginated?page=${page}&limit=${limit}`),
  getById: (id: string) => apiClient.get(`/tags/${id}`),
  getByCategory: (category: string) =>
    apiClient.get(`/tags/category/${category}`),
  search: (query: string) => apiClient.get(`/tags/search?q=${query}`),
  create: (data: any) => apiClient.post("/tags", data),
  update: (id: string, data: any) => apiClient.patch(`/tags/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tags/${id}`),
};

export const technologiesApi = {
  getAll: () => apiClient.get("/technologies"),
  getPaginated: (page: number = 1, limit: number = 10) =>
    apiClient.get(`/technologies/paginated?page=${page}&limit=${limit}`),
  getById: (id: string) => apiClient.get(`/technologies/${id}`),
  create: (data: any) => apiClient.post("/technologies", data),
  update: (id: string, data: any) =>
    apiClient.patch(`/technologies/${id}`, data),
  delete: (id: string) => apiClient.delete(`/technologies/${id}`),
};

export const migrationApi = {
  localizeFields: () => apiClient.post("/migration/localize-fields"),
  rollbackFields: () => apiClient.post("/migration/rollback-localized-fields"),
  getStatus: () => apiClient.get("/migration/status"),
  testLocalization: (data: any) =>
    apiClient.post("/migration/test-localization", data),
  getHelpers: () => apiClient.get("/migration/localization-helpers"),
};

export default api;
