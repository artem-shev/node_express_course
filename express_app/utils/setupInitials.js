const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports = async () => {
  let user = await User.findByPk(1);

  if (!user) {
    user = await User.create({ name: 'admin', email: 'admin@admin.com' });

    await Product.create({
      title: 'first book',
      description: 'description',
      price: 42.99,
      imageUrl: 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
      userId: 1,
    });

    await Cart.create({ userId: 1 });
  }

  return user;
};
