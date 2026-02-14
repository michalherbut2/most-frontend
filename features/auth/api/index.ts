import { apiClient } from '@/shared/lib/api-client';
import { LoginRequest, RegisterRequest, LoginResponse } from '../types';
import { User } from '@/shared/types/common';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', data);
    return response;
  },

  /**
   * Get current user profile
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response;
  },

  /**
   * Logout (optional - if backend has logout endpoint)
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};