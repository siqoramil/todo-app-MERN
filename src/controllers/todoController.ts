import { Response } from 'express';
import { z } from 'zod';
import { todoService } from '../services/todoService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { AuthRequest } from '../middlewares/auth.js';
import { PRIORITY_VALUES, TODO_STATUS, SORT_FIELDS, SORT_ORDER } from '../constants/tokens.js';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').trim(),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').trim().optional(),
  completed: z.boolean().optional().default(false),
  priority: z.enum(PRIORITY_VALUES).optional().default('medium'),
  dueDate: z.string().datetime({ offset: true }).optional(),
  tags: z
    .array(z.string().max(50, 'Tag cannot exceed 50 characters').trim())
    .max(10, 'Cannot have more than 10 tags')
    .optional()
    .default([]),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200, 'Title cannot exceed 200 characters').trim().optional(),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').trim().nullable().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(PRIORITY_VALUES).optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
  tags: z
    .array(z.string().max(50, 'Tag cannot exceed 50 characters').trim())
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
});

export const todoQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  status: z.enum([TODO_STATUS.ALL, TODO_STATUS.ACTIVE, TODO_STATUS.COMPLETED]).optional(),
  priority: z.enum(PRIORITY_VALUES).optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(SORT_FIELDS).optional(),
  order: z.enum([SORT_ORDER.ASC, SORT_ORDER.DESC]).optional(),
});

export const todoIdSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid todo ID format'),
});

export const todoController = {
  create: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.userId) {
      throw ApiError.unauthorized('Not authenticated');
    }

    const data = createTodoSchema.parse(req.body);
    const todo = await todoService.create(req.userId, data);

    res.status(201).json({
      success: true,
      data: todo,
    });
  }),

  getAll: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.userId) {
      throw ApiError.unauthorized('Not authenticated');
    }

    // Query already validated by middleware
    const query = req.query as z.infer<typeof todoQuerySchema>;
    const result = await todoService.getAll(req.userId, query);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  getById: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.userId) {
      throw ApiError.unauthorized('Not authenticated');
    }

    const { id } = todoIdSchema.parse(req.params);
    const todo = await todoService.getById(req.userId, id);

    res.status(200).json({
      success: true,
      data: todo,
    });
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.userId) {
      throw ApiError.unauthorized('Not authenticated');
    }

    const { id } = todoIdSchema.parse(req.params);
    const data = updateTodoSchema.parse(req.body);

    if (Object.keys(data).length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    const todo = await todoService.update(req.userId, id, data);

    res.status(200).json({
      success: true,
      data: todo,
    });
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.userId) {
      throw ApiError.unauthorized('Not authenticated');
    }

    const { id } = todoIdSchema.parse(req.params);
    await todoService.delete(req.userId, id);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  }),
};
