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

  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);

      fs.writeFile(p, JSON.stringify(products), console.log);
    });
  }
};
