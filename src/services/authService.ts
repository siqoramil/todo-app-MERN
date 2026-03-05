import crypto from 'crypto';
import { Types } from 'mongoose';
import { userRepo } from '../repositories/userRepo.js';
import { tokenService, AuthTokens } from './tokenService.js';
import { emailService } from './emailService.js';
import { ApiError } from '../utils/apiError.js';
import { User, IUserDocument } from '../models/User.js';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  tokens: AuthTokens;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const formatUserResponse = (user: IUserDocument): UserResponse => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, name } = input;

    const emailExists = await userRepo.emailExists(email);
    if (emailExists) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await userRepo.create({ email, password, name });
    const tokens = await tokenService.generateAuthTokens(user._id.toString());

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      tokens,
    };
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = await tokenService.generateAuthTokens(user._id.toString());

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      tokens,
    };
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    return tokenService.refreshTokens(refreshToken);
  },

  async logout(refreshToken: string): Promise<void> {
    await tokenService.revokeRefreshToken(refreshToken);
  },

  async logoutAll(userId: string): Promise<void> {
    await tokenService.revokeAllUserRefreshTokens(userId);
  },

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal whether email exists
      return;
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw ApiError.internal('Failed to send password reset email. Please try again later.');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!user) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Revoke all existing refresh tokens for security
    await tokenService.revokeAllUserRefreshTokens(user._id.toString());
  },

  async getMe(userId: string): Promise<UserResponse> {
    if (!Types.ObjectId.isValid(userId)) {
      throw ApiError.unauthorized('Invalid user ID');
    }

    const user = await userRepo.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return formatUserResponse(user);
  },
};
