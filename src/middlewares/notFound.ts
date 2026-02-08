import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
