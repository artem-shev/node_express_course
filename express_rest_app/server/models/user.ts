import { Document } from 'mongoose';

export interface UserModel {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends UserModel, Document {}
