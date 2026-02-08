import { Types } from 'mongoose';
import { todoRepo, CreateTodoData, UpdateTodoData, TodoQueryOptions, PaginatedTodos } from '../repositories/todoRepo.js';
import { ApiError } from '../utils/apiError.js';
import { ITodoDocument } from '../models/Todo.js';
import { Priority, TodoStatus, SortField, SortOrder } from '../constants/tokens.js';

export interface CreateTodoInput {
  title: string;
  description?: string;
  completed?: boolean;
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

export interface TodoQueryInput {
  page?: number;
  limit?: number;
  status?: TodoStatus;
  priority?: Priority;
  tag?: string;
  search?: string;
  sortBy?: SortField;
  order?: SortOrder;
}

export interface TodoResponse {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTodoResponse {
  items: TodoResponse[];
  page: number;
  limit: number;
  total: number;
}

const formatTodoResponse = (todo: ITodoDocument): TodoResponse => ({
  id: todo._id.toString(),
  title: todo.title,
  description: todo.description,
  completed: todo.completed,
  priority: todo.priority,
  dueDate: todo.dueDate,
  tags: todo.tags,
  userId: todo.userId.toString(),
  createdAt: todo.createdAt,
  updatedAt: todo.updatedAt,
});

const formatPaginatedResponse = (result: PaginatedTodos): PaginatedTodoResponse => ({
  items: result.items.map(formatTodoResponse),
  page: result.page,
  limit: result.limit,
  total: result.total,
});

export const todoService = {
  async create(userId: string, input: CreateTodoInput): Promise<TodoResponse> {
    const data: CreateTodoData = {
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      userId: new Types.ObjectId(userId),
    };

    const todo = await todoRepo.create(data);
    return formatTodoResponse(todo);
  },

  async getAll(userId: string, query: TodoQueryInput): Promise<PaginatedTodoResponse> {
    const options: TodoQueryOptions = {
      page: query.page ?? 1,
      limit: Math.min(query.limit ?? 10, 100),
      status: query.status,
      priority: query.priority,
      tag: query.tag,
      search: query.search,
      sortBy: query.sortBy,
      order: query.order,
    };

    const result = await todoRepo.findByUserId(userId, options);
    return formatPaginatedResponse(result);
  },

  async getById(userId: string, todoId: string): Promise<TodoResponse> {
    const todo = await todoRepo.findByIdAndUserId(todoId, userId);

    if (!todo) {
      throw ApiError.notFound('Todo not found');
    }

    return formatTodoResponse(todo);
  },

  async update(userId: string, todoId: string, input: UpdateTodoInput): Promise<TodoResponse> {
    const existingTodo = await todoRepo.findByIdAndUserId(todoId, userId);

    if (!existingTodo) {
      throw ApiError.notFound('Todo not found');
    }

    const data: UpdateTodoData = {
      ...input,
      dueDate: input.dueDate === null ? null : input.dueDate ? new Date(input.dueDate) : undefined,
    };

    const todo = await todoRepo.updateById(todoId, userId, data);

    if (!todo) {
      throw ApiError.notFound('Todo not found');
    }

    return formatTodoResponse(todo);
  },

  async delete(userId: string, todoId: string): Promise<void> {
    const deleted = await todoRepo.deleteById(todoId, userId);

    if (!deleted) {
      throw ApiError.notFound('Todo not found');
    }
  },

  async deleteAll(userId: string): Promise<number> {
    return todoRepo.deleteAllByUserId(userId);
  },
};
