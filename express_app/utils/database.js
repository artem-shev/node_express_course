const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);

const dbName = 'nodeComplete';
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PSW}@cluster0.0tlz2.mongodb.net/${dbName}?w=majority`;
// retryWrites=true&

const sessionStore = new SessionStore({ uri: url, collection: 'sessions' });
let db;

const connectToDb = async () => {
  return mongoose.connect(url);

  // return client;
};
const COLLECTION_NAMES = { PRODUCTS: 'products', USERS: 'users', ORDERS: 'orders' };
const MODEL_NAMES = { PRODUCT: 'Product', USER: 'User', ORDER: 'Order' };

const getDb = () => db;
const makeId = (id) => id;
const makeGetCollection = (collectionName) => () => {
  const db = getDb();
  return db?.collection(collectionName);
};

const makeModel = (collectionName) => {
  const getCollection = makeGetCollection(collectionName);

  return class Product {
    static async fetchAll() {
      return getCollection().find().toArray();
    }

    static async findById(id) {
      return getCollection().findOne({ _id: makeId(id) });
    }

    static async deleteById(id) {
      return getCollection().deleteOne({ _id: makeId(id) });
    }

    constructor(id = null) {
      if (id) this._id = makeId(id);
    }

    save = async (propsToPick) => {
      if (this._id) {
        const updatedUser = propsToPick?.length ? _.pick(this, propsToPick) : this;

        await getCollection().updateOne({ _id: this._id }, { $set: updatedUser });
      } else {
        await getCollection().insertOne(this);
      }

      return this;
    };
  };
};

module.exports = {
  connectToDb,
  getDb,
  makeId,
  makeGetCollection,
  makeModel,
  COLLECTION_NAMES,
  MODEL_NAMES,
  sessionStore,
};
