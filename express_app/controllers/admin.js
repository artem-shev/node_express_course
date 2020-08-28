const Product = require('../models/product');

module.exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(ROOT_DIR, 'views', 'add-product.html'));
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

module.exports.postAddProduct = (req, res, next) => {
  const { title, description, price, imageUrl } = req.body;
  const product = new Product({ title, imageUrl, description, price });

  product.save();
  res.redirect('/');
};

module.exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};
