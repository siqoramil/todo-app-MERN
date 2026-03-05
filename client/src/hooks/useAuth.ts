import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types';

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Welcome back!');
      navigate('/');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordInput) => authService.forgotPassword(data),
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordInput) => authService.resetPassword(data),
    onSuccess: (message) => {
      toast.success(message);
      navigate('/login');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    },
  });
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await authService.getMe();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
