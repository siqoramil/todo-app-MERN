export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type TodoStatus = 'all' | 'active' | 'completed';
export type SortField = 'createdAt' | 'dueDate' | 'priority';
export type SortOrder = 'asc' | 'desc';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
}

export interface TodoFilters {
  page: number;
  limit: number;
  status?: TodoStatus;
  priority?: Priority;
  tag?: string;
  search?: string;
  sortBy?: SortField;
  order?: SortOrder;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string | null;
  tags?: string[];
}
