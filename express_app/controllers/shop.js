const Product = require('../models/product');

module.exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};

module.exports.getProduct = (req, res) => {
  const { productId } = req.params;

  Product.findById(productId, (product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  });
};

module.exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

module.exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your  Cart',
    path: '/cart',
  });
};

module.exports.postCart = (req, res) => {
  const { productId } = req.body;

  res.redirect('/cart');
};

module.exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

module.exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};
