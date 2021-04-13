const User = require('../models/user');
const Product = require('../models/product');
// const Cart = require('../models/cart');

module.exports = async () => {
  let user = await User.findById('6075dd17501426a1e563811e');

  if (!user) {
    user = await new User({ name: 'admin', email: 'admin@admin.com' }).save();

    await new Product({
      title: 'first book',
      description: 'description',
      price: 42.99,
      imageUrl: 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
      userId: '6075dd17501426a1e563811e',
    }).save();

    // await Cart.create({ userId: 1 });
  }

  return user;
};
