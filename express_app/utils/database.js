const path = require('path');
const mongodb = require('mongodb');
const _ = require('lodash');
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.local'),
});

const MongoClient = mongodb.MongoClient;
const dbName = 'nodeComplete';
const url = `mongodb+srv://ashevliakov:${process.env.DB_PSW}@cluster0.0tlz2.mongodb.net/${dbName}?retryWrites=true&w=majority`;

let db;

const mongoConnect = async (cb) => {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });

  if (cb) cb(client);

  db = client.db();

  return client;
};

const getDb = () => db;
const makeId = (id) => new mongodb.ObjectID(id);
const makeGetCollection = (collectionName) => () => {
  const db = getDb();
  return db.collection(collectionName);
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

module.exports = { mongoConnect, getDb, makeId, makeGetCollection, makeModel };
