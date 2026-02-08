import api from '@/lib/axios';
import type {
  ApiResponse,
  Todo,
  PaginatedResponse,
  TodoFilters,
  CreateTodoInput,
  UpdateTodoInput,
} from '@/types';

export const todoService = {
  async getAll(filters: TodoFilters): Promise<PaginatedResponse<Todo>> {
    const params = new URLSearchParams();

    params.set('page', filters.page.toString());
    params.set('limit', filters.limit.toString());

    if (filters.status && filters.status !== 'all') {
      params.set('status', filters.status);
    }
    if (filters.priority) {
      params.set('priority', filters.priority);
    }
    if (filters.tag) {
      params.set('tag', filters.tag);
    }
    if (filters.search) {
      params.set('search', filters.search);
    }
    if (filters.sortBy) {
      params.set('sortBy', filters.sortBy);
    }
    if (filters.order) {
      params.set('order', filters.order);
    }

    const response = await api.get<ApiResponse<PaginatedResponse<Todo>>>(
      `/todos?${params.toString()}`
    );
    return response.data.data;
  },

  async getById(id: string): Promise<Todo> {
    const response = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
    return response.data.data;
  },

  async create(data: CreateTodoInput): Promise<Todo> {
    const response = await api.post<ApiResponse<Todo>>('/todos', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateTodoInput): Promise<Todo> {
    const response = await api.patch<ApiResponse<Todo>>(`/todos/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  async toggleComplete(id: string, completed: boolean): Promise<Todo> {
    const response = await api.patch<ApiResponse<Todo>>(`/todos/${id}`, {
      completed,
    });
    return response.data.data;
  },
};
