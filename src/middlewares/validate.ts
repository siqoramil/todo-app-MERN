import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError.js';

type RequestLocation = 'body' | 'query' | 'params';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    const locations: RequestLocation[] = ['body', 'query', 'params'];

    for (const location of locations) {
      const schema = schemas[location];
      if (schema) {
        try {
          const parsed = schema.parse(req[location]);
          req[location] = parsed;
        } catch (error) {
          if (error instanceof ZodError) {
            const locationErrors: string[] = [];
            for (const issue of error.issues) {
              const path = issue.path.join('.');
              const message = path ? `${path}: ${issue.message}` : issue.message;
              locationErrors.push(message);
            }
            errors[location] = locationErrors;
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw ApiError.badRequest('Validation failed', errors);
    }

    next();
  };
};

export const validateBody = (schema: ZodSchema) => validate({ body: schema });
export const validateQuery = (schema: ZodSchema) => validate({ query: schema });
export const validateParams = (schema: ZodSchema) => validate({ params: schema });
