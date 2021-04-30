import { Schema, model, Types, Document, ObjectId } from 'mongoose';
import { UserDocument } from './user';

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: Object, required: true },
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

export default model<PostDocument>('Post', postSchema);
