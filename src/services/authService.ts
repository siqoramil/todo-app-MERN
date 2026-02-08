import { Types } from 'mongoose';
import { userRepo } from '../repositories/userRepo.js';
import { tokenService, AuthTokens } from './tokenService.js';
import { ApiError } from '../utils/apiError.js';
import { IUserDocument } from '../models/User.js';

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
