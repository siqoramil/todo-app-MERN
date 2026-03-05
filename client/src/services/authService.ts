import api from '@/lib/axios';
import type { ApiResponse, AuthResponse, User } from '@/types';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    return response.data.data;
  },

  async refresh(): Promise<{ accessToken: string }> {
    const response = await api.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh'
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async forgotPassword(data: ForgotPasswordInput): Promise<string> {
    const response = await api.post<ApiResponse<null> & { message: string }>(
      '/auth/forgot-password',
      data
    );
    return response.data.message!;
  },

  async resetPassword(data: ResetPasswordInput): Promise<string> {
    const response = await api.post<ApiResponse<null> & { message: string }>(
      '/auth/reset-password',
      data
    );
    return response.data.message!;
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },
};
