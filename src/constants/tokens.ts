export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const PRIORITY_VALUES = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITY_VALUES)[number];

export const TODO_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export type TodoStatus = (typeof TODO_STATUS)[keyof typeof TODO_STATUS];

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export const SORT_FIELDS = ['createdAt', 'dueDate', 'priority'] as const;
export type SortField = (typeof SORT_FIELDS)[number];
