import mongoose, { Document, Schema, Types } from 'mongoose';
import { TOKEN_TYPES, TokenType } from '../constants/tokens.js';

export interface IToken {
  token: string;
  userId: Types.ObjectId;
  type: TokenType;
  expiresAt: Date;
  blacklisted: boolean;
  createdAt: Date;
}

export interface ITokenDocument extends IToken, Document {}

const tokenSchema = new Schema<ITokenDocument>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(TOKEN_TYPES),
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
tokenSchema.index({ userId: 1, type: 1 });

export const Token = mongoose.model<ITokenDocument>('Token', tokenSchema);
