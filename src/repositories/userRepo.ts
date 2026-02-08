import { Types } from 'mongoose';
import { User, IUserDocument } from '../models/User.js';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export const userRepo = {
  async create(data: CreateUserData): Promise<IUserDocument> {
    const user = new User(data);
    return user.save();
  },

  async findById(id: string | Types.ObjectId): Promise<IUserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return User.findById(id).exec();
  },

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findByEmail(email);
  },

  async findByIdWithPassword(id: string | Types.ObjectId): Promise<IUserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return User.findById(id).select('+password').exec();
  },

  async emailExists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email: email.toLowerCase() }).exec();
    return count > 0;
  },

  async updateById(
    id: string | Types.ObjectId,
    data: Partial<CreateUserData>
  ): Promise<IUserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return User.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await User.findByIdAndDelete(id).exec();
    return result !== null;
  },
};
