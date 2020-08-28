const fs = require('fs');
const path = require('path');

const { ROOT_DIR } = require('../utils/constants');

const p = path.join(ROOT_DIR, 'data', 'products.json');
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) return cb([]);

    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  constructor({ title, imageUrl, description, price }) {
    console.log('price', price);
    this.title = title;
    this.imageUrl =
      imageUrl || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
    this.description = description;
    this.price = Number(price).toFixed(2);
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);

      fs.writeFile(p, JSON.stringify(products), console.log);
    });
  }
};
