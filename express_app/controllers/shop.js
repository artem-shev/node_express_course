const Product = require('../models/product');
const Order = require('../models/order');
const { isAuthenticated } = require('../utils/auth');

module.exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
    // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated: isAuthenticated(req),
    });
  });
};

module.exports.getProduct = (req, res) => {
  const { productId } = req.params;

  Product.findById(productId).then((product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product?.title,
      path: '/products',
      isAuthenticated: isAuthenticated(req),
    });
  });
};

module.exports.getIndex = (req, res) => {
  Product.find().then((products) => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated: isAuthenticated(req),
    });
  });
};

exports.getCart = async (req, res, next) => {
  const { user } = req;
  const products = await user.getCart();

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products,
    isAuthenticated: isAuthenticated(req),
  });
};

exports.postCart = async (req, res, next) => {
  const {
    user,
    body: { productId },
  } = req;

  const product = await Product.findById(productId);

  await user.addToCart(product);

  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const {
    user,
    body: { productId },
  } = req;

  await user.deleteItemFromCart(productId);

  res.redirect('/cart');
};

module.exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: isAuthenticated(req),
  });
};

module.exports.getOrders = async (req, res, next) => {
  const { user } = req;

  const orders = await Order.find({ user });

  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
    orders,
    isAuthenticated: isAuthenticated(req),
  });
};

module.exports.postOrder = async (req, res, next) => {
  const { user } = req;

  await user.populate('cart.items.product').execPopulate();

  await new Order({ products: user.cart.items, user }).save();

  await user.clearCart();

  res.redirect('/orders');
};
