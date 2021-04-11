const { v4 } = require('uuid');

const Cart = require('./cart');
const db = require('../utils/database');

module.exports = class Product {
  static async fetchAll() {
    const [rows, fieldData] = await db.execute('SELECT * FROM products');

    return rows;
  }

  static async findById(productId) {
    console.log('productId', productId);
    const [rows, fieldData] = await db.execute('SELECT * FROM products WHERE products.id = ?', [
      productId,
    ]);
    return rows[0];
  }

  static deleteById(id) {}

  constructor({ title, imageUrl, description, price, id }) {
    this.title = title;
    this.imageUrl =
      imageUrl || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
    this.description = description;
    this.price = Number(price).toFixed(2);
    this.id = id;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description],
    );
  }
};
