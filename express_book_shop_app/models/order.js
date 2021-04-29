const { MODEL_NAMES } = require('../utils/database');
const { model, Schema } = require('mongoose');

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = model(MODEL_NAMES.ORDER, orderSchema);
