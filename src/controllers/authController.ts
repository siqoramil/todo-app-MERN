import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { AuthRequest } from '../middlewares/auth.js';
import { env } from '../config/env.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants/tokens.js';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
});

const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
  });
};

export const authController = {
  register: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);

    setRefreshTokenCookie(res, result.tokens.refreshToken);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);

    setRefreshTokenCookie(res, result.tokens.refreshToken);

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;

    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    const tokens = await authService.refresh(refreshToken);

    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = forgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent',
    });
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token, password } = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  }),

  getMe: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.userId) {
      throw ApiError.unauthorized('Not authenticated');
    }

    const user = await authService.getMe(req.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),
};
