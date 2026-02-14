// shared/lib/axios.ts
import axios, { AxiosError } from 'axios';
import { API_URL } from './constants';
import { authCookie } from './auth-cookie';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - dodawanie tokena
apiClient.interceptors.request.use(
  (config) => {
    const token = authCookie.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - obsługa błędów
apiClient.interceptors.response.use(
  (response) => response.data, // Zwracamy od razu dane
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authCookie.remove();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Formatowanie błędu dla React Query
    const apiError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
    
    return Promise.reject(apiError);
  }
);