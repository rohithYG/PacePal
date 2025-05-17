import { apiRequest } from './queryClient';
import { User } from '@shared/schema';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  notificationsEnabled: boolean;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    return response.json();
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error?.response?.data?.message || 'Login failed. Please try again.');
  }
}

export const register = async (userData: RegisterData): Promise<User> => {
  const response = await apiRequest('POST', '/api/auth/register', userData);
  const data = await response.json();
  return data.user;
};

export const logout = async (): Promise<void> => {
  await apiRequest('POST', '/api/auth/logout');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await apiRequest('GET', '/api/auth/me');
    const data = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
};