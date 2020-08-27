const Product = require('../models/product');

module.exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(ROOT_DIR, 'views', 'add-product.html'));
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

module.exports.postAddProduct = (req, res, next) => {
  const { title } = req.body;
  new Product(title).save();
  res.redirect('/');
};

module.exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};
