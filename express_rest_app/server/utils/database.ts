import mongoose from 'mongoose';

const dbName = 'nodeCompleteRestApp';
export const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PSW}@cluster0.0tlz2.mongodb.net/${dbName}?w=majority`;

const COLLECTION_NAMES = { PRODUCTS: 'products', USERS: 'users', ORDERS: 'orders' };
const MODEL_NAMES = { PRODUCT: 'Product', USER: 'User', ORDER: 'Order' };

export default () => {
  return mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
};
