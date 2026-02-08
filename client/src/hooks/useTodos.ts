import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { todoService } from '@/services/todoService';
import { useTodoStore } from '@/stores/todoStore';
import type { CreateTodoInput, UpdateTodoInput, ApiError } from '@/types';
import { AxiosError } from 'axios';

export function useTodos() {
  const filters = useTodoStore((state) => state.filters);

  return useQuery({
    queryKey: ['todos', filters],
    queryFn: () => todoService.getAll(filters),
    staleTime: 30 * 1000,
  });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => todoService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoInput) => todoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo created!');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Failed to create todo';
      toast.error(message);
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) =>
      todoService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', variables.id] });
      toast.success('Todo updated!');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Failed to update todo';
      toast.error(message);
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted!');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Failed to delete todo';
      toast.error(message);
    },
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todoService.toggleComplete(id, completed),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', variables.id] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Failed to update todo';
      toast.error(message);
    },
  });
}
