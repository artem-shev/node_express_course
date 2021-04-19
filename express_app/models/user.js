const { Schema, model } = require('mongoose');
const { MODEL_NAMES } = require('../utils/database');

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: {
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.PRODUCT, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.getCart = async function () {
  await this.populate('cart.items.product').execPopulate();
  return this.cart.items;
};

userSchema.methods.getCartItem = function (id) {
  return this.cart.items.find(({ product }) => product._id.toString() === id.toString());
};

userSchema.methods.addToCart = function (product) {
  const cartItem = this.getCartItem(product._id);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    this.cart.items.push({ product: product, quantity: 1 });
  }

  return this.save();
};

userSchema.methods.deleteItemFromCart = function (id) {
  this.cart.items = this.cart.items.filter(
    ({ product }) => product._id.toString() !== id.toString(),
  );

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };

  return this.save();
};

module.exports = model(MODEL_NAMES.USER, userSchema);
