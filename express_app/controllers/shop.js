const Product = require('../models/product');

module.exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
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

  Product.findByPk(productId).then((product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product?.title,
      path: '/products',
    });
  });
};

module.exports.getIndex = (req, res) => {
  Product.findAll().then((products) => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = async (req, res, next) => {
  const { user } = req;

  const cart = await user.getCart();
  const products = await cart.getProducts();

  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: products,
  });
};

exports.postCart = async (req, res, next) => {
  const {
    user,
    body: { productId },
  } = req;

  const cart = await user.getCart();
  const cartProducts = await cart.getProducts({ where: { id: productId } });
  let product;

  let newQuantity = 1;

  if (cartProducts.length) {
    [product] = cartProducts;
    newQuantity = product.cartItem.quantity + 1;
  } else {
    product = await Product.findByPk(productId);
  }

  await cart.addProduct(product, { through: { quantity: newQuantity } });

  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const {
    user,
    body: { productId },
  } = req;

  const cart = await user.getCart();
  const [product] = await cart.getProducts({ where: { id: productId } });

  await product.cartItem.destroy();

  res.redirect('/cart');
};

module.exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

module.exports.getOrders = async (req, res, next) => {
  const { user } = req;

  const orders = await user.getOrders({ include: ['products'] });

  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
    orders,
  });
};

module.exports.postOrder = async (req, res, next) => {
  const { user } = req;
  const cart = await user.getCart();
  const products = await cart.getProducts();

  const order = await user.createOrder();
  const productsToOrder = products.map((product) => {
    product.orderItem = { quantity: product.cartItem.quantity };
    return product;
  });

  await order.addProducts(productsToOrder);

  await cart.setProducts(null);

  res.redirect('/orders');
};
