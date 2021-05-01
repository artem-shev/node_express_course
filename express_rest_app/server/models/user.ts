import { Document, Schema, model, Types } from 'mongoose';
import { MODEL_NAMES } from '../utils/database';
import type { PostDocument } from './post';

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, default: `I'm new!` },
  posts: [{ type: Types.ObjectId, ref: MODEL_NAMES.POST }],
});

export interface UserModel {
  name: string;
  email: string;
  password: string;
  status: string;
  posts: PostDocument[];
}

export interface UserDocument extends UserModel, Document {}

export default model<UserDocument>(MODEL_NAMES.USER, userSchema);
