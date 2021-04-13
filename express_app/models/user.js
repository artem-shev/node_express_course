const { makeModel, makeGetCollection } = require('../utils/database');

const productsCollection = makeGetCollection('products');
const ordersCollection = makeGetCollection('orders');

class User extends makeModel('users') {
  constructor({ id = null, _id = undefined, name, email, cart = { items: [] } }) {
    super(id);

    this.name = name;
    this.email = email;
    this.cart = cart;
    if (_id) this._id = _id;
  }

  addToCart(product) {
    const cartItem = this.getCartItem(product._id);

    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cart.items.push({ productId: product._id, quantity: 1 });
    }

    return this.save(['cart']);
  }

  async getCart() {
    const productIds = this.cart.items.map(({ productId }) => productId);

    const products = await productsCollection()
      .find({
        _id: { $in: productIds },
      })
      .toArray();

    return products.map((p) => ({ ...p, quantity: this.getCartItem(p._id)?.quantity }));
  }

  getCartItem(id) {
    return this.cart.items.find(({ productId }) => productId.toString() === id.toString());
  }

  deleteItemFromCart(id) {
    this.cart.items = this.cart.items.filter(
      ({ productId }) => productId.toString() !== id.toString(),
    );

    return this.save(['cart.items']);
  }

  async addOrder() {
    const cartProducts = await this.getCart();
    const order = {
      items: cartProducts,
      user: {
        _id: this._id,
      },
    };

    await ordersCollection().insertOne(order);

    this.cart = { items: [] };

    return this.save(['cart']);
  }

  async getOrders() {
    return ordersCollection().find({ 'user._id': this._id }).toArray();
  }
}

module.exports = User;
