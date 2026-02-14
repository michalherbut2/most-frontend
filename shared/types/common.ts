export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type UserRole = 'USER' | 'LEADER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;

  role: UserRole;
  
  points: number;
  isActive: boolean;
  
  profileImage?: string | null;
  sectionId?: string | null;
  sectionName?: string | null;

  emailVerified: boolean;
  createdAt: string;
  
  // phone: string | null;
  // updatedAt: string;
  // lastLoginAt: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type LoadingState = "idle" | "loading" | "success" | "error";
