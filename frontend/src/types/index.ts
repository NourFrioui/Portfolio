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
  company: LocalizedText;
  name: LocalizedText;
  position: LocalizedText;
  startDate: string;
  endDate?: string;
  description: LocalizedText;
  location: LocalizedText;
  type: "full-time" | "part-time" | "contract" | "internship";
  isCurrentJob?: boolean;
  achievements?: LocalizedText[];
  createdAt: string;
  updatedAt: string;
}

export interface LocalizedText {
  en: string;
  fr: string;
}

export interface Project {
  _id: string;
  title: LocalizedText;
  description: LocalizedText;
  longDescription?: LocalizedText;
  detailedDescription?: LocalizedText;
  categoryId?: string;
  imageUrl?: string;
  images?: string[];
  technologyIds: string[];
  tagIds: string[];
  features?: LocalizedText[];
  challenges?: LocalizedText[];
  solutions?: LocalizedText[];
  liveUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  status: "planned" | "in-progress" | "completed" | "on-hold";
  order: number;
  isFeatured: boolean;
  isActive: boolean;
  timeline?: {
    startDate?: string;
    endDate?: string | null;
    status: "planned" | "in-progress" | "completed" | "on-hold";
    start?: string;
    end?: string;
    duration?: string;
  };
  team?: {
    size?: number;
    members?: Array<{
      name: string;
      role: string;
    }>;
    role?: LocalizedText;
  };
  clientTestimonial?: {
    text?: LocalizedText;
    author?: LocalizedText;
    position?: LocalizedText;
  };
  results?: Array<{
    metric: LocalizedText;
    value: string;
  }>;
  startDate?: string;
  endDate?: string | null;
  loadTime?: number;
  performanceScore?: number;
  accessibilityScore?: number;
  projectType?: string;
  client?: string;
  teamSize?: number;
  responsibilities?: LocalizedText;
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  _id: string;
  name: LocalizedText;
  percentage: number;
  icon?: string;
  description?: LocalizedText;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: LocalizedText;
  description?: LocalizedText;
  category:
    | "technology"
    | "skill"
    | "tool"
    | "framework"
    | "language"
    | "other";
  color?: string;
  iconUrl?: string;
  isActive: boolean;
  order: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Study {
  _id: string;
  institution: LocalizedText;
  degree: LocalizedText;
  field: LocalizedText;
  description?: LocalizedText;
  location?: LocalizedText;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  subjects?: LocalizedText[];
  achievements?: LocalizedText[];
  coursework?: LocalizedText[];
  honors?: LocalizedText[];
  institutionWebsite?: string;
  order: number;
  isActive: boolean;
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
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface CardProps extends ComponentProps {
  title?: string;
  description?: string;
  image?: string;
  href?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

export interface BadgeProps extends ComponentProps {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";
  size?: "sm" | "md" | "lg";
}

// Theme types
export type Theme = "light" | "dark" | "system";

// Error types
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}
