import { Schema, model, Document, Types } from 'mongoose';
import { UserDocument } from './user';
import { MODEL_NAMES } from '../utils/database';

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

export interface PostModel {
  title: string;
  content: string;
  creator: UserDocument;
  imageUrl?: string;
}

export interface PostDocument extends PostModel, Document {}

export default model<PostDocument>(MODEL_NAMES.POST, postSchema);
