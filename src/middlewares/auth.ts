import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/tokenService.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw ApiError.unauthorized('Access token is required');
    }

    const payload = tokenService.verifyAccessToken(token);
    req.userId = payload.userId;

    next();
  }
);

export const optionalAuth = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      if (token) {
        try {
          const payload = tokenService.verifyAccessToken(token);
          req.userId = payload.userId;
        } catch {
          // Ignore invalid tokens for optional auth
        }
      }
    }

    next();
  }
);
