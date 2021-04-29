const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Product = require('../models/product');
const { SALT_ROUNDS } = require('../utils/auth');

module.exports = async () => {
  let user = await User.findOne({ email: 'admin@admin.com' });

  if (!user) {
    const hashedPassword = await bcrypt.hash('111111', SALT_ROUNDS);

    user = await new User({
      name: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      cart: { items: [] },
    }).save();

    await new Product({
      title: 'first book',
      description: 'description',
      price: 42.99,
      imageUrl: 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
      userId: user._id,
    }).save();
  }

  return user;
};
