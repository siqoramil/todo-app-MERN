import { Types } from 'mongoose';
import { Token, ITokenDocument } from '../models/Token.js';
import { TokenType, TOKEN_TYPES } from '../constants/tokens.js';

export interface CreateTokenData {
  token: string;
  userId: Types.ObjectId;
  type: TokenType;
  expiresAt: Date;
}

export const tokenRepo = {
  async create(data: CreateTokenData): Promise<ITokenDocument> {
    const token = new Token(data);
    return token.save();
  },

  async findByToken(token: string): Promise<ITokenDocument | null> {
    return Token.findOne({ token, blacklisted: false }).exec();
  },

  async findRefreshToken(token: string): Promise<ITokenDocument | null> {
    return Token.findOne({
      token,
      type: TOKEN_TYPES.REFRESH,
      blacklisted: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  },

  async findByUserIdAndType(
    userId: string | Types.ObjectId,
    type: TokenType
  ): Promise<ITokenDocument[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }
    return Token.find({ userId, type, blacklisted: false }).exec();
  },

  async blacklistToken(token: string): Promise<boolean> {
    const result = await Token.updateOne({ token }, { blacklisted: true }).exec();
    return result.modifiedCount > 0;
  },

  async blacklistAllUserRefreshTokens(userId: string | Types.ObjectId): Promise<number> {
    if (!Types.ObjectId.isValid(userId)) {
      return 0;
    }
    const result = await Token.updateMany(
      { userId, type: TOKEN_TYPES.REFRESH, blacklisted: false },
      { blacklisted: true }
    ).exec();
    return result.modifiedCount;
  },

  async deleteByToken(token: string): Promise<boolean> {
    const result = await Token.deleteOne({ token }).exec();
    return result.deletedCount > 0;
  },

  async deleteAllByUserId(userId: string | Types.ObjectId): Promise<number> {
    if (!Types.ObjectId.isValid(userId)) {
      return 0;
    }
    const result = await Token.deleteMany({ userId }).exec();
    return result.deletedCount;
  },

  async deleteExpiredTokens(): Promise<number> {
    const result = await Token.deleteMany({ expiresAt: { $lt: new Date() } }).exec();
    return result.deletedCount;
  },

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenDoc = await Token.findOne({ token }).exec();
    return tokenDoc?.blacklisted ?? false;
  },
};
