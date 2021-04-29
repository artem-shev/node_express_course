const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Stripe } = require('stripe');

const Product = require('../models/product');
const Order = require('../models/order');
const getPaginationData = require('../utils/pagination');

const stripe = new Stripe(process.env.STRIP_SECRET_KEY, { apiVersion: '2020-08-27' });

module.exports.getProducts = async (req, res, next) => {
  const total = await Product.countDocuments();
  const { skip, limit, ...pagePaginationData } = getPaginationData(req, total);
  const products = await Product.find().skip(skip).limit(limit);
  // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',

    ...pagePaginationData,
  });
};

module.exports.getProduct = (req, res) => {
  const { productId } = req.params;

  Product.findById(productId).then((product) => {
    res.render('shop/product-detail', {
      product,
      // @ts-ignore
      pageTitle: product?.title,
      path: '/products',
    });
  });
};

module.exports.getIndex = async (req, res) => {
  const total = await Product.countDocuments();
  const { skip, limit, ...pagePaginationData } = getPaginationData(req, total);

  const products = await Product.find().skip(skip).limit(limit);

  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',

    ...pagePaginationData,
  });
};

exports.getCart = async (req, res, next) => {
  const { user } = req;
  const products = await user.getCart();

  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    products,
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

module.exports.getCheckout = async (req, res, next) => {
  const { user } = req;
  try {
    const products = await user.getCart();

    if (!products.length) throw new Error('Cart is empty');

    const totalSum = products.reduce(
      (acc, { quantity, product }) => acc + quantity * product.price,
      0,
    );
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map(({ product, quantity }) => ({
        name: product.title,
        description: product.description,
        amount: product.price * 100,
        currency: 'usd',
        quantity,
      })),
      success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
    });

    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      products,
      totalSum,
      stripeSession,
      stripePublishableKey: process.env.STRIP_PUBLISHABLE_KEY,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.getCheckoutSuccess = async (req, res, next) => {
  const { user } = req;

  await user.populate('cart.items.product').execPopulate();

  await new Order({ products: user.cart.items, user }).save();

  await user.clearCart();

  res.redirect('/orders');
};

module.exports.getOrders = async (req, res, next) => {
  const { user } = req;

  const orders = await Order.find({ user });

  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    orders,
  });
};

module.exports.postOrder = async (req, res, next) => {
  const { user } = req;

  await user.populate('cart.items.product').execPopulate();

  await new Order({ products: user.cart.items, user }).save();

  await user.clearCart();

  res.redirect('/orders');
};

module.exports.getInvoice = async (req, res, next) => {
  const { orderId } = req.params;

  try {
  } catch (e) {
    next(e);
  }
  const order = await Order.findById(orderId);

  if (order?.user?._id.toString() !== req.user._id.toString()) {
    return next(new Error('Unauthorized!'));
  }

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join('tmp', 'invoices', invoiceName);
  const pdfDoc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.fontSize(25).text('Invoice', { underline: true, align: 'center' });

  pdfDoc.text('------------------------------------', { align: 'center' });

  let totalPrice = 0;

  order.products.forEach(({ product, quantity }) => {
    totalPrice += quantity * product.price;
    pdfDoc.fontSize(14).text(`${product.title}: ${quantity} x $${product.price}`);
  }, 0);

  pdfDoc.text('---');

  pdfDoc.fontSize(20).text(`Total price: $${totalPrice}`);

  pdfDoc.end();

  // fs.readFile(invoicePath, (err, invoice) => {
  //   if (err) return next(err);
  //
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`); // inline || attachment
  //
  //   res.send(invoice);
  // });

  // const file = fs.createReadStream(invoicePath);

  // res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

  // file.pipe(res);
};
