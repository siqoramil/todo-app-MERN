import { create } from 'zustand';
import type { TodoFilters, Priority, TodoStatus, SortField, SortOrder } from '@/types';

interface TodoState {
  filters: TodoFilters;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setStatus: (status: TodoStatus | undefined) => void;
  setPriority: (priority: Priority | undefined) => void;
  setTag: (tag: string | undefined) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: SortField) => void;
  setOrder: (order: SortOrder) => void;
  resetFilters: () => void;
}

const defaultFilters: TodoFilters = {
  page: 1,
  limit: 10,
  status: undefined,
  priority: undefined,
  tag: undefined,
  search: '',
  sortBy: 'createdAt',
  order: 'desc',
};

export const useTodoStore = create<TodoState>((set) => ({
  filters: defaultFilters,
  setPage: (page) =>
    set((state) => ({ filters: { ...state.filters, page } })),
  setLimit: (limit) =>
    set((state) => ({ filters: { ...state.filters, limit, page: 1 } })),
  setStatus: (status) =>
    set((state) => ({ filters: { ...state.filters, status, page: 1 } })),
  setPriority: (priority) =>
    set((state) => ({ filters: { ...state.filters, priority, page: 1 } })),
  setTag: (tag) =>
    set((state) => ({ filters: { ...state.filters, tag, page: 1 } })),
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search, page: 1 } })),
  setSortBy: (sortBy) =>
    set((state) => ({ filters: { ...state.filters, sortBy, page: 1 } })),
  setOrder: (order) =>
    set((state) => ({ filters: { ...state.filters, order, page: 1 } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
