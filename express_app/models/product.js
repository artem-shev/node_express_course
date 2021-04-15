const { Schema, model } = require('mongoose');
const { MODEL_NAMES } = require('../utils/database');

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
});

module.exports = model(MODEL_NAMES.PRODUCT, productSchema);
