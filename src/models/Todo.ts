import mongoose, { Document, Schema, Types } from 'mongoose';
import { PRIORITY_VALUES, Priority } from '../constants/tokens.js';

export interface ITodo {
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  tags: string[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodoDocument extends ITodo, Document {}

const todoSchema = new Schema<ITodoDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: PRIORITY_VALUES,
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

todoSchema.index({ userId: 1, createdAt: -1 });
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ userId: 1, priority: 1 });
todoSchema.index({ userId: 1, dueDate: 1 });
todoSchema.index({ title: 'text' });

export const Todo = mongoose.model<ITodoDocument>('Todo', todoSchema);
