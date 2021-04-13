const { makeModel } = require('../utils/database');

class Product extends makeModel('products') {
  constructor({ title, price, description, imageUrl, id = null, userId }) {
    super(id);

    this.title = title || 'awesome book';
    this.price = price || 42.99;
    this.description = description || 'awesome description';
    this.imageUrl =
      imageUrl || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
    this.userId = userId;
  }
}

module.exports = Product;
