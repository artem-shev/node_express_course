const User = require('../models/user');
const Product = require('../models/product');

module.exports = async () => {
  let user = await User.findOne({ email: 'admin@admin.com' });

  if (!user) {
    user = await new User({ name: 'admin', email: 'admin@admin.com', cart: { items: [] } }).save();

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
