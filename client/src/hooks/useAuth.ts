import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, RegisterInput, LoginInput } from '@/services/authService';
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
