import mongoose from 'mongoose';

const dbName = 'nodeCompleteRestApp';
export const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PSW}@cluster0.0tlz2.mongodb.net/${dbName}?w=majority`;

export const COLLECTION_NAMES = { POSTS: 'posts', USERS: 'users' };
export const MODEL_NAMES = { POST: 'Post', USER: 'User' };

export default () => {
  return mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
