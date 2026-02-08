import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { env } from '../config/env.js';
import { TOKEN_TYPES, TokenType } from '../constants/tokens.js';
import { tokenRepo } from '../repositories/tokenRepo.js';
import { ApiError } from '../utils/apiError.js';

export interface TokenPayload {
  userId: string;
  type: TokenType;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const parseExpiration = (expiration: string): number => {
  const match = expiration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiration format: ${expiration}`);
  }

  const value = parseInt(match[1]!, 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return value * (multipliers[unit!] ?? 1);
};

const generateToken = (
  userId: string,
  type: TokenType,
  secret: string,
  expiresIn: string
): string => {
  const payload: TokenPayload = { userId, type };
  const expiresInSeconds = parseExpiration(expiresIn);
  const options: SignOptions = { expiresIn: expiresInSeconds };
  return jwt.sign(payload, secret, options);
};

export const tokenService = {
  generateAccessToken(userId: string): string {
    return generateToken(
      userId,
      TOKEN_TYPES.ACCESS,
      env.JWT_ACCESS_SECRET,
      env.JWT_ACCESS_EXPIRES_IN
    );
  },

  async generateRefreshToken(userId: string): Promise<string> {
    const token = generateToken(
      userId,
      TOKEN_TYPES.REFRESH,
      env.JWT_REFRESH_SECRET,
      env.JWT_REFRESH_EXPIRES_IN
    );

    const expiresInSeconds = parseExpiration(env.JWT_REFRESH_EXPIRES_IN);
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    await tokenRepo.create({
      token,
      userId: new Types.ObjectId(userId),
      type: TOKEN_TYPES.REFRESH,
      expiresAt,
    });

    return token;
  },

  async generateAuthTokens(userId: string): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  },

  verifyAccessToken(token: string): TokenPayload {
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload & TokenPayload;

      if (payload.type !== TOKEN_TYPES.ACCESS) {
        throw ApiError.unauthorized('Invalid token type');
      }

      return { userId: payload.userId, type: payload.type };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized('Access token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Invalid access token');
      }
      throw error;
    }
  },

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload & TokenPayload;

      if (payload.type !== TOKEN_TYPES.REFRESH) {
        throw ApiError.unauthorized('Invalid token type');
      }

      const storedToken = await tokenRepo.findRefreshToken(token);
      if (!storedToken) {
        throw ApiError.unauthorized('Refresh token not found or expired');
      }

      return { userId: payload.userId, type: payload.type };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        await tokenRepo.blacklistToken(token);
        throw ApiError.unauthorized('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Invalid refresh token');
      }
      throw error;
    }
  },

  async revokeRefreshToken(token: string): Promise<void> {
    await tokenRepo.blacklistToken(token);
  },

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await tokenRepo.blacklistAllUserRefreshTokens(userId);
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const payload = await this.verifyRefreshToken(refreshToken);

    await tokenRepo.blacklistToken(refreshToken);

    return this.generateAuthTokens(payload.userId);
  },
};
