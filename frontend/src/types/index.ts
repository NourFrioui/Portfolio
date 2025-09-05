// Core entity types
export interface User {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  profileImage?: string;
  location?: string;
  socialLinks?: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  isCurrentJob?: boolean;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProfileFormData {
  name: string;
  bio: string;
  location: string;
  socialLinks: SocialLinks;
}

// Component props
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends ComponentProps {
  title?: string;
  description?: string;
  image?: string;
  href?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export interface BadgeProps extends ComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Error types
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}
