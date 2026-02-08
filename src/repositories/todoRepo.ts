import { Types, FilterQuery, SortOrder } from 'mongoose';
import { Todo, ITodoDocument } from '../models/Todo.js';
import { Priority, TodoStatus, SortField, SORT_ORDER } from '../constants/tokens.js';

export interface CreateTodoData {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: Date;
  tags?: string[];
  userId: Types.ObjectId;
}

export interface UpdateTodoData {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: Priority;
  dueDate?: Date | null;
  tags?: string[];
}

export interface TodoQueryOptions {
  page: number;
  limit: number;
  status?: TodoStatus;
  priority?: Priority;
  tag?: string;
  search?: string;
  sortBy?: SortField;
  order?: typeof SORT_ORDER.ASC | typeof SORT_ORDER.DESC;
}

export interface PaginatedTodos {
  items: ITodoDocument[];
  page: number;
  limit: number;
  total: number;
}

const priorityOrder: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const todoRepo = {
  async create(data: CreateTodoData): Promise<ITodoDocument> {
    const todo = new Todo(data);
    return todo.save();
  },

  async findById(id: string | Types.ObjectId): Promise<ITodoDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return Todo.findById(id).exec();
  },

  async findByIdAndUserId(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<ITodoDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      return null;
    }
    return Todo.findOne({ _id: id, userId }).exec();
  },

  async findByUserId(
    userId: string | Types.ObjectId,
    options: TodoQueryOptions
  ): Promise<PaginatedTodos> {
    const { page, limit, status, priority, tag, search, sortBy = 'createdAt', order = 'desc' } = options;

    const filter: FilterQuery<ITodoDocument> = { userId };

    if (status === 'active') {
      filter.completed = false;
    } else if (status === 'completed') {
      filter.completed = true;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    let sort: Record<string, SortOrder | { $meta: 'textScore' }>;

    if (sortBy === 'priority') {
      const todos = await Todo.find(filter).exec();

      const sortedTodos = todos.sort((a, b) => {
        const orderMultiplier = order === 'asc' ? 1 : -1;
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) * orderMultiplier;
      });

      const paginatedTodos = sortedTodos.slice(skip, skip + limit);

      return {
        items: paginatedTodos,
        page,
        limit,
        total: todos.length,
      };
    } else {
      sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    }

    const [items, total] = await Promise.all([
      Todo.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      Todo.countDocuments(filter).exec(),
    ]);

    return {
      items,
      page,
      limit,
      total,
    };
  },

  async updateById(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    data: UpdateTodoData
  ): Promise<ITodoDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      return null;
    }

    const updateData: Record<string, unknown> = { ...data };

    if (data.dueDate === null) {
      updateData.$unset = { dueDate: 1 };
      delete updateData.dueDate;
    }

    return Todo.findOneAndUpdate({ _id: id, userId }, updateData, { new: true }).exec();
  },

  async deleteById(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      return false;
    }
    const result = await Todo.findOneAndDelete({ _id: id, userId }).exec();
    return result !== null;
  },

  async deleteAllByUserId(userId: string | Types.ObjectId): Promise<number> {
    if (!Types.ObjectId.isValid(userId)) {
      return 0;
    }
    const result = await Todo.deleteMany({ userId }).exec();
    return result.deletedCount;
  },
};
