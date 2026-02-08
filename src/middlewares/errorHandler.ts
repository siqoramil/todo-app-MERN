import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import mongoose from 'mongoose';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Record<string, string[]> | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation error';
    errors = {};
    for (const [field, error] of Object.entries(err.errors)) {
      errors[field] = [error.message];
    }
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    if (keyValue) {
      const field = Object.keys(keyValue)[0];
      if (field) {
        message = `${field} already exists`;
      }
    }
  } else if (err.name === 'SyntaxError' && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  if (!err.message.includes('expired') && !err.message.includes('Invalid')) {
    console.error(`[Error] ${statusCode} - ${message}`, err);
  }

  res.status(statusCode).json(response);
};
